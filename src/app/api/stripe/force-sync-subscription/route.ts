import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 })
    }

    console.log(`Force syncing subscription for user: ${userId}, email: ${email}`)

    // Get all customers with this email
    const customers = await stripe.customers.list({
      email: email,
      limit: 10
    })

    console.log(`Found ${customers.data.length} customers with email ${email}`)

    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'No Stripe customer found with this email' }, { status: 404 })
    }

    // Check all customers for active subscriptions
    for (const customer of customers.data) {
      console.log(`Checking customer: ${customer.id}`)
      
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all', // Check all statuses, not just active
        limit: 10
      })

      console.log(`Found ${subscriptions.data.length} subscriptions for customer ${customer.id}`)

      if (subscriptions.data.length > 0) {
        // Use the most recent subscription
        const subscription = subscriptions.data[0]
        console.log(`Using subscription: ${subscription.id}, status: ${subscription.status}`)

        // Create/update subscription record
        const subscriptionData = {
          user_id: userId,
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          plan_name: 'Pro Plan',
          amount: subscription.items.data[0]?.price?.unit_amount || 4900,
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Delete any existing subscription for this user
        await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', userId)

        // Insert new subscription
        const { data: newSubscription, error: insertError } = await supabase
          .from('user_subscriptions')
          .insert(subscriptionData)
          .select()
          .single()

        if (insertError) {
          console.error('Error inserting subscription:', insertError)
          return NextResponse.json({ error: 'Failed to save subscription to database' }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true,
          subscription: newSubscription,
          message: 'Subscription synced successfully'
        })
      }
    }

    return NextResponse.json({ error: 'No subscriptions found for this email' }, { status: 404 })

  } catch (error) {
    console.error('Error force syncing subscription:', error)
    return NextResponse.json({ error: 'Failed to sync subscription' }, { status: 500 })
  }
}
