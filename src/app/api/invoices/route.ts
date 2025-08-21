import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Invoice, InvoiceUpload } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Fetch all invoices for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id') || 'temp_user' // Default to temp_user for now
    
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          name,
          business_name,
          email
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch invoices' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      invoices: invoices || []
    })

  } catch (error) {
    console.error('Invoice fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch invoices' 
    }, { status: 500 })
  }
}

// POST: Create new invoice
export async function POST(req: NextRequest) {
  try {
    const body: InvoiceUpload = await req.json()
    const { client_name, client_email, invoice_number, amount, due_date, description } = body
    
    // Validate required fields
    if (!client_name || !client_email || !invoice_number || !amount || !due_date) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Create or get client
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', client_email)
      .single()

    let clientId: string

    if (existingClient) {
      clientId = existingClient.id
    } else {
      // Create new client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: client_name,
          business_name: client_name,
          email: client_email,
          user_id: 'temp_user' // Using text, not UUID
        })
        .select('id')
        .single()

      if (clientError) {
        console.error('Client creation error:', clientError)
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to create client' 
        }, { status: 500 })
      }

      clientId = newClient.id
    }

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        client_id: clientId,
        invoice_number,
        amount: parseFloat(amount.toString()),
        due_date: new Date(due_date).toISOString(),
        description,
        status: 'pending',
        user_id: 'temp_user' // Will be updated when user auth is implemented
      })
      .select('*')
      .single()

    if (invoiceError) {
      console.error('Invoice creation error:', invoiceError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create invoice' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      invoice
    })

  } catch (error) {
    console.error('Invoice creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create invoice' 
    }, { status: 500 })
  }
}

// PUT: Update invoice
export async function PUT(req: NextRequest) {
  try {
    const body: Partial<Invoice> = await req.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invoice ID is required' 
      }, { status: 400 })
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Invoice update error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update invoice' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      invoice
    })

  } catch (error) {
    console.error('Invoice update error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update invoice' 
    }, { status: 500 })
  }
}

// DELETE: Delete invoice
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invoice ID is required' 
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Invoice deletion error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete invoice' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully'
    })

  } catch (error) {
    console.error('Invoice deletion error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete invoice' 
    }, { status: 500 })
  }
}
