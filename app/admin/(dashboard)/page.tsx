import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
                <p className="text-zinc-400">Welcome to your admin dashboard.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Products</h3>
                        <Package className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">Manage your digital products, prices, and files.</p>
                    <Link href="/admin/products">
                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                            View Products
                        </Button>
                    </Link>
                </div>

                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col justify-center items-center text-center border-dashed">
                    <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Add New Product</h3>
                    <Link href="/admin/products/new">
                        <Button variant="outline" className="mt-2 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400">
                            Create Product
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
