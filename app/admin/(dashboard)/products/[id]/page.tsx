import { ProductForm } from "@/components/admin/ProductForm"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Edit Product</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                </div>
                <p className="text-zinc-400">Update product details.</p>
            </div>

            <ProductForm product={product} />
        </div>
    )
}
