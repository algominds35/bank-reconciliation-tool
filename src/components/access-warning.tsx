'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AlertTriangle, Calendar, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function AccessWarning() {
  const [warning, setWarning] = useState<{
    show: boolean
    message: string
    daysLeft: number
    type: 'trial' | 'grace' | 'expired'
  } | null>(null)

  useEffect(() => {
    checkAccessWarning()
  }, [])

  const checkAccessWarning = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!profile) return

      const now = new Date()
      let daysLeft = 0
      let message = ''
      let type: 'trial' | 'grace' | 'expired' = 'trial'

      if (profile.subscription_status === 'trial') {
        const trialEnd = new Date(profile.trial_end_date)
        daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysLeft <= 0) {
          message = 'Your trial has expired. Upgrade to continue using the service.'
          type = 'expired'
        } else if (daysLeft <= 3) {
          message = `Your trial expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Upgrade now to avoid interruption.`
          type = 'trial'
        }
      } else if (profile.subscription_status === 'cancelled') {
        const cancelledDate = new Date(profile.updated_at)
        const gracePeriodEnd = new Date(cancelledDate.getTime() + (30 * 24 * 60 * 60 * 1000))
        daysLeft = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysLeft <= 0) {
          message = 'Your grace period has expired. Reactivate your subscription to continue.'
          type = 'expired'
        } else if (daysLeft <= 7) {
          message = `Your grace period expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Reactivate your subscription to keep your data.`
          type = 'grace'
        }
      }

      if (message) {
        setWarning({
          show: true,
          message,
          daysLeft,
          type
        })
      }
    } catch (error) {
      console.error('Error checking access warning:', error)
    }
  }

  const handleUpgrade = () => {
    window.location.href = '/auth/signup'
  }

  const handleDismiss = () => {
    setWarning(null)
  }

  if (!warning?.show) return null

  return (
    <Alert className={`mb-4 ${warning.type === 'expired' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`h-5 w-5 mt-0.5 ${warning.type === 'expired' ? 'text-red-600' : 'text-yellow-600'}`} />
          <div className="flex-1">
            <AlertDescription className={`${warning.type === 'expired' ? 'text-red-800' : 'text-yellow-800'}`}>
              {warning.message}
            </AlertDescription>
            {warning.type !== 'expired' && (
              <Button 
                size="sm" 
                className="mt-2"
                onClick={handleUpgrade}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {warning.type === 'trial' ? 'Upgrade Now' : 'Reactivate'}
              </Button>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
} 