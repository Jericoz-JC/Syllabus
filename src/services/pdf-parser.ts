import { getDocumentProxy, extractText } from 'unpdf'

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(pdf, { mergePages: true })
    return text.replace(/\s+/g, ' ')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`PDF parsing failed: ${message}`)
  }
}
