"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Database } from "@/types"

type Product = Database['public']['Tables']['products']['Row']

export interface CartItem extends Product {
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("cart", JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeItem = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId))
    }

    const clearCart = () => {
        setItems([])
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Don't render children until cart is loaded to avoid hydration mismatch
    if (!isLoaded) {
        return null
    }

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
