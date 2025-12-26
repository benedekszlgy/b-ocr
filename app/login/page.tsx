'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'

export default function LoginPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        })

        if (error) throw error

        alert(t('login.signUpSuccess', language))
        setIsSignUp(false)
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || t('login.errorOccurred', language))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-kavosz-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-kavosz-teal-light rounded-xl flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#0d9488">
                <rect x="3" y="3" width="8" height="8" rx="1"/>
                <rect x="13" y="3" width="8" height="8" rx="1"/>
                <rect x="3" y="13" width="8" height="8" rx="1"/>
                <rect x="13" y="13" width="8" height="8" rx="1"/>
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-kavosz-teal-primary tracking-tight">B-OCR</h1>
              <p className="text-xs text-kavosz-text-light">Document Intelligence</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-kavosz-text-primary mb-2">
            {isSignUp ? t('login.signUpTitle', language) : t('login.title', language)}
          </h2>
          <p className="text-sm text-kavosz-text-muted">
            {isSignUp
              ? t('login.signUpSubtitle', language)
              : t('login.subtitle', language)}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-kavosz border border-kavosz-border p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-kavosz-text-primary mb-2">
                {t('login.email', language)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('login.emailPlaceholder', language)}
                className="w-full px-4 py-3 text-sm text-kavosz-text-primary bg-white border border-kavosz-border rounded-lg outline-none focus:border-kavosz-teal-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-kavosz-text-primary mb-2">
                {t('login.password', language)}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('login.passwordPlaceholder', language)}
                className="w-full px-4 py-3 text-sm text-kavosz-text-primary bg-white border border-kavosz-border rounded-lg outline-none focus:border-kavosz-teal-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-sm font-medium text-white bg-kavosz-teal-primary hover:bg-kavosz-teal-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('login.loading', language) : (isSignUp ? t('login.signUp', language) : t('login.signIn', language))}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-sm text-kavosz-teal-primary hover:text-kavosz-teal-hover transition-colors"
            >
              {isSignUp
                ? t('login.haveAccount', language)
                : t('login.noAccount', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
