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
        status,
        extracted_fields (
          field_key,
          field_value
        ),
        applications!inner(user_id)
      `)
      .eq('applications.user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to search documents' }, { status: 500 })
    }

    console.log('Search found documents:', documents?.length || 0)
    console.log('Document statuses:', documents?.map(d => ({ id: d.id, status: d.status, hasOCR: !!d.ocr_text })))

    if (!documents || documents.length === 0) {
      return NextResponse.json({ results: [], debug: 'Nincs feltöltött dokumentum. Töltsön fel dokumentumokat először!' })
    }

    // Count documents by status
    const statusCounts = documents.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Filter only completed documents with OCR text
    const completedDocs = documents.filter(d => d.status === 'completed' && d.ocr_text)
    const completedButNoOCR = documents.filter(d => d.status === 'completed' && !d.ocr_text)

    if (completedDocs.length === 0) {
      const statusMsg = Object.entries(statusCounts)
        .map(([status, count]) => `${count} ${status}`)
        .join(', ')

      let debugMsg = `${documents.length} dokumentum található (${statusMsg})`

      if (completedButNoOCR.length > 0) {
        debugMsg += `. ${completedButNoOCR.length} completed dokumentumnak nincs OCR szövege!`
      }

      if (statusCounts.pending > 0) {
        debugMsg += `. ${statusCounts.pending} dokumentum feldolgozásra vár - nyissa meg őket a Dashboard-on!`
      }

      if (statusCounts.error > 0) {
        debugMsg += `. ${statusCounts.error} dokumentum hibával fejeződött be.`
      }

      return NextResponse.json({
        results: [],
        debug: debugMsg,
        statuses: documents.map(d => d.status)
      })
    }

    // Tokenize search query - split into words and filter out short/common words
    const searchTermLower = query.toLowerCase()
    const stopWords = ['a', 'az', 'volt', 'van', 'mi', 'i', 'the', 'is', 'was', 'what']
    const tokens = searchTermLower
      .split(/[\s,?.!]+/)
      .filter(token => token.length > 2 && !stopWords.includes(token))

    console.log('Search tokens:', tokens)

    const results: any[] = []

    for (const doc of completedDocs) {
      let score = 0
      let excerpt = ''
      let matchedTokens = new Set<string>()

      // Search in OCR text
      if (doc.ocr_text) {
        const text = doc.ocr_text.toLowerCase()

        // Search for each token
        for (const token of tokens) {
          if (text.includes(token)) {
            const matches = (text.match(new RegExp(token, 'g')) || []).length
            score += matches * 0.5
            matchedTokens.add(token)

            // Extract excerpt around the first match if we don't have one yet
            if (!excerpt) {
              const index = text.indexOf(token)
              const start = Math.max(0, index - 50)
              const end = Math.min(text.length, index + token.length + 50)
              excerpt = doc.ocr_text.substring(start, end).replace(/\n/g, ' ')
            }
          }
        }
      }

      // Search in extracted fields
      if (doc.extracted_fields && Array.isArray(doc.extracted_fields)) {
        for (const field of doc.extracted_fields) {
          if (field.field_value) {
            const fieldValue = field.field_value.toLowerCase()

            for (const token of tokens) {
              if (fieldValue.includes(token)) {
                score += 2 // Fields are more relevant than raw text
                matchedTokens.add(token)

                if (!excerpt) {
                  excerpt = `${field.field_key}: ${field.field_value}`
                }
              }
            }
          }
        }
      }

      // Bonus score for matching multiple tokens
      if (matchedTokens.size > 1) {
        score *= (1 + (matchedTokens.size - 1) * 0.3)
      }

      if (score > 0) {
        results.push({
          documentId: doc.id,
          documentName: doc.filename,
          excerpt: excerpt || 'No excerpt available',
          relevance: Math.min(score / 10, 1), // Normalize to 0-1
          matchedTokens: matchedTokens.size
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
