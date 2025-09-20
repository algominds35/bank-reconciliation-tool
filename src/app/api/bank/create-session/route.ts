import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 CREATE SESSION: Starting session creation')
    
    // Check environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not set')
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      )
    }

    // SECURITY: Verify user authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      console.log('❌ CREATE SESSION: No authenticated user')
      return createUnauthorizedResponse()
    }

    console.log(`🔍 CREATE SESSION: Creating session for user: ${user.id}`)

    // Create Stripe Financial Connections session
    let session
    try {
      console.log('🔍 CREATE SESSION: Calling Stripe API')
      session = await stripe.financialConnections.sessions.create({
        permissions: ['transactions', 'balances'],
        account_holder: {
          type: 'business'
        },
        filters: {
          countries: ['US']
        }
      })
      console.log(`✅ CREATE SESSION: Session created: ${session.id}`)
    } catch (stripeError: any) {
      console.error('❌ CREATE SESSION: Stripe API error:', stripeError)
      return NextResponse.json(
        { 
          error: 'Stripe API error', 
          details: stripeError.message || 'Unknown Stripe error',
          type: stripeError.type,
          code: stripeError.code
        },
        { status: 500 }
      )
    }

    // Store session in database for tracking
    const { error: sessionError } = await supabase
      .from('financial_connections_sessions')
      .insert({
        user_id: user.id,
        session_id: session.id,
        client_secret: session.client_secret,
        status: 'pending'
      })

    if (sessionError) {
      console.error('❌ CREATE SESSION: Failed to store session:', sessionError)
      // Don't fail the request, just log the error
    }

    console.log('✅ CREATE SESSION: Returning success response')
    return NextResponse.json({
      success: true,
      client_secret: session.client_secret,
      session_id: session.id
    })

  } catch (error) {
    console.error('❌ CREATE SESSION: General error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create bank connection session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
