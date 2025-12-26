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

    // Check documents
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select(`
        id,
        filename,
        status,
        created_at,
        applications!inner(user_id)
      `)
      .eq('applications.user_id', user.id)

    if (docsError) {
      return NextResponse.json({ error: 'Failed to fetch documents', details: docsError })
    }

    // Check chunks for each document
    const { data: chunks, error: chunksError } = await supabase
      .from('document_chunks')
      .select('document_id, chunk_index, created_at')
      .in('document_id', docs?.map(d => d.id) || [])

    if (chunksError) {
      return NextResponse.json({ error: 'Failed to fetch chunks', details: chunksError })
    }

    // Group chunks by document
    const chunksByDoc = chunks?.reduce((acc, chunk) => {
      if (!acc[chunk.document_id]) {
        acc[chunk.document_id] = []
      }
      acc[chunk.document_id].push(chunk)
      return acc
    }, {} as Record<string, any[]>) || {}

    // Check if vector extension is enabled
    const { data: extensions, error: extError } = await supabase
      .rpc('pg_available_extensions')
      .select('name, installed_version')

    return NextResponse.json({
      user_id: user.id,
      documents: docs?.map(d => ({
        id: d.id,
        filename: d.filename,
        status: d.status,
        created_at: d.created_at,
        chunks_count: chunksByDoc[d.id]?.length || 0
      })),
      total_chunks: chunks?.length || 0,
      database_info: {
        extensions_query_error: extError ? extError.message : null
      }
    })
  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
