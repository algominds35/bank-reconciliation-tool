'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface OAuthButtonsProps {
  mode?: 'signin' | 'signup'
}

export function OAuthButtons({ mode = 'signin' }: OAuthButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleOAuth = async (provider: 'google' | 'azure') => {
    setLoading(provider)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        console.error(`${provider} OAuth error:`, error)
        alert(`Error signing ${mode === 'signin' ? 'in' : 'up'} with ${provider === 'google' ? 'Google' : 'Microsoft'}: ${error.message}`)
      }
    } catch (err) {
      console.error('OAuth error:', err)
      alert('An unexpected error occurred')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center space-x-2"
        onClick={() => handleOAuth('google')}
        disabled={loading !== null}
      >
        {loading === 'google' ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center space-x-2"
        onClick={() => handleOAuth('azure')}
        disabled={loading !== null}
      >
        {loading === 'azure' ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#f25022" d="M1 1h10v10H1z"/>
            <path fill="#00a4ef" d="M13 1h10v10H13z"/>
            <path fill="#7fba00" d="M1 13h10v10H1z"/>
            <path fill="#ffb900" d="M13 13h10v10H13z"/>
          </svg>
        )}
        <span>Continue with Microsoft</span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>
    </div>
  )
} 