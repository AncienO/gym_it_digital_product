import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/components/admin/LoginForm"

export default async function AdminLoginPage() {
    // Server-side check to redirect if already logged in
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    if (user) {
        const { data: profile } = await supabaseServer
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'admin') {
            redirect('/admin')
        }
    }

    return <AdminLoginForm />
}
