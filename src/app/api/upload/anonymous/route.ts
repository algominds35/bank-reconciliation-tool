import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { storeTemporaryResults, cleanupExpiredResults } from '@/lib/temporaryStorage';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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

// Function to parse OFX file
async function parseOFXFile(file: File): Promise<Transaction[]> {
  try {
    console.log('Parsing OFX file:', file.name, file.size, 'bytes');
    
    const text = await file.text();
    const transactions: Transaction[] = [];
    
    // Simple OFX parsing - look for STMTTRN (statement transactions)
    const stmttrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    let match;
    
    while ((match = stmttrnRegex.exec(text)) !== null) {
      const transactionData = match[1];
      
      // Extract transaction details
      const dateMatch = transactionData.match(/<DTPOSTED>(\d{8})/);
      const amountMatch = transactionData.match(/<TRNAMT>([+-]?\d+\.?\d*)/);
      const descriptionMatch = transactionData.match(/<NAME>([^<]+)/);
      const typeMatch = transactionData.match(/<TRNTYPE>([^<]+)/);
      
      if (dateMatch && amountMatch && descriptionMatch) {
        const dateStr = dateMatch[1];
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const formattedDate = `${year}-${month}-${day}`;
        
        const amount = parseFloat(amountMatch[1]);
        const description = descriptionMatch[1].trim();
        const type = typeMatch ? typeMatch[1] : (amount > 0 ? 'CREDIT' : 'DEBIT');
        
        transactions.push({
          id: `ofx_${Date.now()}_${transactions.length}`,
          amount: Math.abs(amount), // Make positive for consistency
          description: description,
          date: formattedDate,
          type: type,
          reference: `OFX_${transactions.length}`
        });
      }
    }
    
    console.log(`Parsed ${transactions.length} transactions from OFX file`);
    return transactions;
    
  } catch (error) {
    console.error('Error parsing OFX file:', error);
    throw new Error(`Failed to parse OFX file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to convert Excel file to CSV string
async function convertExcelToCSV(file: File): Promise<string> {
  try {
    console.log('Converting Excel file:', file.name, file.size, 'bytes');
    
    const buffer = await file.arrayBuffer();
    console.log('Buffer size:', buffer.byteLength);
    
    if (buffer.byteLength === 0) {
      throw new Error('Excel file appears to be empty');
    }
    
    // Read Excel file with better error handling
    const workbook = XLSX.read(buffer, { 
      type: 'buffer',
      cellDates: true,
      cellNF: false,
      cellText: false
    });
    
    console.log('Workbook sheets:', workbook.SheetNames);
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('No worksheets found in Excel file');
    }
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      throw new Error('First worksheet is empty or corrupted');
    }
    
    console.log('Worksheet range:', worksheet['!ref']);
    
    // Convert to CSV with proper options
    const csvString = XLSX.utils.sheet_to_csv(worksheet, {
      blankrows: false,
      skipHidden: true
    });
    
    console.log('Excel file converted to CSV:', csvString.length, 'characters');
    console.log('First 200 chars of CSV:', csvString.substring(0, 200));
    
    if (csvString.length === 0) {
      throw new Error('Excel file appears to be empty after conversion');
    }
    
    // Validate that we have actual CSV content, not binary garbage
    if (csvString.includes('PK=') || csvString.includes('<?xml') || csvString.includes('drawing')) {
      throw new Error('Excel file appears to be corrupted or contains binary data');
    }
    
    return csvString;
  } catch (error) {
    console.error('Error converting Excel to CSV:', error);
    throw new Error(`Failed to convert Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseCSV(csvContent: string): Transaction[] {
  console.log('Starting CSV parsing with Papa Parse...');
  
  const transactions: Transaction[] = [];
  
  try {
    // Check if this is pipe-separated data in a single column
    const lines = csvContent.split('\n').filter(line => line.trim());
    const firstLine = lines[0];
    
    if (firstLine && firstLine.includes('|') && !firstLine.includes(',')) {
      console.log('Detected pipe-separated data, converting to CSV format');
      
      // Convert pipe-separated to CSV format
      const csvLines = lines.map(line => {
        // Remove "Row X: " prefix if present
        const cleanLine = line.replace(/^Row \d+: /, '');
        // Replace pipes with commas
        return cleanLine.replace(/\|/g, ',');
      });
      
      // Add header row
      csvLines.unshift('date,description,amount,type,category');
      
      // Recreate CSV content
      const newCsvContent = csvLines.join('\n');
      console.log('Converted pipe-separated data to CSV:', newCsvContent.substring(0, 200));
      
      // Parse the converted CSV
      const results = Papa.parse(newCsvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        transform: (value: string) => value?.trim() || '',
      });
      
      return processParsedResults(results);
    }
    
    // Use Papa Parse for normal CSV parsing
    const results = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transform: (value: string) => value?.trim() || '',
    });
    
    return processParsedResults(results);
    
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw new Error('Failed to parse CSV file');
  }
}

function processParsedResults(results: any): Transaction[] {
  const transactions: Transaction[] = [];
  
  console.log('Papa Parse results:', {
    data: results.data.length,
    errors: results.errors.length,
    meta: results.meta
  });
  
  if (results.errors.length > 0) {
    console.warn('Papa Parse errors:', results.errors);
  }
  
    // Auto-detect column mapping
    const columns = results.meta.fields || [];
    console.log('Detected columns:', columns);
    console.log('DEBUG: Looking for date field in columns:', columns);
  
  let dateField = '';
  let amountField = '';
  let descriptionField = '';
  
    // Smart column detection - expanded to handle more formats
    columns.forEach((col: string) => {
      const lowerCol = col.toLowerCase();
      
      // Date field detection (more variations)
      if (!dateField && (
        lowerCol.includes('date') || 
        lowerCol.includes('posted dt') ||
        lowerCol.includes('transaction date') ||
        lowerCol.includes('doc dt') ||
        lowerCol.includes('effective date') ||
        lowerCol.includes('posted') ||
        lowerCol === 'dt'
      )) {
        dateField = col;
      }
      
      // Amount field detection (more variations)
      if (!amountField && (
        lowerCol.includes('amount') || 
        lowerCol.includes('txn amt') ||
        lowerCol.includes('value') || 
        lowerCol.includes('total') || 
        lowerCol.includes('debit') || 
        lowerCol.includes('credit') ||
        lowerCol.includes('balance') ||
        lowerCol === 'amt' ||
        lowerCol === 'txn'
      )) {
        amountField = col;
      }
      
      // Description field detection (more variations)
      if (!descriptionField && (
        lowerCol.includes('description') || 
        lowerCol.includes('memo') || 
        lowerCol.includes('note') || 
        lowerCol.includes('details') || 
        lowerCol.includes('reference') ||
        lowerCol.includes('doc') ||
        lowerCol.includes('memo/description') ||
        lowerCol.includes('memo/') ||
        lowerCol === 'memo'
      )) {
        descriptionField = col;
      }
    });
  
  // Fallback to first 3 columns if detection fails
  if (!dateField && columns.length > 0) dateField = columns[0];
  if (!amountField && columns.length > 1) amountField = columns[1];
  if (!descriptionField && columns.length > 2) descriptionField = columns[2];
  
  console.log('Column mapping:', { dateField, amountField, descriptionField });
  
  // Process each row
  results.data.forEach((row: any, index: number) => {
    try {
      const date = row[dateField] || '';
      const amountStr = row[amountField] || '';
      const description = row[descriptionField] || 'Transaction';
      
      // Clean and parse amount
      const cleanAmount = amountStr.toString().replace(/[^-\d.,]/g, '').replace(',', '');
      const amount = parseFloat(cleanAmount);
      
      // Skip if no valid amount
      if (isNaN(amount) || amount === 0) {
        return;
      }
      
      // Clean description
      const cleanDescription = description.toString().substring(0, 200).trim();
      
      // Parse date (try multiple formats)
      let parsedDate = '';
      if (date) {
        const dateStr = date.toString();
        // Try common date formats
        const formats = [
          /(\d{4}-\d{2}-\d{2})/, // YYYY-MM-DD
          /(\d{2}\/\d{2}\/\d{4})/, // MM/DD/YYYY
          /(\d{2}-\d{2}-\d{4})/, // MM-DD-YYYY
          /(\d{1,2}\/\d{1,2}\/\d{4})/, // M/D/YYYY
        ];
        
        for (const format of formats) {
          const match = dateStr.match(format);
          if (match) {
            parsedDate = match[1];
            break;
          }
        }
        
        if (!parsedDate) {
          parsedDate = new Date().toISOString().split('T')[0];
        }
      } else {
        parsedDate = new Date().toISOString().split('T')[0];
      }
      
      transactions.push({
        id: `txn_${index}_${Date.now()}`,
        amount,
        description: cleanDescription,
        date: parsedDate,
        type: amount > 0 ? 'Credit' : 'Debit',
        reference: '',
      });
      
    } catch (rowError) {
      console.warn(`Error processing row ${index}:`, rowError);
    }
  });
  
  console.log(`Successfully parsed ${transactions.length} transactions`);
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
    
    // Check file type (support CSV, TXT, and Excel files)
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.csv', '.txt', '.xlsx', '.xls', '.ofx', '.qfx'];
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidFile) {
      console.log('Invalid file type:', file.name);
      return NextResponse.json(
        { error: 'File must be a CSV, TXT, Excel, or OFX file (.xlsx, .xls, .ofx, .qfx)' },
        { status: 400 }
      );
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }
    
    // Check if file is empty
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      );
    }
    
    // Read and parse file (CSV or Excel)
    let csvContent: string;
    
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      console.log('Processing Excel file:', file.name);
      csvContent = await convertExcelToCSV(file);
    } else if (fileName.endsWith('.ofx') || fileName.endsWith('.qfx')) {
      console.log('Processing OFX file:', file.name);
      const ofxTransactions = await parseOFXFile(file);
      
      if (ofxTransactions.length === 0) {
        return NextResponse.json(
          { error: 'No transactions found in OFX file. Please check the file format.' },
          { status: 400 }
        );
      }
      
      // Convert OFX transactions to our standard format and store
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store the results temporarily
      storeTemporaryResults(sessionId, {
        transactions: ofxTransactions,
        duplicates: [],
        unmatched: ofxTransactions,
        timeSaved: ofxTransactions.length * 2,
        processedAt: new Date().toISOString(),
        summary: {
          totalTransactions: ofxTransactions.length,
          duplicatesFound: 0,
          unmatchedCount: ofxTransactions.length,
          timeSaved: ofxTransactions.length * 2
        }
      });
      
      // Clean up expired results
      cleanupExpiredResults();
      
      return NextResponse.json({
        sessionId,
        summary: {
          totalTransactions: ofxTransactions.length,
          duplicatesFound: 0,
          unmatchedCount: ofxTransactions.length,
          timeSaved: ofxTransactions.length * 2 // Estimate 2 minutes per transaction
        },
        transactions: ofxTransactions.slice(0, 50), // Return first 50 for preview
        message: `Successfully imported ${ofxTransactions.length} transactions from OFX file`
      });
    } else {
      console.log('Processing CSV/TXT file:', file.name);
      csvContent = await file.text();
    }
    
    console.log('File content length:', csvContent.length);
    console.log('First 200 chars:', csvContent.substring(0, 200));
    
    const transactions = parseCSV(csvContent);
    console.log('Parsed transactions:', transactions.length);
    
    if (transactions.length === 0) {
      console.log('No valid transactions found');
      return NextResponse.json(
        { 
          error: 'No valid transactions found in your file. Please ensure your CSV has:',
          details: [
            '• Date column (Date, Posted dt., Doc dt., Transaction Date, etc.)',
            '• Amount column (Amount, Txn amt, Value, Total, Debit, Credit, Balance, etc.)',
            '• Description column (Description, Memo/Description, Memo, Details, Doc, etc.)',
            '• Valid numeric amounts (not empty or zero)'
          ],
          suggestion: 'Download our sample CSV to see the correct format'
        },
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
    const summary = {
      totalTransactions: transactions.length,
      duplicatesFound: duplicates.length,
      unmatchedCount: unmatched.length,
      timeSaved,
    };
    
    const results = {
      transactions,
      duplicates,
      unmatched,
      timeSaved,
      processedAt: new Date().toISOString(),
      summary,
    };
    
    storeTemporaryResults(sessionId, results);
    
    // Clean up expired results
    cleanupExpiredResults();
    
    return NextResponse.json({
      sessionId,
      summary,
      transactions: transactions.slice(0, 10), // Return first 10 transactions for preview
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

