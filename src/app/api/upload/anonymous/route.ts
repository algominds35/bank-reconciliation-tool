import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { storeTemporaryResults, cleanupExpiredResults } from '@/lib/temporaryStorage';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type?: string;
  reference?: string;
}

function parseCSV(csvContent: string): Transaction[] {
  const lines = csvContent.split('\n');
  const transactions: Transaction[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Basic CSV parsing (handle quoted fields)
    const fields = line.split(',').map(field => 
      field.startsWith('"') && field.endsWith('"') 
        ? field.slice(1, -1) 
        : field
    );
    
    if (fields.length >= 3) {
      const amount = parseFloat(fields[1]?.replace(/[^-\d.]/g, '') || '0');
      const date = fields[0] || new Date().toISOString().split('T')[0];
      const description = fields[2] || 'Unknown Transaction';
      
      if (!isNaN(amount) && amount !== 0) {
        transactions.push({
          id: `txn_${i}_${Date.now()}`,
          amount,
          description,
          date,
          type: fields[3] || 'Unknown',
          reference: fields[4] || '',
        });
      }
    }
  }
  
  return transactions;
}

function findDuplicates(transactions: Transaction[]): Transaction[] {
  const duplicates: Transaction[] = [];
  const seen = new Map<string, Transaction[]>();
  
  // Group transactions by amount and description similarity
  transactions.forEach(transaction => {
    const key = `${transaction.amount}_${transaction.description.toLowerCase().trim()}`;
    
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    
    seen.get(key)!.push(transaction);
  });
  
  // Find groups with more than one transaction (potential duplicates)
  seen.forEach(group => {
    if (group.length > 1) {
      // Add all but the first one as duplicates
      duplicates.push(...group.slice(1));
    }
  });
  
  return duplicates;
}

function findUnmatched(transactions: Transaction[]): Transaction[] {
  // For demo purposes, return a random subset as "unmatched"
  // In a real implementation, this would compare against another data source
  const shuffled = [...transactions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(5, Math.floor(transactions.length * 0.1)));
}

function calculateTimeSaved(transactionCount: number): number {
  // Estimate: 30 seconds per transaction for manual reconciliation
  return (transactionCount * 0.5) / 60; // Convert to hours
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('csv') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No CSV file provided' },
        { status: 400 }
      );
    }
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV file' },
        { status: 400 }
      );
    }
    
    // Read and parse CSV file
    const csvContent = await file.text();
    const transactions = parseCSV(csvContent);
    
    if (transactions.length === 0) {
      return NextResponse.json(
        { error: 'No valid transactions found in CSV file' },
        { status: 400 }
      );
    }
    
    // Process transactions
    const duplicates = findDuplicates(transactions);
    const unmatched = findUnmatched(transactions);
    const timeSaved = calculateTimeSaved(transactions.length);
    
    // Generate temporary session ID
    const sessionId = crypto.randomUUID();
    
    // Store results temporarily (24 hours)
    const results = {
      transactions,
      duplicates,
      unmatched,
      timeSaved,
      processedAt: new Date().toISOString(),
    };
    
    storeTemporaryResults(sessionId, results);
    
    // Clean up expired results
    cleanupExpiredResults();
    
    return NextResponse.json({
      sessionId,
      summary: {
        totalTransactions: transactions.length,
        duplicatesFound: duplicates.length,
        unmatchedCount: unmatched.length,
        timeSaved,
      },
      duplicates: duplicates.slice(0, 10), // Return first 10 for preview
      unmatched: unmatched.slice(0, 10), // Return first 10 for preview
    });
    
  } catch (error) {
    console.error('CSV processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
}

