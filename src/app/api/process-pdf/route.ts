import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      )
    }
    
    console.log(`Received PDF: ${file.name} for client: ${clientId}`)
    
    try {
      // ENABLE REAL PDF PROCESSING
      const { pdfProcessor } = await import('@/lib/pdf-processor')
      const result = await pdfProcessor.processPDF(file)
      
      console.log(`✅ Real PDF processed: ${result.transactions.length} transactions found`)
      
      // CREATE CLIENT WITH REAL DATA
      const clientName = file.name.replace('.pdf', '').replace(/[^a-zA-Z0-9\s]/g, '')
      
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .upsert({
          id: clientId || `client-${Date.now()}`,
          name: clientName,
          email: '',
          phone: '',
          industry: '',
          status: 'ready',
          user_id: request.headers.get('user-id') || 'demo-user',
          total_transactions: result.totalTransactions,
          unmatched_transactions: result.totalTransactions,
          bank_transactions: result.transactions,
          last_upload: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (clientError) {
        console.error('Client creation failed:', clientError)
        throw new Error(`Database error: ${clientError.message}`)
      }

      console.log(`✅ Real client created: ${client.name} with ${result.totalTransactions} transactions`)
      
      return NextResponse.json({
        success: true,
        result: {
          fileName: result.fileName,
          bankName: result.bankName || 'Unknown Bank',
          accountNumber: result.accountNumber || 'Unknown',
          statementPeriod: result.statementPeriod || 'Unknown',
          transactions: result.transactions,
          totalTransactions: result.totalTransactions,
          errors: result.errors,
          clientId: client.id
        }
      })
      
    } catch (error) {
      console.error('PDF processing failed completely:', error)
      
      // Only fall back if absolutely necessary
      return NextResponse.json(
        { 
          success: false,
          error: 'PDF processing failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('PDF processing API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
