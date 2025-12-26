-- Drop and recreate the search function with correct signature
DROP FUNCTION IF EXISTS search_document_chunks(vector, float, int, uuid);

-- Recreate with correct parameter types
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
