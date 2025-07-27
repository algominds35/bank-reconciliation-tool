'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Transaction, ReconciliationSummary, Client } from '@/types'
import { ClientSelector } from '@/components/client-selector'
import { TransactionTable } from '@/components/transaction-table'
import { MatchingInterface } from '@/components/matching-interface'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  AlertCircle,
  LogOut
} from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'reconciled' | 'unreconciled'>('all')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<'all' | 'bank' | 'bookkeeping'>('all')
  const [summary, setSummary] = useState<ReconciliationSummary>({ 
    total: 0, 
    reconciled: 0, 
    unreconciled: 0,
    bankTransactions: 0,
    bookkeepingTransactions: 0
  })
  const [activeTab, setActiveTab] = useState('transactions')
  const router = useRouter()

  useEffect(() => {
    if (isSupabaseConfigured) {
      checkUser()
    } else {
      // Demo mode - set a dummy user
      setUser({ id: 'demo-user', email: 'demo@example.com' })
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      fetchClients()
      fetchTransactions()
    }
  }, [user, selectedClientId])

  useEffect(() => {
    applyFilters()
    calculateSummary()
  }, [transactions, filter, transactionTypeFilter])

  const checkUser = async () => {
    if (!isSupabaseConfigured) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
      } else {
        setUser(session.user)
      }
    } catch (error) {
      console.warn('Supabase auth check failed:', error)
      // Fallback to demo mode
      setUser({ id: 'demo-user', email: 'demo@example.com' })
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    if (!isSupabaseConfigured) return
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('business_name')

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.warn('Error fetching clients:', error)
      setClients([])
    }
  }

  const fetchTransactions = async () => {
    if (!isSupabaseConfigured) return
    
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)

      if (selectedClientId) {
        query = query.eq('client_id', selectedClientId)
      }

      const { data, error } = await query.order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.warn('Error fetching transactions:', error)
      setTransactions([])
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

    setSummary({ total, reconciled, unreconciled, bankTransactions, bookkeepingTransactions })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, transactionType: 'bank' | 'bookkeeping') => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const newTransactions: Transaction[] = []
          
          // Check if CSV has data
          if (!results.data || results.data.length === 0) {
            throw new Error('CSV file is empty or has no valid data')
          }

          // Check for required columns
          const firstRow = results.data[0] as any
          if (!firstRow.date || !firstRow.description || !firstRow.amount) {
            throw new Error('CSV must have columns: date, description, amount')
          }
          
          for (const row of results.data as any[]) {
            // Skip empty rows
            if (!row.date || !row.description || !row.amount) {
              continue
            }

            // Validate and parse amount
            const amount = typeof row.amount === 'string' 
              ? parseFloat(row.amount.replace(/[,$]/g, '')) 
              : parseFloat(row.amount)
            
            if (isNaN(amount)) {
              console.warn(`Skipping row with invalid amount: ${row.amount}`)
              continue
            }

            const transaction: Transaction = {
              id: crypto.randomUUID(),
              user_id: user?.id || 'demo-user',
              client_id: selectedClientId || undefined,
              date: row.date,
              description: row.description.toString(),
              amount: amount,
              transaction_type: transactionType,
              category: row.category ? row.category.toString() : null,
              notes: row.notes ? row.notes.toString() : null,
              is_reconciled: false
            }

            if (isSupabaseConfigured) {
              const { error } = await supabase
                .from('transactions')
                .insert(transaction)

              if (error) throw error
            } else {
              newTransactions.push(transaction)
            }
          }
          
          if (isSupabaseConfigured) {
            fetchTransactions()
          } else {
            setTransactions(prev => [...prev, ...newTransactions])
          }

          // Success message
          alert(`Successfully uploaded ${newTransactions.length || 'all'} transactions!`)
          
        } catch (error) {
          console.error('Error uploading transactions:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
          alert(`Error uploading transactions: ${errorMessage}. Please check your CSV format.`)
        } finally {
          setUploading(false)
          // Reset file input
          event.target.value = ''
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
        alert(`Error reading CSV file: ${error.message}. Please check your file format.`)
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
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('transactions')
          .update({ 
            is_reconciled: true, 
            reconciliation_group: reconciliationGroup 
          })
          .in('id', [bankId, bookkeepingId])

        if (error) throw error
        fetchTransactions()
      } else {
        setTransactions(prev => prev.map(t => 
          [bankId, bookkeepingId].includes(t.id)
            ? { ...t, is_reconciled: true, reconciliation_group: reconciliationGroup }
            : t
        ))
      }
    } catch (error) {
      console.error('Error matching transactions:', error)
    }
  }

  const reconcileSelected = async () => {
    if (selectedTransactions.length < 2) {
      alert('Please select at least 2 transactions to reconcile')
      return
    }

    const reconciliationGroup = crypto.randomUUID()
    
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('transactions')
          .update({ 
            is_reconciled: true, 
            reconciliation_group: reconciliationGroup 
          })
          .in('id', selectedTransactions)

        if (error) throw error
        fetchTransactions()
      } else {
        setTransactions(prev => prev.map(t => 
          selectedTransactions.includes(t.id)
            ? { ...t, is_reconciled: true, reconciliation_group: reconciliationGroup }
            : t
        ))
      }
      
      setSelectedTransactions([])
    } catch (error) {
      console.error('Error reconciling transactions:', error)
    }
  }

  const unreconcileGroup = async (reconciliationGroup: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('transactions')
          .update({ 
            is_reconciled: false, 
            reconciliation_group: null 
          })
          .eq('reconciliation_group', reconciliationGroup)

        if (error) throw error
        fetchTransactions()
      } else {
        setTransactions(prev => prev.map(t => 
          t.reconciliation_group === reconciliationGroup
            ? { ...t, is_reconciled: false, reconciliation_group: null }
            : t
        ))
      }
    } catch (error) {
      console.error('Error unreconciling transactions:', error)
    }
  }

  const exportReconciled = async () => {
    const reconciledTransactions = transactions.filter(t => t.is_reconciled)
    
    const csvData = reconciledTransactions.map(t => ({
      Date: t.date,
      Description: t.description,
      Amount: t.amount,
      Type: t.transaction_type,
      Category: t.category || '',
      'Reconciliation Group': t.reconciliation_group,
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
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } else {
      router.push('/')
    }
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
              {!isSupabaseConfigured && (
                <Badge variant="secondary" className="text-xs">
                  Demo Mode
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <ClientSelector
                clients={clients}
                selectedClientId={selectedClientId}
                onClientChange={setSelectedClientId}
                loading={loading}
              />
              
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

      {/* Demo Mode Notice */}
      {!isSupabaseConfigured && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2 text-blue-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                <strong>Demo Mode:</strong> Upload CSV files to test all features. Data won't persist between sessions.
              </span>
            </div>
          </div>
        </div>
      )}

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
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="matching">Smart Matching</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            {/* Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center flex-wrap">
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
  )
} 