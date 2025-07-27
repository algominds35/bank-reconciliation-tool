'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, ArrowRight } from 'lucide-react'

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Payment Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl text-gray-600">
              No worries! Your payment was cancelled and no charges were made.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">You can still:</h3>
              <ul className="text-left space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use the free version with basic features</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Try our premium plans anytime</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contact us if you have questions</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#pricing">
                <Button size="lg" className="w-full sm:w-auto">
                  View Pricing Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Continue with Free
                </Button>
              </Link>
            </div>

            <div className="flex justify-center pt-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-500">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t">
              <p>Questions about our pricing?</p>
              <p>Contact our sales team for personalized help.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 