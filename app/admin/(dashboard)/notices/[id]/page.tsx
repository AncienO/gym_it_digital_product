import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { updateNotice } from "../actions"
import { NoticeForm } from "../_components/NoticeForm"

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: notice } = await supabase
        .from("notices")
        .select("*")
        .eq("id", id)
        .single()

    if (!notice) {
        notFound()
    }

    const updateAction = updateNotice.bind(null, id)

    return (
        <div className="space-y-8 p-6">
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Edit Notice</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                </div>
                <p className="text-zinc-400">Update existing notice details.</p>
            </div>
            <NoticeForm
                action={updateAction}
                defaultValues={{
                    content: notice.content
                }}
            />
        </div>
    )
}
