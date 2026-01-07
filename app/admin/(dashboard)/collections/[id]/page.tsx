import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CollectionForm } from "@/components/admin/CollectionForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

interface EditCollectionPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Fetch the collection
    const { data: collection } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single()

    if (!collection) {
        notFound()
    }

    // 2. Fetch all products (for selection)
    const { data: allProducts } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name')

    // 3. Fetch linked products
    const { data: linkedProducts } = await supabase
        .from('product_collections')
        .select('product_id')
        .eq('collection_id', id)

    const initialProductIds = linkedProducts?.map(lp => lp.product_id) || []

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/collections">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Edit Collection</h1>
                    <p className="text-zinc-400">Update collection details and products.</p>
                </div>
            </div>

            <CollectionForm
                products={allProducts || []}
                initialData={{
                    ...collection,
                    products: initialProductIds
                }}
            />
        </div>
    )
}
