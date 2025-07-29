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
      // Get Stripe instance
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
          userEmail: '', // Will be collected by Stripe
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
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