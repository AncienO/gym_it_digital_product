"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BicepsFlexed } from "lucide-react"

export function HeroSection() {
    const scrollToProducts = () => {
        const productsSection = document.getElementById('featured-products')
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <BicepsFlexed
                    className="absolute -right-30 bottom-0 md:-bottom-32 md:-right-32 w-[600px] h-[600px] md:w-[1200px] md:h-[1200px] text-emerald-600 opacity-30 -rotate-12"
                    strokeWidth={1}
                />
            </div>

            <div className="container relative z-20 px-4 mx-auto">
                <div className="max-w-2xl space-y-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                        Don't know where to start on your Fitness journey? <br /> <br />
                        <span
                            className="text-emerald-500 cursor-pointer hover:text-emerald-400 transition-colors inline-block"
                            onClick={scrollToProducts}
                            style={{
                                animation: 'pulse-subtle 2s ease-in-out infinite'
                            }}
                        >
                            Start here.
                        </span>
                    </h1>
                    <style jsx>{`
                        @keyframes pulse-subtle {
                            0%, 100% {
                                color: rgb(16 185 129); /* emerald-500 */
                                transform: scale(1);
                            }
                            50% {
                                color: rgb(5 150 105); /* emerald-600 */
                                transform: scale(1.05);
                            }
                        }
                    `}</style>
                    <p className="text-xl text-zinc-300 leading-relaxed">
                        Premium digital training programs backed by research to reach your fitness goals.<br />
                        <span className="text-emerald-500">
                            Download instantly and start your journey today.
                        </span>
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/products">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full">
                                Browse Programs <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button variant="outline" size="lg" className="border-zinc-700 text-white hover:bg-zinc-800 px-8 py-6 text-lg rounded-full">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
