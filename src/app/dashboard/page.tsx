'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Transaction, ReconciliationSummary, Client } from '@/types'
import { ClientSelector } from '@/components/client-selector'
import { TransactionTable } from '@/components/transaction-table'
import { MatchingInterface } from '@/components/matching-interface'
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
  Plus
} from 'lucide-react'

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

  const fetchTransactions = async () => {
    try {
      // Fetch from both bank_transactions and book_transactions tables
      const [bankResult, bookResult] = await Promise.all([
        supabase.from('bank_transactions').select('*'),
        supabase.from('book_transactions').select('*')
      ])

      let allTransactions: Transaction[] = []

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

      setTransactions(allTransactions)
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
    const reconciled = transactions.filter(t => t.is_reconciled).length
    const unreconciled = total - reconciled
    const bankTransactions = transactions.filter(t => t.transaction_type === 'bank').length
    const bookkeepingTransactions = transactions.filter(t => t.transaction_type === 'bookkeeping').length
    const quickbooksTransactions = transactions.filter(t => t.transaction_type === 'quickbooks').length

    setSummary({ total, reconciled, unreconciled, bankTransactions, bookkeepingTransactions, quickbooksTransactions })
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, transactionType: 'bank' | 'bookkeeping') => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('Starting file upload:', file.name, 'Type:', transactionType)
    setUploading(true)
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        console.log('CSV parsing completed:', results)
        
        try {
          // Check if CSV has data
          if (!results.data || results.data.length === 0) {
            throw new Error('CSV file is empty or has no valid data')
          }

          console.log('CSV data found:', results.data.length, 'rows')

          // Check for required columns in first row
          const firstRow = results.data[0] as any
          console.log('First row:', firstRow)
          
          if (!firstRow || typeof firstRow !== 'object') {
            throw new Error('Invalid CSV format - no valid data rows found')
          }

          const hasDate = firstRow.date || firstRow.Date || firstRow.DATE
          const hasDescription = firstRow.description || firstRow.Description || firstRow.DESCRIPTION
          const hasAmount = firstRow.amount || firstRow.Amount || firstRow.AMOUNT

          if (!hasDate || !hasDescription || !hasAmount) {
            throw new Error(`CSV must have columns: date, description, amount. Found columns: ${Object.keys(firstRow).join(', ')}`)
          }

          console.log('CSV validation passed, processing rows...')
          
          let processedCount = 0
          
          for (const row of results.data as any[]) {
            // Skip empty rows
            if (!row || typeof row !== 'object') {
              continue
            }

            // Get values from row (case insensitive)
            const date = row.date || row.Date || row.DATE
            const description = row.description || row.Description || row.DESCRIPTION
            const amountStr = row.amount || row.Amount || row.AMOUNT

            if (!date || !description || !amountStr) {
              console.warn('Skipping incomplete row:', row)
              continue
            }

            // Parse amount - handle currency symbols and commas
            let amount: number
            try {
              const cleanAmount = String(amountStr).replace(/[$,\s]/g, '')
              amount = parseFloat(cleanAmount)
              
              if (isNaN(amount)) {
                console.warn(`Skipping row with invalid amount: ${amountStr}`)
                continue
              }
            } catch (e) {
              console.warn(`Error parsing amount ${amountStr}:`, e)
              continue
            }

            const transaction: Transaction = {
              id: crypto.randomUUID(),
              user_id: user?.id || 'anonymous',
              client_id: selectedClientId || undefined,
              date: String(date),
              description: String(description),
              amount: amount,
              transaction_type: transactionType,
              category: row.category || row.Category || null,
              notes: row.notes || row.Notes || null,
              is_reconciled: false
            }

            console.log('Processing transaction:', transaction)

            try {
              // Insert directly without client requirement - like it was working before
              const tableName = transactionType === 'bank' ? 'bank_transactions' : 'book_transactions'
              
              const { error } = await supabase
                .from(tableName)
                .insert({
                  client_id: null, // Allow null client_id like before
                  date: String(date),
                  description: String(description),
                  amount: amount,
                  type: amount >= 0 ? 'credit' : 'debit',
                  category: row.category || row.Category || null,
                  account: row.account || row.Account || null,
                  reference: row.reference || row.Reference || null,
                  is_reconciled: false
                })

              if (error) {
                console.error('Supabase insert error:', error)
                throw new Error(`Database error: ${error.message}`)
              }
              
              processedCount++
            } catch (dbError) {
              console.error('Database error for transaction:', transaction, dbError)
              throw dbError
            }
          }

          console.log(`Successfully processed ${processedCount} transactions`)

          if (processedCount === 0) {
            throw new Error('No valid transactions found in CSV file')
          }

          // Refresh the transactions list
          await fetchTransactions()
          await fetchClients()

          // Success message
          alert(`Successfully uploaded ${processedCount} ${transactionType} transactions!`)
          
        } catch (error) {
          console.error('Upload error details:', error)
          
          let errorMessage = 'Unknown error occurred'
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'string') {
            errorMessage = error
          } else if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = String(error.message)
          }
          
          alert(`Error uploading transactions: ${errorMessage}`)
        } finally {
          setUploading(false)
          // Reset file input
          event.target.value = ''
        }
      },
      error: (parseError) => {
        console.error('CSV parsing error:', parseError)
        alert(`Error reading CSV file: ${parseError.message}. Please check your file format.`)
        setUploading(false)
        event.target.value = ''
      }
    })
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
        
        // First, let's verify these IDs exist in the database
        const { data: existingBank, error: checkError } = await supabase
          .from('bank_transactions')
          .select('id')
          .in('id', bankIds)
        
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
      // Clear bank transactions
      const { error: bankError } = await supabase
        .from('bank_transactions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (bankError) {
        console.error('Error clearing bank transactions:', bankError)
      }

      // Clear book transactions
      const { error: bookError } = await supabase
        .from('book_transactions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (bookError) {
        console.error('Error clearing book transactions:', bookError)
      }

      // Refresh transactions
      await fetchTransactions()
      setSelectedTransactions([])
      calculateSummary()
    } catch (error) {
      console.error('Error clearing transactions:', error)
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
    const allTransactions = transactions // Export all transactions, not just reconciled
    
    if (allTransactions.length === 0) {
      alert('No transactions to export')
      return
    }

    try {
      const doc = new jsPDF()
      
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Transaction Report', 20, 25)
      
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
      
      doc.text(`Total Transactions: ${allTransactions.length}`, 20, 65)
      doc.text(`Reconciled: ${allTransactions.filter(t => t.is_reconciled).length}`, 20, 75)
      doc.text(`Unreconciled: ${allTransactions.filter(t => !t.is_reconciled).length}`, 20, 85)
      
      let currentY = 100
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      
      doc.setFillColor(59, 130, 246)
      doc.rect(20, currentY - 5, 170, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.text('Date', 25, currentY + 2)
      doc.text('Description', 50, currentY + 2)
      doc.text('Amount', 120, currentY + 2)
      doc.text('Type', 140, currentY + 2)
      doc.text('Status', 160, currentY + 2)
      
      currentY += 15
      
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      
      allTransactions.forEach((transaction, index) => {
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
        const status = transaction.is_reconciled ? 'Reconciled' : 'Unreconciled'
        
        doc.text(date, 25, currentY)
        doc.text(description, 50, currentY)
        doc.text(amount, 120, currentY)
        doc.text(type, 140, currentY)
        doc.text(status, 160, currentY)
        
        currentY += 10
        
        if (currentY > 250) {
          doc.addPage()
          currentY = 30
        }
      })
      
      const totalAmount = allTransactions.reduce((sum, t) => sum + t.amount, 0)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, currentY + 15)
      
      const pdfBlob = doc.output('blob')
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `transaction-report-${exportDate.replace(/\//g, '-')}.pdf`
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
              
              <a href="mailto:alex@usealgomind.com">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Support</span>
                </Button>
              </a>
              
              <Link href="/settings/qbo">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${qboStatus.connected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>QuickBooks</span>
                  {qboStatus.connected && (
                    <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-800">
                      ✓
                    </Badge>
                  )}
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
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{summary.total}</p>
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
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                      <div className="text-sm text-slate-600">Total Transactions</div>
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
                  accept=".csv"
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
                          accept=".csv"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'bookkeeping')}
                          disabled={uploading}
                        />
                      </div>
                    </div>

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
                      className="flex items-center space-x-2"
              >
                      <CheckCircle className="h-4 w-4" />
                      <span>Reconcile Selected ({selectedTransactions.length})</span>
                    </Button>

                    <Button
                      variant="outline"
                onClick={exportReconciled}
                disabled={transactions.length === 0}
                      className="flex items-center space-x-2"
              >
                      <Download className="h-4 w-4" />
                      <span>Export CSV</span>
                    </Button>

                    <Button
                      variant="outline"
                onClick={exportReconciledPDF}
                disabled={transactions.length === 0}
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
            <MatchingInterface
              bankTransactions={bankTransactions}
              bookkeepingTransactions={bookkeepingTransactions}
              onMatch={handleMatch}
              loading={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </TrialGuard>
    </AccessGuard>
  )
} 