import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Search for customers in Stripe by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    })

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'Email not found in our payment records. Please use the exact email you used for payment.' },
        { status: 404 }
      )
    }

    const customer = customers.data[0]

    // Check for ANY payments (not just active subscriptions)
    // This includes: active, cancelled, trial, past_due, etc.
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 10 // Get more subscriptions to check
    })

    // Also check for any payment intents or charges
    const charges = await stripe.charges.list({
      customer: customer.id,
      limit: 5
    })

    // If they have ANY subscription OR payment, they're verified
    const hasAnySubscription = subscriptions.data.length > 0
    const hasAnyPayment = charges.data.length > 0

    if (!hasAnySubscription && !hasAnyPayment) {
      return NextResponse.json(
        { error: 'No payment found for this email. Please ensure you have completed payment.' },
        { status: 404 }
      )
    }

    // Find the most recent subscription (regardless of status)
    const latestSubscription = subscriptions.data.length > 0 
      ? subscriptions.data[0] 
      : null

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        subscription: latestSubscription?.id || null,
        subscriptionStatus: latestSubscription?.status || 'no_subscription',
        hasPayment: hasAnyPayment
      }
    })

  } catch (error) {
    console.error('Error verifying Stripe customer:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment information' },
      { status: 500 }
    )
  }
}
