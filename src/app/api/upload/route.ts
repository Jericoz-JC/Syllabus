import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const data = await pdf(buffer)
    const text = data.text.replace(/\s+/g, ' ').trim()

    return NextResponse.json({
      success: true,
      text,
      filename: file.name,
      size: file.size,
      textLength: text.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse PDF'
    return NextResponse.json({ success: false, error: message })
  }
}
