"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { useCart } from "@/context/CartContext"

function SuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")
    const reference = searchParams.get("reference")
    const [isVerifying, setIsVerifying] = useState(!!reference)
    const [verificationError, setVerificationError] = useState<string | null>(null)
    const [orderItems, setOrderItems] = useState<any[]>([])
    const { clearCart } = useCart()

    const [retryCount, setRetryCount] = useState(0)

    const fetchOrderItems = async () => {
        if (!orderId) return

        try {
            const response = await fetch(`/api/orders/${orderId}`)
            const data = await response.json()

            if (response.ok && data.items && data.items.length > 0) {
                setOrderItems(data.items)
                return true
            }
            return false
        } catch (error) {
            console.error('Error fetching order items:', error)
            return false
        }
    }

    useEffect(() => {
        fetchOrderItems()
    }, [orderId])

    useEffect(() => {
        if (reference) {
            const verifyPayment = async () => {
                try {
                    const response = await fetch(`/api/pay/verify?reference=${reference}`)
                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(data.error || 'Payment verification failed')
                    }

                    // Payment verified successfully - Clear the cart!
                    clearCart()

                    // NOW fetch order items
                    // Wait a bit for database to update
                    setTimeout(async () => {
                        const success = await fetchOrderItems()

                        // Retry if items not found (up to 3 times)
                        if (!success && retryCount < 3) {
                            setTimeout(async () => {
                                await fetchOrderItems()
                                setRetryCount(prev => prev + 1)
                            }, 2000)
                        }
                    }, 1000)

                } catch (error: any) {
                    console.error("Verification error:", error)
                    setVerificationError(error.message)
                } finally {
                    setIsVerifying(false)
                }
            }

            verifyPayment()
        }
    }, [reference, retryCount])

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p>Verifying payment...</p>
                </div>
            </div>
        )
    }

    if (verificationError) {
        return (
            <div className="min-h-screen bg-black py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-red-500/10 p-6 rounded-full mb-8">
                    <CheckCircle className="h-16 w-16 text-red-500" />
                    {/* Ideally use XCircle or AlertCircle but keeping imports simple for now */}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Payment Verification Failed</h1>
                <p className="text-zinc-400 mb-8 max-w-md">
                    {verificationError}
                </p>
                <Link href="/cart">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Try Again
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-emerald-500/10 p-6 rounded-full mb-8">
                <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-zinc-400 mb-8 max-w-md">
                Thank you for your purchase. We've sent you a confirmation email. Download your Order below.
            </p>

            <div className="space-y-4 w-full max-w-md">
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-white font-semibold mb-4">Download your Order below</h3>
                    <div className="space-y-3">
                        {orderItems.length > 0 ? (
                            orderItems.map((item) => (
                                <div key={item.product_id} className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                                    <span className="text-sm text-zinc-300">{item.product_name}</span>
                                    <a
                                        href={`/api/download/${orderId}/${item.product_id}`}
                                        className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg font-medium transition-colors"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm">Loading your downloads...</p>
                        )}
                    </div>
                </div>

                <Link href="/products">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
