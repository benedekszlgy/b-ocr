'use client'

import { useState } from 'react'
import Header from '@/components/Header'

interface SearchResult {
  documentId: string
  documentName: string
  excerpt: string
  relevance: number
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      if (res.ok) {
        const data = await res.json()
        setResults(data.results || [])
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-kavosz-bg">
      <Header />

      <main className="pb-12">
        <div className="max-w-[960px] mx-auto px-6 py-8">
          <h1 className="text-[28px] font-light text-kavosz-teal-primary mb-2">
            Dokumentum keresés
          </h1>
          <p className="text-sm text-kavosz-text-muted mb-6">
            Keressen a feldolgozott dokumentumok tartalmában
          </p>

          {/* Search Input */}
          <div className="bg-white rounded-xl shadow-kavosz border border-kavosz-border p-6 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Keressen számla számra, ügyfél névre, összegre..."
                  className="w-full px-4 py-3 pr-12 text-sm text-kavosz-text-primary bg-white border border-kavosz-border rounded-lg outline-none focus:border-kavosz-teal-primary transition-colors"
                />
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-kavosz-text-light"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-8 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Keresés...' : 'Keresés'}
              </button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-kavosz-teal-primary border-t-transparent rounded-full" />
              <p className="text-kavosz-text-muted mt-4">Keresés folyamatban...</p>
            </div>
          ) : searched && results.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-kavosz border border-kavosz-border text-center">
              <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <h3 className="text-lg font-semibold text-kavosz-text-primary mb-2">
                Nincs találat
              </h3>
              <p className="text-sm text-kavosz-text-muted">
                Próbáljon más kulcsszavakkal keresni
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-kavosz-text-muted">
                {results.length} találat
              </p>
              {results.map((result, index) => (
                <div
                  key={index}
                  onClick={() => window.location.href = `/feldolgozas?docId=${result.documentId}`}
                  className="bg-white rounded-xl p-5 shadow-kavosz border border-kavosz-border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-kavosz-text-primary">
                      {result.documentName}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-kavosz-teal-light text-kavosz-teal-primary rounded-full">
                      {(result.relevance * 100).toFixed(0)}% relevancia
                    </span>
                  </div>
                  <p className="text-sm text-kavosz-text-muted leading-relaxed">
                    ...{result.excerpt}...
                  </p>
                </div>
              ))}
            </div>
          ) : !searched ? (
            <div className="bg-white rounded-xl p-12 shadow-kavosz border border-kavosz-border text-center">
              <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <h3 className="text-lg font-semibold text-kavosz-text-primary mb-2">
                Kezdjen el gépelni a kereséshez
              </h3>
              <p className="text-sm text-kavosz-text-muted">
                Használja a keresőmezőt dokumentumok tartalmának keresésére
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
