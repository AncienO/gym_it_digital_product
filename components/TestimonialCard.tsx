import { BicepsFlexed } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface TestimonialCardProps {
    username: string
    text: string
    rating: number
}

export function TestimonialCard({ username, text, rating }: TestimonialCardProps) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col h-[280px]">
            <div className="flex mb-4 shrink-0">
                {[...Array(5)].map((_, i) => (
                    <BicepsFlexed
                        key={i}
                        className={`w-5 h-5 ${i < rating ? "text-emerald-500" : "text-zinc-700"}`}
                    />
                ))}
            </div>

            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <p className="text-zinc-300 mb-6 flex-grow leading-relaxed line-clamp-5 cursor-help">
                            "{text}"
                        </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-zinc-950 border-zinc-800 text-zinc-300 p-3 leading-relaxed">
                        "{text}"
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className="mt-auto shrink-0 flex items-center gap-3">
                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-bold text-sm flex-shrink-0">
                    {username.charAt(0).toUpperCase()}
                </div>
                <p className="font-bold text-white uppercase tracking-wider text-sm">{username}</p>
            </div>
        </div>
    )
}
