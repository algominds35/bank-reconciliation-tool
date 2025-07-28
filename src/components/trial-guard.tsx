'use client'

import React from 'react'
import { useTrialStatus } from '@/hooks/useTrialStatus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, Crown, Zap } from 'lucide-react'

interface TrialGuardProps {
  children: React.ReactNode
}

export function TrialGuard({ children }: TrialGuardProps) {
  const trialStatus = useTrialStatus()

  // Show loading state
  if (trialStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  // Block access if trial expired and no active subscription
  if (!trialStatus.isTrialActive && trialStatus.subscriptionStatus !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center border-red-200">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Trial Expired
              </CardTitle>
              <p className="text-xl text-gray-600 mt-4">
                Your 14-day free trial has ended. Upgrade now to continue using ReconcilePro.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center justify-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Choose Your Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Starter Plan */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900">Starter</h4>
                    <p className="text-2xl font-bold text-gray-900">$29<span className="text-sm text-gray-500">/month</span></p>
                    <p className="text-sm text-gray-600 mb-3">Up to 1,000 transactions/month</p>
                    <a href="https://buy.stripe.com/test_6oU3cx6DQ1EP0Ix5XY0Fi07" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full" size="sm">
                        Choose Plan
                      </Button>
                    </a>
                  </div>

                  {/* Professional Plan */}
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-500 relative">
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">Popular</Badge>
                    <h4 className="font-semibold text-gray-900">Professional</h4>
                    <p className="text-2xl font-bold text-gray-900">$79<span className="text-sm text-gray-500">/month</span></p>
                    <p className="text-sm text-gray-600 mb-3">Up to 10,000 transactions/month</p>
                    <a href="https://buy.stripe.com/test_28EbJ32nA0ALezn1HI0Fi08" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full" size="sm">
                        Choose Plan
                      </Button>
                    </a>
                  </div>

                  {/* Enterprise Plan */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900">Enterprise</h4>
                    <p className="text-2xl font-bold text-gray-900">$199<span className="text-sm text-gray-500">/month</span></p>
                    <p className="text-sm text-gray-600 mb-3">Unlimited transactions</p>
                    <a href="https://buy.stripe.com/test_aFa9AV4vIdnxgHv2LM0Fi09" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full" size="sm" variant="outline">
                        Choose Plan
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 pt-4 border-t">
                <p className="mb-2">
                  🔐 All your data is safely stored and will be restored immediately after payment
                </p>
                <p>
                  💬 Questions? Email us at support@getconnectflows.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show trial warning if less than 3 days remaining
  const showWarning = trialStatus.subscriptionStatus === 'trial' && trialStatus.daysRemaining <= 3

  return (
    <div>
      {showWarning && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-orange-800">
                <strong>{trialStatus.daysRemaining} days left</strong> in your free trial. 
                <span className="ml-1">Upgrade now to continue access.</span>
              </p>                              
            </div>
            <div className="flex gap-2">
              <a href="https://buy.stripe.com/test_28EbJ32nA0ALezn1HI0Fi08" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Upgrade Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  )
} 