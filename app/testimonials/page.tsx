import { createClient } from "@/lib/supabase/server"
import { TestimonialCard } from "@/components/TestimonialCard"
import { BicepsFlexed } from "lucide-react"

export const metadata = {
    title: "Testimonials | GYM-IT",
    description: "Read success stories from our community.",
}

export default async function TestimonialsPage() {
    const supabase = await createClient()
    const { data: testimonials } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <main className="flex-grow pt-24 pb-20">
                <div className="container px-4 mx-auto">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center justify-center p-3 mb-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <BicepsFlexed className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Community <span className="text-emerald-500">Stories</span>
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed">
                            Join hundreds of others who have transformed their lives with our programs.
                            Real results, real people.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials?.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial.id}
                                username={testimonial.username}
                                text={testimonial.text}
                                rating={testimonial.rating}
                            />
                        ))}
                    </div>

                    {(!testimonials || testimonials.length === 0) && (
                        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                            <p className="text-zinc-500">No testimonials yet. Be the first to share your story!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
