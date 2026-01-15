import { NextResponse } from 'next/server'

export async function GET() {
  const hasServerKey = !!process.env.OPENROUTER_API_KEY

  return NextResponse.json({
    hasServerKey,
    message: hasServerKey
      ? 'API key configured on server'
      : 'Enter your OpenRouter API key',
  })
}
