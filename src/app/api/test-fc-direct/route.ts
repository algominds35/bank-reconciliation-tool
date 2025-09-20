import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 TESTING FC DIRECT: Starting direct Financial Connections test')
    
    // Test if we can even import and initialize Stripe
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    
    console.log('✅ TESTING FC DIRECT: Stripe initialized')
    
    // Try to create a Financial Connections session directly
    try {
      console.log('🔍 TESTING FC DIRECT: Attempting to create FC session')
      
      const session = await stripe.financialConnections.sessions.create({
        permissions: ['transactions', 'balances'],
        account_holder: {
          type: 'business' as any
        },
        filters: {
          countries: ['US']
        }
      } as any)
      
      console.log('✅ TESTING FC DIRECT: FC session created successfully!')
      
      return NextResponse.json({
        success: true,
        message: 'Financial Connections IS enabled and working!',
        session_id: session.id,
        client_secret: session.client_secret
      })
      
    } catch (fcError: any) {
      console.error('❌ TESTING FC DIRECT: FC session creation failed:', fcError)
      
      return NextResponse.json({
        success: false,
        error: 'Financial Connections session creation failed',
        details: fcError.message,
        type: fcError.type,
        code: fcError.code,
        statusCode: fcError.statusCode,
        possibleCauses: [
          'Financial Connections not enabled on account',
          'Account type not supported',
          'Regional restrictions',
          'API version mismatch'
        ]
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ TESTING FC DIRECT: General error:', error)
    return NextResponse.json({
      success: false,
      error: 'General error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
