import { createClient } from "@/lib/supabase/server"
import { createNotice, toggleNoticeStatus, deleteNotice } from "./actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, CheckCircle2, Clock, Megaphone, Edit } from "lucide-react"
import Link from "next/link"

export default async function NoticesPage() {
    const supabase = await createClient()
    const { data: notices } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Notices</h2>
                    <p className="text-zinc-400">Manage site-wide announcements.</p>
                </div>
            </div>

            {/* Create New Notice Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Post New Notice</h3>
                <form action={createNotice} className="flex flex-col md:flex-row gap-4">
                    <input
                        name="content"
                        type="text"
                        placeholder="Enter notice content..."
                        className="flex-1 bg-black/20 border border-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white min-w-0"
                        required
                    />
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto shrink-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Notice
                    </Button>
                </form>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Content</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {notices?.map((notice) => (
                                <tr key={notice.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-6 py-4">
                                        {notice.is_active ? (
                                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-medium">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                                                <Clock className="w-4 h-4" />
                                                Inactive
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        {notice.content}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {new Date(notice.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-zinc-400">
                                                    {notice.is_active ? "Deactivate" : "Activate"}
                                                </span>
                                                <form action={async () => {
                                                    "use server"
                                                    await toggleNoticeStatus(notice.id, !notice.is_active)
                                                }}>
                                                    <Checkbox
                                                        checked={notice.is_active}
                                                        type="submit"
                                                    />
                                                </form>
                                            </div>
                                            <Link href={`/admin/notices/${notice.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                "use server"
                                                await deleteNotice(notice.id)
                                            }}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!notices || notices.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                        No notices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {notices?.map((notice) => (
                    <div key={notice.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-medium flex-shrink-0">
                                    <Megaphone className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-white line-clamp-2">{notice.content}</div>
                                </div>
                            </div>
                            <div>
                                {notice.is_active ? (
                                    <div className="text-emerald-500">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="text-zinc-500">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                            <span className="text-xs text-zinc-500">
                                {new Date(notice.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-4">
                                <form action={async () => {
                                    "use server"
                                    await toggleNoticeStatus(notice.id, !notice.is_active)
                                }} className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-400">
                                        {notice.is_active ? "Active" : "Inactive"}
                                    </span>
                                    <Checkbox
                                        checked={notice.is_active}
                                        type="submit"
                                    />
                                </form>
                                <Link href={`/admin/notices/${notice.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <form action={async () => {
                                    "use server"
                                    await deleteNotice(notice.id)
                                }}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}

                {(!notices || notices.length === 0) && (
                    <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        No notices found.
                    </div>
                )}
            </div>
        </div>
    )
}
