'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadPage() {
  const [appId, setAppId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        setStatus('')
        setResult(null)
      }
    }
  })

  const createApplication = async () => {
    setLoading(true)
    setStatus('Creating application...')

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externalRef: `APP-${Date.now()}` })
      })

      const data = await res.json()

      if (res.ok) {
        setAppId(data.application.id)
        setStatus(`Application created: ${data.application.id}`)
      } else {
        setStatus(`Error: ${data.error}`)
      }
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !appId) {
      setStatus('Please create an application and select a file first')
      return
    }

    setLoading(true)
    setStatus('Uploading file...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('applicationId', appId)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        setStatus(`Upload error: ${uploadData.error}`)
        setLoading(false)
        return
      }

      setStatus('File uploaded! Starting OCR and extraction...')

      // Trigger extraction
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: uploadData.document.id }),
      })

      const extractData = await extractRes.json()

      if (extractRes.ok) {
        setStatus('Extraction complete!')
        setResult(extractData)
      } else {
        setStatus(`Extraction error: ${extractData.error}`)
      }
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-800 mb-2">B-OCR Test Upload</h1>
          <p className="text-stone-600">Upload a document to test AI extraction</p>
        </div>

        {/* Step 1: Create Application */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Step 1: Create Application</h2>
          {!appId ? (
            <button
              onClick={createApplication}
              disabled={loading}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Creating...' : 'Create New Application'}
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✓ Application Created</p>
              <p className="text-green-600 text-sm font-mono mt-1">{appId}</p>
            </div>
          )}
        </div>

        {/* Step 2: Upload File */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Step 2: Select Document</h2>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-amber-500 bg-amber-50'
                : 'border-stone-300 hover:border-amber-400 hover:bg-stone-50'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div>
                <p className="text-green-600 font-medium text-lg mb-2">✓ {file.name}</p>
                <p className="text-stone-500 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-stone-400 text-xs mt-2">Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <p className="text-stone-600 text-lg mb-2">
                  {isDragActive ? 'Drop the file here...' : 'Drag & drop a document here'}
                </p>
                <p className="text-stone-400 text-sm">or click to browse</p>
                <p className="text-stone-400 text-xs mt-2">Supports: PDF, PNG, JPG, JPEG, GIF, BMP</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Upload & Extract */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Step 3: Upload & Extract</h2>

          <button
            onClick={handleUpload}
            disabled={!file || !appId || loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full"
          >
            {loading ? 'Processing...' : 'Upload & Extract Data'}
          </button>

          {status && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">{status}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <h2 className="text-xl font-semibold text-stone-800 mb-4">Extraction Results</h2>

            <div className="space-y-4">
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="text-sm text-stone-600 mb-1">Document Type</p>
                <p className="text-lg font-semibold text-stone-800">
                  {result.documentType?.replace('_', ' ')}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Confidence: {(result.classificationConfidence * 100).toFixed(1)}%
                </p>
              </div>

              {result.extractedFields && result.extractedFields.length > 0 && (
                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">Extracted Fields</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.extractedFields.map((field: any, idx: number) => (
                      <div key={idx} className="bg-stone-50 rounded-lg p-3">
                        <p className="text-xs text-stone-500 mb-1">{field.fieldName}</p>
                        <p className="font-medium text-stone-800">{field.value || 'N/A'}</p>
                        <p className="text-xs text-stone-400 mt-1">
                          Confidence: {(field.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-stone-600 text-sm hover:text-stone-800">
                  View Raw JSON
                </summary>
                <pre className="mt-2 p-4 bg-stone-900 text-green-400 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
