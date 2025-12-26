import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateEmbedding } from '@/lib/rag/embeddings'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const authClient = await createClient()
    const supabase = createServiceClient()

    // Get current user
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[RAG Search] User:', user.id, 'Query:', query)

    // Get user's application IDs first
    const { data: userApps } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)

    const appIds = userApps?.map(a => a.id) || []
    console.log('[RAG Search] User applications:', appIds.length)

    if (appIds.length === 0) {
      return NextResponse.json({
        results: [],
        debug: 'Nincs hozzárendelt alkalmazás. Töltsön fel dokumentumokat először!'
      })
    }

    // Get user's documents
    const { data: userDocs, error: docsError } = await supabase
      .from('documents')
      .select('id, filename, status, ocr_text')
      .in('application_id', appIds)

    if (docsError) {
      console.error('[RAG Search] Error fetching documents:', docsError)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    console.log('[RAG Search] Found', userDocs?.length || 0, 'documents')

    if (!userDocs || userDocs.length === 0) {
      return NextResponse.json({
        results: [],
        debug: 'Nincs feltöltött dokumentum. Töltsön fel dokumentumokat először!'
      })
    }

    // Check completed documents
    const completedDocs = userDocs.filter(d => d.status === 'completed' && d.ocr_text)
    console.log('[RAG Search] Completed docs:', completedDocs.length)

    if (completedDocs.length === 0) {
      const statusCounts = userDocs.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const statusMsg = Object.entries(statusCounts)
        .map(([status, count]) => `${count} ${status}`)
        .join(', ')

      return NextResponse.json({
        results: [],
        debug: `${userDocs.length} dokumentum található (${statusMsg}). Várja meg, amíg a dokumentumok feldolgozása befejeződik!`
      })
    }

    // Get document IDs for filtering
    const docIds = completedDocs.map(d => d.id)
    console.log('[RAG Search] Searching in', docIds.length, 'completed documents')

    // Check if we have any chunks
    const { count: chunkCount, error: countError } = await supabase
      .from('document_chunks')
      .select('*', { count: 'exact', head: true })
      .in('document_id', docIds)

    console.log('[RAG Search] Found', chunkCount || 0, 'chunks')

    if (countError) {
      console.error('[RAG Search] Error counting chunks:', countError)
    }

    if (!chunkCount || chunkCount === 0) {
      return NextResponse.json({
        results: [],
        debug: 'A dokumentumokhoz még nincsenek indexelve részletek. Próbálja meg később!'
      })
    }

    // Generate embedding for query
    console.log('[RAG Search] Generating query embedding...')
    const queryEmbedding = await generateEmbedding(query)
    console.log('[RAG Search] Query embedding generated, length:', queryEmbedding.length)

    // Simple direct query without RPC - just get all chunks and calculate similarity in JS
    const { data: allChunks, error: chunksError } = await supabase
      .from('document_chunks')
      .select(`
        id,
        document_id,
        chunk_text,
        embedding
      `)
      .in('document_id', docIds)

    if (chunksError) {
      console.error('[RAG Search] Error fetching chunks:', chunksError)
      return NextResponse.json({
        results: [],
        debug: `Chunk fetch error: ${chunksError.message}`
      })
    }

    console.log('[RAG Search] Fetched', allChunks?.length || 0, 'chunks')

    if (!allChunks || allChunks.length === 0) {
      return NextResponse.json({
        results: [],
        debug: 'Nincsenek kereshető részletek a dokumentumokban'
      })
    }

    // Calculate cosine similarity in JavaScript
    const cosineSimilarity = (a: number[], b: number[]): number => {
      if (a.length !== b.length) return 0

      let dotProduct = 0
      let normA = 0
      let normB = 0

      for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
      }

      const denominator = Math.sqrt(normA) * Math.sqrt(normB)
      return denominator === 0 ? 0 : dotProduct / denominator
    }

    // Calculate similarity for each chunk
    const scoredChunks = allChunks
      .map(chunk => {
        // Parse embedding if it's a string
        const embedding = typeof chunk.embedding === 'string'
          ? JSON.parse(chunk.embedding)
          : chunk.embedding

        const similarity = cosineSimilarity(queryEmbedding, embedding)

        return {
          chunk_id: chunk.id,
          document_id: chunk.document_id,
          chunk_text: chunk.chunk_text,
          similarity
        }
      })
      .filter(chunk => chunk.similarity > 0.5) // Filter by threshold
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity
      .slice(0, 20) // Take top 20

    console.log('[RAG Search] Found', scoredChunks.length, 'matching chunks')

    if (scoredChunks.length === 0) {
      return NextResponse.json({
        results: [],
        debug: 'Nem találtunk releváns dokumentumokat a kereséshez'
      })
    }

    // Get document info for matched chunks
    const matchedDocIds = [...new Set(scoredChunks.map(c => c.document_id))]
    const docMap = new Map(completedDocs.map(d => [d.id, d]))

    // Group by document
    const documentScores = new Map<string, {
      id: string
      filename: string
      excerpts: string[]
      maxSimilarity: number
      chunkCount: number
    }>()

    for (const chunk of scoredChunks) {
      const doc = docMap.get(chunk.document_id)
      if (!doc) continue

      if (!documentScores.has(chunk.document_id)) {
        documentScores.set(chunk.document_id, {
          id: chunk.document_id,
          filename: doc.filename,
          excerpts: [chunk.chunk_text],
          maxSimilarity: chunk.similarity,
          chunkCount: 1
        })
      } else {
        const docScore = documentScores.get(chunk.document_id)!
        if (docScore.excerpts.length < 3) {
          docScore.excerpts.push(chunk.chunk_text)
        }
        docScore.maxSimilarity = Math.max(docScore.maxSimilarity, chunk.similarity)
        docScore.chunkCount++
      }
    }

    // Convert to results
    const results = Array.from(documentScores.values()).map(doc => ({
      documentId: doc.id,
      documentName: doc.filename,
      excerpt: doc.excerpts[0] || 'No excerpt available',
      relevance: doc.maxSimilarity,
      matchedChunks: doc.chunkCount
    }))

    results.sort((a, b) => b.relevance - a.relevance)

    console.log('[RAG Search] Returning', results.length, 'documents')

    return NextResponse.json({ results: results.slice(0, 20) })
  } catch (error: any) {
    console.error('[RAG Search] Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      debug: error.message
    }, { status: 500 })
  }
}
