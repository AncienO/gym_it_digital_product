"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Mail } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    // Hide footer on admin routes and contact page
    if (pathname?.startsWith('/admin') || pathname === '/contact') {
        return null
    }

    return (
        <footer className="w-full border-t border-zinc-800 bg-black py-8 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-lg font-bold text-white leading-none">
                            gym<span className="text-emerald-500">-it</span>
                        </h3>
                        <p className="text-zinc-500 text-xs mt-1">
                            Digital fitness products
                        </p>
                    </div>
                    <div className="hidden md:block h-8 w-px bg-zinc-800 mx-2"></div>
                    <div className="hidden md:block text-xs text-zinc-700">
                        © {new Date().getFullYear()} gym-it. All rights reserved.
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <div className="flex flex-row items-center gap-6 text-sm text-zinc-500">
                        <Link href="/write-review" className="hover:text-emerald-400 transition-colors">
                            Write a Review
                        </Link>
                        <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                            Terms of Use
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-colors group md:w-auto">
                        <Mail className="h-4 w-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        <a href="mailto:gym.it.digital@gmail.com" className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                            gym.it.digital@gmail.com
                        </a>
                    </div>
                </div>

                <div className="md:hidden text-xs text-zinc-700 mt-2">
                    © {new Date().getFullYear()} gym-it. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
