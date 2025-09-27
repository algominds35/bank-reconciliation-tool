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

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // First, check if subscription exists in our database
    const { data: dbSubscription, error: dbError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (dbSubscription) {
      return NextResponse.json({ subscription: dbSubscription })
    }

    // If not in database, check Stripe directly by email
    if (email) {
      const customers = await stripe.customers.list({
        email: email,
        limit: 1
      })

      if (customers.data.length > 0) {
        const customer = customers.data[0]
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
          limit: 1
        })

        if (subscriptions.data.length > 0) {
          const stripeSubscription = subscriptions.data[0]
          
          // Create subscription record in our database
          const subscriptionData = {
            user_id: userId,
            stripe_customer_id: customer.id,
            stripe_subscription_id: stripeSubscription.id,
            status: stripeSubscription.status,
            plan_name: 'Pro Plan', // Default plan name
            amount: stripeSubscription.items.data[0]?.price?.unit_amount || 4900,
            current_period_start: new Date((stripeSubscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((stripeSubscription as any).current_period_end * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { data: newSubscription, error: insertError } = await supabase
            .from('user_subscriptions')
            .insert(subscriptionData)
            .select()
            .single()

          if (insertError) {
            console.error('Error inserting subscription:', insertError)
          }

          return NextResponse.json({ 
            subscription: newSubscription || subscriptionData,
            foundInStripe: true
          })
        }
      }
    }

    return NextResponse.json({ subscription: null })

  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json({ error: 'Failed to check subscription' }, { status: 500 })
  }
}
