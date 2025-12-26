'use client'

import { useUploadQueue } from '@/contexts/UploadQueueContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { useState } from 'react'

export default function UploadProgress() {
  const { queue, isProcessing, completedCount, errorCount, clearCompleted } = useUploadQueue()
  const { language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  if (queue.length === 0) return null

  const activeCount = queue.filter(doc =>
    doc.status === 'uploading' || doc.status === 'processing' || doc.status === 'pending'
  ).length

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-xl shadow-xl border border-kavosz-border overflow-hidden max-w-md">
        {/* Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-4 py-3 bg-kavosz-teal-light cursor-pointer hover:bg-opacity-80 transition-colors"
        >
          <div className="flex items-center gap-3">
            {isProcessing ? (
              <div className="animate-spin h-5 w-5 border-2 border-kavosz-teal-primary border-t-transparent rounded-full" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            )}
            <div>
              <p className="text-sm font-semibold text-kavosz-teal-primary">
                {isProcessing
                  ? `${t('upload.processing', language)} (${activeCount})`
                  : `${completedCount} ${t('upload.complete', language)}`}
              </p>
              {errorCount > 0 && (
                <p className="text-xs text-red-600">{errorCount} {t('upload.error', language)}</p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="text-kavosz-teal-primary hover:text-kavosz-teal-hover transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>
        </div>

        {/* Expanded List */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-kavosz-border">
              {queue.map((doc) => (
                <div key={doc.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {doc.status === 'complete' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22,4 12,14.01 9,11.01"/>
                        </svg>
                      ) : doc.status === 'error' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      ) : (
                        <div className="animate-spin h-4 w-4 border-2 border-kavosz-teal-primary border-t-transparent rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-kavosz-text-primary truncate">
                        {doc.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-kavosz-text-muted">
                          {doc.status === 'pending' && t('upload.processing', language)}
                          {doc.status === 'uploading' && t('upload.uploading', language)}
                          {doc.status === 'processing' && t('upload.processing', language)}
                          {doc.status === 'complete' && t('upload.complete', language)}
                          {doc.status === 'error' && doc.error}
                        </p>
                      </div>
                      {(doc.status === 'uploading' || doc.status === 'processing') && (
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-kavosz-teal-primary transition-all duration-300"
                            style={{ width: `${doc.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            {!isProcessing && queue.length > 0 && (
              <div className="px-4 py-3 border-t border-kavosz-border bg-gray-50">
                <button
                  onClick={clearCompleted}
                  className="w-full px-4 py-2 text-sm font-medium text-kavosz-teal-primary hover:bg-kavosz-teal-light rounded-lg transition-colors"
                >
                  {t('common.close', language)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
