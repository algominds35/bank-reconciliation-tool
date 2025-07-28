'use client'

import React from 'react'
import { useTrialStatus } from '@/hooks/useTrialStatus' 
import { Badge } from '@/components/ui/badge'
import { Clock, Crown } from 'lucide-react'

export function TrialStatusBadge() {
  const trialStatus = useTrialStatus()

  if (trialStatus.isLoading) {
    return null
  }

  // Show badge for trial users
  if (trialStatus.subscriptionStatus === 'trial') {
    const isWarning = trialStatus.daysRemaining <= 3
    
    return (
      <Badge 
        variant={isWarning ? "destructive" : "secondary"}
        className="flex items-center space-x-1"
      >
        <Clock className="h-3 w-3" />
        <span>
          {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''} left
        </span>
      </Badge>
    )
  }

  // Show badge for paid users
  if (trialStatus.subscriptionStatus === 'active') {
    return (
      <Badge variant="default" className="flex items-center space-x-1 bg-green-100 text-green-800">
        <Crown className="h-3 w-3" />
        <span>
          {trialStatus.subscriptionPlan ? 
            trialStatus.subscriptionPlan.charAt(0).toUpperCase() + trialStatus.subscriptionPlan.slice(1) 
            : 'Pro'
          }
        </span>
      </Badge>
    )
  }

  return null
} 