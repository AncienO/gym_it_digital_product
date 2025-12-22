'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createNotice(formData: FormData) {
    const supabase = await createClient()
    const content = formData.get("content") as string

    if (!content) {
        throw new Error("Content is required")
    }

    const { error } = await supabase.from("notices").insert({
        content,
        is_active: false // Default to inactive
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/notices")
    revalidatePath("/")
}

export async function updateNotice(id: string, formData: FormData) {
    const supabase = await createClient()
    const content = formData.get("content") as string

    if (!content) {
        throw new Error("Content is required")
    }

    const { error } = await supabase.from("notices").update({
        content
    }).eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/notices")
    revalidatePath("/")
    redirect("/admin/notices")
}

export async function toggleNoticeStatus(id: string, isActive: boolean) {
    const supabase = await createClient()

    if (isActive) {
        await supabase.from("notices").update({ is_active: false }).neq('id', id)
    }

    const { error } = await supabase.from("notices").update({
        is_active: isActive
    }).eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/notices")
    revalidatePath("/")
}

export async function deleteNotice(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("notices").delete().eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/notices")
    revalidatePath("/")
}
