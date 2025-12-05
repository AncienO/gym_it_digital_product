// Type declarations for external libraries

// Paystack Inline (loaded via CDN)
interface PaystackPopSetupOptions {
    key: string
    email: string
    amount: number
    currency?: string
    ref: string
    phone?: string
    metadata?: {
        [key: string]: any // Allow additional metadata properties
        custom_fields?: Array<{
            display_name: string
            variable_name: string
            value: string
        }>
    }
    onClose?: () => void
    callback?: (response: any) => void
}

interface PaystackHandler {
    openIframe: () => void
}

interface PaystackPop {
    setup: (options: PaystackPopSetupOptions) => PaystackHandler
}

declare global {
    interface Window {
        PaystackPop: PaystackPop
    }
}

export { }
