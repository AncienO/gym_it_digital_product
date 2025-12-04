import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSignupForm } from "@/components/admin/SignupForm"

export default async function AdminSignupPage() {
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

    return <AdminSignupForm />
}
