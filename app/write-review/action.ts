'use server'

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitReview(formData: FormData) {
    // using admin client to bypass RLS since public users can't insert testimonials by default
    const supabase = createAdminClient()

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
        is_approved: false // Pending approval
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/testimonials")
    // Redirect to a thank you page or just back to home with a success message? 
    // For now, let's redirect to home with a query param or handle it in the client
    // But standard form action behavior suggests redirect. 
    // Let's redirect to a success state or just returning would be fine if handled by client component.
    // The TestimonialForm uses the action logic.
    // If I redirect, the toast might not show if it's a full page reload, but next.js redirects are client-side transitions mostly.

    // Actually, maybe better to stay on page and show success?
    // But TestimonialForm expects a promise that resolves.
    // If I redirect, it throws NEXT_REDIRECT which TestimonialForm catches as success.

    // Let's redirect to home for now.
    redirect("/?review_submitted=true")
}
