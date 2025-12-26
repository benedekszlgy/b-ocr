'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-kavosz-border">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 bg-kavosz-teal-light rounded-lg flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0d9488">
              <rect x="3" y="3" width="8" height="8" rx="1"/>
              <rect x="13" y="3" width="8" height="8" rx="1"/>
              <rect x="3" y="13" width="8" height="8" rx="1"/>
              <rect x="13" y="13" width="8" height="8" rx="1"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-kavosz-teal-primary tracking-tight">B-OCR</span>
            <span className="text-[11px] text-kavosz-text-light -mt-0.5">Document Intelligence</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
              pathname === '/dashboard'
                ? 'text-kavosz-teal-primary bg-kavosz-teal-light'
                : 'text-kavosz-text-secondary bg-transparent hover:bg-kavosz-teal-light/50'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            <span>{t('header.dashboard', language)}</span>
          </Link>
          <Link
            href="/upload"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
              pathname === '/upload'
                ? 'text-kavosz-teal-primary bg-kavosz-teal-light'
                : 'text-kavosz-text-secondary bg-transparent hover:bg-kavosz-teal-light/50'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>{t('header.newDocument', language)}</span>
          </Link>
          <Link
            href="/search"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
              pathname === '/search'
                ? 'text-kavosz-teal-primary bg-kavosz-teal-light'
                : 'text-kavosz-text-secondary bg-transparent hover:bg-kavosz-teal-light/50'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>{t('header.search', language)}</span>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="relative">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 bg-kavosz-teal-light rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-kavosz-teal-primary">
              {userEmail || 'Felhasználó'}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </div>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-kavosz-border z-50">
              <div className="p-3 border-b border-kavosz-border">
                <p className="text-xs text-kavosz-text-muted">{t('header.loggedInAs', language)}</p>
                <p className="text-sm font-medium text-kavosz-text-primary truncate">{userEmail}</p>
              </div>

              {/* Language Switcher */}
              <div className="p-2 border-b border-kavosz-border">
                <p className="text-xs text-kavosz-text-muted px-2 mb-1.5">{t('header.language', language)}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setLanguage('hu')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      language === 'hu'
                        ? 'bg-kavosz-teal-primary text-white'
                        : 'text-kavosz-text-secondary hover:bg-gray-50'
                    }`}
                  >
                    🇭🇺 Magyar
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      language === 'en'
                        ? 'bg-kavosz-teal-primary text-white'
                        : 'text-kavosz-text-secondary hover:bg-gray-50'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {t('header.logout', language)}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
