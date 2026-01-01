"use client"

import { useState, useRef, useEffect } from "react"
import { useCurrency } from "@/context/CurrencyContext"
import { Button } from "@/components/ui/button"
import { Check, Globe, ChevronDown } from "lucide-react"

export function CurrencySelector() {
    const { currency, setCurrency } = useCurrency()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white gap-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Globe className="h-4 w-4" />
                <span className="font-medium">{currency}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg py-1 z-[100] animate-in fade-in zoom-in-95 duration-100">
                    <button
                        onClick={() => {
                            setCurrency('GHS')
                            setIsOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 flex items-center justify-between"
                    >
                        <span className="flex items-center gap-2">🇬🇭 GHS (Cedis)</span>
                        {currency === 'GHS' && <Check className="h-4 w-4 text-emerald-500" />}
                    </button>
                    <button
                        onClick={() => {
                            setCurrency('USD')
                            setIsOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 flex items-center justify-between"
                    >
                        <span className="flex items-center gap-2">🇺🇸 USD (Dollar)</span>
                        {currency === 'USD' && <Check className="h-4 w-4 text-emerald-500" />}
                    </button>
                </div>
            )}
        </div>
    )
}
