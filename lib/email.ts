import nodemailer from 'nodemailer'

interface SendDownloadEmailParams {
    to: string
    customerName: string
    orderNumber: string
    products: Array<{
        name: string
        downloadUrl: string
    }>
}

export async function sendDownloadEmail({ to, customerName, orderNumber, products }: SendDownloadEmailParams) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail address
                pass: process.env.GMAIL_APP_PASSWORD, // Your App Password
            },
        })

        const mailOptions = {
            from: 'gym-it <gym.it.digital@gmail.com>', // Sender address
            to: to,
            subject: `Your gym-it Purchase - Order #${orderNumber}`,
            html: generateDownloadEmailHTML({ customerName, orderNumber, products }),
        }

        const info = await transporter.sendMail(mailOptions)

        console.log('✅ Email sent successfully to:', to)
        console.log('📧 Message ID:', info.messageId)
        return { success: true, data: info }
    } catch (error) {
        console.error('❌ Email sending error:', error)
        return { success: false, error }
    }
}

function generateDownloadEmailHTML({ customerName, orderNumber, products }: Omit<SendDownloadEmailParams, 'to'>) {
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
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff;">gym-it</h1>
            <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.9;">Digital Fitness Products</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="margin: 0 0 20px 0; color: #10b981; font-size: 24px;">Thank You for Your Purchase! 🎉</h2>
            
            <p style="margin: 0 0 15px 0; color: #d4d4d8; line-height: 1.6;">
                Hi ${customerName || 'there'},
            </p>
            
            <p style="margin: 0 0 25px 0; color: #d4d4d8; line-height: 1.6;">
                Your payment has been successfully processed! Your digital fitness products are ready to download.
            </p>

            <!-- Order Details -->
            <div style="background-color: #27272a; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 8px;">
                <p style="margin: 0 0 5px 0; color: #a1a1aa; font-size: 14px;">Order Number</p>
                <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold;">#${orderNumber}</p>
            </div>

            <!-- Products -->
            <h3 style="margin: 30px 0 15px 0; color: #ffffff; font-size: 18px;">Your Products:</h3>
            
            ${products.map((product, index) => `
                <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                    <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px; font-weight: 600;">${index + 1}. ${product.name}</p>
                    <a href="${product.downloadUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                        📥 Download Now
                    </a>
                </div>
            `).join('')}

            <!-- Important Notice -->
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 8px;">
                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                    <strong>⚠️ Important:</strong> These download links are unique to your order. Please save this email for future reference. Links will remain active for 30 days.
                </p>
            </div>

            <!-- Support -->
            <p style="margin: 30px 0 0 0; color: #d4d4d8; line-height: 1.6; font-size: 14px;">
                If you have any questions or need assistance, feel free to reply to this email.
            </p>

            <p style="margin: 15px 0 0 0; color: #d4d4d8; line-height: 1.6; font-size: 14px;">
                Happy training! 💪<br>
                <strong>The gym-it Team</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #09090b; padding: 30px 20px; text-align: center; border-top: 1px solid #27272a;">
            <p style="margin: 0 0 10px 0; color: #71717a; font-size: 12px;">
                This email was sent from <strong>gym.it.digital@gmail.com</strong>
            </p>
            <p style="margin: 0; color: #71717a; font-size: 12px;">
                © ${new Date().getFullYear()} gym-it. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `
}
