import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { duplicateDetector, Transaction } from '@/lib/duplicate-detector'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { realmId, bankTransactions: bankTxData } = await req.json()

    if (!realmId || !bankTxData) {
      return NextResponse.json(
        { error: 'realmId and bankTransactions required' },
        { status: 400 }
      )
    }

    // Fetch QB transactions
    const { data: qbTransactions, error: qbError } = await supabase
      .from('qbo_transactions')
      .select('*')
      .eq('realm_id', realmId)

    if (qbError) {
      console.error('Error fetching QB transactions:', qbError)
      return NextResponse.json(
        { error: 'Failed to fetch QuickBooks transactions' },
        { status: 500 }
      )
    }

    // Convert to Transaction format
    const qbTx: Transaction[] = (qbTransactions || []).map((tx: any) => ({
      id: tx.id,
      date: tx.transaction_date,
      amount: parseFloat(tx.amount) || 0,
      description: tx.memo,
      memo: tx.memo,
      transaction_type: tx.transaction_type,
      reference_number: tx.reference_number,
    }))

    const bankTx: Transaction[] = bankTxData.map((tx: any) => ({
      id: tx.id || `bank-${tx.date}-${tx.amount}`,
      date: tx.date,
      amount: parseFloat(tx.amount) || 0,
      description: tx.description || tx.memo || '',
      memo: tx.description || tx.memo || '',
    }))

    // Generate comprehensive report
    const report = duplicateDetector.generateDiscrepancyReport(bankTx, qbTx)

    // Flag bank transactions that already exist in QB
    const flags = duplicateDetector.flagAlreadyInQuickBooks(bankTx, qbTx)

    return NextResponse.json({
      report,
      flags: Object.fromEntries(flags),
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Discrepancy report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

