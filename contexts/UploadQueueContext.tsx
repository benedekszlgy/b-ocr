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
  const processingRef = useRef(false)
  const [processTrigger, setProcessTrigger] = useState(0)

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
    setQueue(prev => [...prev, queuedDoc])
    setProcessTrigger(t => t + 1) // Trigger processing
    return id
  }, [])

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(doc => doc.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setQueue(prev => prev.filter(doc => doc.status !== 'complete' && doc.status !== 'error'))
  }, [])

  const updateQueueItem = useCallback((id: string, updates: Partial<QueuedDocument>) => {
    setQueue(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc))
  }, [])

  // Process queue - runs continuously in background
  useEffect(() => {
    let isMounted = true

    const processQueue = async () => {
      if (processingRef.current) return

      processingRef.current = true

      try {
        while (isMounted) {
          // Get current queue state
          let nextDoc: QueuedDocument | undefined

          setQueue(currentQueue => {
            nextDoc = currentQueue.find(doc => doc.status === 'pending')
            return currentQueue
          })

          if (!nextDoc) break

          try {
            // Update to uploading
            setQueue(prev => prev.map(doc =>
              doc.id === nextDoc!.id
                ? { ...doc, status: 'uploading' as const, progress: 10 }
                : doc
            ))

            // Upload file
            const formData = new FormData()
            formData.append('file', nextDoc.file)
            formData.append('applicationId', nextDoc.applicationId)

            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            })

            const uploadData = await uploadRes.json()

            if (!uploadRes.ok) {
              throw new Error(uploadData.error || 'Upload failed')
            }

            // Update to processing
            setQueue(prev => prev.map(doc =>
              doc.id === nextDoc!.id
                ? { ...doc, status: 'processing' as const, progress: 50, documentId: uploadData.document.id }
                : doc
            ))

            // Extract data
            const extractRes = await fetch('/api/extract', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ documentId: uploadData.document.id }),
            })

            const extractData = await extractRes.json()

            if (extractRes.ok) {
              setQueue(prev => prev.map(doc =>
                doc.id === nextDoc!.id
                  ? { ...doc, status: 'complete' as const, progress: 100, result: extractData }
                  : doc
              ))
            } else {
              throw new Error(extractData.error || 'Extraction failed')
            }
          } catch (error: any) {
            console.error('Error processing document:', error)
            setQueue(prev => prev.map(doc =>
              doc.id === nextDoc!.id
                ? { ...doc, status: 'error' as const, progress: 0, error: error.message }
                : doc
            ))
          }
        }
      } finally {
        processingRef.current = false
      }
    }

    processQueue()

    return () => {
      isMounted = false
    }
  }, [processTrigger]) // Trigger when new items added

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
