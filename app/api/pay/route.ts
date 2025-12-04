import { NextResponse } from 'next/server'
import { initializePaystackPayment } from '@/lib/paystack'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
    try {
        const { amount, phoneNumber, email, items, provider = 'paystack' } = await request.json()

        // 1. Create Order in Supabase using admin client
        const supabase = createAdminClient()

        // Create user profile if not exists (or just link to email)
        // For guest checkout, we might just store email in order

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                total_amount: amount,
                customer_email: email,
                customer_phone: phoneNumber,
                status: 'pending',
                payment_provider: provider
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order creation failed:', orderError)
            return NextResponse.json({ error: 'Order creation failed: ' + orderError.message }, { status: 500 })
        }

        const orderId = order.id

        // 2. Create Order Items
        if (items && items.length > 0) {
            const orderItems = items.map((item: any) => ({
                order_id: orderId,
                product_id: item.id,
                price_at_purchase: item.price
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) {
                console.error('Order items creation failed:', itemsError)
                // Continue anyway, we can fix this later
            }
        }

        let referenceId
        let authorizationUrl

        // Paystack Payment Flow
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?orderId=${orderId}`

        // If we are in dev mode and no keys, mock it
        if (!process.env.PAYSTACK_SECRET_KEY) {
            console.log('Mocking Paystack Payment for:', { amount, email, orderId })
            referenceId = 'mock-paystack-ref-' + Date.now()
            // For mock, we just return a success URL directly or a mock page
            // But typically we return an auth URL. Let's return a mock success URL for now if no keys.
            authorizationUrl = `${callbackUrl}&reference=${referenceId}`
        } else {
            const paystackResponse = await initializePaystackPayment(email, amount, callbackUrl, { orderId })
            referenceId = paystackResponse.data.reference
            authorizationUrl = paystackResponse.data.authorization_url
        }

        // 3. Update Order with Reference
        if (referenceId) {
            await supabase
                .from('orders')
                .update({ payment_reference: referenceId })
                .eq('id', orderId)
        }

        return NextResponse.json({ success: true, orderId, referenceId, authorizationUrl })
    } catch (error: any) {
        console.error('Payment API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
