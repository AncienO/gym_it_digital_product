'use client'

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface NoticeFormProps {
    action: (formData: FormData) => Promise<void>
    defaultValues: {
        content: string
    }
}

export function NoticeForm({ action, defaultValues }: NoticeFormProps) {
    return (
        <form action={action} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-zinc-200">
                    Content
                </label>
                <input
                    id="content"
                    name="content"
                    defaultValue={defaultValues.content}
                    type="text"
                    required
                    className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
