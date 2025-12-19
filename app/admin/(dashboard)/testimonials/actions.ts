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

    // Get max sort_order
    const { data: maxSort } = await supabase
        .from("testimonials")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .single()

    const nextSortOrder = (maxSort?.sort_order ?? 0) + 1

    const { error } = await supabase.from("testimonials").insert({
        username,
        text,
        rating,
        is_approved: true, // Admin created ones are auto-approved
        sort_order: nextSortOrder
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

export async function toggleTestimonialApproval(id: string, is_approved: boolean) {
    const supabase = await createClient()

    const { error } = await supabase.from("testimonials").update({
        is_approved
    }).eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    revalidatePath("/cart")
}

export async function moveTestimonial(id: string, direction: 'up' | 'down') {
    const supabase = await createClient()

    // 1. Get current testimonial
    const { data: current, error: fetchError } = await supabase
        .from('testimonials')
        .select('id, sort_order')
        .eq('id', id)
        .single()

    if (fetchError || !current) {
        throw new Error('Testimonial not found')
    }

    // 2. Find adjacent testimonial
    let query = supabase
        .from('testimonials')
        .select('id, sort_order')
        .neq('id', id)

    if (direction === 'up') {
        // Find one with sort_order < current, ordered desc (closest)
        query = query
            .lt('sort_order', current.sort_order)
            .order('sort_order', { ascending: false })
            .limit(1)
    } else {
        // Find one with sort_order > current, ordered asc (closest)
        query = query
            .gt('sort_order', current.sort_order)
            .order('sort_order', { ascending: true })
            .limit(1)
    }

    const { data: adjacent } = await query.single()

    if (adjacent) {
        const updates = [
            supabase.from('testimonials').update({ sort_order: adjacent.sort_order }).eq('id', current.id),
            supabase.from('testimonials').update({ sort_order: current.sort_order }).eq('id', adjacent.id)
        ]

        await Promise.all(updates)
    }

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    revalidatePath("/cart")
}
