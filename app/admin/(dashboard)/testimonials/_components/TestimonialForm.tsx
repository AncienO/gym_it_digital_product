"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BicepsFlexed, Loader2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export function TestimonialForm({
    action,
    defaultValues,
    submitLabel,
    placeholders,
    resourceName = "Testimonial"
}: {
    action: (formData: FormData) => Promise<void>,
    defaultValues?: {
        username?: string
        text?: string
        rating?: number
    },
    submitLabel?: string,
    placeholders?: {
        username?: string
        text?: string
    },
    resourceName?: string
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState(defaultValues?.rating || 5)

    const handleSubmit = async (formData: FormData) => {
        // Validation
        const username = formData.get("username")?.toString().trim()
        const text = formData.get("text")?.toString().trim()

        if (!username || !text) {
            toast.error("Please fill in all fields")
            return
        }

        setLoading(true)
        try {
            await action(formData)
            toast.success(`${resourceName} saved successfully`)
        } catch (error: any) {
            if (error.message === "NEXT_REDIRECT") {
                // Redirecting, so it was successful
                toast.success(`${resourceName} saved successfully`)
                return
            }
            console.error(`Error saving ${resourceName.toLowerCase()}:`, error)
            toast.error(`Failed to save ${resourceName.toLowerCase()}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 w-full">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
                {/* Username */}
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-zinc-300">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        defaultValue={defaultValues?.username}
                        placeholder={placeholders?.username ?? "e.g. John Doe"}
                        className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500 transition-colors h-11"
                    />
                </div>

                {/* Testimonial Text */}
                <div className="space-y-2">
                    <Label htmlFor="text" className="text-zinc-300">Testimonial Text</Label>
                    <Textarea
                        id="text"
                        name="text"
                        defaultValue={defaultValues?.text}
                        placeholder={placeholders?.text ?? "e.g. This program changed my life! The results were immediate."}
                        rows={4}
                        className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500 transition-colors min-h-[120px] resize-none"
                    />
                </div>

                {/* Rating */}
                <div className="space-y-3">
                    <Label className="text-zinc-300">Rating (Biceps)</Label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRating(value)}
                                className={`p-3 rounded-lg transition-all duration-200 border ${rating >= value
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/50"
                                    : "bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700"
                                    }`}
                            >
                                <BicepsFlexed className="w-6 h-6" />
                            </button>
                        ))}
                        <input type="hidden" name="rating" value={rating} />
                    </div>
                    <p className="text-xs text-zinc-500">Click to rate from 1 to 5 biceps</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 h-12"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-medium"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        submitLabel || "Save Testimonial"
                    )}
                </Button>
            </div>
        </form>
    )
}
