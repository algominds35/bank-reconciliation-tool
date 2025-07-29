'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ExternalLink } from 'lucide-react'

export default function TestPaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Links Test
          </h1>
          <p className="text-gray-600">
            Test your Stripe payment links to make sure they're working properly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-blue-600">Starter Plan</CardTitle>
              <div className="text-2xl font-bold">$29/mo</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>• Up to 1,000 transactions/month</p>
                <p>• CSV import & export</p>
                <p>• PDF reports</p>
                <p>• Email support</p>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Test Starter Payment
                  </Button>
                </a>
                
                <div className="text-xs text-gray-500 text-center">
                  Opens Stripe checkout in new tab
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="border-2 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-green-600">Professional Plan</CardTitle>
              <div className="text-2xl font-bold">$79/mo</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>• Up to 10,000 transactions/month</p>
                <p>• Multi-client management</p>
                <p>• Advanced matching rules</p>
                <p>• Priority support</p>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Test Professional Payment
                  </Button>
                </a>
                
                <div className="text-xs text-gray-500 text-center">
                  Opens Stripe checkout in new tab
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-purple-600">Enterprise Plan</CardTitle>
              <div className="text-2xl font-bold">$199/mo</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>• Unlimited transactions</p>
                <p>• Team collaboration</p>
                <p>• Custom integrations</p>
                <p>• Dedicated support</p>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="https://buy.stripe.com/28E4gBd2eerBdvjaee0Fi0c" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Test Enterprise Payment
                  </Button>
                </a>
                
                <div className="text-xs text-gray-500 text-center">
                  Opens Stripe checkout in new tab
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            How to Test Your Payment Links
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>1.</strong> Click any payment link above to open Stripe checkout</p>
            <p><strong>2.</strong> Use Stripe test card: <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code></p>
            <p><strong>3.</strong> Any future expiry date (e.g., 12/25)</p>
            <p><strong>4.</strong> Any 3-digit CVC</p>
            <p><strong>5.</strong> Enter your email address</p>
            <p><strong>6.</strong> Complete the payment</p>
            <p><strong>7.</strong> Check your Vercel logs to see if the webhook processed correctly</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Your webhook will automatically create accounts for customers who pay</li>
            <li>• Customers can then login with their email and reset their password</li>
            <li>• Check Vercel function logs to see webhook processing</li>
            <li>• Make sure your Stripe webhook endpoint is configured in Stripe Dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 