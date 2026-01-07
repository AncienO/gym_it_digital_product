"use client"

import Link from "next/link"
import { ArrowRight, Layers } from "lucide-react"
import { Database } from "@/types"

type Collection = Database['public']['Tables']['collections']['Row']

interface CollectionCardProps {
    collection: Collection
}

export function CollectionCard({ collection }: CollectionCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 transition-all hover:border-emerald-500/50">
            {/* Image Aspect Ratio Container */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-800 relative">
                {collection.image_url ? (
                    <img
                        src={collection.image_url}
                        alt={collection.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <Layers className="h-12 w-12 text-zinc-700" />
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
            </div>

            {/* Content Content - Absolute positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {collection.title}
                </h3>
                {collection.description && (
                    <p className="text-sm text-zinc-300 line-clamp-2 mb-4">
                        {collection.description}
                    </p>
                )}

                <Link
                    href={`/collections/${collection.slug}`}
                    className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                    View Collection <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>

            {/* Full Card Link Overlay */}
            <Link
                href={`/collections/${collection.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`View ${collection.title}`}
            />
        </div>
    )
}
