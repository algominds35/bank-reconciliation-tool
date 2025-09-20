import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Starting debug endpoint')
    
    // Test 1: Check if Stripe is initialized
    console.log('🔍 DEBUG: Testing Stripe initialization')
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not initialized' }, { status: 500 })
    }
    
    // Test 2: Check environment variables
    console.log('🔍 DEBUG: Checking environment variables')
    const envVars = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'NOT SET',
    }
    
    // Test 3: Try a simple Stripe API call
    console.log('🔍 DEBUG: Testing basic Stripe API call')
    try {
      const account = await stripe.accounts.retrieve()
      console.log('🔍 DEBUG: Stripe API call successful')
      
      return NextResponse.json({
        success: true,
        message: 'All tests passed',
        envVars,
        stripeAccount: {
          id: account.id,
          country: account.country,
          type: account.type
        }
      })
    } catch (stripeError: any) {
      console.error('🔍 DEBUG: Stripe API call failed:', stripeError)
      return NextResponse.json({
        success: false,
        message: 'Stripe API call failed',
        envVars,
        stripeError: {
          type: stripeError.type,
          message: stripeError.message,
          code: stripeError.code
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('🔍 DEBUG: General error:', error)
    return NextResponse.json({
      success: false,
      message: 'General error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
