'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  Building2,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BankTransaction {
  id: string
  stripe_transaction_id: string
  amount: number
  currency: string
  description: string
  transaction_date: string
  transaction_type: 'credit' | 'debit'
  category: string
  reference: string
  is_reconciled: boolean
  synced_at: string
  bank_account: {
    bank_name: string
    last_four: string
  }
}

interface TransactionViewerProps {
  bankAccountId?: string
}

export default function TransactionViewer({ bankAccountId }: TransactionViewerProps) {
  const [transactions, setTransactions] = useState<BankTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all')
  const [filterReconciled, setFilterReconciled] = useState<'all' | 'reconciled' | 'unreconciled'>('all')
  const [dateOrder, setDateOrder] = useState<'asc' | 'desc'>('desc')
  const { toast } = useToast()

  useEffect(() => {
    loadTransactions()
  }, [bankAccountId])

  useEffect(() => {
    const storedOrder = localStorage.getItem('transactionDateOrder')
    if (storedOrder === 'asc' || storedOrder === 'desc') {
      setDateOrder(storedOrder)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('transactionDateOrder', dateOrder)
  }, [dateOrder])

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      const url = bankAccountId 
        ? `/api/bank/transactions?account=${bankAccountId}`
        : '/api/bank/transactions'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setTransactions(data.transactions || [])
      } else {
        throw new Error(data.error || 'Failed to load transactions')
      }
    } catch (error) {
      console.error('Failed to load transactions:', error)
      toast({
        title: 'Error',
        description: 'Failed to load bank transactions',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncTransactions = async () => {
    if (!bankAccountId) return
    
    try {
      setIsSyncing(true)
      
      const response = await fetch('/api/bank/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account_id: bankAccountId,
          days: 30
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Sync Complete',
          description: `Synced ${data.transactions_synced} new transactions`,
          variant: 'default'
        })
        
        // Reload transactions
        await loadTransactions()
      } else {
        throw new Error(data.error || 'Failed to sync transactions')
      }

    } catch (error) {
      console.error('Transaction sync error:', error)
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Failed to sync transactions',
        variant: 'destructive'
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Type filter
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType
    
    // Reconciliation filter
    const matchesReconciled = filterReconciled === 'all' || 
      (filterReconciled === 'reconciled' && transaction.is_reconciled) ||
      (filterReconciled === 'unreconciled' && !transaction.is_reconciled)
    
    return matchesSearch && matchesType && matchesReconciled
  })

  const getComparableDate = (value?: string | null) => {
    if (!value) return 0
    const time = new Date(value).getTime()
    return Number.isNaN(time) ? 0 : time
  }

  const orderedTransactions = useMemo(() => {
    const sorter = (a: BankTransaction, b: BankTransaction) => {
      const dateA = getComparableDate(a.transaction_date)
      const dateB = getComparableDate(b.transaction_date)
      return dateOrder === 'desc' ? dateB - dateA : dateA - dateB
    }

    return [...filteredTransactions].sort(sorter)
  }, [filteredTransactions, dateOrder])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const totalTransactions = transactions.length
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const reconciledCount = transactions.filter(tx => tx.is_reconciled).length
  const unreconciledCount = totalTransactions - reconciledCount

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Transactions
          </CardTitle>
          <CardDescription>
            Loading your bank transactions...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Bank Transactions
        </CardTitle>
        <CardDescription>
          View and manage your synced bank transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Transactions</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{totalTransactions}</div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Total Amount</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(totalAmount)}</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Reconciled</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{reconciledCount}</div>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Unreconciled</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">{unreconciledCount}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button
              variant={filterType === 'credit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('credit')}
            >
              Credits
            </Button>
            <Button
              variant={filterType === 'debit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('debit')}
            >
              Debits
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={dateOrder === 'desc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateOrder('desc')}
            >
              Newest → Oldest
            </Button>
            <Button
              variant={dateOrder === 'asc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateOrder('asc')}
            >
              Oldest → Newest
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterReconciled === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterReconciled('all')}
            >
              All
            </Button>
            <Button
              variant={filterReconciled === 'reconciled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterReconciled('reconciled')}
            >
              Reconciled
            </Button>
            <Button
              variant={filterReconciled === 'unreconciled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterReconciled('unreconciled')}
            >
              Unreconciled
            </Button>
          </div>
          
          {bankAccountId && (
            <Button
              onClick={handleSyncTransactions}
              disabled={isSyncing}
              variant="outline"
              size="sm"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          {orderedTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filterType !== 'all' || filterReconciled !== 'all' 
                ? 'No transactions match your filters'
                : 'No transactions found. Connect a bank account to get started.'
              }
            </div>
          ) : (
            orderedTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.transaction_type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.transaction_type === 'credit' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-600">
                      {transaction.bank_account.bank_name} •••• {transaction.bank_account.last_four}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(transaction.transaction_date)}
                      {transaction.category && ` • ${transaction.category}`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`text-right ${
                    transaction.transaction_type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    <div className="font-medium">
                      {transaction.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                  
                  <Badge 
                    variant={transaction.is_reconciled ? 'default' : 'secondary'}
                  >
                    {transaction.is_reconciled ? 'Reconciled' : 'Unreconciled'}
                  </Badge>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More / Export */}
        <div className="flex justify-center pt-4">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
