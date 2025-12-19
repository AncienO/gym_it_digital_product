"use client"

import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { useState } from "react"
import { toggleTestimonialApproval } from "./actions"
import toast from "react-hot-toast"

export function ToggleApprovalButton({ id, isApproved }: { id: string, isApproved: boolean }) {
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        try {
            await toggleTestimonialApproval(id, !isApproved)
            toast.success(isApproved ? "Testimonial unapproved" : "Testimonial approved")
        } catch (error) {
            console.error("Error toggling approval:", error)
            toast.error("Failed to update status")
        } finally {
            setLoading(false)
        }
    }

    if (isApproved) {
        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                disabled={loading}
                title="Unapprove"
                className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
        )
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={loading}
            className="h-8 border-emerald-600/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
            Approve
        </Button>
    )
}
