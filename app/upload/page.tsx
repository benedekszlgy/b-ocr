'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Header from '@/components/Header'

interface UploadedDoc {
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error'
  result?: any
  error?: string
  documentId?: string
  showJson?: boolean
}

export default function UploadPage() {
  const [appId, setAppId] = useState('')
  const [documents, setDocuments] = useState<UploadedDoc[]>([])
  const [currentStep, setCurrentStep] = useState<'select' | 'upload' | 'results'>('select')

  // Auto-create application on mount
  useEffect(() => {
    createApplication()
  }, [])

  const createApplication = async () => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externalRef: `APP-${Date.now()}` })
      })
      const data = await res.json()
      if (res.ok) {
        setAppId(data.application.id)
      }
    } catch (error) {
      console.error('Failed to create application:', error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    noClick: false,
    noKeyboard: false,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        alert(`Nem támogatott fájlformátum. Csak PDF, PNG, JPG és JPEG fájlokat fogadunk el.`)
        return
      }

      if (acceptedFiles.length === 0) {
        return
      }

      const newDocs = acceptedFiles.map(file => ({
        file,
        status: 'pending' as const
      }))
      setDocuments(prev => [...prev, ...newDocs])
    }
  })

  const processDocument = async (doc: UploadedDoc, index: number) => {
    if (!appId) return

    // Update status to uploading
    setDocuments(prev => prev.map((d, i) =>
      i === index ? { ...d, status: 'uploading' } : d
    ))

    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', doc.file)
      formData.append('applicationId', appId)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(uploadData.error)
      }

      // Update to processing
      setDocuments(prev => prev.map((d, i) =>
        i === index ? { ...d, status: 'processing' } : d
      ))

      // Extract data
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: uploadData.document.id }),
      })

      const extractData = await extractRes.json()

      if (extractRes.ok) {
        setDocuments(prev => prev.map((d, i) =>
          i === index ? { ...d, status: 'complete', result: extractData, documentId: uploadData.document.id } : d
        ))
      } else {
        throw new Error(extractData.error)
      }
    } catch (error: any) {
      setDocuments(prev => prev.map((d, i) =>
        i === index ? { ...d, status: 'error', error: error.message } : d
      ))
    }
  }

  const handleProcessAll = async () => {
    setCurrentStep('upload')
    for (let i = 0; i < documents.length; i++) {
      if (documents[i].status === 'pending') {
        await processDocument(documents[i], i)
      }
    }
    setCurrentStep('results')
  }

  const handleReset = () => {
    setDocuments([])
    setCurrentStep('select')
    createApplication()
  }

  if (currentStep === 'select') {
    return (
      <div className="min-h-screen bg-kavosz-bg">
        <Header />

        <main className="pb-12">
          <div className="max-w-[960px] mx-auto px-6 py-8">
            <h1 className="text-[28px] font-light text-kavosz-teal-primary mb-5">
              Dokumentumok feltöltése
            </h1>

            {/* Info Box */}
            <div className="flex items-start gap-3 px-5 py-4 bg-kavosz-teal-light rounded-lg mb-6">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <p className="text-sm text-kavosz-teal-primary leading-relaxed">
                A feltöltött dokumentumok automatikusan feldolgozásra kerülnek. Támogatott formátumok: PDF, PNG, JPG.
              </p>
            </div>

            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-kavosz border border-kavosz-border overflow-hidden">
              <div className="px-6 py-12 text-center">
                <div
                  {...getRootProps()}
                  className={`cursor-pointer transition-colors rounded-lg p-6 ${
                    isDragActive ? 'bg-kavosz-teal-light' : 'hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="mb-4">
                    <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17,8 12,3 7,8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-base font-medium text-kavosz-text-secondary mb-1">
                    Húzza ide a fájlokat vagy kattintson a tallózáshoz
                  </p>
                  <p className="text-xs text-kavosz-text-light mt-3">Maximum 10MB fájlonként</p>
                </div>
              </div>

              {/* File List */}
              {documents.length > 0 && (
                <div className="px-6 py-5 border-t border-kavosz-border">
                  <h3 className="text-sm font-semibold text-kavosz-text-secondary mb-4">
                    Kiválasztott fájlok ({documents.length})
                  </h3>
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg mb-2 border border-kavosz-border">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-kavosz-text-primary truncate">{doc.file.name}</p>
                          <p className="text-xs text-kavosz-text-light">{(doc.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDocuments(prev => prev.filter((_, idx) => idx !== i))}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleProcessAll}
                      disabled={!appId}
                      className="flex-1 px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Adatok kinyerése
                    </button>
                    <button
                      onClick={() => setDocuments([])}
                      className="px-6 py-3 text-sm font-medium text-kavosz-text-muted bg-white border border-kavosz-border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Törlés
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (currentStep === 'upload') {
    const completed = documents.filter(d => d.status === 'complete' || d.status === 'error').length
    const total = documents.length
    const progress = total > 0 ? (completed / total) * 100 : 0

    return (
      <div className="min-h-screen bg-kavosz-bg">
        <Header />

        <main className="pb-12">
          <div className="max-w-[960px] mx-auto px-6 py-8">
            <div className="bg-white rounded-xl p-7 shadow-kavosz border border-kavosz-border">
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="h-1 bg-kavosz-border rounded-sm overflow-hidden mb-3">
                    <div
                      className="h-full bg-kavosz-teal-primary transition-all duration-300"
                      style={{ width: `${progress}%`, animation: progress < 100 ? 'progress 1.5s ease-in-out infinite' : 'none' }}
                    />
                  </div>
                  <p className="text-sm text-kavosz-text-muted">
                    Dokumentumok elemzése folyamatban... ({completed}/{total})
                  </p>
                </div>

                {/* Document processing list */}
                <div className="space-y-3 mt-6">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-kavosz-border">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {doc.status === 'complete' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22,4 12,14.01 9,11.01"/>
                            </svg>
                          ) : doc.status === 'error' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                          ) : (
                            <div className="animate-spin h-5 w-5 border-2 border-kavosz-teal-primary border-t-transparent rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-kavosz-text-primary truncate">{doc.file.name}</p>
                          <p className="text-xs text-kavosz-text-muted">
                            {doc.status === 'uploading' && 'Feltöltés...'}
                            {doc.status === 'processing' && 'Feldolgozás...'}
                            {doc.status === 'complete' && 'Kész'}
                            {doc.status === 'error' && 'Hiba'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Results view
  const hasResults = documents.some(d => d.status === 'complete')

  return (
    <div className="min-h-screen bg-kavosz-bg">
      <Header />

      <main className="pb-12">
        <div className="max-w-[960px] mx-auto px-6 py-8">
          {/* Action buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleReset}
              className="px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
            >
              Új feltöltés
            </button>
          </div>

          {/* Show errors */}
          {documents.filter(d => d.status === 'error').map((doc, i) => (
            <div key={`error-${i}`} className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 mb-1">
                    Hiba történt: {doc.file.name}
                  </h4>
                  <p className="text-sm text-red-600">{doc.error}</p>
                </div>
              </div>
            </div>
          ))}

          {hasResults && documents.map((doc, i) => {
            if (doc.status !== 'complete' || !doc.result) return null

            return (
              <div key={i} className="bg-white rounded-xl p-7 shadow-kavosz border border-kavosz-border mb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-kavosz-text-primary">Kinyert adatok</h3>
                  <div className="flex items-center gap-2 px-3.5 py-2 bg-kavosz-teal-light rounded-full">
                    <div className="w-2 h-2 bg-kavosz-teal-primary rounded-full" />
                    <span className="text-[13px] font-medium text-kavosz-teal-primary">
                      Feldolgozás kész
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex gap-8 pb-5 mb-6 border-b border-kavosz-border">
                  <div className="flex gap-2">
                    <span className="text-sm text-kavosz-text-muted">Dokumentum típusa:</span>
                    <span className="text-sm font-medium text-kavosz-text-primary">
                      {doc.result.documentType?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm text-kavosz-text-muted">Megbízhatóság:</span>
                    <span className="text-sm font-medium text-kavosz-text-primary">
                      {(doc.result.classificationConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Fields */}
                {doc.result.extractedFields && doc.result.extractedFields.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      {doc.result.extractedFields.map((field: any, idx: number) => (
                        <div key={idx}>
                          <label className="block text-sm font-semibold text-kavosz-text-primary mb-2">
                            {field.fieldName?.replace('_', ' ')}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={field.value || ''}
                              readOnly
                              className="w-full px-4 py-3 pr-12 text-sm text-kavosz-text-secondary bg-white border border-kavosz-border rounded-lg outline-none"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-kavosz-teal-primary font-medium">
                              {(field.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-5 border-t border-kavosz-border">
                  <button
                    onClick={() => {
                      setDocuments(prev => prev.map((d, idx) =>
                        idx === i ? { ...d, showJson: !d.showJson } : d
                      ))
                    }}
                    className="px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
                  >
                    {doc.showJson ? 'Mezők mutatása' : 'Részletek (JSON)'}
                  </button>
                  <button
                    onClick={async () => {
                      if (!doc.documentId || !confirm('Biztosan törölni szeretné ezt a dokumentumot?')) return

                      try {
                        const res = await fetch(`/api/documents/${doc.documentId}`, { method: 'DELETE' })
                        if (res.ok) {
                          setDocuments(prev => prev.filter((_, idx) => idx !== i))
                        } else {
                          alert('Hiba történt a törlés során')
                        }
                      } catch (error) {
                        console.error('Delete error:', error)
                        alert('Hiba történt a törlés során')
                      }
                    }}
                    className="flex items-center gap-1.5 px-6 py-3 text-sm font-medium text-red-500 bg-transparent hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Ügylet törlése
                  </button>
                </div>

                {/* JSON View */}
                {doc.showJson && (
                  <div className="mt-6 pt-6 border-t border-kavosz-border">
                    <h4 className="text-sm font-semibold text-kavosz-text-primary mb-3">JSON Részletek</h4>
                    <pre className="bg-gray-50 border border-kavosz-border rounded-lg p-4 text-xs overflow-auto max-h-96">
                      {JSON.stringify(doc.result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )
          })}

          {!hasResults && (
            <div className="text-center py-12">
              <p className="text-kavosz-text-muted">Nincs feldolgozott dokumentum</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
