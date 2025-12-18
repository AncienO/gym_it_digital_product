"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Package, LogOut, Menu, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-900 p-4 sticky top-0 z-50">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white tracking-tighter">
                    gym-it <span className="text-emerald-500">Admin</span>
                </h1>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-zinc-400 hover:text-white"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
                    <nav className="space-y-2">
                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/admin/products" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
                                <Package className="mr-2 h-4 w-4" />
                                Products
                            </Button>
                        </Link>
                        <Link href="/admin/testimonials" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Testimonials
                            </Button>
                        </Link>
                    </nav>

                    <div className="pt-4 border-t border-zinc-800">
                        <form action="/auth/signout" method="post">
                            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/10">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
