import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// Create admin client with service role key for user lookup
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 LIVE PAYMENT WEBHOOK: Starting...')
    
    // Verify environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Service role key not configured'
      }, { status: 500 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET_LIVE) {
      console.error('❌ Missing STRIPE_WEBHOOK_SECRET_LIVE')
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Live webhook secret not configured'
      }, { status: 500 })
    }
    
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      console.error('❌ No Stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }
    
    // Verify webhook signature
    if (!stripe) {
      console.error('❌ Stripe not configured')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_LIVE!
      )
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('🔔 Live Stripe webhook received:', event.type)

    // Handle successful payments
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const customerEmail = session.customer_details?.email
      
      if (!customerEmail) {
        console.error('❌ No customer email found')
        return NextResponse.json({ error: 'No customer email' }, { status: 400 })
      }

      console.log('💰 LIVE Payment successful for:', customerEmail)
      console.log('💵 Amount paid:', session.amount_total! / 100, 'USD')

      // Plan detection based on amount paid
      const amountPaid = session.amount_total! / 100
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
      if (!supabaseAdmin) {
        console.error('❌ Supabase admin client not configured')
        return NextResponse.json({ 
          error: 'Server configuration error',
          details: 'Supabase admin client not available'
        }, { status: 500 })
      }
      
      console.log('🔍 Looking for existing user...')
      
      // Try to find existing user by email
      const { data: existingUser, error: userError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (userError) {
        console.error('❌ Error fetching users:', userError)
        return NextResponse.json({ 
          error: 'Database error',
          details: userError.message 
        }, { status: 500 })
      }

      const user = existingUser.users.find(u => u.email === customerEmail)
      
      if (!user) {
        console.log('⚠️ User not found, they need to sign up first')
        return NextResponse.json({ 
          success: true,
          message: 'Payment processed, but user needs to sign up',
          email: customerEmail,
          plan: subscriptionPlan
        })
      }

      console.log('✅ Found user:', user.id)

      // Update user profile with subscription
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_plan: subscriptionPlan,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (profileError) {
        console.error('❌ Error updating profile:', profileError)
        return NextResponse.json({ 
          error: 'Database error',
          details: profileError.message 
        }, { status: 500 })
      }

      console.log('✅ User subscription updated successfully')
      console.log('🎉 Client can now access dashboard!')

      return NextResponse.json({ 
        success: true,
        message: 'Subscription activated successfully',
        user: {
          id: user.id,
          email: user.email,
          plan: subscriptionPlan
        }
      })
    }

    // Handle other event types if needed
    console.log('ℹ️ Unhandled event type:', event.type)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
