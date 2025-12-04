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
        <footer className="w-full border-t border-zinc-800 bg-black py-12 mt-auto">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                        gym<span className="text-emerald-500">-it</span>
                    </h3>
                    <p className="text-zinc-500 text-sm">
                        Digital fitness products
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-colors group">
                    <Mail className="h-4 w-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                    <a href="mailto:gym.it.digital@gmail.com" className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                        gym.it.digital@gmail.com
                    </a>
                </div>

                <div className="flex gap-6 text-sm text-zinc-500">
                    <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                        Terms of Use
                    </Link>
                </div>

                <div className="text-xs text-zinc-700 mt-4">
                    © {new Date().getFullYear()} gym-it. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
