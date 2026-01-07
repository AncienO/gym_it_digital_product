// Force rebuild
import { createClient } from "@/lib/supabase/server"
import { CollectionCard } from "@/components/CollectionCard"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Collections | gym-it",
    description: "Browse our curated collections of fitness programs.",
}

export default async function CollectionsIndexPage() {
    const supabase = await createClient()

    const { data: collections } = await supabase
        .from('collections')
        .select('*')
        .eq('is_active', true)
        .order('title')

    return (
        <div className="min-h-screen bg-black py-20">
            <div className="container px-4 mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Browse Collections</h1>
                    <p className="text-zinc-400">Curated groups of programs for your specific goals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections?.map((collection) => (
                        <CollectionCard key={collection.id} collection={collection} />
                    ))}

                    {(!collections || collections.length === 0) && (
                        <p className="text-zinc-500 col-span-full text-center">No collections found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
