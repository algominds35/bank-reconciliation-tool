import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify user authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID required' },
        { status: 400 }
      )
    }
    
    // SECURITY: Verify client belongs to authenticated user
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, name')
      .eq('id', clientId)
      .eq('user_id', user.id) // SECURE: Ensure client belongs to user
      .single()

    if (clientError || !client) {
      console.error('❌ Client not found or access denied:', clientError)
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      )
    }
    
    console.log(`Received QuickBooks file: ${file.name} for client: ${client.name}`)
    
    // Process CSV file
    let transactions: any[] = []
    
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      try {
        const csvText = await file.text()
        transactions = parseQuickBooksCSV(csvText)
      } catch (error) {
        console.error('CSV processing failed:', error)
        return NextResponse.json(
          { 
            success: false,
            error: 'CSV processing failed. Please check file format.',
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'File must be a CSV' },
        { status: 400 }
      )
    }
    
    // Validate we have real transactions
    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No transactions found in file. Please check file format.'
        },
        { status: 400 }
      )
    }
    
    console.log(`✅ Extracted ${transactions.length} REAL QuickBooks transactions from ${file.name}`)
    
    // Store real QuickBooks transactions in database
    const bookTransactions = transactions.map((tx, index) => ({
      id: `qb-${clientId}-${index}`,
      client_id: clientId,
      date: tx.date,
      description: tx.description,
      amount: tx.amount,
      type: tx.amount >= 0 ? 'credit' : 'debit',
      category: tx.category || '',
      account: tx.account || '',
      reference: tx.reference || '',
      is_reconciled: false,
      created_at: new Date().toISOString()
    }))
    
    const { error: txError } = await supabase
      .from('book_transactions')
      .insert(bookTransactions)
    
    if (txError) {
      console.error('❌ QuickBooks transaction storage failed:', txError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to store QuickBooks transactions',
          details: txError.message
        },
        { status: 500 }
      )
    }
    
    // Update client status
    await supabase
      .from('clients')
      .update({ 
        status: 'ready_for_reconciliation',
        last_upload: new Date().toISOString()
      })
      .eq('id', clientId)
    
    return NextResponse.json({
      success: true,
      result: {
        fileName: file.name,
        totalTransactions: transactions.length,
        clientId: clientId
      }
    })
    
  } catch (error) {
    console.error('QuickBooks upload API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process QuickBooks file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper functions for QuickBooks CSV processing
function parseQuickBooksCSV(csvText: string): any[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []
  
  // Try to detect CSV format
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''))
  console.log('QuickBooks CSV Headers detected:', headers)
  
  const transactions: any[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = parseCSVLine(line)
    if (values.length < 3) continue
    
    // Map QuickBooks CSV formats
    const transaction = {
      date: extractDate(values, headers),
      description: extractDescription(values, headers),
      amount: extractAmount(values, headers),
      category: extractCategory(values, headers),
      account: extractAccount(values, headers),
      reference: extractReference(values, headers)
    }
    
    if (transaction.date && transaction.description && transaction.amount !== null) {
      transactions.push(transaction)
    }
  }
  
  console.log(`Parsed ${transactions.length} QuickBooks transactions from CSV`)
  return transactions
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

function extractDate(values: string[], headers: string[]): string | null {
  const dateIndices = headers.findIndex(h => 
    h.includes('date') || h.includes('transaction date') || h.includes('post date') || h.includes('memo date')
  )
  
  if (dateIndices >= 0 && values[dateIndices]) {
    const dateStr = values[dateIndices].replace(/"/g, '')
    // Try to parse common date formats
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  }
  
  return null
}

function extractDescription(values: string[], headers: string[]): string {
  const descIndices = headers.findIndex(h => 
    h.includes('description') || h.includes('memo') || h.includes('payee') || h.includes('transaction') || h.includes('name')
  )
  
  if (descIndices >= 0 && values[descIndices]) {
    return values[descIndices].replace(/"/g, '').trim()
  }
  
  return 'Unknown Transaction'
}

function extractAmount(values: string[], headers: string[]): number {
  const amountIndices = headers.findIndex(h => 
    h.includes('amount') || h.includes('debit') || h.includes('credit') || h.includes('withdrawal') || h.includes('deposit') || h.includes('total')
  )
  
  if (amountIndices >= 0 && values[amountIndices]) {
    const amountStr = values[amountIndices].replace(/"/g, '').replace(/[$,]/g, '')
    const amount = parseFloat(amountStr)
    if (!isNaN(amount)) {
      return amount
    }
  }
  
  return 0
}

function extractCategory(values: string[], headers: string[]): string {
  const catIndices = headers.findIndex(h => 
    h.includes('category') || h.includes('type') || h.includes('classification') || h.includes('account')
  )
  
  if (catIndices >= 0 && values[catIndices]) {
    return values[catIndices].replace(/"/g, '').trim()
  }
  
  return ''
}

function extractAccount(values: string[], headers: string[]): string {
  const accIndices = headers.findIndex(h => 
    h.includes('account') || h.includes('account number') || h.includes('account name')
  )
  
  if (accIndices >= 0 && values[accIndices]) {
    return values[accIndices].replace(/"/g, '').trim()
  }
  
  return ''
}

function extractReference(values: string[], headers: string[]): string {
  const refIndices = headers.findIndex(h => 
    h.includes('reference') || h.includes('check') || h.includes('transaction id') || h.includes('number')
  )
  
  if (refIndices >= 0 && values[refIndices]) {
    return values[refIndices].replace(/"/g, '').trim()
  }
  
  return ''
}
