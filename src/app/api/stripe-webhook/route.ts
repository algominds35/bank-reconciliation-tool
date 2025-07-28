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

      // Determine plan based on amount paid
      let subscriptionPlan = 'starter'
      const amountPaid = session.amount_total / 100 // Convert cents to dollars
      
      if (amountPaid >= 199) {
        subscriptionPlan = 'enterprise'
      } else if (amountPaid >= 79) {
        subscriptionPlan = 'professional' 
      } else if (amountPaid >= 29) {
        subscriptionPlan = 'starter'
      }

      console.log('📋 Assigned plan:', subscriptionPlan)

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

      console.log(`✅ SUCCESS: ${customerEmail} upgraded to ${subscriptionPlan}`)
      
      return NextResponse.json({ 
        success: true, 
        message: `User upgraded to ${subscriptionPlan}`,
        email: customerEmail,
        plan: subscriptionPlan
      })
    }

    // Acknowledge other events
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('💥 Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
} 