-- Delete existing chunks with string embeddings
-- They will be regenerated as arrays when documents are re-extracted
TRUNCATE document_chunks;

-- Add a comment to track what happened
COMMENT ON TABLE document_chunks IS 'Embeddings fixed to use vector arrays instead of strings on 2024-12-27';
