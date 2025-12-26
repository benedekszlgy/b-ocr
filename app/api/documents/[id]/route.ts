import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    // Fetch document with fields
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
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

    // Delete extracted fields first (foreign key constraint)
    await supabase
      .from('extracted_fields')
      .delete()
      .eq('document_id', id)

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
