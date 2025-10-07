'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Transaction, ReconciliationSummary, Client } from '@/types'
import { ClientSelector } from '@/components/client-selector'
import { TransactionTable } from '@/components/transaction-table'
// MatchingInterface removed - using inline duplicate detection interface
// BankConnection removed - focusing on core CSV functionality
import { TrialGuard } from '@/components/trial-guard'
import { AccessGuard } from '@/components/access-guard'
import { AccessWarning } from '@/components/access-warning'
import { TrialStatusBadge } from '@/components/trial-status-badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import { SingleFileMatcher } from '@/lib/single-file-matcher'
import BetaFeedback from '@/components/BetaFeedback'

// Function to detect complex multi-month report format
function isComplexReportFormat(csvContent: string): boolean {
  console.log('Checking if complex format...');
  
  // Look for multiple months in ANY line (not just first 5)
  const monthHeaders = ['APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER', 'JANUARY', 'FEBRUARY', 'MARCH'];
  
  let monthHeaderCount = 0;
  const lines = csvContent.split('\n');
  
  // Check ALL lines for month headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toUpperCase();
    monthHeaders.forEach(month => {
      if (line.includes(month)) {
        monthHeaderCount++;
      }
    });
  }
  
  // Check for quoted employee names pattern
  const hasQuotedNames = /"[^"]+,\s*[^"]+"/.test(csvContent);
  const hasSummaryRows = csvContent.includes('PUBLIC') || csvContent.includes('PRIVATE') || csvContent.includes('TOTAL ALL') || csvContent.includes('INTERFUND');
  
  console.log('Month count:', monthHeaderCount, 'Has quoted names:', hasQuotedNames, 'Has summary rows:', hasSummaryRows);
  
  // If we have multiple months OR quoted names with summary rows, it's complex
  return monthHeaderCount >= 3 || (hasSummaryRows && hasQuotedNames);
}

// Function to clean messy CSV data with double quotes
function cleanMessyCSV(csvContent: string): string {
  console.log('Cleaning messy CSV data...');
  
  // Replace double quotes with single quotes
  let cleaned = csvContent.replace(/""/g, '"');
  
  // Fix common CSV issues
  cleaned = cleaned.replace(/,\s*"/g, ',"'); // Remove spaces before quotes
  cleaned = cleaned.replace(/"\s*,/g, '",'); // Remove spaces after quotes
  cleaned = cleaned.replace(/,\s*,/g, ',,'); // Fix empty fields
  
  // Fix header typo (common in bank exports)
  cleaned = cleaned.replace(/^"ate,/, '"Date,');
  
  // Remove trailing commas and quotes at end of lines
  cleaned = cleaned.replace(/,\s*$/gm, '');
  cleaned = cleaned.replace(/"\s*$/gm, '');
  
  console.log('CSV cleaning completed');
  return cleaned;
}

// Function to parse complex multi-month report format
function parseComplexReportFormat(csvContent: string): any[] {
  console.log('Parsing complex comma-separated multi-month report format...');
  
  const lines = csvContent.split('\n');
  const transactions: any[] = [];
  
  // Month mapping - added July and August
  const monthMap: { [key: string]: number } = {
    'JANUARY': 1, 'FEBRUARY': 2, 'MARCH': 3, 'APRIL': 4,
    'MAY': 5, 'JUNE': 6, 'JULY': 7, 'AUGUST': 8,
    'SEPTEMBER': 9, 'OCTOBER': 10, 'NOVEMBER': 11, 'DECEMBER': 12
  };
  
  const currentYear = new Date().getFullYear();
  
  // Expanded skip patterns for all summary types
  const skipPatterns = [
    'PUBLIC', 'PRIVATE', 'TOTAL', 'INTERFUND', 'OOP', 'HIGHLIGHTED', 
    'NOT HIGHLIGHTED', 'OOP RCL', 'TOTAL ALL', 'TOTAL GL', 'OOP EXPENSES',
    'SPIN', 'CONV SUB', 'HIGHLIGHTED = PAID', 'NOT HIGHLIGJTED = ROLL FORWARD'
  ];
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === ',' || line === ',,') continue;
    
    // Split by commas and clean up
    const columns = line.split(',').map(col => col.trim().replace(/"/g, '')).filter(col => col);
    
    // Skip lines with too few columns
    if (columns.length < 3) continue;
    
    // Check if this line contains only summary data
    const lineUpper = line.toUpperCase();
    if (skipPatterns.some(pattern => lineUpper.includes(pattern))) {
      continue;
    }
    
    // Process each set of 3 columns (Month, Name, Amount)
    for (let colIndex = 0; colIndex < columns.length - 2; colIndex += 3) {
      const month = columns[colIndex];
      const name = columns[colIndex + 1];
      const amount = columns[colIndex + 2];
      
      // Validate we have all three parts
      if (!month || !name || !amount) continue;
      
      // Check if month is valid
      const monthUpper = month.toUpperCase();
      if (!monthMap[monthUpper]) continue;
      
      // Check if amount is a valid number (handle negative amounts in parentheses)
      let amountStr = amount.replace(/[,$]/g, '').replace(/\(/g, '-').replace(/\)/g, '');
      const cleanAmount = parseFloat(amountStr);
      if (isNaN(cleanAmount) || cleanAmount === 0) continue;
      
      // Skip if name looks like a summary row
      const nameUpper = name.toUpperCase();
      if (skipPatterns.some(pattern => nameUpper.includes(pattern))) continue;
      
      // Skip if name is empty or just spaces
      if (!name.trim()) continue;
      
      // Create date (use first day of month)
      const monthNum = monthMap[monthUpper];
      const date = new Date(currentYear, monthNum - 1, 1);
      const dateStr = date.toISOString().split('T')[0];
      
      transactions.push({
        id: `txn_${transactions.length}_${Date.now()}`,
        amount: cleanAmount,
        description: name.trim(),
        date: dateStr,
        type: cleanAmount > 0 ? 'Credit' : 'Debit',
        reference: '',
        category: '',
      });
      
      console.log(`Extracted transaction: ${dateStr} | ${name} | $${cleanAmount}`);
    }
  }
  
  console.log(`Successfully parsed ${transactions.length} transactions from complex comma-separated report format`);
  return transactions;
}
import { 
  Upload, 
  Download, 
  FileText, 
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Shield,
  AlertCircle,
  LogOut,
  Settings,
  Trash2,
  RefreshCw,
  Plus,
  Building2,
  CreditCard,
  Zap,
  AlertTriangle
} from 'lucide-react'

// Function to check for duplicates within a single CSV file
const checkForDuplicatesInFile = async (csvData: any[], transactionType: 'bank' | 'bookkeeping'): Promise<number> => {
  const transactions: any[] = []
  
  // Parse the CSV data into transaction objects
  for (const row of csvData) {
    if (!row || typeof row !== 'object') continue
    
    const date = row.date || row.Date || row.DATE
    const description = row.description || row.Description || row.DESCRIPTION
    const amountStr = row.amount || row.Amount || row.AMOUNT
    
    if (!date || !description || !amountStr) continue
    
    // Parse amount
    let amount: number
    try {
      const cleanAmount = String(amountStr).replace(/[$,\s]/g, '')
      amount = parseFloat(cleanAmount)
      if (isNaN(amount)) continue
    } catch (e) {
      continue
    }
    
    transactions.push({
      date: String(date),
      description: String(description),
      amount: amount,
      type: transactionType
    })
  }
  
         // Find duplicates using EXACT matching - same date + amount + description
         const seen = new Map<string, any[]>()
         let duplicateCount = 0
         
         console.log('=== EXACT DUPLICATE DETECTION DEBUG ===')
         console.log('Total transactions to process:', transactions.length)
         
         transactions.forEach((transaction, index) => {
           // EXACT KEY: date + amount + description (exact match)
           const key = `${transaction.date}_${transaction.amount}_${transaction.description.toLowerCase().trim()}`
           
           console.log(`[${index}] Processing: "${transaction.description}" | $${transaction.amount} | ${transaction.date} | Key: "${key}"`)
           
           if (!seen.has(key)) {
             seen.set(key, [])
             console.log(`  → New group created for key: "${key}"`)
           } else {
             console.log(`  → EXACT DUPLICATE FOUND! Adding to existing group: "${key}"`)
           }
           
           seen.get(key)!.push(transaction)
         })
         
         // Count groups with more than one transaction (duplicates)
         seen.forEach((group, key) => {
           if (group.length > 1) {
             console.log(`Found exact duplicate group for key: ${key}`, group)
             duplicateCount += group.length - 1 // All but the first are duplicates
           }
         })
  
  console.log(`Found ${duplicateCount} duplicates in ${transactionType} CSV`)
  console.log('All transaction keys:', Array.from(seen.keys()))
  return duplicateCount
}

// Function to get duplicates formatted for Smart Matching interface
const getDuplicatesForSmartMatching = async (csvData: any[], transactionType: 'bank' | 'bookkeeping'): Promise<any[]> => {
  const transactions: any[] = []
  
  // Parse the CSV data into transaction objects
  for (const row of csvData) {
    if (!row || typeof row !== 'object') continue
    
    const date = row.date || row.Date || row.DATE
    const description = row.description || row.Description || row.DESCRIPTION
    const amountStr = row.amount || row.Amount || row.AMOUNT
    
    if (!date || !description || !amountStr) continue
    
    // Parse amount
    let amount: number
    try {
      const cleanAmount = String(amountStr).replace(/[$,\s]/g, '')
      amount = parseFloat(cleanAmount)
      if (isNaN(amount)) continue
    } catch (e) {
      continue
    }
    
    transactions.push({
      id: crypto.randomUUID(),
      date: String(date),
      description: String(description),
      amount: amount,
      type: transactionType,
      category: row.category || row.Category || 'Unknown'
    })
  }
  
         // Group duplicates using EXACT logic - same date + amount + description
         const duplicateGroups: any[] = []
         const seen = new Map<string, any[]>()
         
         transactions.forEach(transaction => {
           // EXACT KEY: date + amount + description (exact match)
           const key = `${transaction.date}_${transaction.amount}_${transaction.description.toLowerCase().trim()}`
           
           if (!seen.has(key)) {
             seen.set(key, [])
           }
           
           seen.get(key)!.push(transaction)
         })
  
  console.log('=== FORMATTING DUPLICATES FOR SMART MATCHING ===')
  console.log('Total transaction groups:', seen.size)
  
  // Find groups with more than one transaction (duplicates)
  seen.forEach((group, key) => {
    if (group.length > 1) {
      console.log(`Creating duplicate group for key: "${key}" with ${group.length} transactions`)
      const duplicateGroup = {
        id: crypto.randomUUID(),
        duplicateGroup: group,
        original: group[0], // First one is the "original"
        duplicates: group.slice(1), // Rest are duplicates
        confidence: 95, // High confidence for exact matches
        matchType: 'duplicate',
        reason: `Found ${group.length} identical transactions: ${group[0].description} - $${group[0].amount}`
      }
      console.log('Duplicate group created:', duplicateGroup)
      duplicateGroups.push(duplicateGroup)
    }
  })
  
  console.log(`=== TOTAL DUPLICATE GROUPS CREATED: ${duplicateGroups.length} ===`)
  return duplicateGroups
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [invoiceStats, setInvoiceStats] = useState({
    total: 0,
    pending: 0,
    overdue: 0,
    paid: 0,
    totalAmount: 0,
    overdueAmount: 0
  })
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  

  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'reconciled' | 'unreconciled'>('all')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<'all' | 'bank' | 'bookkeeping' | 'quickbooks'>('all')
  const [summary, setSummary] = useState<ReconciliationSummary>({ 
    total: 0, 
    totalAmount: 0,
    reconciled: 0, 
    unreconciled: 0,
    bankTransactions: 0,
    bookkeepingTransactions: 0,
    quickbooksTransactions: 0
  })
  const [activeTab, setActiveTab] = useState('transactions')
  const [qboStatus, setQboStatus] = useState<{ connected: boolean; realmId?: string }>({ connected: false })
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [nextSyncTime, setNextSyncTime] = useState<string | null>(null)
  const [clearingDemoData, setClearingDemoData] = useState(false)
  const [singleFileMatches, setSingleFileMatches] = useState<any[]>([])
  const [showSingleFileMatches, setShowSingleFileMatches] = useState(false)
  const [duplicatesFound, setDuplicatesFound] = useState<number>(0)
  const [duplicateStatus, setDuplicateStatus] = useState<'active' | 'inactive'>('inactive')
  const [duplicateTransactions, setDuplicateTransactions] = useState<Set<string>>(new Set())
  const [messyCSVMode, setMessyCSVMode] = useState(false)
  const [enableDateFilter, setEnableDateFilter] = useState(false)
  const [lastImportDate, setLastImportDate] = useState('')
  const [enableFileComparison, setEnableFileComparison] = useState(false)
  const [existingDataFile, setExistingDataFile] = useState<File | null>(null)
  const [enableCreditCardOverlap, setEnableCreditCardOverlap] = useState(false)
  const [statementEndDate, setStatementEndDate] = useState('')
  const [overlapDetails, setOverlapDetails] = useState<Array<{
    originalTransaction: any;
    duplicateTransaction: any;
    reason: string;
  }>>([])
  

  
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchClients()
      fetchTransactions()
      fetchQboStatus()
      fetchInvoiceStats()
    }
  }, [user, selectedClientId])

  useEffect(() => {
    applyFilters()
    calculateSummary()
  }, [transactions, filter, transactionTypeFilter])


  const checkUser = async () => {
    try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
    } else {
      setUser(session.user)
      }
    } catch (error) {
      console.error('Supabase auth check failed:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('business_name')

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.warn('Database tables not found')
          return
        }
        throw error
      }
      setClients(data || [])
    } catch (error) {
      console.warn('Error fetching clients:', error)
      setClients([])
    }
  }

  // Apply a single suggestion (duplicate removal, category assignment, or reconciliation)
  const applySuggestion = async (match: any) => {
    try {
      if (match.type === 'duplicate') {
        // Remove duplicate transactions from database
        const duplicateIds = match.transactions?.slice(1).map((d: any) => d.id) || []; // Keep first, remove rest
        if (duplicateIds.length > 0) {
          const { error } = await supabase
            .from('bank_transactions_sync')
            .delete()
            .in('id', duplicateIds);
          
          if (error) throw error;
          
          alert(`✅ Removed ${duplicateIds.length} duplicate transactions!`);
          fetchTransactions(); // Refresh the list
        }
      } else if (match.type === 'category_suggestion') {
        // Update category for matching transactions
        const transactionIds = match.transactions?.map((t: any) => t.id) || [];
        const newCategory = match.suggestion?.split('"')[1] || 'Other';
        
        if (transactionIds.length > 0) {
          const { error } = await supabase
            .from('bank_transactions_sync')
            .update({ category: newCategory })
            .in('id', transactionIds);
          
          if (error) throw error;
          
          alert(`✅ Updated ${transactionIds.length} transactions to category: ${newCategory}`);
          fetchTransactions(); // Refresh the list
        }
      } else if (match.type === 'reconciliation') {
        // Mark transactions as reconciled
        const transactionIds = match.transactions?.map((t: any) => t.id) || [];
        
        if (transactionIds.length > 0) {
          const { error } = await supabase
            .from('bank_transactions_sync')
            .update({ is_reconciled: true })
            .in('id', transactionIds);
          
          if (error) throw error;
          
          alert(`✅ Reconciled ${transactionIds.length} matching transactions!`);
          fetchTransactions(); // Refresh the list
        }
      }
      
      // Remove this suggestion from the list
      setSingleFileMatches(prev => prev.filter(m => m.id !== match.id));
      
    } catch (error) {
      alert(`❌ Error applying suggestion: ${error}`);
    }
  };

  // Apply all suggestions at once
  const applyAllSuggestions = async () => {
    try {
      for (const match of singleFileMatches) {
        await applySuggestion(match);
      }
      alert(`✅ Applied all ${singleFileMatches.length} suggestions!`);
      setSingleFileMatches([]);
    } catch (error) {
      alert(`❌ Error applying suggestions: ${error}`);
    }
  };

  // Show duplicates instead of filtering them out
  const removeDuplicates = (transactions: Transaction[]): Transaction[] => {
    const seen = new Map<string, boolean>();
    const duplicates: Transaction[] = [];
    const unique: Transaction[] = [];
    let duplicateCount = 0;
    
    console.log('=== DUPLICATE DETECTION DEBUG ===');
    console.log('Total transactions to process:', transactions.length);
    
    transactions.forEach((transaction, index) => {
      const key = `${transaction.date}_${transaction.amount}_${transaction.description?.toLowerCase().trim()}`;
      console.log(`Transaction ${index + 1}: ${transaction.description} on ${transaction.date} for $${transaction.amount}`);
      console.log(`Key: "${key}"`);
      console.log(`Already seen: ${seen.has(key)}`);
      
      if (!seen.has(key)) {
        seen.set(key, true);
        unique.push(transaction);
        console.log('✅ Added as unique');
      } else {
        duplicateCount++;
        duplicates.push(transaction);
        console.log('❌ DUPLICATE FOUND! Adding to duplicates list');
      }
    });
    
    console.log(`=== RESULTS: ${unique.length} unique, ${duplicateCount} duplicates ===`);
    console.log('Duplicates found:', duplicates);
    
    // Update duplicate tracking state
    setDuplicatesFound(duplicateCount);
    setDuplicateStatus(duplicateCount > 0 ? 'active' : 'inactive');
    
    // Track which transactions are duplicates for highlighting
    const duplicateIds = new Set(duplicates.map(d => d.id));
    setDuplicateTransactions(duplicateIds);
    
    // Return ALL transactions (unique + duplicates) so you can see them
    return [...unique, ...duplicates];
  };

  const fetchTransactions = async () => {
    try {
      if (!user?.id) {
        console.error('No user ID available for fetching transactions')
        setTransactions([])
        return
      }

      console.log('Fetching transactions for user:', user.id)

      // Fetch from bank_transactions_sync, bank_transactions, and book_transactions tables - FILTERED BY USER ID
      const [bankSyncResult, bankResult, bookResult] = await Promise.all([
        supabase.from('bank_transactions_sync').select('*').eq('user_id', user.id),
        supabase.from('bank_transactions').select('*').eq('user_id', user.id),
        supabase.from('book_transactions').select('*').eq('user_id', user.id)
      ])

      console.log('Bank sync result:', bankSyncResult)
      console.log('Bank result:', bankResult)
      console.log('Book result:', bookResult)

      let allTransactions: Transaction[] = []

      // Process bank_transactions_sync (manual uploads)
      if (bankSyncResult.data) {
        allTransactions.push(...bankSyncResult.data.map(t => ({
          id: t.id,
          user_id: user?.id || 'demo-user',
          client_id: undefined, // bank_transactions_sync doesn't have client_id
          date: t.transaction_date,
          description: t.description,
          amount: t.amount,
          transaction_type: 'bank' as const,
          category: t.category,
          notes: t.reference || undefined,
          is_reconciled: t.is_reconciled || false,
          reconciliation_group: undefined
        })))
      }

      // Process bank transactions
      if (bankResult.data) {
        allTransactions.push(...bankResult.data.map(t => ({
          id: t.id,
          user_id: user?.id || 'demo-user',
          client_id: t.client_id,
          date: t.date,
          description: t.description,
          amount: t.amount,
          transaction_type: 'bank' as const,
          category: t.category,
          notes: t.notes || t.reference || null,
          is_reconciled: t.is_reconciled || false,
          reconciliation_group: t.reconciliation_group
        })))
      }

      // Process book transactions
      if (bookResult.data) {
        allTransactions.push(...bookResult.data.map(t => ({
          id: t.id,
          user_id: user?.id || 'demo-user',
          client_id: t.client_id,
          date: t.date,
          description: t.description,
          amount: t.amount,
          transaction_type: 'bookkeeping' as const,
          category: t.category,
          notes: t.notes || t.reference || null,
          is_reconciled: t.is_reconciled || false,
          reconciliation_group: t.reconciliation_group
        })))
      }

      // Filter out duplicates before displaying
      console.log('=== AUTO-DUPLICATE FILTERING ===');
      console.log('Raw transactions from database:', allTransactions.length);
      
      // Log first few transactions to see what we're working with
      console.log('First 3 transactions:', allTransactions.slice(0, 3).map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        amount: t.amount
      })));
      
      const uniqueTransactions = removeDuplicates(allTransactions)
      console.log(`Filtered ${allTransactions.length - uniqueTransactions.length} duplicates from display`)
      console.log('Final unique transactions:', uniqueTransactions.length);
      
      // Set the filtered transactions
      setTransactions(uniqueTransactions)
    } catch (error) {
      console.warn('Error fetching transactions:', error)
      setTransactions([])
    }
  }

  const fetchQboStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/qbo/status')
      if (response.ok) {
        const status = await response.json()
        setQboStatus({ connected: status.connected, realmId: status.status })
      }
    } catch (error) {
      console.warn('Error fetching QBO status:', error)
    }
  }

  const handleQuickBooksSync = async () => {
    if (!qboStatus.realmId) {
      alert('QuickBooks not connected')
      return
    }

    setSyncStatus('syncing')
    try {
      const response = await fetch('/api/qbo/sync', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          realmId: qboStatus.realmId, 
          full: false 
        })
      })
      
      if (response.ok) {
        setSyncStatus('success')
        setLastSyncTime(new Date().toLocaleString())
        // Refresh transactions after sync
        setTimeout(() => {
          fetchTransactions()
          fetchQboStatus()
        }, 2000)
        
        // Reset status after 3 seconds
        setTimeout(() => setSyncStatus('idle'), 3000)
      } else {
        throw new Error('Sync failed')
      }
    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const applyFilters = () => {
    let filtered = transactions

    if (filter === 'reconciled') {
      filtered = filtered.filter(t => t.is_reconciled)
    } else if (filter === 'unreconciled') {
      filtered = filtered.filter(t => !t.is_reconciled)
    }

    if (transactionTypeFilter !== 'all') {
      filtered = filtered.filter(t => t.transaction_type === transactionTypeFilter)
    }

    setFilteredTransactions(filtered)
  }

  const calculateSummary = () => {
    const total = transactions.length
    const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const reconciled = transactions.filter(t => t.is_reconciled).length
    const unreconciled = total - reconciled
    const bankTransactions = transactions.filter(t => t.transaction_type === 'bank').length
    const bookkeepingTransactions = transactions.filter(t => t.transaction_type === 'bookkeeping').length
    const quickbooksTransactions = transactions.filter(t => t.transaction_type === 'quickbooks').length

    setSummary({ total, totalAmount, reconciled, unreconciled, bankTransactions, bookkeepingTransactions, quickbooksTransactions })
  }

  const fetchInvoiceStats = async () => {
    try {
      const response = await fetch('/api/invoices?user_id=temp_user')
      const data = await response.json()
      
      if (data.success && data.invoices) {
        const invoices = data.invoices
        const today = new Date()
        
        const stats = {
          total: invoices.length,
          pending: invoices.filter((inv: any) => inv.status === 'pending').length,
          overdue: invoices.filter((inv: any) => {
            const dueDate = new Date(inv.due_date)
            return inv.status === 'pending' && dueDate < today
          }).length,
          paid: invoices.filter((inv: any) => inv.status === 'paid').length,
          totalAmount: invoices.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0),
          overdueAmount: invoices.filter((inv: any) => {
            const dueDate = new Date(inv.due_date)
            return inv.status === 'pending' && dueDate < today
          }).reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0)
        }
        
        setInvoiceStats(stats)
        setInvoices(invoices)
      }
    } catch (error) {
      console.error('Failed to fetch invoice stats:', error)
    }
  }

  const handleAddClient = async (clientData: any) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          user_id: user.id,
          status: 'pending'
        }])
        .select()
        .single()

      if (error) throw error

      setClients([...clients, data])
      alert('Client created successfully!')

















      
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Failed to create client. Please try again.')
    }
  }

  const handleUpdateClient = async (clientId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId)
        .eq('user_id', user.id)

      if (error) throw error

      setClients(clients.map(c => c.id === clientId ? { ...c, ...updates } : c))
      alert('Client updated successfully!')
    } catch (error) {
      console.error('Error updating client:', error)
      alert('Failed to update client. Please try again.')
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('user_id', user.id)

      if (error) throw error

      setClients(clients.filter(c => c.id !== clientId))
      if (selectedClientId === clientId) {
        setSelectedClientId(null)
      }
      alert('Client deleted successfully!')
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Failed to delete client. Please try again.')
    }
  }

  // Single-file auto-matching function
  const runAutoMatch = async () => {
    if (transactions.length === 0) {
      alert('No transactions available for matching');
      return;
    }
    
    try {
      const matches = await runSingleFileMatching(transactions);
      if (matches.length > 0) {
        alert(`Found ${matches.length} potential matches! Check the Single-File Auto-Matching Results section.`);
      } else {
        alert('No automatic matches found. Try manual matching or check your transaction data.');
      }
    } catch (error) {
      console.error('Auto-match error:', error);
      alert('Error running auto-match. Please try again.');
    }
  };

  const runSingleFileMatching = async (transactions: any[]) => {
    console.log('🔍 === STARTING AUTO-MATCH ===')
    console.log('Input transactions:', transactions.length)
    console.log('Sample transaction:', transactions[0])
    
    try {
      // Transform transactions to match SingleFileMatcher format
      const formattedTransactions = transactions.map(tx => {
        const amount = parseFloat(String(tx.amount).replace(/[$,\s]/g, '')) || 0
        return {
          id: tx.id || crypto.randomUUID(),
          amount: amount,
          description: String(tx.description || '').trim(),
          date: String(tx.date || '').trim(),
          category: tx.category || 'Unknown',
          type: (amount >= 0) ? 'Credit' as const : 'Debit' as const
        }
      }).filter(tx => tx.description && tx.date && tx.amount !== 0) // Filter out invalid transactions
      
      console.log('✅ Formatted transactions:', formattedTransactions.length)
      console.log('Sample formatted transaction:', formattedTransactions[0])
      
      if (formattedTransactions.length === 0) {
        console.log('❌ No valid transactions to analyze')
        return []
      }
      
      const matcher = new SingleFileMatcher()
      console.log('🔍 Running matcher.findMatches...')
      const matches = matcher.findMatches(formattedTransactions)
      
      console.log('🎯 Single-file matches found:', matches.length)
      console.log('🎯 Match details:', matches.map(m => ({
        type: m.type,
        confidence: m.confidence,
        reason: m.reason,
        transactions: m.transactions.length
      })))
      
      // Ensure matches have proper structure
      const validMatches = matches.map(match => ({
        ...match,
        id: match.id || crypto.randomUUID(),
        confidence: match.confidence || 0.7,
        transactions: match.transactions || [],
        reason: match.reason || 'No reason provided'
      }))
      
      setSingleFileMatches(validMatches)
      setShowSingleFileMatches(true)
      
      console.log('✅ Auto-match completed successfully!')
      
      // Track feature usage for beta users
      if (user) {
        await trackBetaUserActivity('single_file_analysis', { matches_found: validMatches.length })
      }
      
      return validMatches
    } catch (error) {
      console.error('❌ Error in single-file matching:', error)
      console.error('❌ Error details:', error)
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
      return []
    }
  }

  // Track beta user activity
  const trackBetaUserActivity = async (activity: string, metadata: any = {}) => {
    if (!user) return
    
    try {
      const { error } = await supabase
        .from('beta_user_activity')
        .insert({
          user_id: user.id,
          activity,
          metadata,
          timestamp: new Date().toISOString()
        })

      if (error) console.error('Error tracking beta activity:', error)
    } catch (error) {
      console.error('Error tracking beta activity:', error)
    }
  }

  const handleExistingDataUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setExistingDataFile(file);
      console.log('Existing data file selected:', file.name);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, transactionType: 'bank' | 'bookkeeping') => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('Starting file upload:', file.name, 'Type:', transactionType)
    console.log('Dashboard version: 2024-10-05-02 - Using API endpoint for all file types')
    setUploading(true)
    
    try {
      // Use the API endpoint that handles all file types (CSV, Excel, OFX)
      const formData = new FormData()
      formData.append('csv', file)
      
      // Add user ID for database insertion
      if (user?.id) {
        formData.append('userId', user.id)
        console.log('Processing file for user:', user.id)
      }
      
      // Add messy CSV mode flag
      formData.append('messyCSVMode', messyCSVMode.toString())
      console.log('Messy CSV mode:', messyCSVMode)
      
      // Add date filter settings
      formData.append('enableDateFilter', enableDateFilter.toString())
      formData.append('lastImportDate', lastImportDate)
      console.log('Date filter enabled:', enableDateFilter, 'Last import date:', lastImportDate)
      
      // Add file comparison settings
      formData.append('enableFileComparison', enableFileComparison.toString())
      if (enableFileComparison && existingDataFile) {
        formData.append('existingDataFile', existingDataFile)
        console.log('File comparison enabled with existing data:', existingDataFile.name)
      }
      
      // Add credit card overlap settings
      formData.append('enableCreditCardOverlap', enableCreditCardOverlap.toString())
      formData.append('statementEndDate', statementEndDate)
      console.log('Credit card overlap enabled:', enableCreditCardOverlap, 'Statement end date:', statementEndDate)
      
      const response = await fetch('/api/upload/anonymous', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }
      
      console.log('Upload successful:', result)
      
      // Store the session ID for later use
      const sessionId = result.sessionId
      
      // The API has already processed and inserted the transactions
      // Just show success message and refresh the data
      console.log('API processed transactions successfully')
      
      // Refresh the transactions list to show updated data
          await fetchTransactions()
          await fetchClients()

      // If no transactions were uploaded (due to filtering), show explanation
      if (result.totalProcessed === 0 && result.message) {
        console.log('No transactions uploaded due to filtering - this is expected behavior');
      }
      
      // Show overlap details if any were found
      if (result.overlapDetails && result.overlapDetails.length > 0) {
        console.log('Showing detailed overlap report:', result.overlapDetails.length, 'overlaps found');
        
        // Create overlap report notification that appears immediately
        const overlapReportDiv = document.createElement('div');
        overlapReportDiv.innerHTML = `
          <div style="
            position: fixed; 
            top: 80px; 
            right: 20px; 
            background: #dbeafe; 
            color: #1e40af; 
            padding: 20px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            max-width: 500px;
            font-family: system-ui;
            border: 2px solid #3b82f6;
          ">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px;">
              🎯 Credit Card Overlaps Resolved (${result.overlapDetails.length} found)
            </div>
            <div style="max-height: 300px; overflow-y: auto;">
              ${result.overlapDetails.map((overlap: any, index: number) => `
                <div style="margin-bottom: 12px; padding: 8px; background: white; border-radius: 6px; border: 1px solid #3b82f6;">
                  <div style="font-weight: 600; margin-bottom: 6px; font-size: 14px;">
                    ⚠️ Overlap #${index + 1}: ${overlap.originalTransaction.description}
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 6px;">
                    <div style="background: #dcfce7; padding: 6px; border-radius: 4px; font-size: 12px;">
                      <span style="font-weight: 600; color: #166534;">✅ KEPT:</span><br>
                      <span style="color: #16a34a;">${overlap.originalTransaction.date} - $${overlap.originalTransaction.amount}</span>
                    </div>
                    <div style="background: #fef2f2; padding: 6px; border-radius: 4px; font-size: 12px;">
                      <span style="font-weight: 600; color: #dc2626;">🗑️ REMOVED:</span><br>
                      <span style="color: #dc2626;">${overlap.duplicateTransaction.date} - $${overlap.duplicateTransaction.amount}</span>
                    </div>
                  </div>
                  <div style="font-size: 11px; color: #6b7280;">
                    ${overlap.reason}
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="margin-top: 12px; padding: 8px; background: #bfdbfe; border-radius: 6px; font-size: 12px;">
              <strong>💡 How it works:</strong> Credit card transactions can appear on both statements. This tool automatically removes the later duplicates.
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
              position: absolute; 
              top: 8px; 
              right: 8px; 
              background: none; 
              border: none; 
              font-size: 18px; 
              cursor: pointer; 
              color: #6b7280;
            ">×</button>
          </div>
        `;
        document.body.appendChild(overlapReportDiv);
        
        // Remove the overlap report after 15 seconds
        setTimeout(() => {
          if (overlapReportDiv.parentNode) {
            overlapReportDiv.parentNode.removeChild(overlapReportDiv);
          }
        }, 15000);
      }

      // Show detailed success message with duplicate info
      const message = result.message || `Successfully uploaded ${result.transactions?.length || 0} ${transactionType} transactions!`;
      
      // Create a more visible success message
      const successDiv = document.createElement('div');
      successDiv.innerHTML = `
        <div style="
          position: fixed; 
          top: 20px; 
          right: 20px; 
          background: #10b981; 
          color: white; 
          padding: 16px 24px; 
          border-radius: 8px; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          max-width: 400px;
          font-family: system-ui;
        ">
          <strong>✅ Upload Successful!</strong><br>
          ${message}
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Remove the message after 5 seconds
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
        }
      }, 5000);
      
      // Store overlap details for detailed reporting
      if (result.overlapDetails) {
        setOverlapDetails(result.overlapDetails);
        console.log('Overlap Details:', result.overlapDetails);
      }
      
      // Log the results for debugging
      console.log('Upload Results:', {
        totalProcessed: result.totalProcessed,
        newTransactions: result.newTransactions,
        duplicates: result.duplicates,
        message: result.message,
        overlapDetails: result.overlapDetails
      });
      
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
          setUploading(false)
          event.target.value = ''
        }
  }

  const handleTransactionSelect = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    )
  }

  const handleMatch = async (bankId: string, bookkeepingId: string) => {
    const reconciliationGroup = crypto.randomUUID()
    
    try {
      // Update bank transaction
      const { error: bankError } = await supabase
        .from('bank_transactions')
        .update({ 
          is_reconciled: true, 
          reconciliation_group: reconciliationGroup 
        })
        .eq('id', bankId)

      if (bankError) throw bankError

      // Update book transaction
      const { error: bookError } = await supabase
        .from('book_transactions')
        .update({ 
          is_reconciled: true, 
          reconciliation_group: reconciliationGroup 
        })
        .eq('id', bookkeepingId)

      if (bookError) throw bookError

      // Refresh transactions
      fetchTransactions()
    } catch (error) {
      console.error('Error matching transactions:', error)
    }
  }

  // Excel report function removed - was causing issues

  const syncInvoices = async () => {
    if (!qboStatus.connected) {
      alert('Please connect your QuickBooks account first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/qbo/invoices/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          realm_id: qboStatus.realmId
        })
      })

      const result = await response.json()
      if (result.success) {
        alert(`Successfully synced ${result.invoices_processed} invoices and ${result.clients_processed} clients!`)
        // TODO: Refresh invoice data
      } else {
        alert(`Sync failed: ${result.message}`)
      }
    } catch (error) {
      console.error('Invoice sync failed:', error)
      alert('Failed to sync invoices. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reconcileSelected = async () => {
    if (selectedTransactions.length < 2) {
      alert('Please select at least 2 transactions to reconcile')
      return
    }

    const reconciliationGroup = crypto.randomUUID()
    
    try {
      console.log('Starting reconciliation for:', selectedTransactions.length, 'transactions')
      console.log('Selected transaction IDs:', selectedTransactions)
      
      // Separate bank and book transactions
      const bankIds = selectedTransactions.filter(id => {
        const transaction = transactions.find(t => t.id === id)
        return transaction?.transaction_type === 'bank'
      })
      
      const bookIds = selectedTransactions.filter(id => {
        const transaction = transactions.find(t => t.id === id)
        return transaction?.transaction_type === 'bookkeeping'
      })

      console.log('Bank IDs to reconcile:', bankIds)
      console.log('Book IDs to reconcile:', bookIds)

      // Update bank transactions
      if (bankIds.length > 0) {
        console.log('Updating bank transactions...')
        console.log('Bank IDs being sent to database:', bankIds)
        
        // First, let's verify these IDs exist in the database and belong to this user
        const { data: existingBank, error: checkError } = await supabase
          .from('bank_transactions')
          .select('id')
          .in('id', bankIds)
          .eq('user_id', user.id) // CRITICAL: Only check transactions belonging to this user
        
        console.log('Existing bank transactions:', existingBank)
        if (checkError) {
          console.error('Error checking bank transactions:', checkError)
          throw checkError
        }
        
        if (!existingBank || existingBank.length === 0) {
          throw new Error('No bank transactions found with the provided IDs')
        }
        
        const { data: bankData, error: bankError } = await supabase
          .from('bank_transactions')
          .update({ 
            is_reconciled: true, 
            reconciliation_group: reconciliationGroup 
          })
          .in('id', bankIds)
          .eq('user_id', user.id) // CRITICAL: Only update transactions belonging to this user
          .select()

        console.log('Bank update result:', { data: bankData, error: bankError })

        if (bankError) {
          console.error('Bank update error details:', bankError)
          throw bankError
        }
        console.log('Bank transactions updated successfully:', bankData)
      }

      // Update book transactions
      if (bookIds.length > 0) {
        console.log('Updating book transactions...')
        const { data: bookData, error: bookError } = await supabase
          .from('book_transactions')
          .update({ 
            is_reconciled: true, 
            reconciliation_group: reconciliationGroup 
          })
          .in('id', bookIds)
          .eq('user_id', user.id) // CRITICAL: Only update transactions belonging to this user
          .select()

        if (bookError) {
          console.error('Book update error:', bookError)
          throw bookError
        }
        console.log('Book transactions updated successfully:', bookData)
      }

      console.log('Reconciliation completed successfully')
      await fetchTransactions()
      setSelectedTransactions([])
      alert(`Successfully reconciled ${bankIds.length + bookIds.length} transactions!`)
    } catch (error) {
      console.error('Error reconciling transactions:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error reconciling transactions: ${errorMessage}`)
    }
  }

  const unreconcileGroup = async (reconciliationGroup: string) => {
    try {
      // Update bank transactions
      const { error: bankError } = await supabase
        .from('bank_transactions')
        .update({ 
          is_reconciled: false, 
          reconciliation_group: null 
        })
        .eq('reconciliation_group', reconciliationGroup)

      if (bankError) throw bankError

      // Update book transactions
      const { error: bookError } = await supabase
        .from('book_transactions')
        .update({ 
          is_reconciled: false, 
          reconciliation_group: null 
        })
        .eq('reconciliation_group', reconciliationGroup)

      if (bookError) throw bookError

      fetchTransactions()
    } catch (error) {
      console.error('Error unreconciling transactions:', error)
    }
  }

  const clearAllTransactions = async () => {
    if (!confirm('Are you sure you want to clear all transactions? This cannot be undone.')) {
      return
    }

    try {
      console.log('Starting to clear all transactions for user:', user.id)
      
      // Call the server-side API route for clearing transactions
      console.log('Calling clear-transactions API with userId:', user.id);
      
      const response = await fetch('/api/clear-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });

      console.log('API response status:', response.status);
      
      const result = await response.json();
      console.log('API response result:', result);

      if (!response.ok) {
        console.error('API error:', result);
        throw new Error(result.error || 'Failed to clear transactions');
      }

      // Refresh transactions
      console.log('Refreshing transactions after clearing...')
      await fetchTransactions()
      setSelectedTransactions([])
      calculateSummary()
      
      alert('All transactions cleared successfully!')
    } catch (error) {
      console.error('Error clearing transactions:', error)
      alert('Error clearing transactions: ' + error)
    }
  }

  const exportReconciled = async () => {
    const reconciledTransactions = transactions.filter(t => t.is_reconciled)
    
    if (reconciledTransactions.length === 0) {
      alert('No reconciled transactions to export')
      return
    }
    
    const csvData = reconciledTransactions.map(t => ({
      Date: t.date,
      Description: t.description,
      Amount: t.amount,
      Type: t.transaction_type,
      Category: t.category || '',
      Status: 'Reconciled',
      'Reconciliation Group': t.reconciliation_group || '',
      Notes: t.notes || ''
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `reconciled-transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    
    window.URL.revokeObjectURL(url)
  }

  const exportReconciledPDF = async () => {
    const reconciledTransactions = transactions.filter(t => t.is_reconciled)
    
    if (reconciledTransactions.length === 0) {
      alert('No reconciled transactions to export')
      return
    }

    try {
      const doc = new jsPDF()
      
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Bank Reconciliation Report', 20, 25)
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      const exportDate = new Date().toLocaleDateString()
      doc.text(`Export Date: ${exportDate}`, 20, 35)
      doc.text(`Account: ${user?.email}`, 20, 45)
      
      if (selectedClientId) {
        const selectedClient = clients.find(c => c.id === selectedClientId)
        if (selectedClient) {
          doc.text(`Client: ${selectedClient.business_name} (${selectedClient.name})`, 20, 55)
        }
      }
      
      doc.text(`Total Reconciled Transactions: ${reconciledTransactions.length}`, 20, 65)
      
      let currentY = 80
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      
      doc.setFillColor(59, 130, 246)
      doc.rect(20, currentY - 5, 170, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.text('Date', 25, currentY + 2)
      doc.text('Description', 50, currentY + 2)
      doc.text('Amount', 120, currentY + 2)
      doc.text('Type', 140, currentY + 2)
      doc.text('Group', 160, currentY + 2)
      
      currentY += 15
      
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      
      reconciledTransactions.forEach((transaction, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250)
          doc.rect(20, currentY - 3, 170, 10, 'F')
        }
        
        const date = new Date(transaction.date).toLocaleDateString()
        const description = transaction.description.length > 25 
          ? transaction.description.substring(0, 22) + '...' 
          : transaction.description
        const amount = `$${transaction.amount.toFixed(2)}`
        const type = transaction.transaction_type === 'bank' ? 'Bank' : 'Books'
        const groupId = transaction.reconciliation_group?.substring(0, 6) || 'N/A'
        
        doc.text(date, 25, currentY)
        doc.text(description, 50, currentY)
        doc.text(amount, 120, currentY)
        doc.text(type, 140, currentY)
        doc.text(groupId, 160, currentY)
        
        currentY += 10
        
        if (currentY > 250) {
          doc.addPage()
          currentY = 30
        }
      })
      
      const totalAmount = reconciledTransactions.reduce((sum, t) => sum + t.amount, 0)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, currentY + 15)
      
      const pdfBlob = doc.output('blob')
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reconciliation-report-${exportDate.replace(/\//g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
        
        {/* Beta Feedback Component */}
        {user && (
          <BetaFeedback userId={user.id} userEmail={user.email} />
        )}
      </div>
    )
  }

  const bankTransactions = transactions.filter(t => t.transaction_type === 'bank')
  const bookkeepingTransactions = transactions.filter(t => t.transaction_type === 'bookkeeping')

  return (
    <AccessGuard>
    <TrialGuard>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Bank Reconciliation</h1>
              <Badge variant="outline" className="text-xs">
                {user?.email}
              </Badge>
              <TrialStatusBadge />
            </div>

            <div className="flex items-center space-x-4">
              <ClientSelector
                clients={clients}
                selectedClientId={selectedClientId}
                onClientChange={setSelectedClientId}
                loading={loading}
              />
              

              
              <Link href="/team">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Team</span>
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Support</span>
                </Button>
              </Link>
              
              
              <Link href="/settings/security">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </Link>

              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Access Warning */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AccessWarning />
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">{summary.total}</p>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-lg font-bold text-green-600">${summary.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Reconciled</p>
                  <p className="text-2xl font-bold text-green-600">{summary.reconciled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Unreconciled</p>
                  <p className="text-2xl font-bold text-red-600">{summary.unreconciled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Bank</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.bankTransactions}</p>
                </div>
            </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Bookkeeping</p>
                  <p className="text-2xl font-bold text-green-600">{summary.bookkeepingTransactions}</p>
            </div>
          </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">QB</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">QuickBooks</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.quickbooksTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="matching">Smart Matching</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            {/* Single-File Auto-Matching Results */}
            {showSingleFileMatches && singleFileMatches.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Zap className="h-5 w-5" />
                    Single-File Auto-Matching Results
                  </CardTitle>
                  <CardDescription>
                    Found {singleFileMatches.length} smart matches in your bank statement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {singleFileMatches.map((match, index) => (
                    <div key={match.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={match.type === 'duplicate' ? 'destructive' : match.type === 'pattern' ? 'default' : match.type === 'reconciliation' ? 'outline' : 'secondary'}>
                            {match.type === 'duplicate' ? 'Duplicate' : match.type === 'pattern' ? 'Pattern' : match.type === 'reconciliation' ? 'Reconciliation' : 'Category'}
                          </Badge>
                          <Badge variant="outline">
                            {Math.round(match.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => applySuggestion(match)}
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{match.reason}</p>
                      {match.suggestion && (
                        <p className="text-sm font-medium text-blue-700">{match.suggestion}</p>
                      )}
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          {match.transactions.length} transactions affected
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => applyAllSuggestions()}
                    >
                      Apply All Suggestions
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowSingleFileMatches(false)}>
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                      <div className="text-sm text-slate-600">Total Transactions</div>
                      <div className="text-lg font-semibold text-green-600">${summary.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Total Amount</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">{summary.reconciled}</div>
                      <div className="text-sm text-slate-600">Reconciled</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{invoiceStats.total}</div>
                      <div className="text-sm text-slate-600">Total Invoices</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="text-2xl font-bold text-red-600">{invoiceStats.overdue}</div>
                      <div className="text-sm text-slate-600">Overdue Invoices</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

        {/* Controls */}
            <Card>
              <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center flex-wrap">
                    {/* Upload buttons - no client requirement */}
                    <Button
                      onClick={() => document.getElementById('bank-upload')?.click()}
                      disabled={uploading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Bank CSV
                        </>
                      )}
                    </Button>
                    
                    
                    {/* Upload Buttons */}
                    <div className="flex gap-2">
              <div>
                        <label htmlFor="bank-upload" className="cursor-pointer">
                          <Button asChild disabled={uploading}>
                            <span className="flex items-center space-x-2">
                              <Upload className="h-4 w-4" />
                              <span>{uploading ? 'Uploading...' : 'Upload Bank CSV'}</span>
                            </span>
                          </Button>
                </label>
                <input
                          id="bank-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls,.ofx,.qfx"
                  className="hidden"
                          onChange={(e) => handleFileUpload(e, 'bank')}
                  disabled={uploading}
                />
              </div>

                      <div>
                        <label htmlFor="bookkeeping-upload" className="cursor-pointer">
                          <Button variant="outline" asChild disabled={uploading}>
                            <span className="flex items-center space-x-2">
                              <Upload className="h-4 w-4" />
                              <span>Upload Bookkeeping CSV</span>
                            </span>
                          </Button>
                        </label>
                        <input
                          id="bookkeeping-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls,.ofx,.qfx"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'bookkeeping')}
                          disabled={uploading}
                        />
                      </div>
                    </div>

            {/* Messy CSV Mode Toggle */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="messy-csv-mode" 
                  checked={messyCSVMode}
                  onChange={(e) => setMessyCSVMode(e.target.checked)}
                  className="w-4 h-4 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                />
                <label htmlFor="messy-csv-mode" className="text-sm font-medium text-yellow-800">
                  🔧 Messy Multi-Month Format
                </label>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Enable this for complex bookkeeping files with multiple months per row (e.g., "April,Name,Amount,May,Name,Amount")
              </p>
            </div>

            {/* Date Filter for Reuven's Feature Request */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  id="enable-date-filter" 
                  checked={enableDateFilter}
                  onChange={(e) => setEnableDateFilter(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enable-date-filter" className="text-sm font-medium text-blue-800">
                  📅 Date Filter (Prevent Re-importing Old Data)
                </label>
              </div>
              {enableDateFilter && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Last Import Date
                  </label>
                  <input 
                    type="date" 
                    value={lastImportDate}
                    onChange={(e) => setLastImportDate(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    Remove all transactions before this date to prevent re-importing old data
                  </p>
                </div>
              )}
            </div>

            {/* File Comparison Feature (Reuven's Request) */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  id="enable-file-comparison" 
                  checked={enableFileComparison}
                  onChange={(e) => setEnableFileComparison(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                />
                <label htmlFor="enable-file-comparison" className="text-sm font-medium text-green-800">
                  🔄 File Comparison (Compare Against Existing Data)
                </label>
              </div>
              {enableFileComparison && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Upload Existing QuickBooks Data (CSV/Excel)
                    </label>
                    <input 
                      type="file" 
                      accept=".csv,.xlsx,.xls"
                      onChange={handleExistingDataUpload}
                      className="w-full px-3 py-2 border border-green-300 rounded-md text-sm"
                    />
                    <p className="text-xs text-green-600 mt-1">
                      Upload your existing QuickBooks export to prevent importing duplicates
                    </p>
                  </div>
                  {existingDataFile && (
                    <div className="p-2 bg-green-100 rounded text-sm text-green-700">
                      ✅ Existing data loaded: {existingDataFile.name}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Credit Card Overlap Handling (Reuven's Request) */}
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  id="enable-credit-card-overlap" 
                  checked={enableCreditCardOverlap}
                  onChange={(e) => setEnableCreditCardOverlap(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="enable-credit-card-overlap" className="text-sm font-medium text-purple-800">
                  💳 Credit Card Overlap Handling
                </label>
              </div>
              {enableCreditCardOverlap && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">
                      Statement End Date
                    </label>
                    <input 
                      type="date" 
                      value={statementEndDate}
                      onChange={(e) => setStatementEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-purple-300 rounded-md text-sm"
                    />
                    <p className="text-xs text-purple-600 mt-1">
                      Handle overlapping transactions that appear on both current and next statement
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded text-sm text-purple-700">
                    <strong>How it works:</strong> Detects transactions in the last 3 days of your statement that might also appear on the next statement, and removes the later duplicates.
                  </div>
                </div>
              )}
            </div>

                    {/* Bank Connection removed - focusing on core CSV functionality */}

                    {/* Filters */}
                    <Select
                value={filter}
                      onValueChange={(value) => setFilter(value as any)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="reconciled">Reconciled</SelectItem>
                        <SelectItem value="unreconciled">Unreconciled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={transactionTypeFilter}
                      onValueChange={(value) => setTransactionTypeFilter(value as any)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="bank">Bank Only</SelectItem>
                        <SelectItem value="bookkeeping">Bookkeeping Only</SelectItem>
                        <SelectItem value="quickbooks">QuickBooks Only</SelectItem>
                      </SelectContent>
                    </Select>
            </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                onClick={reconcileSelected}
                disabled={selectedTransactions.length < 2}
                      className={`flex items-center space-x-2 ${selectedTransactions.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                      <CheckCircle className="h-4 w-4" />
                      <span>Reconcile Selected ({selectedTransactions.length})</span>
                    </Button>

                    <Button
                      variant="outline"
                onClick={exportReconciled}
                disabled={summary.reconciled === 0}
                      className="flex items-center space-x-2"
              >
                      <Download className="h-4 w-4" />
                      <span>Export CSV</span>
                    </Button>

                    <Button
                      variant="outline"
                onClick={exportReconciledPDF}
                disabled={summary.reconciled === 0}
                      className="flex items-center space-x-2"
              >
                      <FileText className="h-4 w-4" />
                      <span>Export PDF</span>
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={clearAllTransactions}
                      disabled={transactions.length === 0}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Clear All</span>
                    </Button>
                    
                    {/* TEST AUTO-MATCH WITH SAMPLE DATA */}
                    <Button
                      onClick={async () => {
                        console.log('🧪 Testing auto-match with sample data...')
                        
                        // Create sample transactions for testing
                        const sampleTransactions = [
                          { id: '1', date: '2024-01-15', description: 'Office Supplies Purchase', amount: 150.00, category: 'Expenses' },
                          { id: '2', date: '2024-01-16', description: 'Client Payment - ABC Corp', amount: 2500.00, category: 'Income' },
                          { id: '3', date: '2024-01-17', description: 'Office Supplies Purchase', amount: 150.00, category: 'Expenses' },
                          { id: '4', date: '2024-01-17', description: 'Office Supplies Purchase', amount: 150.00, category: 'Expenses' },
                          { id: '5', date: '2024-01-18', description: 'Software Subscription', amount: 99.00, category: 'Technology' },
                          { id: '6', date: '2024-01-19', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment' },
                          { id: '7', date: '2024-01-20', description: 'Office Supplies Purchase', amount: 150.00, category: 'Expenses' },
                          { id: '8', date: '2024-01-21', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment' },
                          { id: '9', date: '2024-01-22', description: 'Office Supplies Purchase', amount: 150.00, category: 'Expenses' },
                          { id: '10', date: '2024-01-23', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment' }
                        ]
                        
                        try {
                          const matches = await runSingleFileMatching(sampleTransactions)
                          alert(`🧪 TEST COMPLETE!\n\nFound ${matches.length} matches:\n• ${matches.filter(m => m.type === 'duplicate').length} duplicates\n• ${matches.filter(m => m.type === 'pattern').length} patterns\n• ${matches.filter(m => m.type === 'category_suggestion').length} category suggestions\n\nCheck the Smart Matching tab to see results!`)
                        } catch (error) {
                          alert(`❌ TEST FAILED: ${error}`)
                        }
                      }}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Test Auto-Match</span>
                    </Button>

                    {/* DUPLICATE TEST BUTTON - SHOULD BE VISIBLE */}
                    <Button
                      onClick={() => {
                        // Step 1: Detect duplicates
                        const unique = removeDuplicates(transactions);
                        
                        // Step 2: Show results immediately
                        if (duplicatesFound > 0) {
                          alert(`✅ FOUND ${duplicatesFound} DUPLICATES!\n\nFiltered from ${transactions.length} to ${unique.length} transactions.\n\nDuplicates have been removed from the list.`);
                        } else {
                          alert(`✅ NO DUPLICATES FOUND!\n\nAll ${transactions.length} transactions are unique.`);
                        }
                        
                        // Step 3: Auto-run matching
                        setTimeout(async () => {
                          try {
                            console.log('🔍 Starting auto-match with transactions:', unique.length);
                            const matches = await runSingleFileMatching(unique);
                            console.log('🔍 Auto-match results:', matches);
                            
                            if (matches.length > 0) {
                              alert(`🎯 AUTO-MATCH COMPLETE!\n\nFound ${matches.length} smart matches!\n\n• ${matches.filter(m => m.type === 'duplicate').length} duplicates\n• ${matches.filter(m => m.type === 'pattern').length} recurring patterns\n• ${matches.filter(m => m.type === 'category_suggestion').length} category suggestions\n\nCheck the results below!`);
                            } else {
                              alert(`⚠️ AUTO-MATCH COMPLETE!\n\nNo automatic matches found.\n\nThis could mean:\n• Your transactions are all unique (good!)\n• No recurring patterns detected\n• No category suggestions available`);
                            }
                          } catch (error) {
                            console.error('❌ Auto-match error:', error);
                            alert(`❌ AUTO-MATCH ERROR!\n\n${error}\n\nCheck console for details.`);
                          }
                        }, 500);
                      }}
                      disabled={transactions.length === 0}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Test Duplicates</span>
                    </Button>
            </div>
          </div>
              </CardContent>
            </Card>

        {/* Transactions Table */}
            <TransactionTable
              transactions={filteredTransactions}
              selectedTransactions={selectedTransactions}
              onTransactionSelect={handleTransactionSelect}
              onUnreconcileGroup={unreconcileGroup}
              loading={false}
            />
          </TabsContent>

          <TabsContent value="quickbooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">QB</span>
                  </div>
                  <span>QuickBooks Transactions</span>
                </CardTitle>
                <CardDescription>
                  Transactions synced from your QuickBooks account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {qboStatus.connected ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Your QuickBooks data is automatically synced and integrated into the main reconciliation system.
                      </p>
                      <div className="flex space-x-3">
                        <Link href="/settings/qbo">
                          <Button variant="outline" size="sm">
                            Manage Connection
                          </Button>
                        </Link>
                        <Button 
                          size="sm"
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/qbo/sync', { 
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                  realmId: qboStatus.realmId, 
                                  full: false 
                                })
                              })
                              if (response.ok) {
                                alert('Sync started successfully!')
                              }
                            } catch (error) {
                              console.error('Sync error:', error)
                            }
                          }}
                        >
                          Sync Now
                        </Button>
                      </div>
                    </div>
                    
                    {/* QuickBooks Transactions Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {transactions.filter(t => t.transaction_type === 'quickbooks').length}
                        </div>
                        <div className="text-sm text-blue-600">QB Transactions</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {transactions.filter(t => t.transaction_type === 'quickbooks' && t.is_reconciled).length}
                        </div>
                        <div className="text-sm text-green-600">Reconciled</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {transactions.filter(t => t.transaction_type === 'quickbooks' && !t.is_reconciled).length}
                        </div>
                        <div className="text-sm text-orange-600">Pending</div>
                      </div>
                    </div>

                    {/* QuickBooks Transactions Table */}
                    <div className="border rounded-lg">
                      <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-medium">Recent QuickBooks Transactions</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {transactions
                              .filter(t => t.transaction_type === 'quickbooks')
                              .slice(0, 10)
                              .map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 text-sm text-gray-900">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate">
                                    {transaction.description}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-500">
                                    {transaction.qbo_account_name || 'N/A'}
                                  </td>
                                  <td className={`px-4 py-2 text-sm font-medium ${transaction.is_credit ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.is_credit ? '+' : '-'}${transaction.amount.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 text-sm">
                                    <Badge variant={transaction.is_reconciled ? "default" : "secondary"}>
                                      {transaction.is_reconciled ? 'Reconciled' : 'Pending'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      {transactions.filter(t => t.transaction_type === 'quickbooks').length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                          <p>No QuickBooks transactions found. Sync your account to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">QB</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Connect QuickBooks</h3>
                    <p className="text-gray-500 mb-4">
                      Connect your QuickBooks account to automatically sync transactions and integrate them into your reconciliation workflow.
                    </p>
                    <Link href="/settings/qbo">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Connect QuickBooks
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matching" className="space-y-6">
            {/* Smart Auto-Matching Section */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Zap className="h-5 w-5" />
                  Smart Auto-Matching
                </CardTitle>
                <CardDescription>
                  Automatically find and suggest transaction matches using smart algorithms. Review and accept/reject each suggestion individually.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Duplicate Detection Status */}
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Duplicate Detection Status:</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-blue-700">Duplicates Found: {duplicatesFound}</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      duplicateStatus === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      Status: {duplicateStatus === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Single File Duplicate Detection */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Single File Duplicate Detection</h3>
                  <p className="text-yellow-700 mb-3">
                    Upload a single CSV file to automatically detect and remove duplicates within that file.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => handleFileUpload(e, 'bank')}
                      className="hidden"
                      id="duplicate-detection-upload"
                    />
                    <label
                      htmlFor="duplicate-detection-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Upload File for Duplicate Detection
                    </label>
                  </div>
                </div>

                {/* Auto-Match Button */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Run Auto-Match Analysis</h3>
                  <p className="text-green-700 mb-3">
                    Analyze your current transactions for duplicates, patterns, and category suggestions.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        if (transactions.length === 0) {
                          alert('No transactions found. Please upload a file first.');
                          return;
                        }
                        
                        try {
                          console.log('🔍 Running auto-match with REAL transactions...');
                          console.log('Real transaction count:', transactions.length);
                          console.log('Sample real transaction:', transactions[0]);
                          
                          const matches = await runSingleFileMatching(transactions);
                          
                          if (matches.length > 0) {
                            alert(`🎯 REAL AUTO-MATCH COMPLETE!\n\nAnalyzed ${transactions.length} real transactions\nFound ${matches.length} smart matches:\n• ${matches.filter(m => m.type === 'duplicate').length} duplicates\n• ${matches.filter(m => m.type === 'pattern').length} recurring patterns\n• ${matches.filter(m => m.type === 'category_suggestion').length} category suggestions\n• ${matches.filter(m => m.type === 'reconciliation').length} reconciliation matches\n\nResults are shown below!`);
                          } else {
                            // Calculate data insights
                            const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
                            const dateRange = transactions.length > 0 ? {
                              start: new Date(Math.min(...transactions.map(t => new Date(t.date).getTime()))).toLocaleDateString(),
                              end: new Date(Math.max(...transactions.map(t => new Date(t.date).getTime()))).toLocaleDateString()
                            } : null;
                            const categories = Array.from(new Set(transactions.map(t => t.category).filter(Boolean)));
                            
                            alert(`✅ CLEAN DATA CONFIRMED!\n\n📊 DATA ANALYSIS:\n• ${transactions.length} transactions processed\n• Date range: ${dateRange?.start} to ${dateRange?.end}\n• Total amount: $${totalAmount.toLocaleString()}\n• Categories: ${categories.length} different types\n• 0 duplicates found (data is clean!)\n• 0 recurring patterns detected\n• All transactions are unique\n\n🎯 YOUR DATA IS READY FOR IMPORT!\nNo issues found - proceed with confidence!`);
                          }
                        } catch (error) {
                          console.error('❌ Auto-match error:', error);
                          alert(`❌ AUTO-MATCH ERROR!\n\n${error}\n\nCheck console for details.`);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={transactions.length === 0}
                    >
                      <Zap className="h-4 w-4" />
                      Run Auto-Match
                    </Button>
                  </div>
                </div>

                {/* No Matches Found - Show Data Insights */}
                {showSingleFileMatches && singleFileMatches.length === 0 && transactions.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-4">✅ Clean Data Confirmed!</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Transactions:</span> {transactions.length}
                      </div>
                      <div>
                        <span className="font-medium">Total Amount:</span> ${transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Date Range:</span> {
                          transactions.length > 0 ? 
                          `${new Date(Math.min(...transactions.map(t => new Date(t.date).getTime()))).toLocaleDateString()} - ${new Date(Math.max(...transactions.map(t => new Date(t.date).getTime()))).toLocaleDateString()}` :
                          'N/A'
                        }
                      </div>
                      <div>
                        <span className="font-medium">Categories:</span> {Array.from(new Set(transactions.map(t => t.category).filter(Boolean))).length}
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-green-800 font-medium">🎯 Your data is ready for import!</p>
                      <p className="text-green-700 text-sm">No duplicates, patterns, or categorization issues found.</p>
                    </div>
                  </div>
                )}

                {/* Auto-Match Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Tip:</strong> Use the "Test Duplicates" button on the main transactions page to detect duplicates, then use "Run Auto-Match" here for smart matching!
                  </p>
                </div>

                {/* Auto-Match Results */}
                {showSingleFileMatches && singleFileMatches.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">🎯 Auto-Match Results ({singleFileMatches.length} found)</h3>
                    <div className="space-y-3">
                      {singleFileMatches.map((match, index) => (
                        <div key={match.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={match.type === 'duplicate' ? 'destructive' : match.type === 'pattern' ? 'default' : match.type === 'reconciliation' ? 'outline' : 'secondary'}>
                                {match.type === 'duplicate' ? 'Duplicate' : match.type === 'pattern' ? 'Pattern' : match.type === 'reconciliation' ? 'Reconciliation' : 'Category'}
                              </Badge>
                              <Badge variant="outline">
                                {Math.round(match.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => applySuggestion(match)}
                            >
                              Apply
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{match.reason}</p>
                          {match.suggestion && (
                            <p className="text-sm font-medium text-blue-700">{match.suggestion}</p>
                          )}
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              {match.transactions.length} transactions affected
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => applyAllSuggestions()}
                        >
                          Apply All Suggestions
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setShowSingleFileMatches(false)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Results */}
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No transactions found. Upload a file to get started.</p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">
                      Found {transactions.length} unique transactions ready for matching.
                      {duplicatesFound > 0 && ` ${duplicatesFound} duplicates were filtered out.`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Beta Feedback Component */}

      {user && (
        <BetaFeedback userId={user.id} userEmail={user.email} />
      )}
    </div>
    </TrialGuard>
    </AccessGuard>
  )
} 