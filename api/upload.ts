// pdfjs-serverless is designed specifically for Edge/serverless environments
import { getDocument } from 'pdfjs-serverless'

export const config = {
  runtime: 'edge'
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json({ success: false, error: 'No file provided' })
    }

    const arrayBuffer = await file.arrayBuffer()

    // Use getDocument from pdfjs-serverless (the correct API)
    const pdf = await getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    }).promise

    // Extract text from all pages
    const numPages = pdf.numPages
    const textParts: string[] = []

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .filter((item): boolean => 'str' in item && typeof (item as { str: unknown }).str === 'string')
        .map(item => (item as { str: string }).str)
        .join(' ')
      textParts.push(pageText)
    }

    const text = textParts.join('\n\n')

    return Response.json({
      success: true,
      text,
      filename: file.name,
      size: file.size,
      textLength: text.length
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse PDF'
    return Response.json({ success: false, error: message })
  }
}
