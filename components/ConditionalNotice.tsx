"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface Notice {
    content: string
}

interface ConditionalNoticeProps {
    notice: Notice | null
}

export function ConditionalNotice({ notice }: ConditionalNoticeProps) {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !notice) return null

    // Hide on admin routes
    if (pathname?.startsWith('/admin')) {
        return null
    }

    return (
        <div className="bg-indigo-600 text-white relative border-t border-indigo-700/50">
            <div className="container mx-auto px-4 py-3 md:py-2">
                <p className="text-sm font-medium text-left md:text-center whitespace-normal break-words w-full">
                    {notice.content}
                </p>
            </div>
        </div>
    )
}
