# Supabase Database Setup

## Running Migrations

To enable the RAG (Retrieval Augmented Generation) pipeline, you need to run the database migration to enable pgvector and create the document_chunks table.

### Steps:

1. **Go to your Supabase project dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your b-ocr project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the migration**
   - Copy the contents of `migrations/20241226_enable_pgvector.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify the migration**
   - Go to "Table Editor" in the left sidebar
   - You should see a new table called `document_chunks`
   - Go to "Database" > "Extensions" and verify that `vector` extension is enabled

### What this migration does:

- Enables the `pgvector` extension for vector similarity search
- Creates a `document_chunks` table to store text chunks with embeddings
- Creates indexes for fast vector similarity search
- Creates a function `search_document_chunks()` for semantic search

### After migration:

Once the migration is complete, the RAG pipeline will automatically:
1. Chunk OCR text after document processing
2. Generate embeddings using OpenAI's text-embedding-3-small model
3. Store chunks with embeddings in the database
4. Use vector similarity search for semantic document search

The search will now understand meaning, not just keywords. For example:
- "What was the invoice amount on December 16?" will find documents with invoice totals from 2025-12-16
- "Show me contracts from last month" will find contract documents from the previous month
