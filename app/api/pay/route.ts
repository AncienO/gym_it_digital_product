import { NextResponse } from 'next/server'
import { initializePaystackPayment } from '@/lib/paystack'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPaystackAmount } from '@/lib/currency'

export async function POST(request: Request) {
    try {
        const { amount, phoneNumber, email, items, provider = 'paystack', currency = 'GHS' } = await request.json()

        // Convert USD to GHS if needed (Paystack Ghana only supports GHS settlement)
        // We store the original currency for display, but charge in GHS
        const displayAmount = amount
        const displayCurrency = currency
        const chargeAmount = getPaystackAmount(amount, currency as 'GHS' | 'USD')

        console.log(`💰 Payment: Display ${displayCurrency} ${displayAmount}, Charging GHS ${chargeAmount}`)

        // 1. Create Order in Supabase using admin client
        const supabase = createAdminClient()

        // Create user profile if not exists (or just link to email)
        // For guest checkout, we might just store email in order

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                total_amount: chargeAmount, // Always GHS amount charged
                customer_email: email,
                customer_phone: phoneNumber,
                status: 'pending',
                payment_provider: provider,
                currency: displayCurrency // Store what currency customer selected/saw
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

        // Paystack Payment Flow - Use production URL if available
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.NODE_ENV === 'production' ? 'https://gymit.fitness' : 'http://localhost:3000')
        const callbackUrl = `${baseUrl}/checkout/success?orderId=${orderId}`

        console.log('💳 Payment callback URL:', callbackUrl)

        // If we are in dev mode and no keys, mock it
        if (!process.env.PAYSTACK_SECRET_KEY) {
            console.log('Mocking Paystack Payment for:', { amount, email, orderId })
            referenceId = 'mock-paystack-ref-' + Date.now()
            // For mock, we just return a success URL directly or a mock page
            // But typically we return an auth URL. Let's return a mock success URL for now if no keys.
            authorizationUrl = `${callbackUrl}&reference=${referenceId}`
        } else {
            // Always pass GHS to Paystack (required for Ghana merchants)
            const paystackResponse = await initializePaystackPayment(email, chargeAmount, callbackUrl, { orderId, displayCurrency, displayAmount }, 'GHS')
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
