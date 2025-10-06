import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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
  category?: string;
  reference?: string;
}

// Function to parse messy multi-month CSV format
function parseMessyMultiMonthCSV(content: string): Transaction[] {
  console.log('🔧 Parsing messy multi-month CSV format...');
  
  const transactions: Transaction[] = [];
  const rows = content.split('\n');
  
  // Define months to look for
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Define patterns to skip
  const skipPatterns = [
    'TOTAL ALL', 'TOTAL GL', 'HIGHLIGHTED = PAID', 'NOT HIGHLIGHTED = ROLL FORWARD',
    'PRIVATE', 'OOP', 'ok', 'SPIN', 'HIGHLIGHTED', 'NOT HIGHLIGJTED'
  ];
  
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex].trim();
    
    // Skip empty rows
    if (!row) continue;
    
    // Skip rows with skip patterns
    if (skipPatterns.some(pattern => row.includes(pattern))) {
      console.log(`⏭️ Skipping row ${rowIndex + 1}: contains skip pattern`);
      continue;
    }
    
    // Parse CSV row (handle quoted fields)
    const cells = parseCSVRow(row);
    console.log(`🔍 Processing row ${rowIndex + 1}: ${cells.length} cells`);
    
    // Look for month patterns in the row
    let i = 0;
    while (i < cells.length) {
      const cell = cells[i]?.trim();
      
      // Check if this cell is a month
      if (cell && months.includes(cell)) {
        const month = cell;
        const name = cells[i + 1]?.replace(/"/g, '').trim();
        const amountStr = cells[i + 2]?.replace(/"/g, '').replace(/,/g, '').trim();
        
        // Validate we have name and amount
        if (name && amountStr && !skipPatterns.some(pattern => name.includes(pattern))) {
          const amount = parseFloat(amountStr);
          
          if (!isNaN(amount) && amount !== 0) {
            // Convert month name to proper date (using current year, first day of month)
            const monthToDate = (monthName: string) => {
              const monthMap: { [key: string]: number } = {
                'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
              };
              const currentYear = new Date().getFullYear();
              const monthIndex = monthMap[monthName];
              if (monthIndex !== undefined) {
                return new Date(currentYear, monthIndex, 1).toISOString().split('T')[0];
              }
              return monthName; // Fallback to original if not found
            };
            
            transactions.push({
              id: crypto.randomUUID(),
              date: monthToDate(month),
              description: name,
              amount: amount,
              type: amount > 0 ? 'Credit' : 'Debit',
              category: 'Unknown'
            });
            
            console.log(`✅ Extracted: ${month} - ${name} - $${amount} (converted to ${monthToDate(month)})`);
          }
        }
        
        i += 3; // Move to next month triplet
      } else {
        i++; // Skip non-month cells
      }
    }
  }
  
  console.log(`🎯 Messy CSV parser extracted ${transactions.length} transactions`);
  return transactions;
}

// Helper function to parse CSV row handling quotes
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Add the last field
  return result;
}

// Function to parse OFX file
async function parseOFXFile(file: File): Promise<Transaction[]> {
  try {
    console.log('Parsing OFX file:', file.name, file.size, 'bytes');
    const text = await file.text();
    
    const transactions: Transaction[] = [];
    
    // Parse OFX transactions
    const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    let match;
    
    while ((match = stmtTrnRegex.exec(text)) !== null) {
      const transactionBlock = match[1];
      
      // Extract date
      const dateMatch = transactionBlock.match(/<DTPOSTED>(\d{8})/);
      const date = dateMatch ? dateMatch[1] : '';
      
      // Extract amount
      const amountMatch = transactionBlock.match(/<TRNAMT>([-\d.]+)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
      
      // Extract description
      const descMatch = transactionBlock.match(/<NAME>([^<]+)/);
      const description = descMatch ? descMatch[1].trim() : '';
      
      // Extract transaction type
      const typeMatch = transactionBlock.match(/<TRNTYPE>([^<]+)/);
      const type = typeMatch ? typeMatch[1].toLowerCase() : '';
      
      if (date && amount !== 0 && description) {
        transactions.push({
          id: `ofx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: `${date.substring(0,4)}-${date.substring(4,6)}-${date.substring(6,8)}`,
          amount,
          description,
          type,
          category: '',
          reference: ''
        });
      }
    }
    
    console.log(`Parsed ${transactions.length} OFX transactions`);
    return transactions;
  } catch (error) {
    console.error('Error parsing OFX file:', error);
    throw new Error('Failed to parse OFX file');
  }
}

function parseCSV(csvContent: string): Transaction[] {
  const transactions: Transaction[] = [];
  
  try {
    const results = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });

    console.log('Papa Parse results:', {
      data: results.data.length,
      errors: results.errors.length,
      meta: results.meta
    });

    if (results.errors.length > 0) {
      console.warn('CSV parsing errors:', results.errors);
    }

    const headers = results.meta.fields || [];
    console.log('Detected columns:', headers);

    // Auto-detect column names
    let dateField = '';
    let amountField = '';
    let descriptionField = '';

    console.log('DEBUG: Looking for date field in columns:', headers);
    
    // Find date field
    for (const header of headers) {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('date') || lowerHeader.includes('posted') || lowerHeader.includes('doc dt')) {
        dateField = header;
        break;
      }
    }

    // Find amount field
    for (const header of headers) {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('amount') || lowerHeader.includes('txn amt') || lowerHeader.includes('value') || 
          lowerHeader.includes('total') || lowerHeader.includes('debit') || lowerHeader.includes('credit') || 
          lowerHeader.includes('balance')) {
        amountField = header;
        break;
      }
    }

    // Find description field
    for (const header of headers) {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('description') || lowerHeader.includes('memo') || lowerHeader.includes('details') || 
          lowerHeader.includes('doc') || lowerHeader.includes('payee')) {
        descriptionField = header;
        break;
      }
    }

    console.log('Column mapping:', {
      dateField,
      amountField,
      descriptionField
    });

    // Process each row
    for (const row of results.data as any[]) {
      if (!row[dateField] || !row[amountField] || !row[descriptionField]) {
        continue;
      }

      // Parse amount - handle various formats
      let amount = 0;
      const amountStr = String(row[amountField]).trim();
      
      if (amountStr) {
        // Remove currency symbols and commas
        const cleanAmount = amountStr.replace(/[$,\s]/g, '');
        const parsed = parseFloat(cleanAmount);
        if (!isNaN(parsed)) {
          amount = parsed;
        }
      }

      // Skip zero amounts
      if (amount === 0) {
        continue;
      }

      // Parse date
      let date = row[dateField];
      if (date) {
        // Handle various date formats
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          date = dateObj.toISOString().split('T')[0];
        }
      }

      transactions.push({
        id: `csv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date,
        amount,
        description: String(row[descriptionField]).trim(),
        category: row.category || '',
        reference: row.reference || ''
      });
    }

    console.log(`Successfully parsed ${transactions.length} transactions`);
    return transactions;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file');
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('CSV upload request received');
    
    const formData = await request.formData();
    const file = formData.get('csv') as File;
    const userId = formData.get('userId') as string;
    const messyCSVMode = formData.get('messyCSVMode') === 'true';
    
    console.log('API: Received userId:', userId);
    console.log('API: File name:', file?.name);
    console.log('API: Messy CSV mode:', messyCSVMode);
    
    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No CSV file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, file.size, 'bytes');
    
    const validExtensions = ['.csv', '.txt', '.xlsx', '.xls', '.ofx', '.qfx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${fileExtension}. Please upload a CSV, Excel, or OFX file.` },
        { status: 400 }
      );
    }

    let transactions: Transaction[] = [];

    if (fileExtension === '.ofx' || fileExtension === '.qfx') {
      console.log('Processing OFX/QFX file:', file.name);
      transactions = await parseOFXFile(file);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      console.log('Processing Excel file:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      transactions = parseCSV(csvContent);
    } else {
      console.log('Processing CSV/TXT file:', file.name);
      const csvContent = await file.text();
      console.log('File content length:', csvContent.length);
      console.log('First 200 chars:', csvContent.substring(0, 200));
      
      // Check if this looks like messy multi-month format OR if user explicitly enabled messy mode
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
      const hasMultipleMonths = months.filter(month => csvContent.includes(month)).length >= 3;
      const hasQuotedNames = csvContent.includes('"') && csvContent.includes(',');
      const hasSkipPatterns = ['TOTAL ALL', 'HIGHLIGHTED', 'PRIVATE'].some(pattern => csvContent.includes(pattern));
      
      if (messyCSVMode || (hasMultipleMonths && hasQuotedNames && hasSkipPatterns)) {
        console.log('🔧 Using messy multi-month parser (user enabled or auto-detected)');
        transactions = parseMessyMultiMonthCSV(csvContent);
      } else {
        console.log('📊 Using standard CSV parser');
        transactions = parseCSV(csvContent);
      }
      
      console.log('Parsed transactions:', transactions.length);
    }

    if (transactions.length === 0) {
      console.log('No valid transactions found');
      return NextResponse.json(
        { error: 'No valid transactions found in your file' },
        { status: 400 }
      );
    }

    // Enhanced duplicate detection against existing database records AND within the same file
    let newTransactions = transactions;
    let duplicates: Transaction[] = [];
    
    console.log('API: About to check duplicates. userId:', userId, 'transactions count:', transactions.length);
    
    // ALWAYS run intra-file duplicate detection (duplicates within the same file)
    console.log('API: Running intra-file duplicate detection...');
    const seenInFile = new Map<string, boolean>();
    newTransactions = [];
    duplicates = [];
    
    transactions.forEach((transaction, index) => {
      const key = `${transaction.date}_${transaction.amount}_${transaction.description?.toLowerCase().trim()}`;
      
      if (seenInFile.has(key)) {
        duplicates.push(transaction);
        console.log(`✅ Found duplicate within file: ${transaction.description} on ${transaction.date} for $${transaction.amount}`);
      } else {
        newTransactions.push(transaction);
        seenInFile.set(key, true);
        console.log(`✅ Adding new transaction: ${transaction.description} on ${transaction.date} for $${transaction.amount}`);
      }
    });
    
    console.log(`Intra-file duplicate detection: ${newTransactions.length} new, ${duplicates.length} duplicates within file`);
    
    if (userId) {
      console.log('API: Running enhanced duplicate detection against existing records...');
      
      // Get existing transactions from database for this user
      const { data: existingTransactions, error } = await supabase
        .from('bank_transactions_sync')
        .select('transaction_date, amount, description')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching existing transactions:', error);
        // If we can't check, assume all are new
      } else {
        // Create a lookup map for existing transactions
        const existingMap = new Map<string, boolean>();
        existingTransactions?.forEach(existing => {
          const key = `${existing.transaction_date}_${existing.amount}_${existing.description?.toLowerCase().trim()}`;
          existingMap.set(key, true);
        });

        // Check each new transaction against existing database records
        const finalNewTransactions: Transaction[] = [];
        const databaseDuplicates: Transaction[] = [];
        
        newTransactions.forEach((transaction, index) => {
          const key = `${transaction.date}_${transaction.amount}_${transaction.description?.toLowerCase().trim()}`;
          
          if (existingMap.has(key)) {
            databaseDuplicates.push(transaction);
            console.log(`✅ Found duplicate against database: ${transaction.description} on ${transaction.date} for $${transaction.amount}`);
          } else {
            finalNewTransactions.push(transaction);
            console.log(`✅ Adding new transaction: ${transaction.description} on ${transaction.date} for $${transaction.amount}`);
          }
        });
        
        // Update the arrays
        newTransactions = finalNewTransactions;
        duplicates = [...duplicates, ...databaseDuplicates]; // Combine intra-file and database duplicates

        console.log(`Enhanced duplicate detection: ${newTransactions.length} new, ${duplicates.length} duplicates (${duplicates.filter(d => existingMap.has(`${d.date}_${d.amount}_${d.description?.toLowerCase().trim()}`)).length} from database, ${duplicates.length - duplicates.filter(d => existingMap.has(`${d.date}_${d.amount}_${d.description?.toLowerCase().trim()}`)).length} within file)`);
        console.log(`Existing transactions in database: ${existingTransactions?.length || 0}`);
        console.log(`Total transactions in upload: ${transactions.length}`);
      }
    } else {
      console.log('API: No userId provided, skipping duplicate detection. All transactions will be processed.');
    }

    // Insert only NEW transactions into database if user ID is provided
    let insertedCount = 0;
    if (userId && newTransactions.length > 0) {
      console.log(`Inserting ${newTransactions.length} new transactions into database...`);

      // First, ensure user has a default bank account
      let bankAccountId = userId;
      const { data: existingAccount } = await supabase
        .from('bank_accounts')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (!existingAccount || existingAccount.length === 0) {
        // Create a default bank account for manual uploads
        const { data: newAccount, error: accountError } = await supabase
          .from('bank_accounts')
          .insert({
            user_id: userId,
            account_id: `manual_${userId}`,
            bank_name: 'Manual Upload Account',
            account_type: 'checking',
            status: 'active',
            last_sync: new Date().toISOString()
          })
          .select('id')
          .single();

        if (accountError) {
          console.error('Error creating bank account:', accountError);
          return NextResponse.json({ 
            error: 'Failed to create bank account for transactions' 
          }, { status: 500 });
        }
        bankAccountId = newAccount.id;
      } else {
        bankAccountId = existingAccount[0].id;
      }

      // Insert transactions into bank_transactions_sync table
      for (const transaction of transactions) {
        try {
          const insertData = {
            user_id: userId,
            bank_account_id: bankAccountId,
            stripe_transaction_id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: transaction.amount,
            currency: 'usd',
            description: transaction.description,
            transaction_date: transaction.date,
            transaction_type: transaction.amount > 0 ? 'credit' : 'debit',
            category: transaction.category || null,
            reference: transaction.reference || null,
            is_reconciled: false,
            raw_data: { source: 'manual_upload', original_transaction: transaction }
          };

          const { error } = await supabase
            .from('bank_transactions_sync')
            .insert(insertData);

          if (error) {
            console.error('Error inserting transaction:', error);
            // Continue with other transactions
          } else {
            insertedCount++;
          }
        } catch (insertError) {
          console.error('Error processing transaction:', insertError);
          // Continue with other transactions
        }
      }

      console.log(`Successfully inserted ${insertedCount} transactions into database`);
    }

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      sessionId,
      transactions: newTransactions.slice(0, 10), // Return first 10 new transactions for preview
      message: `Successfully uploaded ${transactions.length} transactions. ${duplicates.length} duplicates found.`,
      insertedCount,
      duplicates: duplicates.length,
      totalProcessed: transactions.length,
      newTransactions: newTransactions.length
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}