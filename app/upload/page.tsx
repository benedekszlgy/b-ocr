'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadedDoc {
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error'
  result?: any
  error?: string
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
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
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
          i === index ? { ...d, status: 'complete', result: extractData } : d
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Document Upload</h1>
            <p className="text-gray-600">Upload invoices, receipts, or other documents for automatic data extraction</p>
          </div>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-xl font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop documents'}
            </p>
            <p className="text-gray-500 mb-4">or click to browse</p>
            <p className="text-sm text-gray-400">Supports: PDF, PNG, JPG, JPEG • Multiple files allowed</p>
          </div>

          {/* Selected Files */}
          {documents.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Files ({documents.length})
              </h3>
              <div className="space-y-2 mb-6">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium text-gray-700">{doc.file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDocuments(prev => prev.filter((_, idx) => idx !== i))
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleProcessAll}
                disabled={!appId}
                className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                Process {documents.length} Document{documents.length > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentStep === 'upload') {
    const completed = documents.filter(d => d.status === 'complete').length
    const total = documents.length
    const progress = (completed / total) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Documents</h2>
            <p className="text-gray-600">Extracting data from your files...</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>{completed} of {total} completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {doc.status === 'complete' && <span className="text-green-500">✓</span>}
                  {doc.status === 'error' && <span className="text-red-500">✗</span>}
                  {(doc.status === 'uploading' || doc.status === 'processing') && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  )}
                  {doc.status === 'pending' && <span className="text-gray-400">○</span>}
                </div>
                <span className="flex-1 text-sm text-gray-700 truncate">{doc.file.name}</span>
                <span className="text-xs text-gray-500 capitalize">{doc.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Results view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Extraction Results</h1>
            <p className="text-gray-600">
              {documents.filter(d => d.status === 'complete').length} documents processed successfully
            </p>
          </div>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Upload More Documents
          </button>
        </div>

        <div className="grid gap-6">
          {documents.map((doc, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{doc.file.name}</h3>
                  {doc.result && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {doc.result.documentType?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(doc.result.classificationConfidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  )}
                </div>
                {doc.status === 'complete' && (
                  <span className="text-green-600 font-medium">✓ Complete</span>
                )}
                {doc.status === 'error' && (
                  <span className="text-red-600 font-medium">✗ Error</span>
                )}
              </div>

              {doc.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-800 text-sm">{doc.error}</p>
                </div>
              )}

              {doc.result?.extractedFields && doc.result.extractedFields.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {doc.result.extractedFields.map((field: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                        {field.fieldName?.replace('_', ' ')}
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {field.value || 'N/A'}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              field.confidence > 0.8 ? 'bg-green-500' :
                              field.confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${field.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(field.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
