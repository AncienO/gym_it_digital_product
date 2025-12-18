"use client"

import { createClient } from "@/lib/supabase/client"
import { TestimonialCard } from "./TestimonialCard"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Testimonial {
    id: string
    username: string
    text: string
    rating: number
}

export function TestimonialsSectionClient() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const supabase = createClient()
                const { data } = await supabase
                    .from("testimonials")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(8)

                if (data) {
                    setTestimonials(data)
                }
            } catch (error) {
                console.error("Error fetching testimonials:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTestimonials()
    }, [])

    if (!isLoading && testimonials.length === 0) {
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

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
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
                )}

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
