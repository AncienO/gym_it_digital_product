"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./Navbar"
import { useState, useEffect } from "react"

export function ConditionalNavbar() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Render nothing on server to avoid hydration mismatch
    if (!mounted) {
        return null
    }

    // Hide navbar on admin routes
    if (pathname?.startsWith('/admin')) {
        return null
    }

    return <Navbar />
}
