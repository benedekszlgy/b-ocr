// Embeddings generation using OpenAI API

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * Generate embeddings for a single text using OpenAI's text-embedding-3-small model
 * @param text The text to generate embeddings for
 * @returns Array of embedding values (1536 dimensions)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float'
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Generate embeddings for multiple texts in a single batch
 * More efficient than calling generateEmbedding multiple times
 * @param texts Array of texts to generate embeddings for
 * @returns Array of embedding arrays
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return []
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
      encoding_format: 'float'
    })

    return response.data.map(d => d.embedding)
  } catch (error) {
    console.error('Error generating embeddings:', error)
    throw new Error('Failed to generate embeddings')
  }
}

/**
 * Generate embeddings in batches to avoid rate limits
 * @param texts Array of texts
 * @param batchSize Number of texts per batch (default 100)
 * @returns Array of embedding arrays
 */
export async function generateEmbeddingsBatched(
  texts: string[],
  batchSize: number = 100
): Promise<number[][]> {
  const results: number[][] = []

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const embeddings = await generateEmbeddings(batch)
    results.push(...embeddings)

    // Small delay between batches to avoid rate limits
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return results
}
