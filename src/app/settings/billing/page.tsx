'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  X,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface Subscription {
  id: string
  status: string
  plan_name: string
  stripe_subscription_id: string
  stripe_customer_id: string
  current_period_start: string
  current_period_end: string
  amount: number
  created_at: string
  cancelled_at?: string
}

export default function BillingSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchSubscription()
    }
  }, [user])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
      } else {
        setUser(session.user)
      }
    } catch (error) {
      console.error('Supabase auth check failed:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscription = async () => {
    try {
      // First try database
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setSubscription(data)
        return
      }

      // If not found in database, check Stripe directly
      console.log('Subscription not found in database, checking Stripe...')
      const response = await fetch('/api/stripe/check-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.subscription) {
          setSubscription(result.subscription)
          console.log('Found subscription in Stripe:', result.subscription)
        }
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) {
      alert('No active subscription found')
      return
    }

    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to all premium features.')) {
      return
    }

    setCancelling(true)
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
          customerId: subscription.stripe_customer_id
        })
      })

      if (response.ok) {
        alert('Subscription cancelled successfully. You will receive a confirmation email shortly.')
        await fetchSubscription() // Refresh subscription data
      } else {
        const error = await response.json()
        alert(`Failed to cancel subscription: ${error.error}`)
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Failed to cancel subscription. Please try again or contact support.')
    } finally {
      setCancelling(false)
    }
  }

  const handleManageBilling = async () => {
    if (!subscription?.stripe_customer_id) {
      alert('No billing information found')
      return
    }

    try {
      // Create Stripe billing portal session
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: subscription.stripe_customer_id
        })
      })

      if (response.ok) {
        const { url } = await response.json()
        window.open(url, '_blank')
      } else {
        alert('Failed to open billing portal. Please contact support.')
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
      alert('Failed to open billing portal. Please contact support.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
            </div>
            <Badge variant="outline" className="text-xs">
              {user?.email}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{subscription.plan_name}</h3>
                      <p className="text-gray-600">${subscription.amount / 100}/month</p>
                    </div>
                    <Badge 
                      variant={subscription.status === 'active' ? 'default' : 'destructive'}
                      className="ml-4"
                    >
                      {subscription.status === 'active' ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Cancelled
                        </>
                      )}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Current Period</p>
                        <p className="text-sm text-gray-600">
                          {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-sm text-gray-600">${subscription.amount / 100}/month</p>
                      </div>
                    </div>
                  </div>

                  {subscription.status === 'cancelled' && subscription.cancelled_at && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Subscription Cancelled</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        Cancelled on {new Date(subscription.cancelled_at).toLocaleDateString()}. 
                        You'll have access until {new Date(subscription.current_period_end).toLocaleDateString()}.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-600 mb-4">You're currently on the free trial.</p>
                  <Link href="/#pricing">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      View Plans & Pricing
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Actions */}
          {subscription && (
            <Card>
              <CardHeader>
                <CardTitle>Billing Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Manage Payment Method</h4>
                      <p className="text-sm text-gray-600">Update your payment method and billing information</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleManageBilling}
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Manage Billing</span>
                    </Button>
                  </div>

                  {subscription.status === 'active' && (
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-800">Cancel Subscription</h4>
                        <p className="text-sm text-red-600">To cancel your subscription, please contact our support team</p>
                      </div>
                      <Link href="/contact">
                        <Button 
                          variant="destructive" 
                          className="flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Contact Support</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Billing history will be available after your first payment.</p>
                <p className="text-sm">You can view detailed invoices in the billing portal above.</p>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Have questions about your billing or subscription? Our support team is here to help.
                </p>
                <div className="flex space-x-3">
                  <Link href="/contact">
                    <Button variant="outline">Contact Support</Button>
                  </Link>
                  <a href="mailto:alex@usealgomind.com">
                    <Button variant="outline">Email Support</Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
