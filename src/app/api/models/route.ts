import { NextResponse } from 'next/server'
import { FREE_MODELS } from '@/lib/constants'

export async function GET() {
  return NextResponse.json(FREE_MODELS)
}
