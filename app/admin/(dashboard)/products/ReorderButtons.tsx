"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { moveProduct } from "./actions"
import { useState, useTransition } from "react"
import toast from "react-hot-toast"

export function ReorderButtons({ productId, isFirst, isLast }: { productId: string, isFirst: boolean, isLast: boolean }) {
    const [isPending, startTransition] = useTransition()

    const handleMove = (direction: 'up' | 'down') => {
        startTransition(async () => {
            try {
                await moveProduct(productId, direction)
            } catch (error) {
                toast.error("Failed to reorder")
            }
        })
    }

    return (
        <div className="flex flex-col gap-1">
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => handleMove('up')}
                disabled={isFirst || isPending}
                title="Move Up"
            >
                <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => handleMove('down')}
                disabled={isLast || isPending}
                title="Move Down"
            >
                <ArrowDown className="h-3 w-3" />
            </Button>
        </div>
    )
}
