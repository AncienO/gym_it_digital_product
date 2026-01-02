import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ url: string }> }
) {
    try {
        // Await params in Next.js 15
        const { url } = await params

        // Decode the URL from the path parameter
        const pdfUrl = decodeURIComponent(url)

        console.log('Fetching PDF from:', pdfUrl)

        // Fetch the PDF from Supabase storage
        const response = await fetch(pdfUrl)

        if (!response.ok) {
            console.error('PDF fetch failed:', response.status, response.statusText)
            return NextResponse.json(
                { error: 'PDF not found' },
                { status: 404 }
            )
        }

        const pdfBuffer = await response.arrayBuffer()

        // Return the PDF with headers that discourage downloading
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="preview.pdf"',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            },
        })
    } catch (error) {
        console.error('Error serving preview PDF:', error)
        return NextResponse.json(
            { error: 'Failed to load preview' },
            { status: 500 }
        )
    }
}
