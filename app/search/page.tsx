'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'

interface SearchResult {
  documentId: string
  documentName: string
  excerpt: string
  relevance: number
}

export default function SearchPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [answer, setAnswer] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    setAnswer('')

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      if (res.ok) {
        const data = await res.json()
        setResults(data.results || [])
        setAnswer(data.answer || '')
        if (data.debug) {
          setDebugInfo(data.debug + (data.statuses ? ` - Statuses: ${data.statuses.join(', ')}` : ''))
        } else {
          setDebugInfo('')
        }
      } else {
        setResults([])
        setAnswer('')
        setDebugInfo('Error fetching results')
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setAnswer('')
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[28px] font-light text-kavosz-teal-primary">
              {t('search.title', language)}
            </h1>
            <a
              href="/api/debug-rag"
              target="_blank"
              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            >
              Debug Info
            </a>
          </div>
          <p className="text-sm text-kavosz-text-muted mb-6">
            {t('search.subtitle', language)}
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
                  placeholder={t('search.placeholder', language)}
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
                {loading ? t('search.searching', language) : t('search.searchButton', language)}
              </button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-kavosz-teal-primary border-t-transparent rounded-full" />
              <p className="text-kavosz-text-muted mt-4">{t('search.searching', language)}</p>
            </div>
          ) : searched && results.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-kavosz border border-kavosz-border text-center">
              <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <h3 className="text-lg font-semibold text-kavosz-text-primary mb-2">
                {t('search.noResults', language)}
              </h3>
              <p className="text-sm text-kavosz-text-muted mb-2">
                {t('search.noResultsDesc', language)}
              </p>
              {debugInfo && (
                <p className="text-xs text-red-600 mt-4 font-mono">
                  Debug: {debugInfo}
                </p>
              )}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {/* AI Answer */}
              {answer && (
                <div className="bg-gradient-to-r from-kavosz-teal-light to-white rounded-xl p-6 shadow-kavosz border border-kavosz-teal-primary/20 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-kavosz-teal-primary rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-kavosz-teal-primary mb-2">AI Válasz</h3>
                      <p className="text-sm text-kavosz-text-primary whitespace-pre-wrap leading-relaxed">
                        {answer}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-kavosz-text-muted">
                {results.length} {t('search.resultsCount', language)}
              </p>
              {results.map((result, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/feldolgozas?docId=${result.documentId}`)}
                  className="bg-white rounded-xl p-5 shadow-kavosz border border-kavosz-border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-kavosz-text-primary">
                      {result.documentName}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-kavosz-teal-light text-kavosz-teal-primary rounded-full">
                      {(result.relevance * 100).toFixed(0)}% {t('search.relevance', language)}
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
                {t('search.startTyping', language)}
              </h3>
              <p className="text-sm text-kavosz-text-muted">
                {t('search.startTypingDesc', language)}
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
