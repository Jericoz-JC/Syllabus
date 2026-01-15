import { Elysia, t } from 'elysia'
import { extractTextFromPDF } from '../services/pdf-parser'

export const uploadRoutes = new Elysia({ prefix: '/api' })
  .post('/upload', async ({ body }) => {
    try {
      const file = body.file
      const arrayBuffer = await file.arrayBuffer()
      const text = await extractTextFromPDF(arrayBuffer)

      return {
        success: true,
        text,
        filename: file.name,
        size: file.size,
        textLength: text.length
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse PDF'
      return { success: false, error: message }
    }
  }, {
    body: t.Object({
      file: t.File()
    })
  })
