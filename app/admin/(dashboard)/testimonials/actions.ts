'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTestimonial(formData: FormData) {
    const supabase = await createClient()

    const username = formData.get("username") as string
    const text = formData.get("text") as string
    const rating = Number(formData.get("rating"))

    if (!username || !text || !rating) {
        throw new Error("Missing required fields")
    }

    const { error } = await supabase.from("testimonials").insert({
        username,
        text,
        rating,
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    revalidatePath("/cart")
    redirect("/admin/testimonials")
}

export async function updateTestimonial(id: string, formData: FormData) {
    const supabase = await createClient()

    const username = formData.get("username") as string
    const text = formData.get("text") as string
    const rating = Number(formData.get("rating"))

    if (!username || !text || !rating) {
        throw new Error("Missing required fields")
    }

    const { error } = await supabase.from("testimonials").update({
        username,
        text,
        rating,
    }).eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    revalidatePath("/cart")
    redirect("/admin/testimonials")
}

export async function deleteTestimonial(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("testimonials").delete().eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    revalidatePath("/cart")
}
