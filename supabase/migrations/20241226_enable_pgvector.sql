-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create document_chunks table for RAG
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Index for fast document lookups
  CONSTRAINT document_chunks_document_id_chunk_index_key UNIQUE (document_id, chunk_index)
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx ON document_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for document_id lookups
CREATE INDEX IF NOT EXISTS document_chunks_document_id_idx ON document_chunks(document_id);

-- Function to search document chunks by similarity
CREATE OR REPLACE FUNCTION search_document_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  chunk_id uuid,
  document_id uuid,
  chunk_text text,
  similarity float,
  document_filename text,
  document_created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id as chunk_id,
    dc.document_id,
    dc.chunk_text,
    1 - (dc.embedding <=> query_embedding) as similarity,
    d.filename as document_filename,
    d.created_at as document_created_at
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  LEFT JOIN applications a ON d.application_id = a.id
  WHERE
    (filter_user_id IS NULL OR a.user_id = filter_user_id)
    AND (1 - (dc.embedding <=> query_embedding)) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
