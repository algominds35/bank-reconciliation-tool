'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CreditCard, Clock, TrendingUp } from 'lucide-react'

export default function SignupRedirect() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Choose Your Plan
            </CardTitle>
            <p className="text-gray-600 mt-2">
              All plans include a 14-day free trial with credit card required
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
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <span>If you love it, billing starts automatically after 14 days</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <a href="https://buy.stripe.com/test_TRIAL_PROFESSIONAL_LINK_HERE" target="_blank" rel="noopener noreferrer">
                <Button className="w-full h-16 text-lg">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">Try Professional Free (14 Days)</span>
                    <span className="text-sm opacity-90">Then $79/month • Most Popular</span>
                  </div>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              
              <a href="https://buy.stripe.com/test_TRIAL_STARTER_LINK_HERE" target="_blank" rel="noopener noreferrer">
                <Button className="w-full h-16 text-lg" variant="outline">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">Try Starter Free (14 Days)</span>
                    <span className="text-sm opacity-90">Then $29/month</span>
                  </div>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>

              <a href="https://buy.stripe.com/test_TRIAL_ENTERPRISE_LINK_HERE" target="_blank" rel="noopener noreferrer">
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
              <p className="text-sm text-gray-600 mb-4">
                <strong>Already have an account?</strong>
              </p>
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full">
                  Login to Dashboard
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <Link href="/" className="text-blue-600 hover:underline text-sm">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 