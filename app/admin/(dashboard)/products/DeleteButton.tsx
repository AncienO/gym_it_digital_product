"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteProduct } from "./actions"
import toast from 'react-hot-toast'
import { ConfirmDialog } from "@/components/ConfirmDialog"

interface DeleteButtonProps {
    productId: string
    productName: string
}

export function DeleteButton({ productId, productName }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteProduct(productId)
            toast.success('Product archived successfully')
        } catch (error: any) {
            toast.error('Error deleting product: ' + error.message)
        } finally {
            setIsDeleting(false)
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
                title={`Archive "${productName}"?`}
                message="This will hide it from your store while keeping purchase records intact."
                confirmText="Archive"
                cancelText="Cancel"
            />
        </>
    )
}
