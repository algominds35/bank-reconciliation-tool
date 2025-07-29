import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// LIVE MODE STRIPE CONFIGURATION ONLY
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
const stripeSecretKey = process.env.STRIPE_SECRET_KEY_LIVE

// Client-side Stripe
export const getStripe = () => {
  if (!stripePublishableKey) {
    console.error('Missing Stripe live publishable key')
    return null
  }
  return loadStripe(stripePublishableKey)
}

// Server-side Stripe
export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
}) : null

// Pricing data - Update these with your actual Stripe price IDs
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter_live',
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
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional_live',
    paymentLink: 'https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b',
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
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_live',
    paymentLink: 'https://buy.stripe.com/28E4gBd2eerBdvjaee0Fi0c',
    features: [
      'Unlimited transactions',
      'Unlimited clients',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support'
    ]
  }
} 