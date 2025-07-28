'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTrialStatus } from '@/hooks/useTrialStatus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  AlertTriangle,
  Loader2
} from 'lucide-react'

interface TrialGuardProps {
  children: React.ReactNode
}

export function TrialGuard({ children }: TrialGuardProps) {
  const trialStatus = useTrialStatus()
  const router = useRouter()

  // Redirect expired users to upgrade page
  useEffect(() => {
    if (!trialStatus.isLoading && trialStatus.subscriptionStatus === 'expired') {
      router.push('/upgrade')
    }
  }, [trialStatus.isLoading, trialStatus.subscriptionStatus, router])

  // Loading state
  if (trialStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your account status...</p>
        </div>
      </div>
    )
  }

  // Trial expired - redirect to upgrade (this shouldn't render due to useEffect)
  if (trialStatus.subscriptionStatus === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to upgrade page...</p>
        </div>
      </div>
    )
  }

  // Show trial warning if less than 3 days remaining (but still active)
  const showTrialWarning = trialStatus.subscriptionStatus === 'trial' && trialStatus.daysRemaining <= 3

  return (
    <div>
      {/* Trial Warning Banner */}
      {showTrialWarning && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">
                Trial expires in {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''}!
              </span>
              <span className="text-yellow-700 ml-2">
                Choose a plan to continue accessing your data.
              </span>
            </div>
            <Button 
              size="sm" 
              onClick={() => router.push('/upgrade')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Render children (dashboard content) */}
      {children}
    </div>
  )
} 