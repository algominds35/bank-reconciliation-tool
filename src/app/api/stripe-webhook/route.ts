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

      // Find and update user account
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('❌ Database error:', authError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      const user = authUsers.users.find(u => u.email === customerEmail)
      
      if (!user) {
        console.error('❌ User not found:', customerEmail)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Update user to active subscription
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'active',
          subscription_plan: subscriptionPlan,
          stripe_customer_id: session.customer,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

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