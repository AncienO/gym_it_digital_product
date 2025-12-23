import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BicepsFlexed } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="space-y-6 max-w-md mx-auto">
                {/* Icon/Logo */}
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-800 shadow-2xl shadow-emerald-500/10 animate-in zoom-in duration-500">
                    <BicepsFlexed className="w-12 h-12 text-emerald-500" />
                </div>

                {/* 404 Text */}
                <div className="space-y-2">
                    <h1 className="text-7xl font-bold text-white tracking-tighter">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold text-zinc-200">
                        Page not found
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Oops! It looks like you've wandered into the wrong part of the gym. This page doesn't exist or has been moved.
                    </p>
                </div>

                {/* Action */}
                <div className="pt-8">
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-full font-medium transition-all hover:scale-105">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-500/5 rounded-full blur-3xl" />
            </div>
        </div>
    )
}
