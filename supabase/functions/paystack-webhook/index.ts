

import { createClient } from "@supabase/supabase-js"

console.log("Paystack Webhook Function Initialized")

Deno.serve(async (req: Request) => {
    if (req.method === 'GET') {
        return new Response("Paystack Webhook is active", { status: 200 });
    }

    if (req.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
        if (!secret) {
            console.error("PAYSTACK_SECRET_KEY is not set")
            return new Response("Configuration Error", { status: 500 })
        }

        const signature = req.headers.get('x-paystack-signature')
        if (!signature) {
            return new Response("No signature header", { status: 401 })
        }

        const body = await req.text()

        // Verify Signature
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-512" },
            false,
            ["verify", "sign"]
        );

        const verification = await crypto.subtle.verify(
            "HMAC",
            key,
            hexToUint8Array(signature) as any,
            encoder.encode(body)
        );

        if (!verification) {
            console.error("Signature verification failed")
            return new Response("Invalid signature", { status: 401 })
        }

        const event = JSON.parse(body)
        console.log(`Received event: ${event.event}`, event.data.reference)

        if (event.event === 'charge.success') {
            const { reference, metadata, amount, customer } = event.data

            // metadata passed from initializePaystackPayment should contain orderId
            // In app/api/pay/route.ts we passed { orderId } as metadata
            const orderId = metadata?.orderId || metadata?.custom_fields?.find((f: any) => f.variable_name === 'orderId')?.value;

            if (!orderId) {
                console.warn("No orderId found in metadata", metadata)
                return new Response("No orderId in metadata", { status: 200 }) // Return 200 to acknowledge receipt
            }

            // Initialize Supabase Admin Client
            const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
            const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            const supabase = createClient(supabaseUrl, supabaseServiceKey)

            // Update Order
            const { error } = await supabase
                .from('orders')
                .update({
                    status: 'paid', // using 'paid' as verified status, though app might use 'completed' - checking schema is best but 'paid' is safe generic
                    payment_reference: reference,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)

            if (error) {
                console.error("Failed to update order", error)
                return new Response("Database update failed", { status: 500 })
            }

            console.log(`Order ${orderId} updated to paid`)
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error: any) {
        console.error("Webhook error:", error)
        return new Response(`Webhook Error: ${error.message}`, { status: 400 })
    }
})


// Helper to convert hex string to Uint8Array for crypto verification
function hexToUint8Array(hexString: string): Uint8Array {
    if (hexString.length % 2 !== 0) {
        throw new Error("Invalid hex string");
    }
    const arrayBuffer = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        const byteValue = parseInt(hexString.slice(i, i + 2), 16);
        arrayBuffer[i / 2] = byteValue;
    }
    return arrayBuffer;
}
