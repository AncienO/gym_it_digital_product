"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import toast from 'react-hot-toast'

// Simple Textarea component if not exists
function SimpleTextarea({ className, onChange, onKeyDown, ...props }: any) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            const target = e.currentTarget
            const start = target.selectionStart
            const end = target.selectionEnd
            const value = target.value

            const newValue = value.substring(0, start) + "\t" + value.substring(end)

            // Create a synthetic-like event to update parent state
            const mockEvent = {
                target: {
                    value: newValue
                }
            }

            if (onChange) {
                onChange(mockEvent)
            }

            // Restore cursor position
            requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + 1
            })
        }

        if (onKeyDown) {
            onKeyDown(e)
        }
    }

    return (
        <textarea
            className={`flex min-h-[150px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white font-mono ${className}`}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            {...props}
        />
    )
}

interface ProductFormProps {
    product?: any
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(product?.name || "")
    const [description, setDescription] = useState(product?.description || "")
    const [price, setPrice] = useState(product?.price || "")
    const [duration, setDuration] = useState(product?.duration || "")
    const [isActive, setIsActive] = useState(product?.is_active ?? true)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [productFile, setProductFile] = useState<File | null>(null)
    const [currentImageUrl, setCurrentImageUrl] = useState(product?.image_url || "")
    const [currentFileUrl, setCurrentFileUrl] = useState(product?.file_url || "")

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleUpload = async (file: File, bucket: string) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file)

        if (uploadError) {
            throw uploadError
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
        return data.publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = currentImageUrl
            let fileUrl = currentFileUrl

            // Upload Image
            if (imageFile) {
                imageUrl = await handleUpload(imageFile, 'product-images')
            }

            // Upload Product File
            if (productFile) {
                // Let's use 'product-files' bucket
                fileUrl = await handleUpload(productFile, 'product-files')
            }

            const productData = {
                name,
                description,
                price: parseFloat(price),
                duration,
                is_active: isActive,
                image_url: imageUrl,
                file_url: fileUrl,
            }

            if (product) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id)

                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('products')
                    .insert(productData)

                if (error) throw error
            }

            toast.success(product ? 'Product updated successfully' : 'Product created successfully')
            router.push('/admin/products')
            router.refresh()

        } catch (error: any) {
            console.error('Error saving product:', error)
            toast.error('Error saving product: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full">
            <div className="space-y-8">
                {/* Main Info */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-300">Product Name</Label>
                            <Input
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500 transition-colors h-11"
                                placeholder="e.g. 12 Week Strength Program"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-zinc-300">Description</Label>
                            <SimpleTextarea
                                id="description"
                                value={description}
                                onChange={(e: any) => setDescription(e.target.value)}
                                rows={6}
                                className="resize-none"
                                placeholder="Describe what the user gets..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-zinc-300">Price (GHS)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">GHS</span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500 pl-12 h-11"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-zinc-300">Duration</Label>
                                <Input
                                    id="duration"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="e.g. 4 Weeks"
                                    className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500 h-11"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Media, Status, Actions */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                        <h3 className="text-lg font-medium text-white mb-4">Availability</h3>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <Label htmlFor="isActive" className="text-zinc-300 cursor-pointer flex-1 select-none">
                                Active & Visible
                            </Label>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
                        <h3 className="text-lg font-medium text-white">Media & Files</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cover Image */}
                            <div className="space-y-3">
                                <Label className="text-zinc-300">Cover Image</Label>
                                <div className="relative group">
                                    <div className="aspect-video w-full bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center transition-colors hover:border-zinc-700">
                                        {imageFile ? (
                                            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-full w-full object-cover" />
                                        ) : currentImageUrl ? (
                                            <img src={currentImageUrl} alt="Current" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                                                <span className="text-xs text-zinc-500 block">Upload Image</span>
                                            </div>
                                        )}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-2 text-center">Rec: 16:9 or 4:3</p>
                                </div>
                            </div>

                            {/* Product File */}
                            <div className="space-y-3">
                                <Label className="text-zinc-300">Product File</Label>
                                <div className="relative group">
                                    <div className="aspect-video w-full bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center transition-colors hover:border-zinc-700">
                                        {productFile ? (
                                            <div className="text-center p-4">
                                                <div className="h-8 w-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Upload className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs text-emerald-500 block font-medium truncate max-w-[150px]">{productFile.name}</span>
                                            </div>
                                        ) : currentFileUrl ? (
                                            <div className="text-center p-4">
                                                <div className="h-8 w-8 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Upload className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs text-zinc-400 block font-medium truncate max-w-[150px]">Current: {currentFileUrl.split('/').pop()}</span>
                                            </div>
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                                                <span className="text-xs text-zinc-500 block">Upload File</span>
                                            </div>
                                        )}
                                        <Input
                                            type="file"
                                            onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-2 text-center">PDF, ZIP, etc.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
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
                                "Save Product"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
