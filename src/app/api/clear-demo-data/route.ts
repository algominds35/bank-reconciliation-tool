import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Clear fake/demo transactions
    const { error: bankError } = await supabase
      .from('bank_transactions')
      .delete()
      .or('description.ilike.%Office Rent Payment%,description.ilike.%Rent Expense%,description.ilike.%demo%,description.ilike.%fake%')

    const { error: bookError } = await supabase
      .from('book_transactions')
      .delete()
      .or('description.ilike.%Office Rent Payment%,description.ilike.%Rent Expense%,description.ilike.%demo%,description.ilike.%fake%')

    if (bankError) {
      console.error('Error clearing bank transactions:', bankError)
    }

    if (bookError) {
      console.error('Error clearing book transactions:', bookError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Demo data cleared successfully' 
    })

  } catch (error) {
    console.error('Error clearing demo data:', error)
    return NextResponse.json(
      { error: 'Failed to clear demo data' },
      { status: 500 }
    )
  }
}
