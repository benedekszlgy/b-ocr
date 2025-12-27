import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const authClient = await createClient()
    const supabase = createServiceClient()

    // Get current user
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch document with fields (user ownership check via applications join)
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select(`
        *,
        applications!inner(user_id)
      `)
      .eq('id', id)
      .eq('applications.user_id', user.id)
      .single()

    if (docError) {
      console.error('Document fetch error:', docError)
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Fetch extracted fields
    const { data: fields, error: fieldsError } = await supabase
      .from('extracted_fields')
      .select('id, document_id, field_key, field_value, confidence, validation_status')
      .eq('document_id', id)

    if (fieldsError) {
      console.error('Fields fetch error:', fieldsError)
      return NextResponse.json({ error: 'Failed to fetch fields' }, { status: 500 })
    }

    const extractedFields = fields?.map(f => ({
      fieldName: f.field_key,
      value: f.field_value,
      confidence: f.confidence
    })) || []

    // Generate signed URL for file access
    let signedUrl = document.file_path
    if (document.file_path) {
      console.log('[Document API] Generating signed URL for:', document.file_path)
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600) // 1 hour expiry

      if (urlError) {
        console.error('[Document API] Signed URL error:', urlError)
      }

      if (urlData?.signedUrl) {
        signedUrl = urlData.signedUrl
        console.log('[Document API] Generated signed URL:', signedUrl)
      } else {
        console.log('[Document API] No signed URL generated, using file_path')
      }
    }

    return NextResponse.json({
      document: {
        ...document,
        file_url: signedUrl, // Add signed URL for downloading/viewing
        extractedFields
      }
    })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const authClient = await createClient()
    const supabase = createServiceClient()

    // Get current user
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete extracted fields first (foreign key constraint)
    await supabase
      .from('extracted_fields')
      .delete()
      .eq('document_id', id)

    // Verify ownership via applications join before delete
    const { data: doc } = await supabase
      .from('documents')
      .select(`
        id,
        applications!inner(user_id)
      `)
      .eq('id', id)
      .eq('applications.user_id', user.id)
      .single()

    if (!doc) {
      return NextResponse.json({ error: 'Document not found or access denied' }, { status: 404 })
    }

    // Delete the document
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
