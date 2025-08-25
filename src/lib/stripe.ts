import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export interface PaymentIntentData {
  amount: number // in cents
  currency: string
  invoiceId: string
  customerEmail: string
  customerName: string
  description: string
}

export async function createPaymentIntent(data: PaymentIntentData) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        invoiceId: data.invoiceId,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
      },
      description: data.description,
      receipt_email: data.customerEmail,
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw error
  }
}