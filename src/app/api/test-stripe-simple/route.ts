import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 SIMPLE TEST: Starting basic test')
    
    // Test 1: Check if we can import Stripe
    let stripe
    try {
      const Stripe = require('stripe')
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
      console.log('✅ SIMPLE TEST: Stripe imported successfully')
    } catch (importError) {
      console.error('❌ SIMPLE TEST: Stripe import failed:', importError)
      return NextResponse.json({
        success: false,
        error: 'Stripe import failed',
        details: importError
      }, { status: 500 })
    }
    
    // Test 2: Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'NOT SET',
    }
    
    // Test 3: Try the simplest possible Stripe API call
    try {
      console.log('🔍 SIMPLE TEST: Testing basic Stripe API call')
      const account = await stripe.accounts.retrieve()
      console.log('✅ SIMPLE TEST: Basic Stripe API call successful')
      
      return NextResponse.json({
        success: true,
        message: 'All basic tests passed',
        envCheck,
        account: {
          id: account.id,
          country: account.country
        }
      })
    } catch (apiError: any) {
      console.error('❌ SIMPLE TEST: Stripe API call failed:', apiError)
      return NextResponse.json({
        success: false,
        error: 'Stripe API call failed',
        envCheck,
        apiError: {
          type: apiError.type,
          message: apiError.message,
          code: apiError.code,
          statusCode: apiError.statusCode
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ SIMPLE TEST: General error:', error)
    return NextResponse.json({
      success: false,
      error: 'General error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
