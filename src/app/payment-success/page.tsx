import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, TrendingUp } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ReconcileBook</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to ReconcileBook! Your subscription is now active and you have full access to professional bank reconciliation tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Access Your Dashboard</h3>
                    <p className="text-gray-600">Log in to start reconciling your bank transactions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Upload Your Data</h3>
                    <p className="text-gray-600">Import your bank and bookkeeping CSV files</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Start Reconciling</h3>
                    <p className="text-gray-600">Use our smart matching to reconcile transactions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/auth/login">
                  <Button className="w-full" size="lg">
                    Access Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" className="w-full" size="lg">
                    View Features
                  </Button>
                </Link>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Need help? Contact us at{' '}
                    <a href="mailto:alex@usealgomind.com" className="text-blue-600 hover:underline">
                      alex@usealgomind.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Subscription Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Plan:</strong> Professional</p>
                  <p><strong>Price:</strong> $79/month</p>
                </div>
                <div>
                  <p><strong>Billing:</strong> Monthly</p>
                  <p><strong>Next charge:</strong> Next month</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                You can manage your subscription anytime from your dashboard or contact support to make changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 