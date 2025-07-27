'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getStripe } from '@/lib/stripe'

interface PaymentButtonProps {
  priceId: string
  planName: string
  buttonText?: string
  className?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export function PaymentButton({ 
  priceId, 
  planName, 
  buttonText = 'Start Free Trial',
  className = '',
  variant = 'default',
  size = 'default'
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // Payments temporarily disabled - redirect to signup
      alert('Payments are temporarily disabled while we fix technical issues. Please sign up for updates!')
      router.push('/auth/signup')
    } catch (error) {
      console.error('Navigation error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? 'Processing...' : buttonText}
    </Button>
  )
} 