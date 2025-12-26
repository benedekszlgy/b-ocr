'use client'

import Link from 'next/link'

export default function HomePage() {
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
      <div className="container mx-auto px-8 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded p-8 mb-6 border border-stone-200">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-800 mb-3">
                AI-Powered Document Extraction
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Extract data from loan application documents automatically using advanced OCR and GPT-4 technology
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-3 rounded text-base transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Documents
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white rounded p-5 border border-stone-200">
              <div className="w-10 h-10 bg-teal-50 rounded flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Document Upload</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Drag and drop multiple PDF or image files for instant processing
              </p>
            </div>

            <div className="bg-white rounded p-5 border border-stone-200">
              <div className="w-10 h-10 bg-teal-50 rounded flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart OCR</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Advanced optical character recognition powered by OpenAI Vision API
              </p>
            </div>

            <div className="bg-white rounded p-5 border border-stone-200">
              <div className="w-10 h-10 bg-teal-50 rounded flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Extraction</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                GPT-4 extracts structured data with confidence scores for each field
              </p>
            </div>
          </div>

          {/* Supported Documents */}
          <div className="bg-white rounded p-6 border border-stone-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Supported Document Types</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded border border-stone-200">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Invoices & Receipts</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded border border-stone-200">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">ID Cards & Passports</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded border border-stone-200">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Bank Statements</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded border border-stone-200">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Pay Stubs</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded border border-stone-200">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Tax Returns</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded border border-stone-200">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Utility Bills</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded border border-stone-200">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Employment Letters</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded border border-stone-200">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Financial Documents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
