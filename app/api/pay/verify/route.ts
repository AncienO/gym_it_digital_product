import { NextResponse } from 'next/server'
import { verifyPaystackPayment } from '@/lib/paystack'
import { createAdminClient } from '@/lib/supabase/admin'

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

                    // 4. Send download email to customer
                    console.log('🔍 Email check - customer_email:', order.customer_email)
                    console.log('🔍 Email check - GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD)
                    console.log('🔍 Email check - orderItems count:', orderItems?.length)

                    if (order.customer_email && process.env.GMAIL_APP_PASSWORD) {
                        const { sendDownloadEmail } = await import('@/lib/email')

                        // Build download URLs and product list
                        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                        const products = orderItems.map((item: any) => ({
                            name: item.products.name,
                            downloadUrl: `${baseUrl}/api/download/${order.id}/${item.products.id}`
                        }))

                        console.log('📧 Sending download email to:', order.customer_email)
                        console.log('📧 Products in email:', products.length)

                        const emailResult = await sendDownloadEmail({
                            to: order.customer_email,
                            customerName: order.customer_email.split('@')[0], // Use email username as name
                            orderNumber: order.id.substring(0, 8).toUpperCase(),
                            products
                        })

                        if (emailResult.success) {
                            console.log('✅ Download email sent successfully')
                        } else {
                            console.error('❌ Failed to send download email:', emailResult.error)
                        }
                    } else {
                        if (!order.customer_email) {
                            console.log('⚠️ No customer email found, skipping email')
                        }
                        if (!process.env.GMAIL_APP_PASSWORD) {
                            console.log('⚠️ GMAIL_APP_PASSWORD not configured, skipping email')
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
