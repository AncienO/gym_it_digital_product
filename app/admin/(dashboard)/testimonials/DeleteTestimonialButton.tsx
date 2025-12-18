"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteTestimonial } from "./actions"
import toast from "react-hot-toast"
import { ConfirmDialog } from "@/components/ConfirmDialog"

interface DeleteTestimonialButtonProps {
    id: string
    username: string
}

export function DeleteTestimonialButton({ id, username }: DeleteTestimonialButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteTestimonial(id)
            toast.success("Testimonial deleted successfully")
        } catch (error: any) {
            toast.error("Error deleting testimonial: " + error.message)
        } finally {
            setIsDeleting(false)
            setShowConfirm(false)
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-900/10"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
            >
                {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </Button>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title={`Delete testimonial from "${username}"?`}
                message="This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    )
}
