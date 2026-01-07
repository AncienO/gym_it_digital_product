"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface Notice {
    id: string
    content: string
}

interface ConditionalNoticeProps {
    notice: Notice | null
}

export function ConditionalNotice({ notice }: ConditionalNoticeProps) {
    const pathname = usePathname()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Only show if we have a notice and it hasn't been dismissed
        if (notice) {
            const dismissedId = localStorage.getItem('dismissed_notice_id')
            if (dismissedId !== notice.id) {
                setIsVisible(true)
            }
        }
    }, [notice])

    if (!notice || !isVisible) return null

    // Hide on admin routes
    if (pathname?.startsWith('/admin')) {
        return null
    }

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('dismissed_notice_id', notice.id)
    }

    return (
        <div className="bg-indigo-600 text-white relative z-10 border-t border-indigo-700/50 transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-4 py-3 md:py-2 pr-12 relative flex items-center justify-center min-h-[44px]">
                <p className="text-sm font-medium text-center whitespace-normal break-words w-full">
                    {notice.content}
                </p>
                <button
                    onClick={handleDismiss}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Dismiss notice"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
