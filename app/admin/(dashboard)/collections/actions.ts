'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteCollection(collectionId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId)

    if (error) {
        throw new Error('Failed to delete collection')
    }

    revalidatePath('/admin/collections')
    revalidatePath('/collections')
    revalidatePath('/')
}

export async function toggleCollectionStatus(collectionId: string, isActive: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('collections')
        .update({ is_active: isActive })
        .eq('id', collectionId)

    if (error) {
        console.error('Error updating collection status:', error)
        throw new Error(`Failed to update collection status: ${error.message}`)
    }

    revalidatePath('/admin/collections')
    revalidatePath('/collections')
    revalidatePath('/')
}
