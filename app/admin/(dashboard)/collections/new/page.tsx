import { createClient } from "@/lib/supabase/server"
import { CollectionForm } from "@/components/admin/CollectionForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewCollectionPage() {
    const supabase = await createClient()

    // Fetch active products to choose from
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name')

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/collections">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">New Collection</h1>
                    <p className="text-zinc-400">Create a group of products.</p>
                </div>
            </div>

            <CollectionForm products={products || []} />
        </div>
    )
}
