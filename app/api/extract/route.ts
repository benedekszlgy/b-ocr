// API route for OCR and AI extraction
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { extractTextFromImage } from '@/lib/ocr/tesseract'
import { classifyDocument, extractFields } from '@/lib/extraction/openai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Use service client for database operations
  const supabase = createServiceClient()

  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()

  // For testing: allow unauthenticated access
  // In production, you should enforce authentication
  if (!user) {
    console.warn('Extraction called without authentication - using test mode')
  }

  const { documentId } = await request.json()

  if (!documentId) {
    return NextResponse.json(
      { error: 'No document ID provided' },
      { status: 400 }
    )
  }

  // Get document
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single()

  if (docError || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  // Update status to processing
  await supabase
    .from('documents')
    .update({ status: 'processing' })
    .eq('id', documentId)

  try {
    // Get file URL from Supabase Storage
    const { data: urlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(doc.file_path, 3600) // 1 hour expiry

    if (!urlData?.signedUrl) {
      throw new Error('Failed to get file URL')
    }

    // Perform OCR
    const ocrText = await extractTextFromImage(urlData.signedUrl)

    if (!ocrText || ocrText.trim().length === 0) {
      throw new Error('No text extracted from document')
    }

    // Classify document type
    const classification = await classifyDocument(ocrText)

    // Extract fields based on document type
    const fields = await extractFields(ocrText, classification.type)

    // Update document with OCR results
    await supabase
      .from('documents')
      .update({
        status: 'completed',
        doc_type: classification.type,
        doc_type_confidence: classification.confidence,
        ocr_text: ocrText,
      })
      .eq('id', documentId)

    // Save extracted fields
    if (fields.length > 0) {
      const fieldRecords = fields.map((f) => ({
        document_id: documentId,
        field_key: f.key,
        field_value: f.value,
        confidence: f.confidence,
        validation_status: f.confidence > 0.8 ? 'valid' : 'review',
      }))

      await supabase.from('extracted_fields').insert(fieldRecords)
    }

    return NextResponse.json({
      success: true,
      documentType: classification.type,
      classificationConfidence: classification.confidence,
      fieldsExtracted: fields.length,
      extractedFields: fields.map(f => ({
        fieldName: f.key,
        value: f.value,
        confidence: f.confidence
      })),
    })
  } catch (error: any) {
    console.error('Extraction error:', error)

    // Update document status to error
    await supabase
      .from('documents')
      .update({
        status: 'error',
        error_message: error.message,
      })
      .eq('id', documentId)

    return NextResponse.json(
      { error: error.message || 'Extraction failed' },
      { status: 500 }
    )
  }
}
