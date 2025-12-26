'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            B-OCR
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Loan Document Extractor
          </p>
          <p className="text-lg text-gray-600 mb-12">
            AI-powered document extraction for loan applications using OCR and GPT-4
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Features</h2>
            <div className="grid md:grid-3 gap-6 text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">📄 Document Upload</h3>
                <p className="text-sm text-gray-600">
                  Upload PDF or image documents with drag & drop
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">🔍 Smart OCR</h3>
                <p className="text-sm text-gray-600">
                  Automatic text extraction using Tesseract.js
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">🤖 AI Extraction</h3>
                <p className="text-sm text-gray-600">
                  GPT-4 powered field extraction with confidence scores
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/upload"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Upload Document →
            </Link>
            <p className="text-sm text-gray-500">
              Upload bank statements, pay stubs, ID cards, and more
            </p>
          </div>

          <div className="mt-16 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Supported Documents</h3>
            <div className="grid md:grid-cols-2 gap-3 text-left mt-3">
              <div className="text-sm text-blue-800">• ID Cards (Driver License, Passport)</div>
              <div className="text-sm text-blue-800">• Bank Statements</div>
              <div className="text-sm text-blue-800">• Pay Stubs</div>
              <div className="text-sm text-blue-800">• Tax Returns (W-2, 1099)</div>
              <div className="text-sm text-blue-800">• Utility Bills</div>
              <div className="text-sm text-blue-800">• Employment Letters</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
