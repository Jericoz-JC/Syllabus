// Use Node.js runtime for reliable PDF parsing (Edge has bundling issues with pdfjs)
import pdf from 'pdf-parse'

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
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
    const buffer = Buffer.from(arrayBuffer)

    const data = await pdf(buffer)
    const text = data.text.replace(/\s+/g, ' ').trim()

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
