import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 QUICK TEST: Testing basic connectivity')
    
    // Test environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'NOT SET',
    }
    
    // Test if we can import Stripe
    let stripe
    try {
      const Stripe = require('stripe')
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
      console.log('✅ QUICK TEST: Stripe imported successfully')
    } catch (importError) {
      return NextResponse.json({
        success: false,
        error: 'Stripe import failed',
        details: importError
      }, { status: 500 })
    }
    
    // Test basic Stripe API call
    try {
      const account = await stripe.accounts.retrieve()
      console.log('✅ QUICK TEST: Basic Stripe API call successful')
      
      return NextResponse.json({
        success: true,
        message: 'Basic Stripe connectivity works',
        envCheck,
        account: {
          id: account.id,
          country: account.country
        }
      })
    } catch (apiError: any) {
      console.error('❌ QUICK TEST: Stripe API call failed:', apiError)
      return NextResponse.json({
        success: false,
        error: 'Stripe API call failed',
        envCheck,
        apiError: {
          type: apiError.type,
          message: apiError.message,
          code: apiError.code
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ QUICK TEST: General error:', error)
    return NextResponse.json({
      success: false,
      error: 'General error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
