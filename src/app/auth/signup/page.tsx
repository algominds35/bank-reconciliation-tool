'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus, CheckCircle, ArrowRight, LogIn, Users, Sparkles } from 'lucide-react'

function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isBetaSignup, setIsBetaSignup] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if this is a beta signup
    const beta = searchParams.get('beta')
    if (beta === 'true') {
      setIsBetaSignup(true)
    }
  }, [searchParams])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Skip Stripe verification for beta users
      if (!isBetaSignup) {
        // First, verify the email matches a Stripe customer
        const verifyResponse = await fetch('/api/verify-stripe-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json()
          setError(errorData.error || 'Email not found in our payment records. Please use the exact email you used for payment.')
          setLoading(false)
          return
        }
      }

      let data, error
      
      if (isBetaSignup) {
        // For beta users, try to sign in directly (bypass email confirmation)
        const signInResult = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (signInResult.data.user) {
          // User already exists, sign them in
          data = signInResult.data
          error = signInResult.error
        } else {
          // User doesn't exist, create account
          const signUpResult = await supabase.auth.signUp({
            email,
            password,
          })
          data = signUpResult.data
          error = signUpResult.error
        }
      } else {
        // Regular signup with email confirmation
        const signUpResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        data = signUpResult.data
        error = signUpResult.error
      }

      // If successful signup, mark as beta user if applicable
      if (data.user && isBetaSignup) {
        // Skip beta table creation for now - just log it
        console.log('Beta user signup successful:', data.user.email)
      }

      if (error) {
        setError(error.message)
      } else if (data.user) {
        console.log('Signup successful:', data.user.email)
        
        setSuccess(true)
        // Redirect to dashboard immediately
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError('Signup failed - no user created')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Account Created!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {isBetaSignup 
                  ? "Welcome to the Beta Program! Redirecting to your dashboard..."
                  : "Welcome to ReconcileBook! Redirecting to your dashboard..."
                }
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {isBetaSignup ? 'Join Beta Testing' : 'Create Your Account'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isBetaSignup 
                ? 'Welcome to the ReconcileBook Beta Program! Help shape the future of reconciliation.'
                : 'Welcome to ReconcileBook! Create your account to get started.'
              }
            </p>

            {isBetaSignup && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-1">Beta Tester Benefits</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Free access to all features</li>
                      <li>• Early access to new features</li>
                      <li>• Direct influence on product development</li>
                      <li>• Priority support and feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Important Notice - Only show for paid signups */}
            {!isBetaSignup && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-900">
                      Important: Use Your Payment Email
                    </h3>
                    <p className="text-sm text-blue-800 mt-1">
                      You must use the <strong>exact same email address</strong> you used when paying via Stripe. This links your subscription to your account automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address {!isBetaSignup && "(Must match your Stripe payment email)"}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isBetaSignup ? "Enter your email address" : "Enter the EXACT email you used for payment"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {!isBetaSignup && (
                  <p className="text-xs text-blue-600 mt-1">
                    ⚠️ This must be identical to your Stripe payment email for automatic subscription linking
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading 
                  ? (isBetaSignup ? 'Joining Beta Program...' : 'Creating Account...') 
                  : (isBetaSignup ? 'Join Beta Program' : 'Create Account')
                }
                {isBetaSignup ? <Users className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="text-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
                ← Back to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}