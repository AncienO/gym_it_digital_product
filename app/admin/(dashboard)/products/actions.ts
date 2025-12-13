'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function moveProduct(productId: string, direction: 'up' | 'down') {
    const supabase = await createClient()

    // 1. Get current product
    const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('id, sort_order')
        .eq('id', productId)
        .single()

    if (fetchError || !currentProduct) {
        throw new Error('Product not found')
    }

    // 2. Find adjacent product
    let query = supabase
        .from('products')
        .select('id, sort_order')
        .neq('id', productId)

    if (direction === 'up') {
        // Find one with sort_order < current, ordered desc (closest)
        query = query
            .lt('sort_order', currentProduct.sort_order)
            .order('sort_order', { ascending: false })
            .limit(1)
    } else {
        // Find one with sort_order > current, ordered asc (closest)
        query = query
            .gt('sort_order', currentProduct.sort_order)
            .order('sort_order', { ascending: true })
            .limit(1)
    }

    const { data: adjacentProduct } = await query.single()

    if (adjacentProduct) {
        // 3. Swap sort orders
        // We use a transaction-like approach or just two updates. 
        // Note: If uniqueness constraint exists on sort_order, this could fail without a temp value.
        // Assuming no strict unique constraint or deferrable.

        // Optimistic swap using a safe update strategy if unique constraint exists, 
        // but here we likely just have a standard integer.

        const updates = [
            supabase.from('products').update({ sort_order: adjacentProduct.sort_order }).eq('id', currentProduct.id),
            supabase.from('products').update({ sort_order: currentProduct.sort_order }).eq('id', adjacentProduct.id)
        ]

        await Promise.all(updates)
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/products')
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient()

    // Soft delete: set is_active to false
    // Or if we really want to "archive" and hide even from admin, we might need another flag.
    // Based on "hide it from your store", setting is_active = false is the safest meaningful action.
    const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId)

    if (error) {
        throw new Error('Failed to archive product')
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/products')
}
