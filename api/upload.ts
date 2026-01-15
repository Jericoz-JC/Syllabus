// pdfjs-serverless is designed specifically for Edge/serverless environments
// @ts-ignore - Type definitions may not be available
import { getDocumentProxy, extractText } from 'pdfjs-serverless'

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
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer))
    const { text } = await extractText(pdf, { mergePages: true })

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
