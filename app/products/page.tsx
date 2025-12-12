import { ProductCard } from "@/components/ProductCard"
import { createClient } from "@/lib/supabase/server"

export default async function ProductsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

    return (
        <div className="min-h-screen bg-black py-12">
            <div className="container px-4 mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">All Programs</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Choose from our wide range of specialized training programs designed to help you reach your fitness goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {(!products || products.length === 0) && (
                        <p className="text-zinc-500 col-span-3 text-center">No products available yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
