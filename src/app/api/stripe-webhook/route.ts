import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Admin client for user creation
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This is the secret admin key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    // Parse the webhook event
    let event
    try {
      event = JSON.parse(body)
    } catch (err) {
      console.error('Invalid JSON:', err)
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

      // Check if user already exists
      const { data: existingUser, error: lookupError } = await supabaseAdmin.auth.admin.listUsers()
      const userExists = existingUser?.users?.find(u => u.email === customerEmail)

      let userId: string
      let accountCreated = false

      if (userExists) {
        console.log('✅ User exists:', customerEmail)
        userId = userExists.id
      } else {
        console.log('🔄 Creating new user account for:', customerEmail)
        
        // Create user using Supabase Admin API
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          password: `TempPass_${Date.now()}`, // Temporary password - user will reset it
          email_confirm: true, // Auto-confirm since they paid
          user_metadata: {
            created_via: 'stripe_payment',
            stripe_customer_id: session.customer
          }
        })

        if (createError) {
          console.error('❌ Failed to create user:', createError)
          return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
        }

        userId = newUser.user!.id
        accountCreated = true
        console.log('✅ User account created:', customerEmail, 'ID:', userId)
      }

      // Update user profile with subscription info
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          subscription_status: 'active',
          subscription_plan: subscriptionPlan,
          stripe_customer_id: session.customer,
          trial_end_date: '2030-12-31',
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('❌ Failed to update profile:', profileError)
        return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
      }

      console.log('✅ User profile updated successfully')
      console.log('🎉 WEBHOOK SUCCESS:', customerEmail, '→', subscriptionPlan.toUpperCase())
      
      return NextResponse.json({ 
        success: true, 
        email: customerEmail,
        plan: subscriptionPlan,
        amount: amountPaid,
        account_created: accountCreated
      })
    }

    // Handle other webhook events
    console.log('ℹ️ Unhandled webhook event:', event.type)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('💥 Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
} 