'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Lock, Calendar, CreditCard } from 'lucide-react'

interface AccessGuardProps {
  children: React.ReactNode
}

export function AccessGuard({ children }: AccessGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [gracePeriodDays, setGracePeriodDays] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      // DEVELOPER BYPASS - Allow specific developer emails to always have access
      const developerEmails = ['alex@usealgomind.com', 'mrjoj@example.com']
      if (developerEmails.includes(session.user.email || '')) {
        console.log('Developer access granted for:', session.user.email)
        setHasAccess(true)
        setSubscription({ status: 'active', developer: true })
        setLoading(false)
        return
      }

      // Get user subscription from user_subscriptions table
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // If no subscription found, check if they have a trial OR give them trial access
      if (error && error.code === 'PGRST116') {
        // Check user_profiles for trial status
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          const now = new Date()
          const trialEnd = new Date(profile.trial_end_date)
          const hasTrialAccess = trialEnd > now
          
          setHasAccess(hasTrialAccess)
          setSubscription(profile)
          return
        } else {
          // No profile found - give them trial access for testing
          console.log('No subscription or trial found, granting trial access for testing')
          setHasAccess(true)
          setSubscription({ status: 'trial', trial: true })
          return
        }
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error)
        // Don't block access on errors - allow through for testing
        setHasAccess(true)
        setSubscription({ status: 'error', error: true })
        return
      }

      setSubscription(subscription)

      // Check access based on subscription status
      const now = new Date()
      
      let access = false
      let reason = ''

      switch (subscription?.status) {
        case 'active':
          access = true
          break
        case 'cancelled':
          // Check if within grace period (14 days from cancellation)
          const cancelledDate = new Date(subscription.cancelled_at || subscription.updated_at)
          const gracePeriodEnd = new Date(cancelledDate.getTime() + (14 * 24 * 60 * 60 * 1000))
          access = gracePeriodEnd > now
          const daysLeft = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          setGracePeriodDays(daysLeft > 0 ? daysLeft : null)
          reason = access ? `Grace period: ${daysLeft} days left` : 'Grace period expired'
          break
        case 'past_due':
        case 'unpaid':
          access = false
          reason = 'Payment failed'
          break
        default:
          // Be more lenient - allow access for testing
          access = true
          reason = 'Development/testing mode'
      }

      setHasAccess(access)
    } catch (error) {
      console.error('Error checking access:', error)
      // Don't block on errors - allow access for testing
      setHasAccess(true)
      setSubscription({ status: 'error', error: true })
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = () => {
    router.push('/auth/signup')
  }

  const handleContactSupport = () => {
    window.open('mailto:alex@usealgomind.com', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Access Restricted
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {subscription?.status === 'cancelled' 
                  ? 'Your subscription has been cancelled'
                  : subscription?.status === 'past_due'
                  ? 'Your payment failed'
                  : 'Your access has expired'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription?.status === 'cancelled' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Grace Period</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    You have 14 days from cancellation to export your data and reactivate your account.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <Button onClick={handleUpgrade} className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Reactivate Subscription
                </Button>
                
                <Button variant="outline" onClick={handleContactSupport} className="w-full">
                  Contact Support
                </Button>
              </div>

                                        <div className="text-center text-sm text-gray-500">
                            <p>Need help? Contact us at alex@usealgomind.com</p>
                          </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show grace period warning if in grace period
  if (subscription?.status === 'cancelled' && gracePeriodDays && gracePeriodDays <= 7) {
    return (
      <div>
        {/* Grace Period Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Grace Period Ending Soon
              </h3>
              <p className="text-sm text-yellow-700">
                Your subscription was cancelled. You have {gracePeriodDays} day{gracePeriodDays !== 1 ? 's' : ''} left in your grace period.
                <a href="/auth/signup" className="font-medium underline ml-1">Reactivate now</a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        {children}
      </div>
    )
  }

  return <>{children}</>
} 