import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICING_PLANS } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { priceId, planName, userEmail } = await request.json()

    if (!priceId || !planName) {
      return NextResponse.json(
        { error: 'Missing required parameters: priceId and planName' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const sessionConfig: any = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/payment/cancelled`,
      metadata: {
        planName,
      },
      subscription_data: {
        metadata: {
          planName,
        },
      },
    }

    // Only add customer_email if provided
    if (userEmail) {
      sessionConfig.customer_email = userEmail
      sessionConfig.metadata.userEmail = userEmail
      sessionConfig.subscription_data.metadata.userEmail = userEmail
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 