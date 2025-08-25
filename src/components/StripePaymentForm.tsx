'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StripePaymentFormProps {
  invoice: {
    id: string
    invoice_number: string
    amount: number
    description: string
    clients?: {
      name: string
      business_name?: string
      email?: string
    }
  }
  onSuccess: () => void
  onError: (error: string) => void
}

export default function StripePaymentForm({ invoice, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setPaymentError('')

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
        }),
      })

      const { clientSecret, paymentIntentId } = await response.json()

      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: invoice.clients?.business_name || invoice.clients?.name || 'Customer',
            email: invoice.clients?.email || '',
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on server
        await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        })

        onSuccess()
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment failed')
      onError(err.message || 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>💳 Pay with Credit Card</CardTitle>
        <CardDescription>
          Secure payment powered by Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 border rounded-lg bg-gray-50">
            <CardElement options={cardElementOptions} />
          </div>

          {paymentError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{paymentError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              `Pay $${parseFloat(invoice.amount.toString()).toFixed(2)}`
            )}
          </Button>

          <div className="text-center text-xs text-gray-500">
            🔒 Your payment information is secure and encrypted
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
