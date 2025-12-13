import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { DeleteButton } from "./DeleteButton"

export default async function AdminProductsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Products</h2>
                    <p className="text-zinc-400">Manage your digital products.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {products?.map((product) => (
                                <tr key={product.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                                                {product.image_url && (
                                                    <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                                )}
                                            </div>
                                            <span className="font-medium text-white">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">GHS {product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            {product.is_active ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteButton productId={product.id} productName={product.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!products || products.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No products found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {products?.map((product) => (
                    <div key={product.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                                    {product.image_url && (
                                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">{product.name}</h3>
                                    <p className="text-sm text-zinc-400">GHS {product.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                {product.is_active ? 'Active' : 'Draft'}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                            <span className="text-xs text-zinc-500">
                                Added {new Date(product.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/products/${product.id}`}>
                                    <Button variant="outline" size="sm" className="h-8 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <DeleteButton productId={product.id} productName={product.name} />
                            </div>
                        </div>
                    </div>
                ))}
                {(!products || products.length === 0) && (
                    <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        No products found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
