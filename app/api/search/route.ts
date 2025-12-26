import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch only user's documents with their OCR text and extracted fields (join via applications)
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        id,
        filename,
        ocr_text,
        extracted_fields (
          field_key,
          field_value
        ),
        applications!inner(user_id)
      `)
      .eq('applications.user_id', user.id)
      .eq('status', 'completed')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to search documents' }, { status: 500 })
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({ results: [] })
    }

    // Simple text-based search with relevance scoring
    const searchTerm = query.toLowerCase()
    const results: any[] = []

    for (const doc of documents) {
      let score = 0
      let excerpt = ''

      // Search in OCR text
      if (doc.ocr_text) {
        const text = doc.ocr_text.toLowerCase()
        if (text.includes(searchTerm)) {
          // Calculate relevance score based on frequency and position
          const matches = (text.match(new RegExp(searchTerm, 'g')) || []).length
          score += matches * 0.5

          // Extract excerpt around the match
          const index = text.indexOf(searchTerm)
          const start = Math.max(0, index - 50)
          const end = Math.min(text.length, index + searchTerm.length + 50)
          excerpt = doc.ocr_text.substring(start, end).replace(/\n/g, ' ')
        }
      }

      // Search in extracted fields
      if (doc.extracted_fields && Array.isArray(doc.extracted_fields)) {
        for (const field of doc.extracted_fields) {
          if (field.field_value) {
            const fieldValue = field.field_value.toLowerCase()
            if (fieldValue.includes(searchTerm)) {
              score += 2 // Fields are more relevant than raw text
              if (!excerpt) {
                excerpt = `${field.field_key}: ${field.field_value}`
              }
            }
          }
        }
      }

      if (score > 0) {
        results.push({
          documentId: doc.id,
          documentName: doc.filename,
          excerpt: excerpt || 'No excerpt available',
          relevance: Math.min(score / 10, 1) // Normalize to 0-1
        })
      }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance)

    return NextResponse.json({ results: results.slice(0, 20) }) // Return top 20 results
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
