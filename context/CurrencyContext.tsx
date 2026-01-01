"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Currency = 'GHS' | 'USD'

interface CurrencyContextType {
    currency: Currency
    setCurrency: (currency: Currency) => void
    formatPrice: (price: number | null | undefined, currency?: Currency) => string
    symbol: string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('GHS')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const initializeCurrency = () => {
            // Check if user has manually set a currency preference
            const saved = localStorage.getItem('gym_it_currency') as Currency

            if (saved && (saved === 'GHS' || saved === 'USD')) {
                // User has a saved preference - respect it
                setCurrencyState(saved)
            } else {
                // First-time visitor - detect timezone
                try {
                    // Get user's timezone using browser's built-in API (no external service needed)
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

                    console.log('🌍 Detected timezone:', timezone)

                    // Check if timezone indicates Ghana
                    // Ghana uses Africa/Accra timezone
                    const isGhana = timezone === 'Africa/Accra'

                    const detectedCurrency: Currency = isGhana ? 'GHS' : 'USD'

                    console.log(`� Auto-selected currency: ${detectedCurrency}`)
                    setCurrencyState(detectedCurrency)

                    // Save the auto-detected preference
                    localStorage.setItem('gym_it_currency', detectedCurrency)
                } catch (error) {
                    // Timezone detection failed - default to GHS
                    console.log('⚠️ Timezone detection error, defaulting to GHS:', error)
                    setCurrencyState('GHS')
                }
            }

            setMounted(true)
        }

        initializeCurrency()
    }, [])

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency)
        // Save manual selection - this will override geo-detection
        localStorage.setItem('gym_it_currency', newCurrency)
    }

    const formatPrice = (price: number | null | undefined, curr = currency) => {
        if (price === null || price === undefined) return 'N/A'

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: curr,
            minimumFractionDigits: 2
        })

        // Custom formatting if needed, otherwise Intl is good
        // Intl outputs "GHS 10.00" or "$10.00"
        return formatter.format(price)
    }

    const symbol = currency === 'GHS' ? '₵' : '$'

    if (!mounted) {
        return <>{children}</> // Render children without context to prevent hydration mismatch or flash? 
        // Better to maybe render with default to avoid layout shift, but let's stick to this for now.
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider")
    }
    return context
}
