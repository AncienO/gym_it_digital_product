
import { Buffer } from "node:buffer"
import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

// Polyfill Buffer for nodemailer
if (!globalThis.Buffer) {
    (globalThis as any).Buffer = Buffer;
}

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

            const orderId = metadata?.orderId || metadata?.custom_fields?.find((f: any) => f.variable_name === 'orderId')?.value;

            if (!orderId) {
                console.warn("No orderId found in metadata", metadata)
                return new Response("No orderId in metadata", { status: 200 })
            }

            // Initialize Supabase Admin Client
            const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
            const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            const supabase = createClient(supabaseUrl, supabaseServiceKey)

            // Update Order
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'paid',
                    payment_reference: reference,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)

            if (updateError) {
                console.error("Failed to update order", updateError)
                return new Response("Database update failed", { status: 500 })
            }

            console.log(`Order ${orderId} updated to paid`)

            // --- EMAIL SENDING LOGIC ---

            // 1. Fetch Order Items & Products
            const { data: orderItems, error: itemsError } = await supabase
                .from('order_items')
                .select(`
                    id,
                    products (
                        name,
                        file_url
                    )
                `)
                .eq('order_id', orderId)

            if (itemsError) {
                console.error("Failed to fetch order items for email", itemsError)
                // Don't fail the webhook, just log and return 200
                return new Response(JSON.stringify({ received: true, emailSent: false }), { status: 200 })
            }

            // 2. Prepare Products List for Email
            // Assume NEXT_PUBLIC_APP_URL is set in secrets, e.g., https://gym-it.onrender.com
            const appUrl = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000'

            const productsList = orderItems?.map((item: any) => ({
                name: item.products?.name,
                downloadUrl: `${appUrl}/api/download/${orderId}/${item.products?.id}` // Redirects to secure download route
            })) || []

            // 3. Send Email
            if (productsList.length > 0) {
                const gmailUser = Deno.env.get('GMAIL_USER')
                const gmailPass = Deno.env.get('GMAIL_APP_PASSWORD')

                if (gmailUser && gmailPass) {
                    try {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: gmailUser,
                                pass: gmailPass,
                            },
                        })

                        // Generate basic HTML (simplified from lib/email.ts for Deno)
                        const htmlContent = generateEmailHtml(customer.email, orderId, productsList)

                        await transporter.sendMail({
                            from: 'gym-it <gym.it.digital@gmail.com>',
                            to: customer.email,
                            subject: `Your gym-it Purchase - Order #${orderId.slice(0, 8)}`,
                            html: htmlContent,
                        })
                        console.log("Email sent successfully to", customer.email)
                    } catch (emailErr) {
                        console.error("Failed to send email", emailErr)
                    }
                } else {
                    console.warn("GMAIL secrets not set, skipping email")
                }
            }
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

function generateEmailHtml(customerName: string, orderNumber: string, products: any[]) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your gym-it Purchase</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border-radius: 12px; overflow: hidden; margin-top: 20px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff;">gym-it</h1>
            <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.9;">Digital Fitness Products</p>
        </div>
        <div style="padding: 40px 30px;">
            <h2 style="margin: 0 0 20px 0; color: #10b981; font-size: 24px;">Thank You for Your Purchase!</h2>
            <p style="margin: 0 0 15px 0; color: #d4d4d8; line-height: 1.6;">Hi ${customerName || 'there'},</p>
            <p style="margin: 0 0 25px 0; color: #d4d4d8; line-height: 1.6;">Your payment has been successfully processed! Your digital fitness products are ready to download.</p>
            <div style="background-color: #27272a; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 8px;">
                <p style="margin: 0 0 5px 0; color: #a1a1aa; font-size: 14px;">Order Number</p>
                <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold;">#${orderNumber}</p>
            </div>
            <h3 style="margin: 30px 0 15px 0; color: #ffffff; font-size: 18px;">Your Products:</h3>
            ${products.map((product, index) => `
                <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                    <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px; font-weight: 600;">${index + 1}. ${product.name}</p>
                    <a href="${product.downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">Download Now</a>
                </div>
            `).join('')}
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 8px;">
                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;"><strong>⚠️ Important:</strong> These download links are unique to your order. Please save this email for future reference.</p>
            </div>
            <p style="margin: 30px 0 0 0; color: #d4d4d8; line-height: 1.6; font-size: 14px;">If you have any questions, feel free to reply to this email.</p>
            <p style="margin: 15px 0 0 0; color: #d4d4d8; line-height: 1.6; font-size: 14px;">Happy training! 💪<br><strong>The gym-it Team</strong></p>
        </div>
        <div style="background-color: #09090b; padding: 30px 20px; text-align: center; border-top: 1px solid #27272a;">
            <p style="margin: 0; color: #71717a; font-size: 12px;">© ${new Date().getFullYear()} gym-it. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
}
