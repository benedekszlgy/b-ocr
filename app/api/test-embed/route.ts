import { NextResponse } from 'next/server'
import { chunkByStructure } from '@/lib/rag/chunking'
import { generateEmbeddingsBatched } from '@/lib/rag/embeddings'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  try {
    const supabase = createServiceClient()

    console.log('[Test] Starting test...')

    // Test text
    const testText = 'This is a test invoice. Amount: $1000. Due date: 2024-01-01.'

    // Step 1: Test chunking
    console.log('[Test] Testing chunking...')
    const chunks = chunkByStructure(testText, 1000)
    console.log('[Test] Chunks created:', chunks.length)

    if (chunks.length === 0) {
      return NextResponse.json({ error: 'Chunking failed', chunks: [] })
    }

    // Step 2: Test embedding generation
    console.log('[Test] Testing embedding generation...')
    const embeddings = await generateEmbeddingsBatched(
      chunks.map(c => c.text),
      50
    )
    console.log('[Test] Embeddings generated:', embeddings.length)
    console.log('[Test] First embedding length:', embeddings[0]?.length)

    if (embeddings.length === 0) {
      return NextResponse.json({ error: 'Embedding generation failed' })
    }

    // Step 3: Test database insert
    console.log('[Test] Testing database insert...')
    const testDocId = '00000000-0000-0000-0000-000000000001' // Fake ID for testing

    const chunkRecords = chunks.map((chunk, idx) => ({
      document_id: testDocId,
      chunk_text: chunk.text,
      chunk_index: chunk.index,
      embedding: JSON.stringify(embeddings[idx])
    }))

    console.log('[Test] Attempting to insert', chunkRecords.length, 'records')

    // Try to insert (will fail with FK constraint, but that's OK)
    const { error: insertError } = await supabase
      .from('document_chunks')
      .insert(chunkRecords)

    if (insertError) {
      console.log('[Test] Insert error (expected):', insertError.message)
    }

    return NextResponse.json({
      success: true,
      chunks: chunks.length,
      embeddings: embeddings.length,
      embeddingDimensions: embeddings[0]?.length,
      insertError: insertError?.message,
      note: 'Insert error is expected (FK constraint). Check server logs for details.'
    })
  } catch (error: any) {
    console.error('[Test] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
