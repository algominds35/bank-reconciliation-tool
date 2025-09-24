import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { temporaryResults } from '../anonymous/route';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId } = await request.json();
    
    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'Session ID and User ID are required' },
        { status: 400 }
      );
    }
    
    // Get temporary results
    const results = temporaryResults.get(sessionId);
    
    if (!results) {
      return NextResponse.json(
        { error: 'Session expired or not found' },
        { status: 404 }
      );
    }
    
    // Check if results have expired
    if (results.expiresAt < Date.now()) {
      temporaryResults.delete(sessionId);
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 410 }
      );
    }
    
    // Save reconciliation to user's account
    const { data: reconciliation, error: reconciliationError } = await supabase
      .from('reconciliations')
      .insert({
        user_id: userId,
        total_transactions: results.transactions.length,
        duplicates_found: results.duplicates.length,
        unmatched_count: results.unmatched.length,
        time_saved_hours: results.timeSaved || 0,
        raw_data: {
          transactions: results.transactions,
          duplicates: results.duplicates,
          unmatched: results.unmatched,
        },
        processed_at: results.processedAt,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (reconciliationError) {
      console.error('Error saving reconciliation:', reconciliationError);
      return NextResponse.json(
        { error: 'Failed to save reconciliation' },
        { status: 500 }
      );
    }
    
    // Save individual transactions
    const transactionsToInsert = results.transactions.map((transaction: any) => ({
      reconciliation_id: reconciliation.id,
      user_id: userId,
      external_id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      transaction_date: transaction.date,
      transaction_type: transaction.type || 'Unknown',
      reference: transaction.reference || '',
      is_duplicate: results.duplicates.some((dup: any) => dup.id === transaction.id),
      is_unmatched: results.unmatched.some((unm: any) => unm.id === transaction.id),
      raw_data: transaction,
      created_at: new Date().toISOString(),
    }));
    
    const { error: transactionsError } = await supabase
      .from('transactions')
      .insert(transactionsToInsert);
    
    if (transactionsError) {
      console.error('Error saving transactions:', transactionsError);
      // Don't fail the whole operation, just log the error
    }
    
    // Clean up temporary results
    temporaryResults.delete(sessionId);
    
    return NextResponse.json({
      success: true,
      reconciliationId: reconciliation.id,
      message: 'Results transferred successfully',
    });
    
  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: 'Failed to transfer results' },
      { status: 500 }
    );
  }
}
