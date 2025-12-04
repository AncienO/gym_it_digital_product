"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: string) {
    const supabase = await createClient()

    // Soft delete: Set is_active to false instead of actually deleting
    const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/products')
    return { success: true }
}
