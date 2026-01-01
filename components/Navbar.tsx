"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { CurrencySelector } from "@/components/CurrencySelector"

export function Navbar() {
    const { items } = useCart()
    const itemCount = items.length

    return (
        <nav className="w-full border-b border-zinc-800 bg-black/50 backdrop-blur-xl relative z-20">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                    gym<span className="text-emerald-500">-it</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/products" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Products
                    </Link>
                    <CurrencySelector />
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                                    {itemCount}
                                </span>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
