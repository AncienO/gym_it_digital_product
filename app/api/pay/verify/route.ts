import { NextResponse } from 'next/server'
import { verifyPaystackPayment } from '@/lib/paystack'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendDownloadEmail } from '@/lib/email'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
        return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    try {
        // 1. Verify Payment with Paystack
        // If we are mocking, we might skip this or have a mock verify
        let paymentData
        if (process.env.PAYSTACK_SECRET_KEY) {
            const verifyResponse = await verifyPaystackPayment(reference)
            if (verifyResponse.data.status !== 'success') {
                return NextResponse.json({ error: 'Payment verification failed', details: verifyResponse.data }, { status: 400 })
            }
            paymentData = verifyResponse.data
        } else {
            // Mock verification
            if (reference.startsWith('mock-paystack-ref-')) {
                paymentData = { status: 'success', reference }
            } else {
                return NextResponse.json({ error: 'Invalid mock reference' }, { status: 400 })
            }
        }

        // 2. Update Order in Supabase using admin client (bypasses RLS)
        const supabase = createAdminClient()

        // Find order by reference
        const { data: order, error: findError } = await supabase
            .from('orders')
            .select('*')
            .eq('payment_reference', reference)
            .single()

        if (findError || !order) {
            // It's possible the order wasn't found if we are mocking or if something went wrong
            console.error('❌ Order not found for reference:', reference, 'Error:', findError)
            console.log('📊 Payment data received:', paymentData)

            // Return error instead of success if order not found
            return NextResponse.json({
                error: 'Order not found',
                reference,
                details: findError
            }, { status: 404 })
        } else {
            console.log('✅ Order found:', order.id, 'Current status:', order.status)

            // Update status to 'paid' (matching the database CHECK constraint)
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status: 'paid' })
                .eq('id', order.id)

            if (updateError) {
                console.error('❌ Failed to update order status:', updateError)
                return NextResponse.json({
                    error: 'Failed to update order',
                    details: updateError
                }, { status: 500 })
            } else {
                console.log('✅ Order status updated to completed for order:', order.id)

                // 3. Create product_duration records for items with duration
                const { data: orderItems } = await supabase
                    .from('order_items')
                    .select(`
                        product_id,
                        products (
                            id,
                            name,
                            file_url,
                            duration
                        )
                    `)
                    .eq('order_id', order.id)

                console.log('📦 Order items fetched:', orderItems?.length || 0, 'items')

                if (orderItems && orderItems.length > 0) {
                    const durationRecords = orderItems
                        .filter((item: any) => item.products?.duration)
                        .map((item: any) => {
                            const duration = item.products.duration
                            const startDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD

                            // Parse duration (e.g., "4 Weeks", "12 Weeks", "30 Days")
                            let daysToAdd = 0
                            const match = duration.match(/(\d+)\s*(week|day|month)/i)
                            if (match) {
                                const value = parseInt(match[1])
                                const unit = match[2].toLowerCase()
                                if (unit.startsWith('week')) {
                                    daysToAdd = value * 7
                                } else if (unit.startsWith('day')) {
                                    daysToAdd = value
                                } else if (unit.startsWith('month')) {
                                    daysToAdd = value * 30 // Approximate
                                }
                            }

                            const endDate = new Date()
                            endDate.setDate(endDate.getDate() + daysToAdd)
                            const endDateStr = endDate.toISOString().split('T')[0]

                            return {
                                order_id: order.id,
                                product_id: item.product_id,
                                start_date: startDate,
                                end_date: endDateStr
                            }
                        })

                    if (durationRecords.length > 0) {
                        console.log('⏰ Creating', durationRecords.length, 'duration records')
                        const { error: durationError } = await supabase
                            .from('product_duration')
                            .insert(durationRecords)

                        if (durationError) {
                            console.error('❌ Failed to create duration records:', durationError)
                        } else {
                            console.log('✅ Duration records created successfully')
                        }
                    }

                    // 4. Send Confirmation Email
                    // console.log('📧 Preparing to send confirmation email...')

                    // Check environment variables
                    const gmailUser = process.env.GMAIL_USER
                    const gmailPass = process.env.GMAIL_APP_PASSWORD

                    if (!gmailUser || !gmailPass) {
                        console.error('❌ EMAIL ERROR: Missing environment variables')
                        console.error('GMAIL_USER:', gmailUser ? 'SET' : 'MISSING')
                        console.error('GMAIL_APP_PASSWORD:', gmailPass ? 'SET' : 'MISSING')
                    } else {
                        console.log('✅ Email credentials found')

                        // Use the production domain for download links
                        const baseUrl = process.env.NODE_ENV === 'production'
                            ? 'https://gymit.fitness'
                            : 'http://localhost:3000'

                        console.log('🌐 Using base URL:', baseUrl)

                        const emailProducts = orderItems.map((item: any) => ({
                            name: item.products.name,
                            downloadUrl: `${baseUrl}/api/download/${order.id}/${item.product_id}`
                        }))

                        console.log(`📦 Prepared ${emailProducts.length} products for email`)

                        try {
                            const emailResult = await sendDownloadEmail({
                                to: order.customer_email,
                                customerName: order.customer_email.split('@')[0],
                                orderNumber: order.id.slice(0, 8),
                                products: emailProducts
                            })

                            if (emailResult.success) {
                                console.log('✅ Email sent successfully to:', order.customer_email)
                            } else {
                                console.error('❌ Email sending failed:', emailResult.error)
                            }
                        } catch (emailError) {
                            console.error('❌ Email exception:', emailError)
                        }
                    }
                } else {
                    console.log('⚠️ No order items found or no items with duration')
                }
            }
        }

        return NextResponse.json({ success: true, data: paymentData })

    } catch (error: any) {
        console.error('Payment Verification Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
