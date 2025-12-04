const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_API_URL = 'https://api.paystack.co'

interface PaystackInitializeResponse {
    status: boolean
    message: string
    data: {
        authorization_url: string
        access_code: string
        reference: string
    }
}

interface PaystackVerifyResponse {
    status: boolean
    message: string
    data: {
        status: string
        reference: string
        amount: number
        gateway_response: string
        channel: string
        currency: string
        ip_address: string
        metadata?: any
        customer: {
            email: string
            customer_code: string
        }
    }
}

export async function initializePaystackPayment(email: string, amount: number, callbackUrl: string, metadata?: any) {
    if (!PAYSTACK_SECRET_KEY) {
        throw new Error('PAYSTACK_SECRET_KEY is not defined')
    }

    // Paystack expects amount in kobo (multiply by 100)
    const amountInKobo = Math.round(amount * 100)

    const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            amount: amountInKobo,
            callback_url: callbackUrl,
            metadata,
            currency: 'GHS', // Assuming GHS for this project
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Paystack initialization failed: ${error}`)
    }

    const data: PaystackInitializeResponse = await response.json()
    return data
}

export async function verifyPaystackPayment(reference: string) {
    if (!PAYSTACK_SECRET_KEY) {
        throw new Error('PAYSTACK_SECRET_KEY is not defined')
    }

    const startTime = Date.now()
    console.log('🔍 Starting Paystack verification for:', reference)

    const response = await fetch(`${PAYSTACK_API_URL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        // Add timeout
        signal: AbortSignal.timeout(15000) // 15 second timeout
    })

    const fetchTime = Date.now() - startTime
    console.log(`⏱️ Paystack API responded in ${fetchTime}ms`)

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Paystack verification failed: ${error}`)
    }

    const data: PaystackVerifyResponse = await response.json()
    console.log(`✅ Verification complete in ${Date.now() - startTime}ms, status:`, data.data.status)
    return data
}
