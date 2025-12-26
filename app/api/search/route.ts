import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/rag/embeddings'

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

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query)

    // Use Supabase's vector search function to find similar chunks
    const { data: similarChunks, error: searchError } = await supabase
      .rpc('search_document_chunks', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: 0.5, // Lower threshold for more results
        match_count: 20,
        filter_user_id: user.id
      })

    if (searchError) {
      console.error('Vector search error:', searchError)
      // Fall back to keyword search if vector search fails
      return NextResponse.json({
        results: [],
        debug: 'Vector search failed, please try again'
      })
    }

    console.log('Vector search found chunks:', similarChunks?.length || 0)

    if (!similarChunks || similarChunks.length === 0) {
      return NextResponse.json({
        results: [],
        debug: 'No matching documents found for your query'
      })
    }

    // Group chunks by document and aggregate relevance
    const documentScores = new Map<string, {
      id: string
      filename: string
      created_at: string
      excerpts: string[]
      maxSimilarity: number
      avgSimilarity: number
      chunkCount: number
    }>()

    for (const chunk of similarChunks) {
      const docId = chunk.document_id

      if (!documentScores.has(docId)) {
        documentScores.set(docId, {
          id: docId,
          filename: chunk.document_filename,
          created_at: chunk.document_created_at,
          excerpts: [],
          maxSimilarity: chunk.similarity,
          avgSimilarity: chunk.similarity,
          chunkCount: 1
        })
      } else {
        const docScore = documentScores.get(docId)!
        docScore.excerpts.push(chunk.chunk_text)
        docScore.maxSimilarity = Math.max(docScore.maxSimilarity, chunk.similarity)
        docScore.avgSimilarity = (docScore.avgSimilarity * docScore.chunkCount + chunk.similarity) / (docScore.chunkCount + 1)
        docScore.chunkCount++
      }

      const docScore = documentScores.get(docId)!
      if (docScore.excerpts.length < 3) { // Keep top 3 excerpts per document
        docScore.excerpts.push(chunk.chunk_text)
      }
    }

    // Convert to results array and sort by relevance
    const results = Array.from(documentScores.values()).map(doc => ({
      documentId: doc.id,
      documentName: doc.filename,
      excerpt: doc.excerpts[0] || 'No excerpt available',
      relevance: doc.maxSimilarity, // Use max similarity as relevance score
      matchedChunks: doc.chunkCount
    }))

    // Sort by relevance (highest first)
    results.sort((a, b) => b.relevance - a.relevance)

    return NextResponse.json({ results: results.slice(0, 20) }) // Return top 20 results
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
