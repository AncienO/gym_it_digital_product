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
        let fileBuffer: ArrayBuffer | null = null;
        let contentType: string | null = null;

        console.log(`⬇️ Attempting to download file from: ${fileUrl}`)

        // Try standard fetch first (works for public URLs)
        const fileResponse = await fetch(fileUrl)

        if (fileResponse.ok) {
            fileBuffer = await fileResponse.arrayBuffer()
            contentType = fileResponse.headers.get('content-type')
        } else {
            console.warn(`⚠️ Direct fetch failed (${fileResponse.status}), trying Supabase Storage download...`)

            // Fallback: Try to download via Admin Client (works for private buckets)
            // We need to extract the bucket and path from the URL
            // Format: .../storage/v1/object/public/[bucket]/[path]
            try {
                const urlObj = new URL(fileUrl)
                const pathParts = urlObj.pathname.split('/')
                // find index of 'public' or 'sign' (if signed url) to locate bucket
                // usually: /storage/v1/object/public/product-files/filename.pdf

                // This is a naive parser, assuming standard Supabase URL structure
                // We know we used 'product-files' bucket in ProductForm
                const bucketName = 'product-files'
                const pathIndex = pathParts.indexOf(bucketName)

                if (pathIndex !== -1) {
                    const filePath = pathParts.slice(pathIndex + 1).join('/')
                    const { data, error: downloadError } = await supabase.storage
                        .from(bucketName)
                        .download(filePath)

                    if (downloadError) {
                        throw downloadError
                    }

                    if (data) {
                        fileBuffer = await data.arrayBuffer()
                        contentType = data.type
                        console.log('✅ Successfully downloaded via Storage API')
                    }
                } else {
                    // Try just the last part if we can't find bucket
                    // Or if URL is totally different
                    console.log('Could not parse bucket from URL, skipping storage download')
                }
            } catch (err) {
                console.error('❌ Storage download fallback failed:', err)
            }
        }

        if (!fileBuffer) {
            return NextResponse.json({ error: 'Failed to access product file. Please contact support.' }, { status: 500 })
        }

        // 3. Check if it's a PDF
        // content-type might be missing or wrong, check extension too
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
            const { width, height } = page.getSize()

            // Top Left
            page.drawText(watermarkText, {
                x: 20,
                y: height - 20,
                size: 10,
                font: font,
                color: rgb(0.06, 0.73, 0.5), // Emerald Green
                opacity: 0.8,
            })

            // Bottom Left
            page.drawText(watermarkText, {
                x: 20,
                y: 20,
                size: 10,
                font: font,
                color: rgb(0.06, 0.73, 0.5), // Emerald Green
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
