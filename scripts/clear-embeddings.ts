import { createClient } from '@supabase/supabase-js'

async function clearEmbeddings() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  console.log('Clearing document_chunks table...')

  const { error } = await supabase
    .from('document_chunks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    console.error('Error:', error)
    process.exit(1)
  }

  console.log('✓ Cleared document_chunks table')
  console.log('✓ Embeddings will be regenerated on next document upload')
}

clearEmbeddings()
