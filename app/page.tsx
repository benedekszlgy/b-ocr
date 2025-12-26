'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-teal-700">B-OCR</h1>
          <p className="text-sm text-gray-600">Document Intelligence Platform</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md p-10 mb-8 border border-gray-200 transition-all duration-300 hover:shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                AI-Powered Document Extraction
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Extract data from loan application documents automatically using advanced OCR and GPT-4 technology
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                href="/upload"
                className="group inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-10 py-4 rounded-lg text-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Documents
                <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-teal-300">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Document Upload</h3>
              <p className="text-gray-600">
                Drag and drop multiple PDF or image files for instant processing
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-teal-300">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart OCR</h3>
              <p className="text-gray-600">
                Advanced optical character recognition powered by OpenAI Vision API
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-teal-300">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Extraction</h3>
              <p className="text-gray-600">
                GPT-4 extracts structured data with confidence scores for each field
              </p>
            </div>
          </div>

          {/* Supported Documents */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Supported Document Types</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-teal-50 hover:border-teal-300">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Invoices & Receipts</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-teal-50 hover:border-teal-300">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">ID Cards & Passports</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-teal-50 hover:border-teal-300">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Bank Statements</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-teal-50 hover:border-teal-300">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Pay Stubs</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-teal-50 hover:border-teal-300">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Tax Returns</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-teal-50 hover:border-teal-300">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Utility Bills</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-teal-50 hover:border-teal-300">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Employment Letters</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-teal-50 hover:border-teal-300">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Financial Documents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
