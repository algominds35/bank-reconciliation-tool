import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface TrialStatus {
  isLoading: boolean
  isTrialActive: boolean
  daysRemaining: number
  trialEndDate: Date | null
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'cancelled'
  subscriptionPlan: string | null
}

export function useTrialStatus() {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isLoading: true,
    isTrialActive: false,
    daysRemaining: 0,
    trialEndDate: null,
    subscriptionStatus: 'trial',
    subscriptionPlan: null
  })

  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          setTrialStatus(prev => ({ ...prev, isLoading: false }))
          return
        }

        // Get user profile with trial info
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching trial status:', error)
          setTrialStatus(prev => ({ ...prev, isLoading: false }))
          return
        }

        if (profile) {
          const now = new Date()
          const trialEnd = new Date(profile.trial_end_date)
          const diffTime = trialEnd.getTime() - now.getTime()
          const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
          
          const isTrialActive = profile.subscription_status === 'trial' && daysRemaining > 0
          const subscriptionActive = profile.subscription_status === 'active'

          setTrialStatus({
            isLoading: false,
            isTrialActive: isTrialActive || subscriptionActive,
            daysRemaining,
            trialEndDate: trialEnd,
            subscriptionStatus: profile.subscription_status,
            subscriptionPlan: profile.subscription_plan
          })
        }
      } catch (error) {
        console.error('Error checking trial status:', error)
        setTrialStatus(prev => ({ ...prev, isLoading: false }))
      }
    }

    checkTrialStatus()
  }, [])

  return trialStatus
} 