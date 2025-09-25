'use client'

import React, { useState, useEffect } from 'react'
import { Transaction } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeftRight, Link, Calendar, DollarSign, Zap, CheckCircle, X, AlertTriangle, Settings } from 'lucide-react'
import { DuplicateDetectionV2 } from '@/components/DuplicateDetectionV2'
import { Txn } from '@/lib/duplicateDetection'

interface MatchingInterfaceProps {
  bankTransactions: Transaction[]
  bookkeepingTransactions: Transaction[]
  onMatch: (bankId: string, bookkeepingId: string) => void
  loading?: boolean
}

interface AutoMatch {
  bankTransaction: Transaction
  bookkeepingTransaction: Transaction
  confidence: number
  reason: string
}

export function MatchingInterface({ 
  bankTransactions, 
  bookkeepingTransactions, 
  onMatch,
  loading 
}: MatchingInterfaceProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [selectedBookkeeping, setSelectedBookkeeping] = useState<string | null>(null)
  const [autoMatches, setAutoMatches] = useState<AutoMatch[]>([])
  const [showAutoMatches, setShowAutoMatches] = useState(false)
  const [processingAutoMatch, setProcessingAutoMatch] = useState(false)
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([])
  const [hasDuplicates, setHasDuplicates] = useState(false)
  const [showDuplicateDetectionV2, setShowDuplicateDetectionV2] = useState(false)
  const [allTransactions, setAllTransactions] = useState<Txn[]>([])

  // Convert transactions to new format for Duplicate Detection v2
  useEffect(() => {
    const convertTransactions = () => {
      const allTxns: Txn[] = []
      
      // Convert bank transactions
      bankTransactions.forEach(txn => {
        allTxns.push({
          id: `bank_${txn.id}`,
          date: txn.date,
          amount: parseFloat(txn.amount.toString()),
          type: parseFloat(txn.amount.toString()) > 0 ? 'income' : 'expense',
          description: txn.description,
          category: txn.category,
          bank_reference_id: txn.id,
          created_at: new Date().toISOString()
        })
      })
      
      // Convert bookkeeping transactions
      bookkeepingTransactions.forEach(txn => {
        allTxns.push({
          id: `book_${txn.id}`,
          date: txn.date,
          amount: parseFloat(txn.amount.toString()),
          type: parseFloat(txn.amount.toString()) > 0 ? 'income' : 'expense',
          description: txn.description,
          category: txn.category,
          created_at: new Date().toISOString()
        })
      })
      
      setAllTransactions(allTxns)
    }
    
    convertTransactions()
  }, [bankTransactions, bookkeepingTransactions])

  // Check for pending duplicates from localStorage
  useEffect(() => {
    const checkPendingDuplicates = () => {
      try {
        const stored = localStorage.getItem('pendingDuplicates')
        console.log('=== CHECKING LOCALSTORAGE FOR DUPLICATES ===')
        console.log('Stored data:', stored)
        
        if (stored) {
          const data = JSON.parse(stored)
          console.log('Parsed data:', data)
          console.log('Duplicates found:', data.duplicates?.length || 0)
          
          if (data.duplicates && data.duplicates.length > 0) {
            console.log('✅ Setting duplicate matches:', data.duplicates)
            setDuplicateMatches(data.duplicates)
            setHasDuplicates(true)
            setShowAutoMatches(true)
            console.log('✅ Duplicates loaded successfully!')
          } else {
            console.log('❌ No duplicates in stored data')
          }
        } else {
          console.log('❌ No data found in localStorage')
        }
      } catch (error) {
        console.error('❌ Error loading pending duplicates:', error)
      }
    }

    checkPendingDuplicates()
  }, [])

  // Also check when component becomes visible (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('=== TAB BECAME VISIBLE - RE-CHECKING DUPLICATES ===')
        const stored = localStorage.getItem('pendingDuplicates')
        if (stored) {
          const data = JSON.parse(stored)
          if (data.duplicates && data.duplicates.length > 0) {
            console.log('✅ Re-loading duplicates on tab switch:', data.duplicates.length)
            setDuplicateMatches(data.duplicates)
            setHasDuplicates(true)
            setShowAutoMatches(true)
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

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

  // Auto-matching algorithm
  const findAutoMatches = (): AutoMatch[] => {
    const unreconciledBank = bankTransactions.filter(t => !t.is_reconciled)
    const unreconciledBookkeeping = bookkeepingTransactions.filter(t => !t.is_reconciled)
    
    const matches: AutoMatch[] = []
    
    unreconciledBank.forEach(bankTrans => {
      unreconciledBookkeeping.forEach(bookTrans => {
        let confidence = 0
        let reason = ''
        
        // Exact amount match (highest priority)
        if (Math.abs(bankTrans.amount - bookTrans.amount) < 0.01) {
          confidence += 50
          reason += 'Exact amount match, '
        }
        
        // Date match (within 3 days)
        const bankDate = new Date(bankTrans.date)
        const bookDate = new Date(bookTrans.date)
        const daysDiff = Math.abs(bankDate.getTime() - bookDate.getTime()) / (1000 * 60 * 60 * 24)
        
        if (daysDiff <= 3) {
          confidence += 20
          reason += 'Date within 3 days, '
        }
        
        // Description similarity (fuzzy matching)
        const bankDesc = bankTrans.description.toLowerCase()
        const bookDesc = bookTrans.description.toLowerCase()
        
        // Check for common words
        const bankWords = bankDesc.split(' ')
        const bookWords = bookDesc.split(' ')
        const commonWords = bankWords.filter(word => bookWords.includes(word))
        
        if (commonWords.length >= 2) {
          confidence += 15
          reason += 'Description similarity, '
        }
        
        // Exact description match
        if (bankDesc === bookDesc) {
          confidence += 25
          reason += 'Exact description match, '
        }
        
        // Category match
        if (bankTrans.category && bookTrans.category && 
            bankTrans.category.toLowerCase() === bookTrans.category.toLowerCase()) {
          confidence += 10
          reason += 'Category match, '
        }
        
        if (confidence >= 70) {
          matches.push({
            bankTransaction: bankTrans,
            bookkeepingTransaction: bookTrans,
            confidence,
            reason: reason.slice(0, -2) // Remove trailing comma
          })
        }
      })
    })
    
    // Sort by confidence (highest first)
    return matches.sort((a, b) => b.confidence - a.confidence)
  }

  const runAutoMatch = () => {
    setProcessingAutoMatch(true)
    setTimeout(() => {
      const matches = findAutoMatches()
      setAutoMatches(matches)
      setShowAutoMatches(true)
      setProcessingAutoMatch(false)
    }, 1000)
  }

  const acceptAutoMatch = (match: AutoMatch) => {
    onMatch(match.bankTransaction.id, match.bookkeepingTransaction.id)
    setAutoMatches(prev => prev.filter(m => m !== match))
  }

  const rejectAutoMatch = (match: AutoMatch) => {
    setAutoMatches(prev => prev.filter(m => m !== match))
  }

  const acceptAllAutoMatches = () => {
    autoMatches.forEach(match => {
      onMatch(match.bankTransaction.id, match.bookkeepingTransaction.id)
    })
    setAutoMatches([])
  }

  const clearDuplicates = () => {
    setDuplicateMatches([])
    setHasDuplicates(false)
    localStorage.removeItem('pendingDuplicates')
  }

  const removeDuplicate = (groupIndex: number, duplicateIndex: number) => {
    const newDuplicates = [...duplicateMatches]
    newDuplicates[groupIndex].duplicates.splice(duplicateIndex, 1)
    
    // If no more duplicates in this group, remove the whole group
    if (newDuplicates[groupIndex].duplicates.length === 0) {
      newDuplicates.splice(groupIndex, 1)
    }
    
    setDuplicateMatches(newDuplicates)
    
    // If no more duplicate groups, clear everything
    if (newDuplicates.length === 0) {
      setHasDuplicates(false)
      localStorage.removeItem('pendingDuplicates')
    }
  }

  useEffect(() => {
    // Auto-run matching when transactions change
    if (bankTransactions.length > 0 && bookkeepingTransactions.length > 0) {
      const matches = findAutoMatches()
      setAutoMatches(matches)
    }
  }, [bankTransactions, bookkeepingTransactions])

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
      {/* Auto-Matching Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <CardTitle>Smart Auto-Matching</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={runAutoMatch}
                disabled={processingAutoMatch || unreconciled.bank.length === 0 || unreconciled.bookkeeping.length === 0}
                className="flex items-center space-x-2"
              >
                {processingAutoMatch ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Run Auto-Match</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Automatically find and suggest transaction matches using smart algorithms. 
            Review and accept/reject each suggestion individually.
          </p>
          
          {/* DEBUG: Show what we have */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <h4 className="font-semibold text-blue-800">Duplicate Detection Status:</h4>
            <p className="text-sm">Duplicates Found: {duplicateMatches.length}</p>
            <p className="text-sm">Status: {hasDuplicates ? 'Active' : 'Inactive'}</p>
          </div>

          {/* Show duplicates if they exist */}
          {hasDuplicates && duplicateMatches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-orange-600">
                  Found {duplicateMatches.length} duplicate groups in your CSV
                </h3>
                <Button 
                  onClick={clearDuplicates}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Clear All</span>
                </Button>
              </div>
              
              {duplicateMatches.map((duplicateGroup, index) => (
                <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      95% confidence
                    </Badge>
                    <span className="text-sm text-orange-700 font-medium">
                      {duplicateGroup.reason}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">Keep This One</span>
                      </div>
                      <div className="text-sm font-medium">{duplicateGroup.original.description}</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatAmount(duplicateGroup.original.amount)}
                      </div>
                      <div className="text-xs text-gray-500">{duplicateGroup.original.date}</div>
                    </div>
                    
                    <div className="space-y-2">
                      {duplicateGroup.duplicates.map((duplicate: any, dupIndex: number) => (
                        <div key={dupIndex} className="bg-white rounded-lg p-3 border border-red-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm font-medium text-red-700">Duplicate</span>
                            </div>
                            <Button
                              onClick={() => removeDuplicate(index, dupIndex)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-sm font-medium">{duplicate.description}</div>
                          <div className="text-lg font-bold text-red-600">
                            {formatAmount(duplicate.amount)}
                          </div>
                          <div className="text-xs text-gray-500">{duplicate.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show regular matches if they exist */}
          {!hasDuplicates && autoMatches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Found {autoMatches.length} potential matches
                </h3>
                <Button 
                  onClick={acceptAllAutoMatches}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Accept All</span>
                </Button>
              </div>
              
              <div className="space-y-3">
                {autoMatches.map((match, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`${
                          match.confidence >= 90 ? 'bg-green-100 text-green-800' :
                          match.confidence >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {match.confidence}% confidence
                        </Badge>
                        <span className="text-sm text-gray-600">{match.reason}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={() => acceptAutoMatch(match)}
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Accept</span>
                        </Button>
                        <Button 
                          onClick={() => rejectAutoMatch(match)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <X className="h-3 w-3" />
                          <span>Reject</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm font-medium text-gray-900 mb-1">Bank Transaction</div>
                        <div className="text-sm text-gray-600">{match.bankTransaction.description}</div>
                        <div className="text-sm font-semibold text-green-600">
                          {formatAmount(match.bankTransaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(match.bankTransaction.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm font-medium text-gray-900 mb-1">Bookkeeping Transaction</div>
                        <div className="text-sm text-gray-600">{match.bookkeepingTransaction.description}</div>
                        <div className="text-sm font-semibold text-green-600">
                          {formatAmount(match.bookkeepingTransaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(match.bookkeepingTransaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {autoMatches.length === 0 && !hasDuplicates && !processingAutoMatch && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No automatic matches found. Try manual matching below.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Manual Matching Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-blue-500" />
            <CardTitle>Manual Matching</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Manually select and match transactions. Click one transaction from each side to create a match.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bank Transactions */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Bank Transactions ({unreconciled.bank.length})</span>
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {unreconciled.bank.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    isSelected={selectedBank === transaction.id}
                    onSelect={() => setSelectedBank(transaction.id)}
                    type="bank"
                  />
                ))}
              </div>
            </div>

            {/* Bookkeeping Transactions */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Link className="h-4 w-4" />
                <span>Bookkeeping Transactions ({unreconciled.bookkeeping.length})</span>
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {unreconciled.bookkeeping.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    isSelected={selectedBookkeeping === transaction.id}
                    onSelect={() => setSelectedBookkeeping(transaction.id)}
                    type="bookkeeping"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Match Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleMatch}
              disabled={!selectedBank || !selectedBookkeeping}
              className="flex items-center space-x-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Match Selected Transactions</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Duplicate Detection v2 */}
      {allTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-500" />
                <CardTitle>Professional Duplicate Detection</CardTitle>
              </div>
              <Button 
                onClick={() => setShowDuplicateDetectionV2(!showDuplicateDetectionV2)}
                variant="outline"
                size="sm"
              >
                {showDuplicateDetectionV2 ? 'Hide' : 'Show'} Advanced
              </Button>
            </div>
          </CardHeader>
          {showDuplicateDetectionV2 && (
            <CardContent>
              <DuplicateDetectionV2 
                transactions={allTransactions}
                onExport={(data, filename) => {
                  console.log('Export requested:', filename, data);
                  // Handle export here
                }}
              />
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
} 