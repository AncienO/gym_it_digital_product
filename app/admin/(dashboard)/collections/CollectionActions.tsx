"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, Power } from "lucide-react"
import { deleteCollection, toggleCollectionStatus } from "./actions"
import toast from 'react-hot-toast'
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface DeleteCollectionButtonProps {
    collectionId: string
    collectionName: string
}

export function DeleteCollectionButton({ collectionId, collectionName }: DeleteCollectionButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteCollection(collectionId)
            toast.success('Collection deleted successfully')
        } catch (error: any) {
            toast.error('Error deleting collection: ' + error.message)
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
                title={`Delete "${collectionName}"?`}
                message="Are you sure you want to delete this collection? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    )
}

interface CollectionStatusToggleProps {
    collectionId: string
    isActive: boolean
}

export function CollectionStatusToggle({ collectionId, isActive }: CollectionStatusToggleProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleToggle = async (checked: boolean) => {
        setIsLoading(true)
        try {
            await toggleCollectionStatus(collectionId, checked)
            toast.success(checked ? 'Collection activated' : 'Collection deactivated')
        } catch (error: any) {
            toast.error('Error updating status: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Checkbox
                id={`status-${collectionId}`}
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={isLoading}
                className="data-[state=checked]:bg-emerald-500 border-zinc-600"
            />
            <Label htmlFor={`status-${collectionId}`} className="text-zinc-300 cursor-pointer text-sm">
                {isActive ? 'Active' : 'Inactive'}
            </Label>
            {isLoading && <Loader2 className="h-3 w-3 animate-spin text-zinc-500 ml-1" />}
        </div>
    )
}
