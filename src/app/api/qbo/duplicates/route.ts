import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { duplicateDetector, Transaction } from '@/lib/duplicate-detector'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const url = new URL(req.url)
    const realmId = url.searchParams.get('realmId')

    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }

    // Fetch QB transactions
    const { data: qbTransactions, error: qbError } = await supabase
      .from('qbo_transactions')
      .select('*')
      .eq('realm_id', realmId)
      .order('transaction_date', { ascending: false })

    if (qbError) {
      console.error('Error fetching QB transactions:', qbError)
      return NextResponse.json(
        { error: 'Failed to fetch QuickBooks transactions' },
        { status: 500 }
      )
    }

    // Convert to Transaction format
    const transactions: Transaction[] = (qbTransactions || []).map((tx: any) => ({
      id: tx.id,
      date: tx.transaction_date,
      amount: parseFloat(tx.amount) || 0,
      description: tx.memo,
      memo: tx.memo,
      transaction_type: tx.transaction_type,
      reference_number: tx.reference_number,
    }))

    // Find duplicates within QB
    const duplicates = duplicateDetector.findDuplicatesInQB(transactions)

    // Return high-confidence duplicates (possible, likely, or exact)
    const significantDuplicates = duplicates.filter(
      (dup) => dup.confidence >= 0.75
    )

    return NextResponse.json({
      duplicates: significantDuplicates,
      total: significantDuplicates.length,
      checked: transactions.length,
    })
  } catch (error) {
    console.error('Duplicate detection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

