import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { updateTestimonial } from "../actions"
import { TestimonialForm } from "../_components/TestimonialForm"

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: testimonial } = await supabase
        .from("testimonials")
        .select("*")
        .eq("id", id)
        .single()

    if (!testimonial) {
        notFound()
    }

    const updateAction = updateTestimonial.bind(null, id)

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Edit Testimonial</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                </div>
                <p className="text-zinc-400">Update existing testimonial details.</p>
            </div>
            <TestimonialForm
                action={updateAction}
                defaultValues={{
                    username: testimonial.username,
                    text: testimonial.text,
                    rating: testimonial.rating
                }}
            />
        </div>
    )
}
