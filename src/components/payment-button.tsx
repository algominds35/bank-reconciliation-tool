'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

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
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Redirect to signup if not logged in
        router.push('/auth/signup')
        return
      }

      const userEmail = session.user.email

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
          userEmail,
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw new Error(error.message)
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
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