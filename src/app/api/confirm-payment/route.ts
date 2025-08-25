import { NextRequest, NextResponse } from 'next/server'
import { retrievePaymentIntent } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await retrievePaymentIntent(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    const invoiceId = paymentIntent.metadata.invoiceId
    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID not found in payment metadata' },
        { status: 400 }
      )
    }

    // Update invoice status to paid
    const { data: invoice, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: `Paid via Stripe - Payment Intent: ${paymentIntentId}`,
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) {
      console.error('Error updating invoice:', error)
      return NextResponse.json(
        { error: 'Failed to update invoice status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      invoice: invoice,
      paymentAmount: paymentIntent.amount / 100, // Convert back from cents
    })
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
