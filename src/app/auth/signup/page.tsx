'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CreditCard, Clock, TrendingUp, UserPlus } from 'lucide-react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showTrialOptions, setShowTrialOptions] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Account created! Check your email for confirmation, then login.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (showTrialOptions) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Choose Your Trial Plan
              </CardTitle>
              <p className="text-gray-600 mt-2">
                14-day free trials with credit card required
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  How Our Trials Work
                </h3>
                <div className="text-left space-y-3 text-blue-800">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <span>Add your credit card and get 14 days completely free</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <span>Full access to all features during trial</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <span>Cancel anytime before day 15 = $0 charged</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <a href="https://buy.stripe.com/test_28EbJ32nA0ALezn1HI0Fi08" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-16 text-lg">
                    <div className="flex flex-col items-center">
                      <span className="font-bold">Try Professional Free (14 Days)</span>
                      <span className="text-sm opacity-90">Then $79/month • Most Popular</span>
                    </div>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                
                <a href="https://buy.stripe.com/test_6oU3cx6DQ1EP0Ix5XY0Fi07" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-16 text-lg" variant="outline">
                    <div className="flex flex-col items-center">
                      <span className="font-bold">Try Starter Free (14 Days)</span>
                      <span className="text-sm opacity-90">Then $29/month</span>
                    </div>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>

                <a href="https://buy.stripe.com/test_aFa9AV4vIdnxgHv2LM0Fi09" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-16 text-lg" variant="outline">
                    <div className="flex flex-col items-center">
                      <span className="font-bold">Try Enterprise Free (14 Days)</span>
                      <span className="text-sm opacity-90">Then $199/month</span>
                    </div>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>

              <div className="border-t pt-6 text-center">
                <Button variant="ghost" onClick={() => setShowTrialOptions(false)}>
                  ← Back to Account Creation
                </Button>
              </div>
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Create Your Account
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Access your dashboard after payment
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use the same email you used for payment to automatically link your subscription
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                  {message}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating account...' : 'Create Account & Access Dashboard'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowTrialOptions(true)}
              >
                <Clock className="mr-2 h-4 w-4" />
                Start Free Trial (Credit Card Required)
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:underline">
                    Login here
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <Link href="/" className="text-blue-600 hover:underline text-sm">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 