import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Papa from 'papaparse'
import { InvoiceUpload } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 })
    }

    // Read file content
    const text = await file.text()
    
    // Parse CSV
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim()
    })

    if (result.errors.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'CSV parsing failed',
        details: result.errors
      }, { status: 400 })
    }

    const invoices: InvoiceUpload[] = []
    const errors: string[] = []

    // Validate and transform CSV data
    result.data.forEach((row: any, index: number) => {
      try {
        // Check required fields
        if (!row.client_name || !row.client_email || !row.invoice_number || !row.amount || !row.due_date) {
          errors.push(`Row ${index + 1}: Missing required fields`)
          return
        }

        // Validate amount
        const amount = parseFloat(row.amount)
        if (isNaN(amount) || amount <= 0) {
          errors.push(`Row ${index + 1}: Invalid amount`)
          return
        }

        // Validate date
        const dueDate = new Date(row.due_date)
        if (isNaN(dueDate.getTime())) {
          errors.push(`Row ${index + 1}: Invalid due date`)
          return
        }

        invoices.push({
          client_name: row.client_name,
          client_email: row.client_email,
          invoice_number: row.invoice_number,
          amount: amount,
          due_date: dueDate.toISOString(),
          description: row.description || 'Invoice from CSV import'
        })
      } catch (error) {
        errors.push(`Row ${index + 1}: ${error}`)
      }
    })

    if (errors.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'CSV validation failed',
        details: errors
      }, { status: 400 })
    }

    // Import invoices to database
    const importedInvoices = []
    const importErrors = []

    for (const invoice of invoices) {
      try {
        // Create or get client
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .eq('email', invoice.client_email)
          .single()

        let clientId: string

        if (existingClient) {
          clientId = existingClient.id
        } else {
          // Create new client
          const { data: newClient, error: clientError } = await supabase
            .from('clients')
            .insert({
              name: invoice.client_name,
              business_name: invoice.client_name,
              email: invoice.client_email,
              user_id: 'temp_user' // Will be updated when user auth is implemented
            })
            .select('id')
            .single()

          if (clientError) {
            importErrors.push(`Failed to create client for ${invoice.client_email}: ${clientError.message}`)
            continue
          }

          clientId = newClient.id
        }

        // Create invoice
        const { data: newInvoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            client_id: clientId,
            invoice_number: invoice.invoice_number,
            amount: invoice.amount,
            due_date: invoice.due_date,
            description: invoice.description,
            status: 'pending',
            user_id: 'temp_user' // Will be updated when user auth is implemented
          })
          .select('*')
          .single()

        if (invoiceError) {
          importErrors.push(`Failed to create invoice ${invoice.invoice_number}: ${invoiceError.message}`)
          continue
        }

        importedInvoices.push(newInvoice)
      } catch (error) {
        importErrors.push(`Failed to import invoice ${invoice.invoice_number}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedInvoices.length} invoices`,
      imported: importedInvoices.length,
      total: invoices.length,
      errors: importErrors,
      invoices: importedInvoices
    })

  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to import CSV' 
    }, { status: 500 })
  }
}
