import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

// Set up a fake worker to prevent PDF.js from trying to create a real one
// @ts-ignore - workerPort is a valid way to disable workers
pdfjsLib.GlobalWorkerOptions.workerPort = null

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`PDF parsing failed: ${message}`)
  }
}
