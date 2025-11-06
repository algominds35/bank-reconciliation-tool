'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Transaction } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, DollarSign, FileText, Unlink, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface TransactionTableProps {
  transactions: Transaction[]
  selectedTransactions: string[]
  onTransactionSelect: (transactionId: string) => void
  onUnreconcileGroup?: (reconciliationGroup: string) => void
  loading?: boolean
}

export function TransactionTable({ 
  transactions, 
  selectedTransactions, 
  onTransactionSelect,
  onUnreconcileGroup,
  loading 
}: TransactionTableProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Load sort order from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('transactionDateOrder')
    if (stored === 'asc' || stored === 'desc') {
      setSortOrder(stored)
    }
  }, [])

  // Save sort order to localStorage
  useEffect(() => {
    localStorage.setItem('transactionDateOrder', sortOrder)
  }, [sortOrder])

  // Sort transactions by date
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })
  }, [transactions, sortOrder])

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toFixed(2)
    return amount >= 0 ? `$${formatted}` : `-$${formatted}`
  }

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getTransactionTypeBadge = (type: 'bank' | 'bookkeeping' | 'quickbooks' | undefined) => {
    if (!type) {
      return (
        <Badge variant="outline">
          Unknown
        </Badge>
      )
    }
    
    switch (type) {
      case 'bank':
        return <Badge variant="default">Bank</Badge>
      case 'bookkeeping':
        return <Badge variant="secondary">Books</Badge>
      case 'quickbooks':
        return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">QuickBooks</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading transactions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">Upload a CSV file to get started with reconciliation.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <span className="sr-only">Select</span>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={toggleSort}
                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                    {sortOrder === 'desc' ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Amount</span>
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className={selectedTransactions.includes(transaction.id) ? 'bg-blue-50' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={() => onTransactionSelect(transaction.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={transaction.description}>
                      {transaction.description}
                    </div>
                    {transaction.notes && (
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {transaction.notes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={`font-semibold ${getAmountColor(transaction.amount)}`}>
                    {formatAmount(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {getTransactionTypeBadge(transaction.transaction_type)}
                  </TableCell>
                  <TableCell>
                    {transaction.category && (
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.is_reconciled ? 'default' : 'destructive'}>
                      {transaction.is_reconciled ? 'Reconciled' : 'Unreconciled'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.is_reconciled && transaction.reconciliation_group && onUnreconcileGroup && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnreconcileGroup(transaction.reconciliation_group!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 