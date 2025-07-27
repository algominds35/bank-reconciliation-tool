'use client'

import React, { useState } from 'react'
import { Transaction } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeftRight, Link, Calendar, DollarSign } from 'lucide-react'

interface MatchingInterfaceProps {
  bankTransactions: Transaction[]
  bookkeepingTransactions: Transaction[]
  onMatch: (bankId: string, bookkeepingId: string) => void
  loading?: boolean
}

export function MatchingInterface({ 
  bankTransactions, 
  bookkeepingTransactions, 
  onMatch,
  loading 
}: MatchingInterfaceProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [selectedBookkeeping, setSelectedBookkeeping] = useState<string | null>(null)

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toFixed(2)
    return amount >= 0 ? `$${formatted}` : `-$${formatted}`
  }

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const handleMatch = () => {
    if (selectedBank && selectedBookkeeping) {
      onMatch(selectedBank, selectedBookkeeping)
      setSelectedBank(null)
      setSelectedBookkeeping(null)
    }
  }

  const TransactionCard = ({ 
    transaction, 
    isSelected, 
    onSelect, 
    type 
  }: { 
    transaction: Transaction
    isSelected: boolean
    onSelect: () => void
    type: 'bank' | 'bookkeeping'
  }) => (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <Badge variant={type === 'bank' ? 'default' : 'secondary'}>
          {type === 'bank' ? 'Bank' : 'Books'}
        </Badge>
        <div className={`font-semibold ${getAmountColor(transaction.amount)}`}>
          {formatAmount(transaction.amount)}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-3 w-3" />
          <span>{new Date(transaction.date).toLocaleDateString()}</span>
        </div>
        
        <div className="text-sm font-medium text-gray-900">
          {transaction.description}
        </div>
        
        {transaction.category && (
          <Badge variant="outline" className="text-xs">
            {transaction.category}
          </Badge>
        )}
        
        {transaction.notes && (
          <div className="text-xs text-gray-500 italic">
            {transaction.notes}
          </div>
        )}
      </div>
    </div>
  )

  const unreconciled = {
    bank: bankTransactions.filter(t => !t.is_reconciled),
    bookkeeping: bookkeepingTransactions.filter(t => !t.is_reconciled)
  }

  return (
    <div className="space-y-6">
      {/* Matching Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Selected: <strong>{selectedBank ? '1 Bank' : '0 Bank'}</strong> + <strong>{selectedBookkeeping ? '1 Bookkeeping' : '0 Bookkeeping'}</strong>
              </div>
            </div>
            
            <Button
              onClick={handleMatch}
              disabled={!selectedBank || !selectedBookkeeping || loading}
              className="flex items-center space-x-2"
            >
              <Link className="h-4 w-4" />
              <span>Match Transactions</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-side Transaction Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bank Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span>Bank Transactions</span>
              <Badge variant="outline">{unreconciled.bank.length} unreconciled</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {unreconciled.bank.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No unreconciled bank transactions</p>
              </div>
            ) : (
              unreconciled.bank.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  isSelected={selectedBank === transaction.id}
                  onSelect={() => setSelectedBank(
                    selectedBank === transaction.id ? null : transaction.id
                  )}
                  type="bank"
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Matching Arrow */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white border border-gray-200 rounded-full p-3 shadow-md">
            <ArrowLeftRight className="h-6 w-6 text-gray-600" />
          </div>
        </div>

        {/* Bookkeeping Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Bookkeeping Transactions</span>
              <Badge variant="outline">{unreconciled.bookkeeping.length} unreconciled</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {unreconciled.bookkeeping.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No unreconciled bookkeeping transactions</p>
              </div>
            ) : (
              unreconciled.bookkeeping.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  isSelected={selectedBookkeeping === transaction.id}
                  onSelect={() => setSelectedBookkeeping(
                    selectedBookkeeping === transaction.id ? null : transaction.id
                  )}
                  type="bookkeeping"
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 