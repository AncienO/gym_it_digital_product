"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Database } from "@/types"
import { useCart } from "@/context/CartContext"
import { Check, Info, Eye, X } from "lucide-react"
import { useState } from "react"

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem, items } = useCart()
    const [isAdded, setIsAdded] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    const isInCart = items.some(item => item.id === product.id)

    const handleAddToCart = () => {
        addItem(product)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <>
            <Card className="overflow-hidden border border-zinc-800 hover:border-zinc-700 shadow-lg bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/80 transition-all duration-300 group h-full flex flex-col">
                <div
                    className="aspect-square relative overflow-hidden bg-zinc-800 shrink-0 cursor-pointer group/image"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Image */}
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className={`object-cover w-full h-full transition-transform duration-500 ${isExpanded ? 'scale-110 blur-sm' : 'group-hover/image:scale-105'}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                            No Image
                        </div>
                    )}

                    {/* Preview Button */}
                    {product.preview_url && (
                        <div
                            className="absolute top-2 left-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md cursor-pointer hover:bg-black/80 transition-colors z-20"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowPreview(true)
                            }}
                            title="Preview Look Inside"
                        >
                            <Eye className="w-4 h-4" />
                        </div>
                    )}

                    {/* Mobile/Tap Interaction Hint */}
                    <div className={`absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-opacity duration-300 z-20 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
                        <Info className="w-4 h-4" />
                    </div>

                    {/* Description Overlay */}
                    <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm p-6 flex items-center justify-center transition-opacity duration-300 z-30 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <p className="text-white text-sm text-center font-medium leading-relaxed overflow-y-auto max-h-full scrollbar-hide">
                            {product.description}
                        </p>
                    </div>
                </div>
                <CardHeader className="p-4 pb-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CardTitle className="text-lg font-bold text-white line-clamp-1 cursor-help">{product.name}</CardTitle>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="max-w-sm bg-zinc-800 text-zinc-100 border border-zinc-700 p-2 text-xs"
                            sideOffset={5}
                        >
                            <p className="font-bold">{product.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 p-4 pt-0">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-zinc-400 line-clamp-2 text-xs whitespace-pre-wrap cursor-help mb-3">{product.description}</p>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="max-w-sm bg-zinc-800 text-zinc-100 border border-zinc-700 p-2"
                            sideOffset={5}
                        >
                            <p className="text-xs whitespace-pre-wrap">{product.description}</p>
                        </TooltipContent>
                    </Tooltip>
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="text-lg font-bold text-emerald-400">
                            GHS {product.price.toFixed(2)}
                        </div>
                        {product.duration && (
                            <div className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 font-medium">
                                {product.duration}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="mt-auto p-4 pt-0">
                    <Button
                        size="sm"
                        className={`w-full font-semibold transition-all duration-300 h-9 text-sm ${isInCart ? 'bg-zinc-700 hover:bg-zinc-700 text-zinc-300' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                        onClick={handleAddToCart}
                        disabled={isInCart}
                    >
                        {isInCart ? (
                            <>
                                <Check className="mr-2 h-3 w-3" /> Added
                            </>
                        ) : (
                            "Add to Cart"
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Preview Modal */}
            {showPreview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-1 bg-zinc-950/50 h-full overflow-hidden flex items-center justify-center">
                            <img
                                src={product.preview_url!}
                                alt={`${product.name} Preview`}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
