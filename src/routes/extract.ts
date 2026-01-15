import { Elysia, t } from 'elysia'
import { callOpenRouter } from '../services/openrouter'
import { generateMarkdown } from '../services/markdown'
import { EXTRACTION_PROMPT } from '../utils/prompts'

export const extractRoutes = new Elysia({ prefix: '/api' })
  .post('/extract', async ({ body }) => {
    try {
      const { text, model, apiKey } = body

      const response = await callOpenRouter({
        apiKey,
        model,
        messages: [
          { role: 'system', content: EXTRACTION_PROMPT },
          { role: 'user', content: `Extract dates and events from this syllabus:\n\n${text}` }
        ]
      })

      // Try to parse the JSON response
      let extracted
      try {
        // Clean the response - remove markdown code blocks if present
        let content = response.content.trim()
        if (content.startsWith('```json')) {
          content = content.slice(7)
        }
        if (content.startsWith('```')) {
          content = content.slice(3)
        }
        if (content.endsWith('```')) {
          content = content.slice(0, -3)
        }
        extracted = JSON.parse(content.trim())
      } catch (parseError) {
        // If JSON parsing fails, return raw response
        return {
          success: false,
          error: 'Failed to parse AI response as JSON',
          rawResponse: response.content,
          model: response.model,
          usage: response.usage
        }
      }

      const markdown = generateMarkdown(extracted)

      return {
        success: true,
        extracted,
        markdown,
        model: response.model,
        usage: response.usage,
        reasoning: response.reasoning
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Extraction failed'
      return { success: false, error: message }
    }
  }, {
    body: t.Object({
      text: t.String(),
      model: t.String(),
      apiKey: t.String()
    })
  })
