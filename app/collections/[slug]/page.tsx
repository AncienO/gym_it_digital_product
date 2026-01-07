import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/ProductCard"
import { Metadata } from "next"

interface CollectionPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: collection } = await supabase
        .from('collections')
        .select('title, description')
        .eq('slug', slug)
        .single()

    if (!collection) {
        return {
            title: 'Collection Not Found',
        }
    }

    return {
        title: `${collection.title} | gym-it`,
        description: collection.description || `Browse our ${collection.title} collection.`,
    }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch Collection
    const { data: collection } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

    if (!collection) {
        notFound()
    }

    // Fetch Products in this Collection
    // Using a simpler approach: fetch junction table then fetch products
    const { data: collectionProducts } = await supabase
        .from('product_collections')
        .select('product_id')
        .eq('collection_id', collection.id)

    const productIds = collectionProducts?.map(cp => cp.product_id) || []

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Header */}
            <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                {collection.image_url && (
                    <img
                        src={collection.image_url}
                        alt={collection.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-50"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{collection.title}</h1>
                    {collection.description && (
                        <p className="text-lg text-zinc-300 max-w-2xl">{collection.description}</p>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <section className="py-12 container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products?.map((product) => (
                        <div key={product.id} className="w-full max-w-[340px] mx-auto">
                            <ProductCard product={product} />
                        </div>
                    ))}

                    {(!products || products.length === 0) && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-zinc-500 text-lg">No products found in this collection.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
