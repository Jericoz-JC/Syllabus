import { NextRequest, NextResponse } from 'next/server'
import { EXTRACTION_PROMPT } from '@/lib/prompts'
import { generateMarkdown } from '@/lib/markdown'
import type { ExtractedData } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

interface ExtractRequest {
  text: string
  model: string
  apiKey?: string
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
      reasoning?: string
    }
  }>
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, model, apiKey: clientKey }: ExtractRequest = await request.json()

    // Use server-side key if available, otherwise use client-provided key
    const apiKey = process.env.OPENROUTER_API_KEY || clientKey

    if (!text || !model) {
      return NextResponse.json({ success: false, error: 'Missing required fields' })
    }

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'No API key configured' })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://syllabus-parser.vercel.app',
        'X-Title': 'Syllabus Parser',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: EXTRACTION_PROMPT },
          { role: 'user', content: `Extract dates and events from this syllabus:\n\n${text}` },
        ],
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
    }

    const data: OpenRouterResponse = await response.json()
    const choice = data.choices[0]

    if (!choice) {
      throw new Error('No response from AI model')
    }

    const content = choice.message.content

    // Parse JSON response
    let extracted: ExtractedData
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      extracted = JSON.parse(cleanContent.trim())
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse: content,
        model: data.model,
        usage: data.usage,
      })
    }

    const markdown = generateMarkdown(extracted)

    return NextResponse.json({
      success: true,
      extracted,
      markdown,
      model: data.model,
      usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      reasoning: choice.message.reasoning,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Extraction failed'
    return NextResponse.json({ success: false, error: message })
  }
}
