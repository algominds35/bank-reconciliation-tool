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
    // SECURITY: Verify user authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    console.log(`Creating Financial Connections session for user: ${user.id}`)

    // Create Stripe Financial Connections session
    const session = await stripe.financialConnections.sessions.create({
      permissions: ['transactions', 'balances'], // Request transaction and balance data
      filters: { 
        countries: ['US'] // US banks only for now
      },
      account_holder: { 
        type: 'individual' // Can be 'individual' or 'company' based on your needs
      },
      // Optional: Customize the UI
      custom_text: {
        submit: {
          message: 'Connect your bank account to automatically sync transactions with ReconcileBook Pro'
        }
      }
    })

    console.log(`✅ Created FC session: ${session.id}`)

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
      console.error('❌ Failed to store FC session:', sessionError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      client_secret: session.client_secret,
      session_id: session.id
    })

  } catch (error) {
    console.error('Financial Connections session creation error:', error)
    
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

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Verify user authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    console.log(`Retrieving FC session: ${sessionId} for user: ${user.id}`)

    // Retrieve the session from Stripe
    const session = await stripe.financialConnections.sessions.retrieve(sessionId)

    // Update session status in database
    const { error: updateError } = await supabase
      .from('financial_connections_sessions')
      .update({
        status: session.status === 'succeeded' ? 'completed' : 'pending',
        accounts_linked: session.accounts || [],
        completed_at: session.status === 'succeeded' ? new Date().toISOString() : null
      })
      .eq('session_id', sessionId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('❌ Failed to update FC session:', updateError)
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        accounts: session.accounts || []
      }
    })

  } catch (error) {
    console.error('Financial Connections session retrieval error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve bank connection session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
