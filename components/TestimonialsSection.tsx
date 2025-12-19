import { createClient } from "@/lib/supabase/server"
import { TestimonialCard } from "./TestimonialCard"
import Link from "next/link"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

export async function TestimonialsSection() {
    const supabase = await createClient()
    const { data: testimonials } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(8)

    if (!testimonials || testimonials.length === 0) {
        return null
    }

    return (
        <section className="py-20 bg-zinc-950/50 border-t border-zinc-900">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Hear From Our <span className="text-emerald-500">Community</span>
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Real results from real people who started their journey with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.id}
                            username={testimonial.username}
                            text={testimonial.text}
                            rating={testimonial.rating}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/testimonials">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 transition-all font-medium h-11 px-8"
                        >
                            View All Stories
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
