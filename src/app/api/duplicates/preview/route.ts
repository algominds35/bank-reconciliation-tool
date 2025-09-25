import { NextRequest, NextResponse } from 'next/server';
import { dedupePreview, DEFAULT_SETTINGS, DedupeSettings, Txn } from '@/lib/duplicateDetection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactions, settings = DEFAULT_SETTINGS } = body;

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Invalid transactions data' },
        { status: 400 }
      );
    }

    // Validate transaction format
    const validTxns: Txn[] = transactions.map((txn: any, index: number) => ({
      id: txn.id || `txn_${index}`,
      date: txn.date,
      amount: parseFloat(txn.amount),
      type: txn.type as 'income' | 'expense',
      description: txn.description,
      category: txn.category,
      bank_reference_id: txn.bank_reference_id,
      check_number: txn.check_number,
      created_at: txn.created_at || new Date().toISOString()
    }));

    // Process duplicates
    const startTime = Date.now();
    const duplicateGroups = dedupePreview(validTxns, settings as DedupeSettings);
    const processingTime = Date.now() - startTime;

    // Calculate summary statistics
    const definiteCount = duplicateGroups.filter(g => g.label === 'definite').length;
    const possibleCount = duplicateGroups.filter(g => g.label === 'possible').length;
    const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.txns.length, 0);

    return NextResponse.json({
      success: true,
      duplicateGroups,
      summary: {
        total_transactions: validTxns.length,
        duplicate_groups: duplicateGroups.length,
        definite_duplicates: definiteCount,
        possible_duplicates: possibleCount,
        total_duplicate_transactions: totalDuplicates,
        processing_time_ms: processingTime
      },
      settings_used: settings
    });

  } catch (error) {
    console.error('Error processing duplicate preview:', error);
    return NextResponse.json(
      { error: 'Failed to process duplicate detection' },
      { status: 500 }
    );
  }
}
