import Link from "next/link"
import { LayoutDashboard, Package, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/admin/MobileNav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Double check auth here just in case (middleware should handle it though)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row">
            {/* Mobile Navigation */}
            <MobileNav />

            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-zinc-800">
                    <h1 className="text-xl font-bold text-white tracking-tighter">
                        gym-it <span className="text-emerald-500">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <Package className="mr-2 h-4 w-4" />
                            Products
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <form action="/auth/signout" method="post">
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/10">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
