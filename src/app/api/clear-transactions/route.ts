import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('Starting to clear all transactions for user:', userId);
    
    // Clear bank_transactions_sync (where manual uploads are stored) - ONLY FOR THIS USER
    const { data: bankSyncData, error: bankSyncError } = await supabase
      .from('bank_transactions_sync')
      .delete()
      .eq('user_id', userId)
      .select();

    if (bankSyncError) {
      console.error('Error clearing bank_transactions_sync:', bankSyncError);
      return NextResponse.json({ 
        error: 'Error clearing bank transactions: ' + bankSyncError.message 
      }, { status: 500 });
    } else {
      console.log('Successfully cleared bank_transactions_sync:', bankSyncData);
    }

    // Clear bank transactions - ONLY FOR THIS USER
    const { data: bankData, error: bankError } = await supabase
      .from('bank_transactions')
      .delete()
      .eq('user_id', userId)
      .select();

    if (bankError) {
      console.error('Error clearing bank transactions:', bankError);
      return NextResponse.json({ 
        error: 'Error clearing bank transactions: ' + bankError.message 
      }, { status: 500 });
    } else {
      console.log('Successfully cleared bank_transactions:', bankData);
    }

    // Clear book transactions - ONLY FOR THIS USER
    const { data: bookData, error: bookError } = await supabase
      .from('book_transactions')
      .delete()
      .eq('user_id', userId)
      .select();

    if (bookError) {
      console.error('Error clearing book transactions:', bookError);
      return NextResponse.json({ 
        error: 'Error clearing book transactions: ' + bookError.message 
      }, { status: 500 });
    } else {
      console.log('Successfully cleared book_transactions:', bookData);
    }

    console.log('All transactions cleared successfully for user:', userId);

    return NextResponse.json({ 
      success: true,
      message: 'All transactions cleared successfully',
      cleared: {
        bankSync: bankSyncData?.length || 0,
        bank: bankData?.length || 0,
        book: bookData?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Error clearing transactions:', error);
    return NextResponse.json(
      { error: `Error clearing transactions: ${error}` },
      { status: 500 }
    );
  }
}
