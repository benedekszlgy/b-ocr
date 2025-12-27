'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'
import { translateFieldName, translateDocumentType, t } from '@/lib/translations'

interface Field {
  fieldName: string
  value: string | null
  confidence: number
}

interface DocumentData {
  id: string
  filename: string
  file_path: string
  file_url?: string
  mime_type: string
  file_size: number
  status: string
  doc_type: string | null
  doc_type_confidence: number | null
  extractedFields: Field[]
  created_at: string
}

function FeldolgozasContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const docId = searchParams.get('docId')
  const { language } = useLanguage()

  const [document, setDocument] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showJson, setShowJson] = useState(false)

  useEffect(() => {
    if (docId) {
      fetchDocument(docId)
    } else {
      setLoading(false)
    }
  }, [docId])

  const fetchDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`)
      if (res.ok) {
        const data = await res.json()
        setDocument(data.document)
      }
    } catch (error) {
      console.error('Failed to fetch document:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!docId || !confirm('Biztosan törölni szeretné ezt a dokumentumot?')) return

    try {
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        alert('Hiba történt a törlés során')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Hiba történt a törlés során')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'processing': return 'bg-blue-100 text-blue-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Feldolgozva'
      case 'processing': return 'Feldolgozás alatt'
      case 'failed': return 'Sikertelen'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-kavosz-bg">
        <Header />
        <main className="pb-12">
          <div className="max-w-[960px] mx-auto px-6 py-8 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-kavosz-teal-primary border-t-transparent rounded-full" />
            <p className="text-kavosz-text-muted mt-4">Betöltés...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!docId || !document) {
    return (
      <div className="min-h-screen bg-kavosz-bg">
        <Header />
        <main className="pb-12">
          <div className="max-w-[960px] mx-auto px-6 py-8">
            <div className="bg-white rounded-xl p-12 shadow-kavosz border border-kavosz-border text-center">
              <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              <h3 className="text-lg font-semibold text-kavosz-text-primary mb-2">
                {t('documentDetails.noDocumentSelected', language)}
              </h3>
              <p className="text-sm text-kavosz-text-muted mb-6">
                {t('documentDetails.selectDocument', language)}
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
              >
                {t('documentDetails.backToDashboard', language)}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-kavosz-bg">
      <Header />

      <main className="pb-12">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Document Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-7 shadow-kavosz border border-kavosz-border">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-kavosz-teal-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-kavosz-text-primary mb-2">
                        {document.filename}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-kavosz-text-muted">
                        <span>{formatFileSize(document.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(document.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3.5 py-2 rounded-full ${getStatusColor(document.status)}`}>
                    <div className="w-2 h-2 bg-current rounded-full" />
                    <span className="text-[13px] font-medium">
                      {getStatusText(document.status)}
                    </span>
                  </div>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 gap-4 pb-6 mb-6 border-b border-kavosz-border">
                  <div>
                    <span className="block text-xs text-kavosz-text-muted mb-1">{t('documentDetails.documentType', language)}</span>
                    <span className="text-sm font-medium text-kavosz-text-primary">
                      {translateDocumentType(document.doc_type || 'UNKNOWN', language)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-kavosz-text-muted mb-1">{t('documentDetails.confidence', language)}</span>
                    <span className="text-sm font-medium text-kavosz-text-primary">
                      {document.doc_type_confidence ? (document.doc_type_confidence * 100).toFixed(0) : '0'}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-kavosz-text-muted mb-1">Fájl típus</span>
                    <span className="text-sm font-medium text-kavosz-text-primary">
                      {document.mime_type}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-kavosz-text-muted mb-1">Dokumentum ID</span>
                    <span className="text-sm font-mono font-medium text-kavosz-text-primary truncate block">
                      {document.id.substring(0, 8)}...
                    </span>
                  </div>
                </div>

            {/* Fields */}
            {document.extractedFields && document.extractedFields.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-kavosz-text-primary mb-4">{t('documentDetails.extractedData', language)}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {document.extractedFields.map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-semibold text-kavosz-text-primary mb-2">
                        {translateFieldName(field.fieldName, language)}
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
                <div className="flex gap-2 pt-6 border-t border-kavosz-border">
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
                  >
                    {showJson ? t('documentDetails.showFields', language) : t('documentDetails.showJson', language)}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-6 py-3 text-sm font-medium text-red-500 bg-transparent hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    {t('documentDetails.deleteDocument', language)}
                  </button>
                </div>

                {/* JSON View */}
                {showJson && (
                  <div className="mt-6 pt-6 border-t border-kavosz-border">
                    <h4 className="text-sm font-semibold text-kavosz-text-primary mb-3">{t('documentDetails.jsonDetails', language)}</h4>
                    <pre className="bg-gray-50 border border-kavosz-border rounded-lg p-4 text-xs overflow-auto max-h-96">
                      {JSON.stringify(document, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Document Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-kavosz border border-kavosz-border sticky top-6">
                <h4 className="text-sm font-semibold text-kavosz-text-primary mb-4">Dokumentum előnézet</h4>

                {/* Document Preview */}
                <div className="bg-gray-50 rounded-lg border border-kavosz-border p-4 mb-4 aspect-[3/4] flex items-center justify-center">
                  {document.mime_type.startsWith('image/') && document.file_url ? (
                    <img
                      src={document.file_url}
                      alt={document.filename}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                      <p className="text-xs text-kavosz-text-muted">
                        {document.mime_type.includes('pdf') ? 'PDF dokumentum' : 'Dokumentum'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <a
                  href={document.file_url || document.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Letöltés / Megnyitás
                </a>

                {/* File Info */}
                <div className="mt-4 pt-4 border-t border-kavosz-border space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-kavosz-text-muted">Fájlnév</span>
                    <span className="text-kavosz-text-primary font-medium truncate ml-2 max-w-[60%]" title={document.filename}>
                      {document.filename}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-kavosz-text-muted">Méret</span>
                    <span className="text-kavosz-text-primary font-medium">
                      {formatFileSize(document.file_size)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-kavosz-text-muted">Típus</span>
                    <span className="text-kavosz-text-primary font-medium">
                      {document.mime_type.split('/')[1].toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function FeldolgozasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-kavosz-bg">
        <Header />
        <main className="pb-12">
          <div className="max-w-[960px] mx-auto px-6 py-8 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-kavosz-teal-primary border-t-transparent rounded-full" />
          </div>
        </main>
      </div>
    }>
      <FeldolgozasContent />
    </Suspense>
  )
}
