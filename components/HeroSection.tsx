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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                            <Link href="/collections">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full">
                                    Browse Collections <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" className="border-zinc-700 text-white hover:bg-zinc-800 px-8 py-6 text-lg rounded-full">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Consultation CTA */}
                    <div className="flex mt-12 lg:mt-0 justify-center lg:justify-end">
                        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-8 rounded-2xl max-w-sm w-full space-y-6 transform hover:scale-105 transition-transform duration-300">
                            <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <BicepsFlexed className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">1-on-1 Consultation</h3>
                                <p className="text-zinc-400">
                                    Need personalized advice? Book a call with me to discuss your specific goals.
                                </p>
                            </div>
                            <Link href="/consultation" className="block">
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold h-12 text-lg">
                                    Book a Call
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
