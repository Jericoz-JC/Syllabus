import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

export const config = {
  runtime: 'edge'
}

// Disable worker for Edge runtime compatibility
// @ts-ignore - workerPort is a valid way to disable workers
pdfjsLib.GlobalWorkerOptions.workerPort = null

async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    isEvalSupported: false,
    disableAutoFetch: true,
    disableStream: true,
    disableFontFace: true
  }).promise

  const textParts: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .filter((item: any) => item.str != null)
      .map((item: any) => item.str + (item.hasEOL ? '\n' : ''))
      .join('')
    textParts.push(pageText)
  }

  return textParts.join('\n').replace(/\s+/g, ' ')
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
    const text = await extractTextFromPDF(arrayBuffer)

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
