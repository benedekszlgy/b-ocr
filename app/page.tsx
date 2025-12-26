'use client'

import Link from 'next/link'
import Header from '@/components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-kavosz-bg">
      <Header />

      <main className="pb-12">
        <div className="max-w-[960px] mx-auto px-6 py-8">
          {/* Hero Section */}
          <section className="text-center pt-12 pb-10">
            <h1 className="text-[32px] font-light text-kavosz-teal-primary mb-3 tracking-tight">
              Dokumentum feldolgozás
            </h1>
            <p className="text-[15px] text-kavosz-text-muted mb-6 max-w-lg mx-auto leading-relaxed">
              Automatikus adatkinyerés hitelkérelem dokumentumokból OCR és AI technológiával
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg transition-colors"
            >
              Dokumentumok feltöltése
            </Link>
          </section>

          {/* Features */}
          <section className="mb-10">
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white rounded-xl p-7 shadow-kavosz border border-kavosz-border">
                <div className="w-12 h-12 bg-kavosz-teal-light rounded-[10px] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-kavosz-text-primary mb-2">
                  Dokumentum feltöltés
                </h3>
                <p className="text-sm text-kavosz-text-muted leading-relaxed">
                  PDF vagy kép fájlok egyszerű feltöltése drag and drop módszerrel
                </p>
              </div>

              <div className="bg-white rounded-xl p-7 shadow-kavosz border border-kavosz-border">
                <div className="w-12 h-12 bg-kavosz-teal-light rounded-[10px] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-kavosz-text-primary mb-2">
                  Intelligens OCR
                </h3>
                <p className="text-sm text-kavosz-text-muted leading-relaxed">
                  OpenAI Vision API által támogatott karakterfelismerés
                </p>
              </div>

              <div className="bg-white rounded-xl p-7 shadow-kavosz border border-kavosz-border">
                <div className="w-12 h-12 bg-kavosz-teal-light rounded-[10px] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-kavosz-text-primary mb-2">
                  AI adatkinyerés
                </h3>
                <p className="text-sm text-kavosz-text-muted leading-relaxed">
                  GPT-4 strukturált adatokat nyer ki megbízhatósági pontszámokkal
                </p>
              </div>
            </div>
          </section>

          {/* Supported Documents */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-kavosz-text-primary mb-4">
              Támogatott dokumentumtípusok
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-kavosz border border-kavosz-border">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  'Számlák',
                  'Személyi igazolványok',
                  'Bankszámlakivonatok',
                  'Bérlevelek',
                  'Adóbevallások',
                  'Közüzemi számlák',
                  'Munkáltatói igazolások',
                  'Pénzügyi dokumentumok'
                ].map((type, index) => (
                  <div key={index} className="flex items-center gap-2 py-2">
                    <span className="text-kavosz-teal-primary font-semibold">✓</span>
                    <span className="text-sm text-kavosz-text-secondary">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
