import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Layers } from "lucide-react"
import { DeleteCollectionButton, CollectionStatusToggle } from "./CollectionActions"

export const dynamic = 'force-dynamic'

export default async function AdminCollectionsPage() {
    const supabase = await createClient()

    const { data: collections } = await supabase
        .from('collections')
        .select('*, product_collections(count)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Collections</h1>
                    <p className="text-zinc-400">Manage your product groups.</p>
                </div>
                <Link href="/admin/collections/new">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                        <Plus className="mr-2 h-4 w-4" />
                        New Collection
                    </Button>
                </Link>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Collection</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Products</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {collections?.map((collection) => (
                                <tr key={collection.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {collection.image_url ? (
                                                    <img src={collection.image_url} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <Layers className="h-5 w-5 text-zinc-500" />
                                                )}
                                            </div>
                                            <span className="font-medium text-white">{collection.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">
                                        /{collection.slug}
                                    </td>
                                    <td className="px-6 py-4">
                                        <CollectionStatusToggle
                                            collectionId={collection.id}
                                            isActive={collection.is_active ?? true}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">
                                        {collection.product_collections?.[0]?.count ?? 0}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/collections/${collection.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteCollectionButton
                                                collectionId={collection.id}
                                                collectionName={collection.title}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!collections || collections.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No collections found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {collections?.map((collection) => (
                    <div key={collection.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {collection.image_url ? (
                                        <img src={collection.image_url} alt={collection.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <Layers className="h-6 w-6 text-zinc-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">{collection.title}</h3>
                                    <p className="text-sm text-zinc-500">/{collection.slug}</p>
                                </div>
                            </div>
                            <CollectionStatusToggle
                                collectionId={collection.id}
                                isActive={collection.is_active ?? true}
                            />
                        </div>

                        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                            <span className="text-xs text-zinc-500">
                                {collection.product_collections?.[0]?.count ?? 0} Products
                            </span>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/collections/${collection.id}`}>
                                    <Button variant="outline" size="sm" className="h-8 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <DeleteCollectionButton
                                    collectionId={collection.id}
                                    collectionName={collection.title}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {(!collections || collections.length === 0) && (
                    <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        No collections found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
