import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus, Edit, Trash2, BicepsFlexed } from "lucide-react"
import Link from "next/link"
import { deleteTestimonial } from "./actions"
import { DeleteTestimonialButton } from "./DeleteTestimonialButton"

export default async function AdminTestimonialsPage() {
    const supabase = await createClient()
    const { data: testimonials } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Testimonials</h2>
                    <p className="text-zinc-400">Manage customer reviews.</p>
                </div>
                <Link href="/admin/testimonials/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Testimonial
                    </Button>
                </Link>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Testimonial</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {testimonials?.map((testimonial) => (
                                <tr key={testimonial.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-medium flex-shrink-0">
                                                {testimonial.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-white">{testimonial.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-emerald-500 font-medium">
                                            <span>{testimonial.rating}</span>
                                            <BicepsFlexed className="w-4 h-4" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 max-w-md truncate">
                                        {testimonial.text}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {new Date(testimonial.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/testimonials/${testimonial.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteTestimonialButton id={testimonial.id} username={testimonial.username} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!testimonials || testimonials.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No testimonials found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {testimonials?.map((testimonial) => (
                    <div key={testimonial.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-medium flex-shrink-0">
                                    {testimonial.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">{testimonial.username}</h3>
                                    <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                                        <span>{testimonial.rating}</span>
                                        <BicepsFlexed className="w-3 h-3" />
                                        <span>Biceps</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-400 line-clamp-3">
                            {testimonial.text}
                        </p>

                        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                            <span className="text-xs text-zinc-500">
                                {new Date(testimonial.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/testimonials/${testimonial.id}`}>
                                    <Button variant="outline" size="sm" className="h-8 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <DeleteTestimonialButton id={testimonial.id} username={testimonial.username} />
                            </div>
                        </div>
                    </div>
                ))}

                {(!testimonials || testimonials.length === 0) && (
                    <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        No testimonials found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
