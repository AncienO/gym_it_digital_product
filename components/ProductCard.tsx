"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Database } from "@/types"
import { useCart } from "@/context/CartContext"
import { Check } from "lucide-react"
import { useState } from "react"

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem, items } = useCart()
    const [isAdded, setIsAdded] = useState(false)

    const isInCart = items.some(item => item.id === product.id)

    const handleAddToCart = () => {
        addItem(product)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <Card className="overflow-hidden border border-zinc-800 hover:border-zinc-700 shadow-lg bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/80 transition-all duration-300 group h-full flex flex-col">
            <div className="aspect-square relative overflow-hidden bg-zinc-800 shrink-0">
                {/* Placeholder for image if null */}
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        No Image
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white line-clamp-1">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="text-zinc-400 line-clamp-3 text-sm whitespace-pre-wrap cursor-help mb-4">{product.description}</p>
                    </TooltipTrigger>
                    <TooltipContent
                        side="top"
                        className="max-w-sm bg-zinc-800 text-zinc-100 border border-zinc-700 p-3"
                        sideOffset={5}
                    >
                        <p className="text-sm whitespace-pre-wrap">{product.description}</p>
                    </TooltipContent>
                </Tooltip>
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="text-2xl font-bold text-emerald-400">
                        GHS {product.price.toFixed(2)}
                    </div>
                    {product.duration && (
                        <div className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium">
                            {product.duration}
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="mt-auto">
                <Button
                    className={`w-full font-semibold transition-all duration-300 ${isInCart ? 'bg-zinc-700 hover:bg-zinc-700 text-zinc-300' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                    onClick={handleAddToCart}
                    disabled={isInCart}
                >
                    {isInCart ? (
                        <>
                            <Check className="mr-2 h-4 w-4" /> Added
                        </>
                    ) : (
                        "Add to Cart"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
