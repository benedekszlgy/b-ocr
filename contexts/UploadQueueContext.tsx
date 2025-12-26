'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

export interface QueuedDocument {
  id: string
  file: File
  applicationId: string
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error'
  progress: number
  documentId?: string
  error?: string
  result?: any
  createdAt: number
}

interface UploadQueueContextType {
  queue: QueuedDocument[]
  addToQueue: (file: File, applicationId: string) => string
  removeFromQueue: (id: string) => void
  clearCompleted: () => void
  isProcessing: boolean
  completedCount: number
  errorCount: number
}

const UploadQueueContext = createContext<UploadQueueContextType | undefined>(undefined)

export function UploadQueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<QueuedDocument[]>([])
  const isProcessingRef = useRef(false)

  const addToQueue = useCallback((file: File, applicationId: string): string => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const queuedDoc: QueuedDocument = {
      id,
      file,
      applicationId,
      status: 'pending',
      progress: 0,
      createdAt: Date.now()
    }
    console.log('[Queue] Adding document to queue:', file.name)
    setQueue(prev => [...prev, queuedDoc])
    return id
  }, [])

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(doc => doc.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setQueue(prev => prev.filter(doc => doc.status !== 'complete' && doc.status !== 'error'))
  }, [])

  // Process one document
  const processDocument = useCallback(async (doc: QueuedDocument) => {
    console.log('[Queue] Starting processing for:', doc.file.name)

    try {
      // Step 1: Upload
      console.log('[Queue] Step 1/2: Uploading...')
      setQueue(prev => prev.map(item =>
        item.id === doc.id
          ? { ...item, status: 'uploading' as const, progress: 10 }
          : item
      ))

      const formData = new FormData()
      formData.append('file', doc.file)
      formData.append('applicationId', doc.applicationId)

      const uploadController = new AbortController()
      const uploadTimeout = setTimeout(() => uploadController.abort(), 30000)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: uploadController.signal,
      }).finally(() => clearTimeout(uploadTimeout))

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      console.log('[Queue] Upload successful. Document ID:', uploadData.document.id)

      // Step 2: Extract
      console.log('[Queue] Step 2/2: Extracting data...')
      setQueue(prev => prev.map(item =>
        item.id === doc.id
          ? { ...item, status: 'processing' as const, progress: 50, documentId: uploadData.document.id }
          : item
      ))

      const extractController = new AbortController()
      const extractTimeout = setTimeout(() => extractController.abort(), 60000)

      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: uploadData.document.id }),
        signal: extractController.signal,
      }).finally(() => clearTimeout(extractTimeout))

      const extractData = await extractRes.json()

      if (!extractRes.ok) {
        throw new Error(extractData.error || 'Extraction failed')
      }

      console.log('[Queue] Extraction successful!')
      setQueue(prev => prev.map(item =>
        item.id === doc.id
          ? { ...item, status: 'complete' as const, progress: 100, result: extractData }
          : item
      ))
    } catch (error: any) {
      console.error('[Queue] Error processing document:', error)
      const errorMessage = error.name === 'AbortError'
        ? 'Request timeout - please try again'
        : (error.message || 'Processing failed')

      setQueue(prev => prev.map(item =>
        item.id === doc.id
          ? { ...item, status: 'error' as const, progress: 0, error: errorMessage }
          : item
      ))
    }
  }, [])

  // Simple queue processor - runs whenever queue changes
  useEffect(() => {
    const process = async () => {
      // Prevent concurrent processing
      if (isProcessingRef.current) {
        console.log('[Queue] Already processing, skipping...')
        return
      }

      // Find next pending document
      const nextDoc = queue.find(doc => doc.status === 'pending')
      if (!nextDoc) {
        console.log('[Queue] No pending documents')
        return
      }

      console.log('[Queue] Found pending document:', nextDoc.file.name)
      isProcessingRef.current = true

      try {
        await processDocument(nextDoc)
      } finally {
        isProcessingRef.current = false
        // After processing one document, trigger re-check for next one
        // This happens automatically because processDocument updates queue state
      }
    }

    process()
  }, [queue, processDocument])

  const isProcessing = queue.some(doc =>
    doc.status === 'uploading' || doc.status === 'processing' || doc.status === 'pending'
  )

  const completedCount = queue.filter(doc => doc.status === 'complete').length
  const errorCount = queue.filter(doc => doc.status === 'error').length

  return (
    <UploadQueueContext.Provider value={{
      queue,
      addToQueue,
      removeFromQueue,
      clearCompleted,
      isProcessing,
      completedCount,
      errorCount
    }}>
      {children}
    </UploadQueueContext.Provider>
  )
}

export function useUploadQueue() {
  const context = useContext(UploadQueueContext)
  if (context === undefined) {
    throw new Error('useUploadQueue must be used within an UploadQueueProvider')
  }
  return context
}
