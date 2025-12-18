"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, ArrowRight, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { TestimonialsSectionClient } from "@/components/TestimonialsSectionClient"
import toast from "react-hot-toast"

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

            // Use Paystack Inline V2 for better customer info pre-fill
            if (data.referenceId && data.authorizationUrl) {
                // Check if Paystack is loaded
                // @ts-ignore - Paystack is loaded from CDN
                if (typeof window.PaystackPop === 'undefined') {
                    throw new Error('Paystack script not loaded. Please refresh the page and try again.')
                }

                const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
                if (!publicKey) {
                    throw new Error('Paystack public key not configured')
                }

                // Using PaystackPop.setup (V1) since V2 requires different script
                // V1 doesn't support phone pre-fill, but we store it in metadata

                // Set a timeout for payment (5 minutes)
                const paymentTimeout = setTimeout(() => {
                    setIsProcessing(false)
                    toast.error('Payment session timed out. Please try again.', {
                        duration: 5000,
                        icon: '⏱️'
                    })
                }, 5 * 60 * 1000) // 5 minutes

                // @ts-ignore - PaystackPop is loaded from CDN
                const handler = window.PaystackPop.setup({
                    key: publicKey,
                    email: email,
                    amount: Math.round(total * 100), // Convert to pesewas for GHS
                    currency: 'GHS', // Ghana Cedis
                    ref: data.referenceId,
                    metadata: {
                        phone_number: phone, // Store for backend reference
                        custom_fields: [
                            {
                                display_name: "Phone Number",
                                variable_name: "phone_number",
                                value: phone
                            }
                        ]
                    },
                    onClose: function () {
                        // Clear the timeout
                        clearTimeout(paymentTimeout)
                        setIsProcessing(false)

                        // Show cancellation message
                        toast.error('Payment cancelled. Your cart is still saved.', {
                            duration: 4000,
                            icon: '❌'
                        })

                        // Show retry prompt after a brief delay
                        setTimeout(() => {
                            toast('Ready to try again? Click the Pay button when ready.', {
                                duration: 5000,
                                icon: '💳'
                            })
                        }, 1500)

                        console.log('Payment popup closed by user')
                    },
                    callback: function (response: any) {
                        // Clear the timeout on successful payment
                        clearTimeout(paymentTimeout)

                        // Show success message
                        toast.success('Payment successful! Redirecting...', {
                            duration: 2000,
                            icon: '✅'
                        })

                        // Payment successful - redirect to success page
                        window.location.href = `/checkout/success?orderId=${data.orderId}&reference=${response.reference}`
                    }
                })

                handler.openIframe()
            } else {
                throw new Error('Payment initialization failed')
            }

        } catch (error: any) {
            console.error("Checkout error:", error)
            toast.error(error.message || 'Payment failed. Please try again.', {
                duration: 5000
            })
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
                                    <Label htmlFor="email" className="text-zinc-300">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    {/* Red Disclaimer */}
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
                                        <div className="flex gap-2">
                                            <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-yellow-400 font-semibold mb-1">IMPORTANT: Enter the correct email address</p>
                                                <p className="text-xs text-yellow-200/90 leading-relaxed">
                                                    Payment receipts and download links will be sent to this email.
                                                    Ensure it's correct to receive your purchased products.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-zinc-300">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="024XXXXXXX"
                                        required
                                        className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />

                                    {/* Red Disclaimer */}
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
                                        <div className="flex gap-2">
                                            <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-yellow-400 font-semibold mb-1">IMPORTANT: Enter the correct phone number</p>
                                                <p className="text-xs text-yellow-200/90 leading-relaxed">
                                                    This number will be used for order updates, download links, and payment verification.
                                                    You will be asked to re-enter it during payment.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin">⏳</span>
                                                Processing Payment...
                                            </span>
                                        ) : (
                                            `Pay GHS ${total.toFixed(2)}`
                                        )}
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
            {/* Testimonials */}
            {/* Testimonials */}
            <div className="mt-20">
                <TestimonialsSectionClient />
            </div>
        </div>
    )
}
