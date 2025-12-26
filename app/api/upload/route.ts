// API route for uploading documents
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Use service client for storage and database operations
  const supabase = createServiceClient()

  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()

  // Require authentication
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.id

  const formData = await request.formData()
  const file = formData.get('file') as File
  const applicationId = formData.get('applicationId') as string

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!applicationId) {
    return NextResponse.json(
      { error: 'No application ID provided' },
      { status: 400 }
    )
  }

  // Upload to Supabase Storage
  const fileName = `${userId}/${applicationId}/${Date.now()}-${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Create document record
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert({
      application_id: applicationId,
      filename: file.name,
      file_path: uploadData.path,
      file_size: file.size,
      mime_type: file.type,
      status: 'pending',
    })
    .select()
    .single()

  if (docError) {
    console.error('Document insert error:', docError)
    return NextResponse.json({ error: docError.message }, { status: 500 })
  }

  return NextResponse.json({ document: doc })
}
