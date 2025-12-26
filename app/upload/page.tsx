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
      <div className="min-h-screen bg-stone-100">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="container mx-auto px-8 py-5">
            <h1 className="text-2xl font-semibold text-teal-600">B-OCR</h1>
            <p className="text-sm text-gray-600 mt-0.5">Document Intelligence Platform</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">Upload Documents</h2>
              <p className="text-sm text-gray-600">Upload invoices, receipts, or other documents for automatic data extraction</p>
            </div>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`bg-white border-2 border-dashed rounded p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-stone-300 hover:border-teal-400 hover:bg-stone-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="mb-3">
                <svg className="mx-auto h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-800 mb-1">
                {isDragActive ? 'Drop files here' : 'Drag & drop documents'}
              </p>
              <p className="text-sm text-gray-600 mb-3">or click to browse</p>
              <p className="text-xs text-gray-500">Supports: PDF, PNG, JPG, JPEG • Multiple files allowed</p>
            </div>

            {/* Selected Files */}
            {documents.length > 0 && (
              <div className="mt-5 bg-white rounded p-5 border border-stone-200">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Selected Files ({documents.length})
                </h3>
                <div className="space-y-2 mb-5">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <svg className="h-4 w-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800 truncate">{doc.file.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDocuments(prev => prev.filter((_, idx) => idx !== i))
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleProcessAll}
                  disabled={!appId}
                  className="w-full bg-teal-600 text-white font-medium py-3 rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Process {documents.length} Document{documents.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'upload') {
    const completed = documents.filter(d => d.status === 'complete').length
    const total = documents.length
    const progress = (completed / total) * 100

    return (
      <div className="min-h-screen bg-stone-100">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="container mx-auto px-8 py-5">
            <h1 className="text-2xl font-semibold text-teal-600">B-OCR</h1>
            <p className="text-sm text-gray-600 mt-0.5">Document Intelligence Platform</p>
          </div>
        </div>

        {/* Processing Content */}
        <div className="container mx-auto px-8 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-2xl w-full bg-white rounded border border-stone-200 p-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-3">
                <svg className="animate-spin h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Processing Documents</h2>
              <p className="text-sm text-gray-600">Extracting data from your files...</p>
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>{completed} of {total} completed</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-stone-50 rounded border border-stone-200">
                  <div className="flex-shrink-0">
                    {doc.status === 'complete' && (
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {doc.status === 'error' && (
                      <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {(doc.status === 'uploading' || doc.status === 'processing') && (
                      <div className="animate-spin h-4 w-4 border-2 border-teal-600 border-t-transparent rounded-full"></div>
                    )}
                    {doc.status === 'pending' && (
                      <div className="w-4 h-4 bg-stone-200 rounded-full"></div>
                    )}
                  </div>
                  <span className="flex-1 text-sm text-gray-700 truncate">{doc.file.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results view
  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-8 py-5">
          <h1 className="text-2xl font-semibold text-teal-600">B-OCR</h1>
          <p className="text-sm text-gray-600 mt-0.5">Document Intelligence Platform</p>
        </div>
      </div>

      {/* Results Content */}
      <div className="container mx-auto px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">Extraction Results</h2>
              <p className="text-sm text-gray-600">
                {documents.filter(d => d.status === 'complete').length} of {documents.length} documents processed successfully
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded hover:bg-teal-700 font-medium transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload More Documents
            </button>
          </div>

          <div className="grid gap-5">
            {documents.map((doc, i) => (
              <div key={i} className="bg-white rounded p-5 border border-stone-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">{doc.file.name}</h3>
                    {doc.result && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                          {doc.result.documentType?.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-600">
                          {(doc.result.classificationConfidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    )}
                  </div>
                  {doc.status === 'complete' && (
                    <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Complete
                    </div>
                  )}
                  {doc.status === 'error' && (
                    <div className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Error
                    </div>
                  )}
                </div>

                {doc.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded mb-4">
                    <p className="text-red-800 text-sm">{doc.error}</p>
                  </div>
                )}

                {doc.result?.extractedFields && doc.result.extractedFields.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {doc.result.extractedFields.map((field: any, idx: number) => (
                      <div key={idx} className="p-3 bg-stone-50 rounded border border-stone-200">
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-1.5">
                          {field.fieldName?.replace('_', ' ')}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          {field.value || 'N/A'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-stone-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                field.confidence > 0.8 ? 'bg-green-500' :
                                field.confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${field.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 font-medium min-w-[35px] text-right">
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
    </div>
  )
}
