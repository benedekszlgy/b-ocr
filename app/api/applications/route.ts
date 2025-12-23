// API route for managing applications
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('applications')
    .select(
      `
      *,
      documents (
        id,
        filename,
        doc_type,
        status,
        created_at
      )
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ applications: data })
}

export async function POST(request: NextRequest) {
  // Use service client to bypass RLS for testing
  const supabase = createServiceClient()

  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()

  // For testing: use null if no user is logged in
  // In production, you should enforce authentication
  const userId = user?.id || null

  const body = await request.json()

  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      external_ref: body.externalRef || null,
      metadata: body.metadata || {},
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ application: data }, { status: 201 })
}
