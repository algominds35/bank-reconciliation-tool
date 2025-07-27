import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Client-side Stripe
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Server-side Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Pricing data matching your landing page
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
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
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
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
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      'Unlimited transactions',
      'Unlimited clients',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support'
    ]
  }
} 