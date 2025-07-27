import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// TEMPORARILY DISABLE STRIPE TO FIX LANDING PAGE CRASH
// Client-side Stripe - return null to prevent initialization errors
export const getStripe = () => {
  console.log('Stripe disabled to prevent landing page crash')
  return null
}

// Server-side Stripe - mock object to prevent errors
export const stripe = {
  checkout: {
    sessions: {
      create: async () => ({ id: 'disabled' })
    }
  }
} as any

// Pricing data - hardcoded to prevent crashes
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    priceId: 'price_disabled_for_now',
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
    priceId: 'price_disabled_for_now',
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
    priceId: 'price_disabled_for_now',
    features: [
      'Unlimited transactions',
      'Unlimited clients',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support'
    ]
  }
} 