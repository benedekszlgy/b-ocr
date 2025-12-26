import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  console.error('Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/delete-user-documents.ts <email>')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function deleteUserDocuments(email: string) {
  console.log(`\nDeleting all documents for user: ${email}`)

  // Get user by email
  const { data: users, error: userError } = await supabase.auth.admin.listUsers()

  if (userError) {
    console.error('Error fetching users:', userError)
    return
  }

  const user = users.users.find(u => u.email === email)

  if (!user) {
    console.log(`User not found: ${email}`)
    return
  }

  console.log(`Found user: ${user.id}`)

  // Get all documents for this user (via applications)
  const { data: documents, error: docsError } = await supabase
    .from('documents')
    .select(`
      id,
      filename,
      applications!inner(user_id)
    `)
    .eq('applications.user_id', user.id)

  if (docsError) {
    console.error('Error fetching documents:', docsError)
    return
  }

  if (!documents || documents.length === 0) {
    console.log('No documents found for this user.')
    return
  }

  console.log(`Found ${documents.length} documents to delete:`)
  documents.forEach(doc => {
    console.log(`  - ${doc.filename} (${doc.id})`)
  })

  // Delete document chunks first (cascade should handle this, but let's be explicit)
  console.log('\nDeleting document chunks...')
  const { error: chunksError } = await supabase
    .from('document_chunks')
    .delete()
    .in('document_id', documents.map(d => d.id))

  if (chunksError) {
    console.error('Error deleting chunks:', chunksError)
  } else {
    console.log('✓ Document chunks deleted')
  }

  // Delete extracted fields
  console.log('\nDeleting extracted fields...')
  const { error: fieldsError } = await supabase
    .from('extracted_fields')
    .delete()
    .in('document_id', documents.map(d => d.id))

  if (fieldsError) {
    console.error('Error deleting fields:', fieldsError)
  } else {
    console.log('✓ Extracted fields deleted')
  }

  // Delete documents
  console.log('\nDeleting documents...')
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .in('id', documents.map(d => d.id))

  if (deleteError) {
    console.error('Error deleting documents:', deleteError)
    return
  }

  console.log('✓ Documents deleted')

  // Get applications to delete
  const { data: applications, error: appsError } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', user.id)

  if (appsError) {
    console.error('Error fetching applications:', appsError)
  } else if (applications && applications.length > 0) {
    console.log(`\nDeleting ${applications.length} applications...`)
    const { error: deleteAppsError } = await supabase
      .from('applications')
      .delete()
      .eq('user_id', user.id)

    if (deleteAppsError) {
      console.error('Error deleting applications:', deleteAppsError)
    } else {
      console.log('✓ Applications deleted')
    }
  }

  console.log(`\n✅ Successfully deleted all data for ${email}`)
}

// Run the deletion
const userEmail = process.argv[2] || 'szilbendi@gmail.com'
deleteUserDocuments(userEmail)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
