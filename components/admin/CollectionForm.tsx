"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Database } from "@/types"
import { Loader2, Upload, X, Trash2 } from "lucide-react"

type Product = Database['public']['Tables']['products']['Row']

interface CollectionFormProps {
    products: Product[]
    initialData?: Database['public']['Tables']['collections']['Row'] & {
        products?: string[]
    }
}

export function CollectionForm({ products, initialData }: CollectionFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<string[]>(initialData?.products || [])
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Create preview
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)
        setFormData(prev => ({ ...prev })) // Trigger re-render if needed
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        console.log('Form submitting...', {
            mode: initialData ? 'UPDATE' : 'INSERT',
            id: initialData?.id,
            slug: formData.slug
        })

        try {
            const fileInput = (document.getElementById('image') as HTMLInputElement)?.files?.[0]
            // Initialize with existing image, so we don't overwrite it with null if no new file is uploaded
            let imageUrl = initialData?.image_url || null

            // Helper to create a clean URL-friendly slug
            const slugify = (text: string) => {
                return text
                    .toString()
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')     // Replace spaces with -
                    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
            }

            const cleanSlug = slugify(formData.slug) || slugify(formData.title)

            if (fileInput) {
                const fileExt = fileInput.name.split('.').pop()
                const fileName = `collections/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, fileInput)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            let collectionId = initialData?.id

            if (initialData) {
                // UPDATE existing collection
                const { error: updateError } = await supabase
                    .from('collections')
                    .update({
                        title: formData.title,
                        slug: cleanSlug,
                        description: formData.description,
                        image_url: imageUrl,
                    })
                    .eq('id', initialData.id)

                if (updateError) throw updateError
            } else {
                // INSERT new collection
                const { data: collection, error: collectionError } = await supabase
                    .from('collections')
                    .insert({
                        title: formData.title,
                        slug: cleanSlug,
                        description: formData.description,
                        image_url: imageUrl,
                    })
                    .select()
                    .single()

                if (collectionError) throw collectionError
                collectionId = collection.id
            }

            // Link Products (for both insert and update)
            if (collectionId) {
                // First, remove all existing links for this collection
                const { error: deleteLinksError } = await supabase
                    .from('product_collections')
                    .delete()
                    .eq('collection_id', collectionId)

                if (deleteLinksError) throw deleteLinksError

                // Then, insert the new set of selected products
                if (selectedProducts.length > 0) {
                    const productLinks = selectedProducts.map(productId => ({
                        collection_id: collectionId,
                        product_id: productId
                    }))

                    const { error: insertLinksError } = await supabase
                        .from('product_collections')
                        .insert(productLinks)

                    if (insertLinksError) throw insertLinksError
                }
            }

            router.push('/admin/collections')
            router.refresh()
        } catch (error: any) {
            console.error('Error creating/updating collection:', error)

            let errorMessage = error?.message || 'Unknown error'
            if (errorMessage.includes('collections_slug_key')) {
                errorMessage = 'This URL (slug) is already taken. Please choose a different one.'
            }

            alert(`Failed to save collection: ${errorMessage}`)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleProduct = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="bg-zinc-900 border-zinc-700 text-white"
                        placeholder="e.g. Strength Training - Home"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug" className="text-white">Slug (URL)</Label>
                    <Input
                        id="slug"
                        required
                        value={formData.slug}
                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        className="bg-zinc-900 border-zinc-700 text-white"
                        placeholder="e.g. strength-training-home"
                    />
                    <p className="text-xs text-zinc-400">
                        This creates the link to your collection: <span className="text-emerald-500 font-mono">/collections/{formData.slug || 'your-url-here'}</span>
                    </p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="bg-zinc-900 border-zinc-700 text-white min-h-[100px]"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="image" className="text-white">Cover Image</Label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        {previewUrl && (
                            <div className="relative h-32 w-full md:w-32 rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0">
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setPreviewUrl(null)}
                                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-black/80"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        )}
                        <div className="flex-1 w-full">
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="bg-zinc-900 border-zinc-700 text-white w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Select Products</h3>
                <div className="grid gap-3 border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 max-h-[400px] overflow-y-auto">
                    {products.map(product => (
                        <div key={product.id} className="flex items-center space-x-3 p-2 rounded hover:bg-zinc-800/50">
                            <Checkbox
                                id={`product-${product.id}`}
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={() => toggleProduct(product.id)}
                                className="border-zinc-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                            <Label
                                htmlFor={`product-${product.id}`}
                                className="text-white cursor-pointer flex-1 flex items-center justify-between"
                            >
                                <span>{product.name}</span>
                                <span className="text-zinc-500 text-sm">GHS {product.price}</span>
                            </Label>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="text-zinc-500 text-center py-4">No products found.</div>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update Collection' : 'Create Collection'}
                </Button>
            </div>
        </form>
    )
}
