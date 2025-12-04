"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel"
}: ConfirmDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-zinc-400 whitespace-pre-line">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
