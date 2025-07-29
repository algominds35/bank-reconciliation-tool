import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

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

// Initialize Stripe with live keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE!, {
  apiVersion: '2025-06-30.basil',
})

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
      console.log('🔍 Looking for existing user...')
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (userError) {
        console.error('❌ Admin lookup failed:', userError)
        return NextResponse.json({ 
          error: 'Admin user lookup failed', 
          details: userError.message 
        }, { status: 500 })
      }

      const existingUser = users.users.find(u => u.email === customerEmail)

      if (existingUser) {
        // User exists - upgrade their account immediately
        console.log('✅ Found existing user:', customerEmail, 'ID:', existingUser.id)

        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: existingUser.id,
            subscription_status: 'active',
            subscription_plan: subscriptionPlan,
            stripe_customer_id: session.customer as string,
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

        console.log('✅ EXISTING USER UPGRADED to:', subscriptionPlan.toUpperCase())
        
        return NextResponse.json({ 
          success: true, 
          email: customerEmail,
          plan: subscriptionPlan,
          amount: amountPaid,
          message: 'Existing user upgraded'
        })
      } else {
        // User doesn't exist - CREATE ACCOUNT AUTOMATICALLY
        console.log('🚀 Creating new account for:', customerEmail)
        
        try {
          // Create user account using admin client
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true, // Auto-confirm email since they paid
            password: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Temporary password
            user_metadata: {
              created_via: 'stripe_live_payment',
              payment_amount: amountPaid,
              subscription_plan: subscriptionPlan
            }
          })

          if (createError) {
            console.error('❌ Failed to create user account:', createError)
            // Fallback: store payment for later account creation
            await storePendingPayment(customerEmail, subscriptionPlan, session, amountPaid)
            return NextResponse.json({ 
              success: true, 
              email: customerEmail,
              plan: subscriptionPlan,
              amount: amountPaid,
              message: 'Payment processed - account creation needed'
            })
          }

          console.log('✅ New user account created:', newUser.user.id)

          // Create user profile with active subscription
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: newUser.user.id,
              subscription_status: 'active',
              subscription_plan: subscriptionPlan,
              stripe_customer_id: session.customer as string,
              trial_end_date: '2030-12-31',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (profileError) {
            console.error('❌ Profile creation failed:', profileError)
            return NextResponse.json({ 
              error: 'Profile creation failed', 
              details: profileError.message 
            }, { status: 500 })
          }

          console.log('✅ NEW USER ACCOUNT CREATED AND ACTIVATED for:', subscriptionPlan.toUpperCase())
          
          return NextResponse.json({ 
            success: true, 
            email: customerEmail,
            plan: subscriptionPlan,
            amount: amountPaid,
            user_id: newUser.user.id,
            message: 'New account created and activated'
          })

        } catch (error) {
          console.error('❌ Account creation failed:', error)
          // Fallback: store payment for later account creation
          await storePendingPayment(customerEmail, subscriptionPlan, session, amountPaid)
          return NextResponse.json({ 
            success: true, 
            email: customerEmail,
            plan: subscriptionPlan,
            amount: amountPaid,
            message: 'Payment processed - account creation needed'
          })
        }
      }
    }

    // Handle other events
    console.log('ℹ️ Unhandled event:', event.type)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('💥 Live webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Helper function to store pending payment
async function storePendingPayment(email: string, plan: string, session: Stripe.Checkout.Session, amount: number) {
  try {
    const { error: pendingError } = await supabase
      .from('pending_payments')
      .insert({
        email: email,
        subscription_plan: plan,
        stripe_customer_id: session.customer as string,
        stripe_session_id: session.id,
        amount_paid: amount,
        created_at: new Date().toISOString()
      })

    if (pendingError && !pendingError.message.includes('does not exist')) {
      console.error('❌ Failed to store pending payment:', pendingError)
    } else {
      console.log('✅ Payment info stored for future account creation')
    }
  } catch (error) {
    console.error('❌ Error storing pending payment:', error)
  }
} 