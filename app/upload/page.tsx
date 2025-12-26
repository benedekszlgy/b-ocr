'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUploadQueue } from '@/contexts/UploadQueueContext'
import { t } from '@/lib/translations'

export default function UploadPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const { addToQueue } = useUploadQueue()
  const [appId, setAppId] = useState('')

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
      console.log('onDrop called:', acceptedFiles.length, 'files, appId:', appId)

      if (rejectedFiles.length > 0) {
        alert(t('upload.unsupportedFormat', language))
        return
      }

      if (acceptedFiles.length === 0 || !appId) {
        console.log('Skipping upload - no files or no appId')
        return
      }

      // Add all files to the background queue
      console.log('Adding files to queue...')
      acceptedFiles.forEach(file => {
        console.log('Adding file:', file.name)
        addToQueue(file, appId)
      })

      // Files are added to queue - user can stay or navigate away
      // Processing continues in background regardless
    }
  })

  return (
    <div className="min-h-screen bg-kavosz-bg">
      <Header />

      <main className="pb-12">
        <div className="max-w-[960px] mx-auto px-6 py-8">
          <h1 className="text-[28px] font-light text-kavosz-teal-primary mb-5">
            {t('upload.title', language)}
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
              {t('upload.infoText', language)}
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-xl shadow-kavosz border border-kavosz-border overflow-hidden">
            <div className="px-6 py-12 text-center">
              <div
                {...getRootProps()}
                className={`cursor-pointer transition-colors rounded-lg p-12 ${
                  isDragActive ? 'bg-kavosz-teal-light' : 'hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="mb-4">
                  <svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17,8 12,3 7,8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="text-lg font-medium text-kavosz-text-secondary mb-2">
                  {isDragActive
                    ? t('upload.dropzoneActive', language)
                    : t('upload.dropzone', language)}
                </p>
                <p className="text-sm text-kavosz-text-light mt-3">{t('upload.maxFileSize', language)}</p>
                <p className="text-xs text-kavosz-text-muted mt-4">
                  {t('upload.supportedFormats', language)}
                </p>
              </div>
            </div>
          </div>

          {/* Info message */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="flex-shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p className="text-sm text-blue-800">
                {language === 'hu'
                  ? 'A feltöltött dokumentumok automatikusan feldolgozásra kerülnek a háttérben. Nyugodtan maradhat itt vagy navigálhat más oldalakra - a feldolgozás folytatódik, és a jobb alsó sarokban követhető.'
                  : 'Uploaded documents will be processed automatically in the background. You can stay here or navigate to other pages - processing continues and can be tracked in the bottom right corner.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
