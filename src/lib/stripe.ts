import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// LIVE MODE STRIPE CONFIGURATION
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE

// Client-side Stripe
export const getStripe = () => {
  if (!stripePublishableKey) {
    console.error('Missing Stripe publishable key')
    return null
  }
  return loadStripe(stripePublishableKey)
}

// Server-side Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE!, {
  apiVersion: '2025-06-30.basil',
})

// Pricing data with LIVE payment links
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    priceId: 'price_starter_live',
    paymentLink: 'https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a',
    features: [
      'Up to 1,000 transactions/month',
      'CSV import & export',
      'PDF reports',
      'Email support'
    ]
  },
  professional: {
    name: 'Professional',
    price: 79,
    priceId: 'price_professional_live',
    paymentLink: 'https://buy.stripe.com/professional_live_link', // You'll need to create this
    features: [
      'Up to 10,000 transactions/month',
      'Multi-client management',
      'Advanced matching rules',
      'Priority support',
      'API access'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    priceId: 'price_enterprise_live',
    paymentLink: 'https://buy.stripe.com/enterprise_live_link', // You'll need to create this
    features: [
      'Unlimited transactions',
      'Unlimited clients',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support'
    ]
  }
} 