'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, UserPlus, LogIn } from 'lucide-react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // In a full implementation, you'd verify the session with Stripe
      // For now, we'll show a success message
      setSessionData({ success: true })
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Payment Successful! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl text-gray-600">
              Welcome to ReconcileBook! Your subscription is active and ready.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-4">✅ What's Next?</h3>
              <div className="text-left space-y-3 text-blue-800">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Your payment has been processed successfully</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Your ReconcileBook subscription is now active</span>
                </div>
                <div className="flex items-start">
                  <UserPlus className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <span><strong>Next:</strong> Create your account to access the dashboard</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center justify-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Create Your ReconcileBook Account
              </h3>
              <p className="text-green-800 text-sm mb-4">
                <strong>Important:</strong> Use the same email address you used for payment to automatically link your subscription.
              </p>
              <Link href="/auth/signup">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Create Account & Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Already have an account?</strong>
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login to ReconcileBook Dashboard
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t">
              <p className="font-semibold mb-2">✅ What Happens Next?</p>
              <div className="text-left space-y-1">
                <p>1. Create your account with the same email</p>
                <p>2. We'll automatically link your payment</p>
                <p>3. Get instant access to your ReconcileBook dashboard</p>
                <p>4. Start reconciling transactions immediately</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Need help?</strong> Contact us at{' '}
                <a href="mailto:alex@usealgomind.com" className="text-blue-600 hover:underline">
                  alex@usealgomind.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
} 