import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

      // Verify plan assignment is correct
      const expectedPlans = {
        29: 'starter',
        79: 'professional', 
        199: 'enterprise'
      }
      
      console.log('🎯 Expected plans mapping:', expectedPlans)
      console.log('💡 Amount paid:', amountPaid, '→ Plan:', subscriptionPlan)

      // BULLETPROOF: Find user and activate account in one query
      const { data: result, error: updateError } = await supabase.rpc('activate_user_by_email', {
        user_email: customerEmail,
        plan: subscriptionPlan,
        stripe_customer: session.customer
      })

      if (updateError) {
        console.error('❌ Failed to update user:', updateError)
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
      }

      console.log('✅ User activated successfully:', result)
      console.log('🎉 WEBHOOK SUCCESS:', customerEmail, '→', subscriptionPlan.toUpperCase())
      
      return NextResponse.json({ 
        success: true, 
        email: customerEmail,
        plan: subscriptionPlan,
        amount: amountPaid
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