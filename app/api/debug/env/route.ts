import { NextResponse } from 'next/server'

export async function GET() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasSupabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasOpenAI,
    hasSupabaseUrl,
    hasSupabaseServiceKey,
    openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'missing',
  })
}
