'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'

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
              Welcome to ReconcilePro! Your subscription is now active.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-left space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>You'll receive a confirmation email with your receipt</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Your account is now upgraded with all premium features</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Start uploading CSVs and reconciling transactions</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t">
              <p>Need help getting started?</p>
              <p>Check out our documentation or contact support.</p>
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
          <p className="text-gray-600">Loading payment confirmation...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
} 