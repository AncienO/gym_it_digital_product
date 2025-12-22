import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Plus, Megaphone, MessageSquare, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats in parallel
    const [
        { data: activeNotice },
        { count: pendingTestimonials },
        { count: totalProducts }
    ] = await Promise.all([
        supabase.from('notices').select('content').eq('is_active', true).limit(1).single(),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('products').select('id', { count: 'exact', head: true })
    ])

    return (
        <div className="space-y-8 p-6">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
                <p className="text-zinc-400">Welcome to your admin dashboard.</p>
            </div>

            {/* Quick Stats / Active Items */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Active Notice Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Megaphone className="w-24 h-24 text-indigo-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-indigo-500" />
                            Active Notice
                        </h3>
                        {activeNotice ? (
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-4">
                                <p className="text-indigo-200 text-sm font-medium line-clamp-2">
                                    "{activeNotice.content}"
                                </p>
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm mb-4 italic">No active notice running.</p>
                        )}
                        <Link href="/admin/notices">
                            <Button variant="outline" size="sm" className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                                Manage Notices
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Testimonials Summary Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="w-24 h-24 text-amber-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-amber-500" />
                            Pending Testimonials
                        </h3>
                        <div className="mb-4">
                            <span className="text-4xl font-bold text-white block">
                                {pendingTestimonials || 0}
                            </span>
                            <span className="text-sm text-zinc-500">reviews waiting for approval</span>
                        </div>
                        <Link href="/admin/testimonials">
                            <Button variant="outline" size="sm" className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                                Review Testimonials
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8">Quick Actions</h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* manage products */}
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Products</h3>
                        <Package className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">
                        {totalProducts || 0} products in catalog. Manage prices and files.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <Link href="/admin/products">
                            <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                                View All
                            </Button>
                        </Link>
                        <Link href="/admin/products/new">
                            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                                <Plus className="w-4 h-4 mr-1" /> Add
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* shortcut to create notice */}
                <Link href="/admin/notices" className="block h-full">
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">Announcements</h3>
                            <Megaphone className="h-5 w-5 text-indigo-500" />
                        </div>
                        <p className="text-zinc-400 text-sm mb-6 flex-1">
                            Post updates or alerts to the website header.
                        </p>
                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                            Go to Notices
                        </Button>
                    </div>
                </Link>

                {/* shortcut to create testimonial */}
                <Link href="/admin/testimonials/new" className="block h-full">
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col justify-center items-center text-center border-dashed hover:bg-zinc-900/80 transition-colors h-full">
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h3 className="font-semibold text-white mb-1">Add Manual Testimonial</h3>
                        <p className="text-xs text-zinc-500">Record a customer review manually.</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}
