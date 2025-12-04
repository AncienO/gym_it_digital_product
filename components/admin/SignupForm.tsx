"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import { createBrowserClient } from '@supabase/ssr'
import Link from "next/link"

export function AdminSignupForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            })

            if (signUpError) throw signUpError

            if (data.user) {
                setSuccess(true)
                // Optional: Redirect after a delay or let them click a link
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="mx-auto h-12 w-12 bg-emerald-900/20 rounded-full flex items-center justify-center border border-emerald-500/20">
                        <UserPlus className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                        Account Created
                    </h2>
                    <p className="mt-2 text-zinc-400">
                        Your account has been successfully created.
                    </p>
                    <div className="mt-6 p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300">
                        <p><strong>Note:</strong> New accounts have <strong>User</strong> privileges by default.</p>
                        <p className="mt-2">Please contact an administrator to upgrade your account to <strong>Admin</strong> to access the dashboard.</p>
                    </div>
                    <div className="mt-8">
                        <Link href="/admin/login">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                Return to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                        <UserPlus className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                        Create Admin Account
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        Sign up to manage your products
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="full-name" className="text-zinc-300">Full Name</Label>
                            <Input
                                id="full-name"
                                name="fullName"
                                type="text"
                                required
                                className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email-address" className="text-zinc-300">Email address</Label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {loading ? "Creating account..." : "Sign up"}
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <Link href="/admin/login" className="text-emerald-500 hover:text-emerald-400">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
