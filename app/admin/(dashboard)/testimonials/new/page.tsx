import { createTestimonial } from "../actions"
import { TestimonialForm } from "../_components/TestimonialForm"

export default function NewTestimonialPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">New Testimonial</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                </div>
                <p className="text-zinc-400">Add a new testimonial from a happy customer.</p>
            </div>
            <TestimonialForm action={createTestimonial} />
        </div>
    )
}
