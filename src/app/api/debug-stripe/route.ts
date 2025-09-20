import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debugging Stripe setup...')
    
    // Check environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    console.log('Environment check:')
    console.log('- STRIPE_SECRET_KEY:', stripeSecretKey ? `SET (${stripeSecretKey.substring(0, 10)}...)` : 'NOT SET')
    console.log('- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', stripePublishableKey ? `SET (${stripePublishableKey.substring(0, 10)}...)` : 'NOT SET')
    
    if (!stripeSecretKey) {
      return NextResponse.json({
        status: 'FAILED',
        error: 'STRIPE_SECRET_KEY not set in environment'
      })
    }
    
    // Test Stripe import and basic API call
    try {
      const Stripe = require('stripe')
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-07-30.basil'
      })
      
      console.log('✅ Stripe instance created successfully')
      
      // Test a simple API call to verify the key works
      const account = await stripe.accounts.retrieve()
      
      console.log('✅ Stripe API call successful')
      
      return NextResponse.json({
        status: 'SUCCESS',
        message: 'Stripe is working correctly!',
        accountId: account.id,
        publishableKey: stripePublishableKey?.substring(0, 20) + '...'
      })
      
    } catch (stripeError: any) {
      console.error('❌ Stripe API error:', stripeError)
      return NextResponse.json({
        status: 'FAILED',
        error: 'Stripe API error',
        details: stripeError.message,
        type: stripeError.type,
        code: stripeError.code
      })
    }
    
  } catch (error: any) {
    console.error('❌ Debug error:', error)
    return NextResponse.json({
      status: 'FAILED',
      error: 'Debug failed',
      details: error.message
    })
  }
}
