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

      // Get user profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setHasAccess(false)
        return
      }

      setSubscription(profile)

      // Check access based on subscription status
      const now = new Date()
      const trialEnd = new Date(profile.trial_end_date)
      
      let access = false
      let reason = ''

      switch (profile.subscription_status) {
        case 'active':
          access = true
          break
        case 'trial':
          access = trialEnd > now
          reason = access ? '' : 'Trial expired'
          break
        case 'cancelled':
          // Check if within grace period (30 days from cancellation)
          const cancelledDate = new Date(profile.updated_at)
          const gracePeriodEnd = new Date(cancelledDate.getTime() + (30 * 24 * 60 * 60 * 1000))
          access = gracePeriodEnd > now
          reason = access ? 'Grace period active' : 'Grace period expired'
          break
        case 'expired':
          access = false
          reason = 'Subscription expired'
          break
        default:
          access = false
          reason = 'Invalid subscription status'
      }

      setHasAccess(access)
    } catch (error) {
      console.error('Error checking access:', error)
      setHasAccess(false)
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
                {subscription?.subscription_status === 'cancelled' 
                  ? 'Your subscription has been cancelled'
                  : subscription?.subscription_status === 'expired'
                  ? 'Your subscription has expired'
                  : 'Your trial has expired'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription?.subscription_status === 'cancelled' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Grace Period</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    You have 30 days from cancellation to export your data and reactivate your account.
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

  return <>{children}</>
} 