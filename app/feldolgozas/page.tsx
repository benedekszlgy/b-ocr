'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'

interface Field {
  fieldName: string
  value: string | null
  confidence: number
}

interface DocumentData {
  id: string
  file_name: string
  file_path: string
  document_type: string | null
  classification_confidence: number | null
  extractedFields: Field[]
  created_at: string
}

function FeldolgozasContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const docId = searchParams.get('docId')

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
                Nincs kiválasztott dokumentum
              </h3>
              <p className="text-sm text-kavosz-text-muted mb-6">
                Válasszon egy dokumentumot a dashboardról
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
              >
                Vissza a dashboardra
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
        <div className="max-w-[960px] mx-auto px-6 py-8">
          <div className="bg-white rounded-xl p-7 shadow-kavosz border border-kavosz-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-kavosz-text-primary mb-1">
                  {document.file_name}
                </h3>
                <p className="text-sm text-kavosz-text-muted">
                  Feltöltve: {new Date(document.created_at).toLocaleDateString('hu-HU')}
                </p>
              </div>
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
                  {document.document_type?.replace('_', ' ') || 'UNKNOWN'}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm text-kavosz-text-muted">Megbízhatóság:</span>
                <span className="text-sm font-medium text-kavosz-text-primary">
                  {document.classification_confidence ? (document.classification_confidence * 100).toFixed(0) : '0'}%
                </span>
              </div>
            </div>

            {/* Fields */}
            {document.extractedFields && document.extractedFields.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-kavosz-text-primary mb-4">Kinyert adatok</h4>
                <div className="grid grid-cols-2 gap-4">
                  {document.extractedFields.map((field, idx) => (
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
                onClick={() => setShowJson(!showJson)}
                className="px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
              >
                {showJson ? 'Mezők mutatása' : 'Részletek (JSON)'}
              </button>
              <button
                onClick={handleDelete}
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
            {showJson && (
              <div className="mt-6 pt-6 border-t border-kavosz-border">
                <h4 className="text-sm font-semibold text-kavosz-text-primary mb-3">JSON Részletek</h4>
                <pre className="bg-gray-50 border border-kavosz-border rounded-lg p-4 text-xs overflow-auto max-h-96">
                  {JSON.stringify(document, null, 2)}
                </pre>
              </div>
            )}
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
