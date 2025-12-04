import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params
        const supabase = await createClient()

        // Fetch order items with product details
        const { data: orderItems, error } = await supabase
            .from('order_items')
            .select(`
                *,
                products (
                    id,
                    name,
                    file_url
                )
            `)
            .eq('order_id', orderId)

        if (error) {
            console.error('Error fetching order items:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Transform the data to include product details
        const items = orderItems?.map(item => ({
            product_id: item.product_id,
            product_name: item.products?.name || 'Unknown Product',
            file_url: item.products?.file_url || '',
            price: item.price_at_purchase
        })) || []

        return NextResponse.json({ items })
    } catch (error: any) {
        console.error('Order API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
