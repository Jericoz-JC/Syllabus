import pdf from 'pdf-parse'

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const data = await pdf(Buffer.from(buffer))
    return data.text.replace(/\s+/g, ' ').trim()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`PDF parsing failed: ${message}`)
  }
}
