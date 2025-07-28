'use client'

import React from 'react'
import { useTrialStatus } from '@/hooks/useTrialStatus' 
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle } from 'lucide-react'

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

  // Show "Active" badge for paid users (instead of plan name)
  if (trialStatus.subscriptionStatus === 'active') {
    return (
      <Badge variant="default" className="flex items-center space-x-1 bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3" />
        <span>Active</span>
      </Badge>
    )
  }

  // Show expired badge
  if (trialStatus.subscriptionStatus === 'expired') {
    return (
      <Badge variant="destructive" className="flex items-center space-x-1">
        <span>Expired</span>
      </Badge>
    )
  }

  return null
} 