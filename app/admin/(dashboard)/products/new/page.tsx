import { ProductForm } from "@/components/admin/ProductForm"

export default function NewProductPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">New Product</h2>
                <p className="text-zinc-400">Add a new digital product to your store.</p>
            </div>

            <ProductForm />
        </div>
    )
}
