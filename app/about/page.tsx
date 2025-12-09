import { Button } from "@/components/ui/button"
import { Dumbbell, Heart, Target, Award, HopOff, Hourglass } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-10" />
                    <img
                        src="https://unsplash.com/photos/a-row-of-dumbbells-in-a-gym-O3aRo3GGECg"
                        alt="Fitness background"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>

                <div className="container relative z-20 px-4 mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-black-600 to-emerald-500">gym-it</span>
                    </h1>
                    <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                        Gym-it is a fitness organization dedicated to giving you a platform in starting your fitness journey. Individuals do not start, not because they do not want a healthy lifestyle or fit body, but because they do not know where to start from. Gym-it provides the launchpad to get you started, all you have to do is just gym-it.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-zinc-950">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">My Mission</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-black-600 to-emerald-500 mx-auto"></div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                                <Target className="h-12 w-12 text-emerald-500 mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-3">My Purpose</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    The purpose is to bridge the gap between your fitness journey and starting.
                                </p>
                            </div>

                            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                                <Heart className="h-12 w-12 text-cyan-500 mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-3">My Approach</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    I craft every program with attention to detail, combining proven training methodologies with practical application. I focus on sustainable progress and long-term results.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Founder Section */}
            <section className="py-20 bg-black">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">Meet the Founder</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-black-600 to-emerald-500 mx-auto"></div>
                        </div>

                        <div className="bg-zinc-900/50 p-8 md:p-12 rounded-2xl border border-zinc-800">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="relative w-48 h-48 bg-zinc-800 rounded-full flex-shrink-0 overflow-hidden">
                                    <Image
                                        src="/jonathan_gym-it.jpg"
                                        alt="Jonathan Odonkor"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Jonathan Odonkor</h3>
                                    <p className="text-emerald-500 mb-4">Founder and Fitness Enthusiast</p>
                                    <p className="text-zinc-400 leading-relaxed mb-4">
                                        I love fitness and I have a passion for helping others achieve their fitness goals. Not just reaching their goals but making it a lifestyle. Fitness and nutrition are the high way to a long life, and I want to help realize that potential for those willing to go the distance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-zinc-950">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">What I Stand For</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-black-600 to-emerald-500 mx-auto"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Dumbbell className="h-8 w-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Quality</h3>
                                <p className="text-zinc-400">Every program is meticulously designed to deliver results.</p>
                            </div>

                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="h-8 w-8 text-cyan-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Results</h3>
                                <p className="text-zinc-400">Always a focus on sustainable progress and measurable outcomes.</p>
                            </div>

                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Hourglass className="h-8 w-8 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Accountability</h3>
                                <p className="text-zinc-400">Your success is our priority. More importantly, your success is your own.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-black">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
                        Browse our programs and find the perfect fit for your fitness goals.
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full">
                            View Programs
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
