import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { invoiceId } = await req.json()

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      )
    }

    // Fetch invoice details
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          name,
          business_name,
          email
        )
      `)
      .eq('id', invoiceId)
      .single()

    if (error || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    if (invoice.status === 'paid') {
      return NextResponse.json(
        { error: 'Invoice is already paid' },
        { status: 400 }
      )
    }

    const client = invoice.clients as any
    if (!client) {
      return NextResponse.json(
        { error: 'Client information not found' },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount: Math.round(parseFloat(invoice.amount.toString()) * 100), // Convert to cents
      currency: 'usd',
      invoiceId: invoice.id,
      customerEmail: client.email || 'noreply@example.com',
      customerName: client.business_name || client.name || 'Customer',
      description: `Payment for Invoice #${invoice.invoice_number} - ${invoice.description}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
