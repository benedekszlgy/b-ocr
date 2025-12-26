'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'
import { t, translateDocumentType } from '@/lib/translations'

interface Document {
  id: string
  filename: string
  file_path: string
  mime_type: string
  file_size: number
  doc_type: string | null
  doc_type_confidence: number | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents')
      if (res.ok) {
        const data = await res.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-kavosz-bg">
      <Header />

      <main className="pb-12">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[28px] font-light text-kavosz-teal-primary mb-2">
                {t('dashboard.title', language)}
              </h1>
              <p className="text-sm text-kavosz-text-muted">
                {documents.length} {t('dashboard.documentsProcessed', language)}
              </p>
            </div>
            <button
              onClick={() => router.push('/upload')}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {t('dashboard.newDocument', language)}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-kavosz-teal-primary border-t-transparent rounded-full" />
              <p className="text-kavosz-text-muted mt-4">{t('common.loading', language)}</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-kavosz border border-kavosz-border text-center">
              <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              <h3 className="text-lg font-semibold text-kavosz-text-primary mb-2">
                {t('dashboard.noDocuments', language)}
              </h3>
              <p className="text-sm text-kavosz-text-muted mb-6">
                {t('dashboard.noDocumentsDesc', language)}
              </p>
              <button
                onClick={() => router.push('/upload')}
                className="px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
              >
                {t('dashboard.uploadButton', language)}
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => router.push(`/feldolgozas?docId=${doc.id}`)}
                  className="bg-white rounded-xl p-5 shadow-kavosz border border-kavosz-border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-kavosz-teal-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-kavosz-text-primary mb-1 truncate">
                          {doc.filename}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-kavosz-text-muted">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    {doc.doc_type && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-kavosz-teal-light rounded-full">
                          <span className="text-sm font-medium text-kavosz-teal-primary">
                            {translateDocumentType(doc.doc_type, language)}
                          </span>
                        </div>
                        {doc.doc_type_confidence && (
                          <span className="text-sm text-kavosz-text-muted">
                            {(doc.doc_type_confidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
