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

    // Check if customer has any active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found for this email. Please ensure you have completed payment.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        subscription: subscriptions.data[0].id
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
