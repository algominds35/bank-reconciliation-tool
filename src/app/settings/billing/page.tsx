'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function BillingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }
      setUser(session.user)
      fetchSubscription(session.user.id)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth/login')
    }
  }

  const fetchSubscription = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching subscription:', error)
      } else {
        setSubscription(profile)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSupport = () => {
    window.open('mailto:support@reconcilepro.com?subject=Cancel Subscription Request', '_blank')
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'starter': return 'Starter'
      case 'professional': return 'Professional'
      case 'enterprise': return 'Enterprise'
      default: return plan
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'trial':
        return <Badge variant="secondary"><Calendar className="h-3 w-3 mr-1" />Trial</Badge>
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      case 'expired':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {subscription?.subscription_plan ? getPlanDisplayName(subscription.subscription_plan) : 'No Plan'}
                  </h3>
                  <p className="text-gray-600">
                    {subscription?.subscription_status === 'trial' ? 'Free Trial' : 'Paid Subscription'}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(subscription?.subscription_status || 'unknown')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer ID</label>
                  <p className="text-gray-900 font-mono text-sm">{subscription?.stripe_customer_id || 'N/A'}</p>
                </div>
              </div>
              
              {subscription?.subscription_status === 'trial' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Trial Period</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    Your trial ends on {new Date(subscription?.trial_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cancellation - Support Only */}
          {subscription?.subscription_status === 'active' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Cancel Subscription</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Contact Support Required</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      To cancel your subscription, please contact our support team. This helps us understand your needs and potentially offer better solutions.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <strong>Why contact support?</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>We can offer better pricing or features</li>
                      <li>Help resolve any issues you're experiencing</li>
                      <li>Provide data export assistance</li>
                      <li>Ensure smooth account closure</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={handleContactSupport}
                      className="w-full"
                    >
                      Contact Support to Cancel
                    </Button>
                    
                    <p className="text-sm text-gray-500 text-center">
                      Response within 24 hours • We're here to help!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you need help with billing or have questions about your subscription, 
                please contact our support team.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> support@reconcilepro.com
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Response time:</strong> Within 24 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 