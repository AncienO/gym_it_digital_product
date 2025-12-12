import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ orderId: string; productId: string }> }
) {
    try {
        const { orderId, productId } = await params
        const supabase = await createAdminClient()

        // 1. Verify Order and Ownership
        // We need to check if this order actually contains this product
        const { data: orderItem, error: orderError } = await supabase
            .from('order_items')
            .select(`
                *,
                orders (
                    customer_email,
                    status
                ),
                products (
                    name,
                    file_url
                )
            `)
            .eq('order_id', orderId)
            .eq('product_id', productId)
            .single()

        if (orderError || !orderItem) {
            return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
        }

        // Cast to any to access joined tables without strict type checking
        const item = orderItem as any

        // Optional: Check if order is paid
        // if (item.orders.status !== 'completed') { ... }

        const fileUrl = item.products?.file_url
        if (!fileUrl) {
            return NextResponse.json({ error: 'Product file not found' }, { status: 404 })
        }

        // 2. Fetch the original file from Supabase Storage
        // Extract path from URL or use the stored path directly if that's what you have
        // Assuming file_url is a public URL, we can fetch it. 
        // Ideally, we should use supabase.storage.download() if it's a private bucket path.

        // Let's try to fetch the file content
        const fileResponse = await fetch(fileUrl)
        if (!fileResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch source file' }, { status: 500 })
        }
        const fileBuffer = await fileResponse.arrayBuffer()

        // 3. Check if it's a PDF
        const contentType = fileResponse.headers.get('content-type')
        if (!contentType?.includes('pdf') && !fileUrl.toLowerCase().endsWith('.pdf')) {
            // If not PDF, just return the file as is (can't watermark)
            return new NextResponse(fileBuffer, {
                headers: {
                    'Content-Type': contentType || 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${item.products?.name || 'download'}.${fileUrl.split('.').pop()}"`,
                },
            })
        }

        // 4. Watermark PDF
        const pdfDoc = await PDFDocument.load(fileBuffer)
        // Standard PDF fonts don't include Poppins, so we use HelveticaBold which is standard and safe
        // To use Poppins, we'd need to load the font file from the filesystem/URL which is heavier
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const pages = pdfDoc.getPages()

        const watermarkText = `Licensed to ${item.orders?.customer_email} - Order #${orderId.slice(0, 8)}`

        for (const page of pages) {
            const { width } = page.getSize()

            page.drawText(watermarkText, {
                x: 20, // Align to left
                y: 20,
                size: 10,
                font: font,
                color: rgb(0.06, 0.73, 0.5), // Emerald-500 approx (#10b981)
                opacity: 0.8,
            })
        }

        const pdfBytes = await pdfDoc.save()

        // 5. Return modified PDF
        // NextResponse accepts Uint8Array, but sometimes TS needs a hint or Buffer
        return new NextResponse(pdfBytes as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${item.products?.name || 'download'}.pdf"`,
            },
        })

    } catch (error: any) {
        console.error('Download error:', error)
        return NextResponse.json({ error: 'Download failed' }, { status: 500 })
    }
}
