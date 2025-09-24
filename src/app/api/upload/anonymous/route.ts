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
  
  // Try to detect header row
  let startRow = 1;
  const firstLine = lines[0]?.toLowerCase() || '';
  if (firstLine.includes('date') || firstLine.includes('amount') || firstLine.includes('description')) {
    startRow = 1; // Skip header
  } else {
    startRow = 0; // No header, start from first row
  }
  
  for (let i = startRow; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // More robust CSV parsing
    const fields = parseCSVLine(line);
    
    if (fields.length >= 2) {
      // Try different field orders - date, amount, description
      let amount = 0;
      let date = '';
      let description = 'Unknown Transaction';
      let type = 'Unknown';
      let reference = '';
      
      // Find amount (look for numeric values)
      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        const numValue = parseFloat(field.replace(/[^-\d.]/g, ''));
        if (!isNaN(numValue) && numValue !== 0) {
          amount = numValue;
          break;
        }
      }
      
      // Find date (look for date-like patterns)
      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        if (field.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/) || field.match(/\d{4}-\d{2}-\d{2}/)) {
          date = field;
          break;
        }
      }
      
      // Use first field as date if no date found
      if (!date && fields[0]) {
        date = fields[0];
      }
      
      // Find description (longest text field)
      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        if (field.length > description.length && !field.match(/^\d+$/)) {
          description = field;
        }
      }
      
      // Add transaction if we have valid amount
      if (!isNaN(amount) && amount !== 0) {
        transactions.push({
          id: `txn_${i}_${Date.now()}`,
          amount,
          description: description.substring(0, 100), // Limit description length
          date: date || new Date().toISOString().split('T')[0],
          type,
          reference,
        });
      }
    }
  }
  
  return transactions;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  fields.push(current.trim());
  return fields;
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
    console.log('CSV upload request received');
    
    const formData = await request.formData();
    const file = formData.get('csv') as File;
    
    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No CSV file provided' },
        { status: 400 }
      );
    }
    
    console.log('File received:', file.name, file.size, 'bytes');
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      console.log('Invalid file type:', file.name);
      return NextResponse.json(
        { error: 'File must be a CSV file' },
        { status: 400 }
      );
    }
    
    // Read and parse CSV file
    const csvContent = await file.text();
    console.log('CSV content length:', csvContent.length);
    console.log('First 200 chars:', csvContent.substring(0, 200));
    
    const transactions = parseCSV(csvContent);
    console.log('Parsed transactions:', transactions.length);
    
    if (transactions.length === 0) {
      console.log('No valid transactions found');
      return NextResponse.json(
        { error: 'No valid transactions found in CSV file. Please check that your CSV has columns for date, amount, and description.' },
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

