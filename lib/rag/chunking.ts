// Text chunking utilities for RAG pipeline

export interface Chunk {
  text: string
  index: number
}

/**
 * Split text into chunks with overlap for better context preservation
 * @param text The text to chunk
 * @param chunkSize Maximum characters per chunk
 * @param overlap Number of characters to overlap between chunks
 * @returns Array of text chunks
 */
export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): Chunk[] {
  if (!text || text.trim().length === 0) {
    return []
  }

  const chunks: Chunk[] = []
  let startIndex = 0
  let chunkIndex = 0

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize

    // If this is not the last chunk, try to break at a sentence or word boundary
    if (endIndex < text.length) {
      // Look for sentence endings (., !, ?, \n) within the last 100 chars
      const searchStart = Math.max(endIndex - 100, startIndex)
      const substring = text.substring(searchStart, endIndex)
      const sentenceEnd = substring.match(/[.!?\n]\s/)

      if (sentenceEnd && sentenceEnd.index !== undefined) {
        endIndex = searchStart + sentenceEnd.index + 1
      } else {
        // If no sentence end found, look for last space
        const lastSpace = text.lastIndexOf(' ', endIndex)
        if (lastSpace > startIndex) {
          endIndex = lastSpace
        }
      }
    }

    const chunkText = text.substring(startIndex, endIndex).trim()

    if (chunkText.length > 0) {
      chunks.push({
        text: chunkText,
        index: chunkIndex
      })
      chunkIndex++
    }

    // Move start index forward, accounting for overlap
    startIndex = endIndex - overlap

    // Ensure we make progress even if chunk is smaller than overlap
    if (startIndex <= chunks[chunks.length - 1]?.text.length + (chunks.length - 1) * (chunkSize - overlap)) {
      startIndex = endIndex
    }
  }

  return chunks
}

/**
 * Split text into chunks by preserving document structure (paragraphs, sections)
 * Better for structured documents like invoices
 */
export function chunkByStructure(
  text: string,
  maxChunkSize: number = 1000
): Chunk[] {
  if (!text || text.trim().length === 0) {
    return []
  }

  // Split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\n+/)
  const chunks: Chunk[] = []
  let currentChunk = ''
  let chunkIndex = 0

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim()
    if (!trimmed) continue

    // If adding this paragraph would exceed max size, save current chunk
    if (currentChunk && (currentChunk.length + trimmed.length + 2) > maxChunkSize) {
      chunks.push({
        text: currentChunk.trim(),
        index: chunkIndex
      })
      chunkIndex++
      currentChunk = ''
    }

    // If single paragraph is larger than max size, split it
    if (trimmed.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push({
          text: currentChunk.trim(),
          index: chunkIndex
        })
        chunkIndex++
        currentChunk = ''
      }

      // Split large paragraph into smaller chunks
      const subChunks = chunkText(trimmed, maxChunkSize, 100)
      for (const subChunk of subChunks) {
        chunks.push({
          text: subChunk.text,
          index: chunkIndex
        })
        chunkIndex++
      }
    } else {
      // Add paragraph to current chunk
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      index: chunkIndex
    })
  }

  return chunks
}
