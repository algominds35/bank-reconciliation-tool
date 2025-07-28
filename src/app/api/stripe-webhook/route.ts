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
    console.log('🔔 CLEAN WEBHOOK: Starting...')
    
    // Verify environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Service role key not configured'
      }, { status: 500 })
    }
    
    const body = await request.text()
    
    // Parse the webhook event
    let event
    try {
      event = JSON.parse(body)
    } catch (err) {
      console.error('❌ Invalid JSON:', err)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    console.log('🔔 Stripe webhook received:', event.type)

    // Handle successful payments
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerEmail = session.customer_details?.email
      
      if (!customerEmail) {
        console.error('❌ No customer email found')
        return NextResponse.json({ error: 'No customer email' }, { status: 400 })
      }

      console.log('💰 Payment successful for:', customerEmail)
      console.log('💵 Amount paid:', session.amount_total / 100, 'USD')

      // Plan detection based on amount paid
      const amountPaid = session.amount_total / 100
      let subscriptionPlan = 'starter'
      
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
      }

      console.log('📋 Final plan:', subscriptionPlan.toUpperCase())

      // Find user using ADMIN CLIENT
      console.log('🔍 Looking for user with admin permissions...')
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (userError) {
        console.error('❌ Admin lookup failed:', userError)
        return NextResponse.json({ 
          error: 'Admin user lookup failed', 
          details: userError.message 
        }, { status: 500 })
      }

      const existingUser = users.users.find(u => u.email === customerEmail)

      if (!existingUser) {
        console.error('❌ User not found:', customerEmail)
        return NextResponse.json({ 
          error: 'User not found',
          message: 'User must create account first via signup',
          email: customerEmail
        }, { status: 404 })
      }

      console.log('✅ Found user:', customerEmail, 'ID:', existingUser.id)

      // Update user profile 
      console.log('📝 Upgrading to:', subscriptionPlan)
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
        console.error('❌ Profile update failed:', profileError)
        return NextResponse.json({ 
          error: 'Profile update failed', 
          details: profileError.message 
        }, { status: 500 })
      }

      console.log('✅ SUCCESS! User upgraded to:', subscriptionPlan.toUpperCase())
      
      return NextResponse.json({ 
        success: true, 
        email: customerEmail,
        plan: subscriptionPlan,
        amount: amountPaid
      })
    }

    // Handle other events
    console.log('ℹ️ Unhandled event:', event.type)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('💥 Webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 