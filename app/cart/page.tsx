"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CartPage() {
    const { items, removeItem, total, clearCart } = useCart()
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            const response = await fetch('/api/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: total,
                    phoneNumber: phone,
                    email: email,
                    items: items,
                    provider: 'paystack'
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Payment failed')
            }

            // Use Paystack Inline (Popup) instead of redirect
            if (data.referenceId && data.authorizationUrl) {
                // @ts-ignore - PaystackPop is loaded from CDN
                const handler = window.PaystackPop.setup({
                    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                    email: email,
                    amount: Math.round(total * 100), // Convert to kobo
                    ref: data.referenceId,
                    metadata: {
                        custom_fields: [
                            {
                                display_name: "Phone Number",
                                variable_name: "phone_number",
                                value: phone
                            }
                        ]
                    },
                    onClose: function () {
                        setIsProcessing(false)
                        console.log('Payment popup closed')
                    },
                    callback: function (response: any) {
                        // Payment successful!
                        window.location.href = `/checkout/success?orderId=${data.orderId}&reference=${response.reference}`
                    }
                })

                handler.openIframe()
            } else {
                throw new Error('Payment initialization failed')
            }

        } catch (error: any) {
            console.error("Checkout error:", error)
            alert(error.message)
            setIsProcessing(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black py-20 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
                <p className="text-zinc-400 mb-8">Looks like you haven't added any programs yet.</p>
                <Link href="/products">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Browse Programs
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black py-12">
            <div className="container px-4 mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Cart Items */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-zinc-800 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-zinc-800 rounded-md overflow-hidden">
                                                {item.image_url && (
                                                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white">{item.name}</h3>
                                                <p className="text-sm text-zinc-400">GHS {item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-zinc-500 hover:text-red-500 hover:bg-zinc-800"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between items-center">
                                <span className="text-zinc-400">Total</span>
                                <span className="text-2xl font-bold text-emerald-400">GHS {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div>
                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 sticky top-24">
                            <h2 className="text-xl font-semibold text-white mb-6">Payment Details</h2>
                            <form onSubmit={handleCheckout} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <p className="text-xs text-zinc-500">Payment reciept will be sent to this email.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="024XXXXXXX"
                                        required
                                        className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <p className="text-xs text-zinc-500">For order updates.</p>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "Processing..." : `Pay GHS ${total.toFixed(2)}`}
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500">
                                        <Lock className="h-3 w-3" />
                                        Secure payment via Paystack
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
