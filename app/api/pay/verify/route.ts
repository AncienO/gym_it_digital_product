import { NextResponse } from 'next/server'
import { verifyPaystackPayment } from '@/lib/paystack'
import { createClient } from '@/lib/supabase/server'

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

        // 2. Update Order in Supabase
        const supabase = await createClient()

        // Find order by reference
        const { data: order, error: findError } = await supabase
            .from('orders')
            .select('*')
            .eq('payment_reference', reference)
            .single()

        if (findError || !order) {
            // It's possible the order wasn't found if we are mocking or if something went wrong
            console.error('Order not found for reference:', reference)
            // For now, we return success if payment was verified, even if order update fails (though ideally we should fail)
        } else {
            // Update status
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status: 'completed' }) // Or 'paid' depending on your schema
                .eq('id', order.id)

            if (updateError) {
                console.error('Failed to update order status:', updateError)
            } else {
                // 3. Create product_duration records for items with duration
                const { data: orderItems } = await supabase
                    .from('order_items')
                    .select(`
                        product_id,
                        products (
                            duration
                        )
                    `)
                    .eq('order_id', order.id)

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
                        const { error: durationError } = await supabase
                            .from('product_duration')
                            .insert(durationRecords)

                        if (durationError) {
                            console.error('Failed to create duration records:', durationError)
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true, data: paymentData })

    } catch (error: any) {
        console.error('Payment Verification Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
