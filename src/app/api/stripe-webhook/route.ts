import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create admin client with service role key for user lookup
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 WEBHOOK: Checking admin permissions...')
    
    // Verify admin client is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Service role key not configured'
      }, { status: 500 })
    }
    
    const body = await request.text()
    console.log('📦 Webhook body length:', body.length)
    
    // Parse the webhook event
    let event
    try {
      event = JSON.parse(body)
    } catch (err) {
      console.error('❌ Invalid JSON:', err)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    console.log('🔔 Stripe webhook received:', event.type)

    // Handle successful payments from Payment Links
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerEmail = session.customer_details?.email
      
      if (!customerEmail) {
        console.error('❌ No customer email found')
        return NextResponse.json({ error: 'No customer email' }, { status: 400 })
      }

      console.log('💰 Payment successful for:', customerEmail)
      console.log('💵 Amount paid:', session.amount_total / 100, 'USD')

      // BULLETPROOF PLAN DETECTION - Exact amount matching
      const amountPaid = session.amount_total / 100 // Convert cents to dollars
      let subscriptionPlan = 'starter' // Default fallback
      
      console.log('🔍 Detecting plan for amount:', amountPaid)
      
      // Exact plan detection with tolerance for floating point issues
      if (amountPaid >= 199 - 0.01) {
        subscriptionPlan = 'enterprise'
        console.log('✅ Plan detected: ENTERPRISE ($199+)')
      } else if (amountPaid >= 79 - 0.01) {
        subscriptionPlan = 'professional'
        console.log('✅ Plan detected: PROFESSIONAL ($79-$198)')
      } else if (amountPaid >= 29 - 0.01) {
        subscriptionPlan = 'starter'
        console.log('✅ Plan detected: STARTER ($29-$78)')
      } else {
        console.error('❌ UNKNOWN AMOUNT:', amountPaid, '- Defaulting to starter')
        subscriptionPlan = 'starter'
      }

      console.log('📋 Final assigned plan:', subscriptionPlan.toUpperCase())

      // Find existing user using ADMIN CLIENT (has proper permissions)
      console.log('🔍 Looking for existing user with admin permissions...')
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (userError) {
        console.error('❌ Error fetching users with admin client:', userError)
        return NextResponse.json({ 
          error: 'Admin user lookup failed', 
          details: userError.message 
        }, { status: 500 })
      }

      const existingUser = users.users.find(u => u.email === customerEmail)

      if (!existingUser) {
        console.error('❌ User not found:', customerEmail)
        console.log('💡 User must sign up first before paying')
        return NextResponse.json({ 
          error: 'User not found',
          message: 'User must create account first via signup',
          email: customerEmail
        }, { status: 404 })
      }

      console.log('✅ Found existing user:', customerEmail, 'ID:', existingUser.id)

      // Update user profile using regular client (for database operations)
      console.log('📝 Upgrading user to:', subscriptionPlan)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: existingUser.id,
          subscription_status: 'active',
          subscription_plan: subscriptionPlan,
          stripe_customer_id: session.customer,
          trial_end_date: '2030-12-31',
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('❌ Failed to update profile:', profileError)
        return NextResponse.json({ 
          error: 'Profile update failed', 
          details: profileError.message 
        }, { status: 500 })
      }

      console.log('✅ User upgraded successfully!')
      console.log('🎉 WEBHOOK SUCCESS:', customerEmail, '→', subscriptionPlan.toUpperCase())
      
      return NextResponse.json({ 
        success: true, 
        email: customerEmail,
        plan: subscriptionPlan,
        amount: amountPaid,
        message: 'User upgraded successfully'
      })
    }

    // Handle other webhook events
    console.log('ℹ️ Unhandled webhook event:', event.type)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('💥 Webhook error:', error)
    console.error('💥 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json({ 
      error: 'Webhook failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 