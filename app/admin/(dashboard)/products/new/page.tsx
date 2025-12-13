import { ProductForm } from "@/components/admin/ProductForm"

export default function NewProductPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">New Product</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                </div>
                <p className="text-zinc-400">Add a new digital product to your store.</p>
            </div>

            <ProductForm />
        </div>
    )
}
