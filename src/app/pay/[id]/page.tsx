'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripePaymentForm from '@/components/StripePaymentForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  due_date: string
  description: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  clients?: {
    name: string
    business_name?: string
    email?: string
  }
}

function PaymentPageContent() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showStripeForm, setShowStripeForm] = useState(false)

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const response = await fetch(`/api/invoices/${params.id}`)
        if (!response.ok) {
          throw new Error('Invoice not found')
        }
        const data = await response.json()
        setInvoice(data)
      } catch (err) {
        setError('Invoice not found or expired')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchInvoice()
    }
  }, [params.id])

  const handleEmailPayment = () => {
    window.location.href = `mailto:alex@usealgomind.com?subject=Payment for Invoice ${invoice?.invoice_number}&body=I would like to pay invoice ${invoice?.invoice_number} for $${invoice?.amount}. Please send payment instructions.`
  }

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    setShowStripeForm(false)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-red-600">Invoice Not Found</CardTitle>
            <CardDescription>
              This invoice may have been paid, expired, or the link is invalid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              If you believe this is an error, please contact us directly.
            </p>
            <Button 
              onClick={() => window.location.href = 'mailto:alex@usealgomind.com'}
              className="w-full"
            >
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-green-600">✅ Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for your payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Invoice #{invoice.invoice_number} has been paid
                </p>
                <p className="text-green-700 text-sm">
                  Amount: ${parseFloat(invoice.amount.toString()).toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                You will receive a receipt via email shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dueDate = new Date(invoice.due_date)
  const today = new Date()
  const isOverdue = today > dueDate
  const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Payment</h1>
          <p className="text-gray-600">Secure payment for your invoice</p>
        </div>

        {/* Invoice Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Invoice #{invoice.invoice_number}</CardTitle>
                <CardDescription>
                  {invoice.clients?.business_name || invoice.clients?.name || 'Valued Customer'}
                </CardDescription>
              </div>
              <Badge variant={isOverdue ? 'destructive' : 'secondary'}>
                {isOverdue ? `${daysOverdue} days overdue` : 'Due'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount Due</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${parseFloat(invoice.amount.toString()).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <p className="text-lg text-gray-900">
                  {dueDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-gray-900">{invoice.description}</p>
            </div>

            {isOverdue && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">⚠️ This invoice is overdue</p>
                <p className="text-red-700 text-sm">
                  Please pay immediately to avoid additional fees or collection actions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Options */}
        {!showStripeForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
              <CardDescription>
                Choose your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setShowStripeForm(true)}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                💳 Pay ${parseFloat(invoice.amount.toString()).toFixed(2)} with Credit Card
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-gray-500">Or</span>
                </div>
              </div>

              <Button 
                onClick={handleEmailPayment}
                variant="outline"
                className="w-full h-12 text-lg"
                size="lg"
              >
                📧 Request Payment Instructions
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Secure payment powered by Stripe
                </p>
                <p className="text-xs text-gray-400">
                  Questions? Contact us at alex@usealgomind.com
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Alternative Payment Methods</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Bank Transfer: Contact us for wire details</p>
                  <p>• Check: Make payable to ReconcileBook</p>
                  <p>• Questions: alex@usealgomind.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Button 
              onClick={() => setShowStripeForm(false)}
              variant="outline"
              className="mb-4"
            >
              ← Back to Payment Options
            </Button>
            <StripePaymentForm 
              invoice={invoice}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 This page is secured with SSL encryption. Your payment information is protected.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PayInvoicePage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentPageContent />
    </Elements>
  )
}
