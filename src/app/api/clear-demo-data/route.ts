import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Clear ALL transactions (more aggressive cleanup)
    const { error: bankError } = await supabase
      .from('bank_transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all except impossible ID

    const { error: bookError } = await supabase
      .from('book_transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all except impossible ID

    if (bankError) {
      console.error('Error clearing bank transactions:', bankError)
    }

    if (bookError) {
      console.error('Error clearing book transactions:', bookError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'ALL transactions cleared successfully' 
    })

  } catch (error) {
    console.error('Error clearing transactions:', error)
    return NextResponse.json(
      { error: 'Failed to clear transactions' },
      { status: 500 }
    )
  }
}
