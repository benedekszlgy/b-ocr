import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
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
      .select('*')
      .eq('document_id', id)

    if (fieldsError) {
      console.error('Fields fetch error:', fieldsError)
    }

    const extractedFields = fields?.map(f => ({
      fieldName: f.field_name,
      value: f.value,
      confidence: f.confidence
    })) || []

    return NextResponse.json({
      document: {
        ...document,
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
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
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
