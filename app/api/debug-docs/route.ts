import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all user's documents with detailed info
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        id,
        filename,
        status,
        ocr_text,
        doc_type,
        created_at,
        applications!inner(user_id)
      `)
      .eq('applications.user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Analyze documents
    const analysis = {
      totalDocuments: documents?.length || 0,
      documentsByStatus: {} as Record<string, number>,
      documentsWithOCR: 0,
      documentsWithoutOCR: 0,
      completedWithOCR: 0,
      completedWithoutOCR: 0,
      documents: documents?.map(doc => ({
        id: doc.id,
        filename: doc.filename,
        status: doc.status,
        hasOCR: !!doc.ocr_text,
        ocrLength: doc.ocr_text?.length || 0,
        docType: doc.doc_type,
        createdAt: doc.created_at
      })) || []
    }

    documents?.forEach(doc => {
      // Count by status
      analysis.documentsByStatus[doc.status] = (analysis.documentsByStatus[doc.status] || 0) + 1

      // Count OCR availability
      if (doc.ocr_text) {
        analysis.documentsWithOCR++
        if (doc.status === 'completed') {
          analysis.completedWithOCR++
        }
      } else {
        analysis.documentsWithoutOCR++
        if (doc.status === 'completed') {
          analysis.completedWithoutOCR++
        }
      }
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
