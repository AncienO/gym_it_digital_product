/**
 * Currency conversion utilities
 * Exchange rate: 1 USD = 10.5 GHS
 */

export const USD_TO_GHS_RATE = 10.5

/**
 * Convert USD amount to GHS
 */
export function convertUsdToGhs(usdAmount: number): number {
    return Math.round(usdAmount * USD_TO_GHS_RATE * 100) / 100
}

/**
 * Convert GHS amount to USD (for display purposes)
 */
export function convertGhsToUsd(ghsAmount: number): number {
    return Math.round((ghsAmount / USD_TO_GHS_RATE) * 100) / 100
}

/**
 * Get the amount to charge via Paystack (always in GHS for Ghana merchants)
 * If currency is USD, convert to GHS. Otherwise, use the amount as-is.
 */
export function getPaystackAmount(amount: number, currency: 'GHS' | 'USD'): number {
    if (currency === 'USD') {
        return convertUsdToGhs(amount)
    }
    return amount
}
