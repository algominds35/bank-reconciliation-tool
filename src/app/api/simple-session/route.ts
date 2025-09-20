import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Creating simple bank session...')
    
    // Check environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: 'STRIPE_SECRET_KEY not set'
      }, { status: 500 })
    }
    
    // Import Stripe directly
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil'
    })
    
    console.log('✅ Stripe instance created')
    
    // Create Financial Connections session with absolute minimal config
    const session = await stripe.financialConnections.sessions.create({
      permissions: ['transactions']
    })
    
    console.log('✅ Stripe session created:', session.id)
    
    return NextResponse.json({
      success: true,
      client_secret: session.client_secret,
      session_id: session.id
    })
    
  } catch (error: any) {
    console.error('❌ Error creating bank session:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create bank session',
      details: error.message,
      type: error.type,
      code: error.code
    }, { status: 500 })
  }
}
