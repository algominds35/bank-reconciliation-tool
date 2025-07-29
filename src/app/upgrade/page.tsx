'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react'

export default function UpgradePage() {
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Your Account
          </h1>
          <p className="text-xl text-gray-600">
            You've experienced the power of ReconcileBook! Choose a plan to continue accessing your dashboard and all premium features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Starter</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mt-2">Perfect for small businesses</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Up to 1,000 transactions/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>CSV import & export</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>PDF reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              <div className="space-y-3">
                <a href="https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" variant="outline">
                    Get Starter - $29/mo
                  </Button>
                </a>
                <a href="https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" variant="ghost">
                    <Clock className="mr-2 h-4 w-4" />
                    Try Starter Free (14 Days)
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="relative border-blue-500 border-2">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white">Most Popular</Badge>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Professional</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mt-2">For growing businesses & bookkeepers</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Up to 10,000 transactions/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Multi-client management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced matching rules</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>API access</span>
                </li>
              </ul>
              <div className="space-y-3">
                <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    Get Professional - $79/mo
                  </Button>
                </a>
                <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    Try Professional Free (14 Days)
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$199</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mt-2">For large accounting firms</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited transactions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <div className="space-y-3">
                <a href="https://buy.stripe.com/28E4gBd2eerBdvjaee0Fi0c" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" variant="outline">
                    Get Enterprise - $199/mo
                  </Button>
                </a>
                <a href="https://buy.stripe.com/28E4gBd2eerBdvjaee0Fi0c" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" variant="ghost">
                    <Clock className="mr-2 h-4 w-4" />
                    Try Enterprise Free (14 Days)
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            💳 Credit card required for trials • 🛡️ Bank-grade security • 🔒 99.9% uptime guarantee
          </p>
          <p className="text-sm text-gray-500">
            🆓 14-day free trials • ⚡ Instant access • 🚫 Cancel anytime before billing
          </p>
        </div>

        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="ghost">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 