'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Transaction, ReconciliationSummary } from '@/types'
import Papa from 'papaparse'
import jsPDF from 'jspdf'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'reconciled' | 'unreconciled'>('all')
  const [summary, setSummary] = useState<ReconciliationSummary>({ total: 0, reconciled: 0, unreconciled: 0 })
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchTransactions()
  }, [])

  useEffect(() => {
    applyFilter()
    calculateSummary()
  }, [transactions, filter])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
    } else {
      setUser(session.user)
    }
  }

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    let filtered = transactions
    if (filter === 'reconciled') {
      filtered = transactions.filter(t => t.is_reconciled)
    } else if (filter === 'unreconciled') {
      filtered = transactions.filter(t => !t.is_reconciled)
    }
    setFilteredTransactions(filtered)
  }

  const calculateSummary = () => {
    const total = transactions.length
    const reconciled = transactions.filter(t => t.is_reconciled).length
    const unreconciled = total - reconciled
    setSummary({ total, reconciled, unreconciled })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          for (const row of results.data as any[]) {
            if (row.date && row.description && row.amount) {
              const { error } = await supabase
                .from('transactions')
                .insert({
                  user_id: user.id,
                  date: row.date,
                  description: row.description,
                  amount: parseFloat(row.amount),
                  is_reconciled: false
                })

              if (error) throw error
            }
          }
          
          fetchTransactions()
        } catch (error) {
          console.error('Error uploading transactions:', error)
        } finally {
          setUploading(false)
        }
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

  const reconcileSelected = async () => {
    if (selectedTransactions.length < 2) {
      alert('Please select at least 2 transactions to reconcile')
      return
    }

    const reconciliationGroup = crypto.randomUUID()
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          is_reconciled: true, 
          reconciliation_group: reconciliationGroup 
        })
        .in('id', selectedTransactions)

      if (error) throw error
      
      setSelectedTransactions([])
      fetchTransactions()
    } catch (error) {
      console.error('Error reconciling transactions:', error)
    }
  }

  const unreconcileGroup = async (reconciliationGroup: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          is_reconciled: false, 
          reconciliation_group: null 
        })
        .eq('reconciliation_group', reconciliationGroup)

      if (error) throw error
      fetchTransactions()
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
      'Reconciliation Group': t.reconciliation_group
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'reconciled-transactions.csv'
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
      // Create new PDF document
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Reconciled Transactions Report', 20, 25)
      
      // Add export date
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      const exportDate = new Date().toLocaleDateString()
      doc.text(`Export Date: ${exportDate}`, 20, 35)
      
      // Add user email
      doc.text(`Account: ${user?.email}`, 20, 45)
      
      // Add summary info
      doc.text(`Total Reconciled Transactions: ${reconciledTransactions.length}`, 20, 55)
      
      // Add table headers
      let currentY = 70
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      
      // Header background
      doc.setFillColor(59, 130, 246) // Blue color matching UI
      doc.rect(20, currentY - 5, 170, 12, 'F')
      
      // Header text
      doc.setTextColor(255, 255, 255) // White text
      doc.text('Date', 25, currentY + 2)
      doc.text('Description', 55, currentY + 2) 
      doc.text('Amount', 130, currentY + 2)
      doc.text('Group ID', 155, currentY + 2)
      
      currentY += 15
      
      // Reset text color for data rows
      doc.setTextColor(0, 0, 0) // Black text
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      
      // Add transaction rows
      reconciledTransactions.forEach((transaction, index) => {
        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250) // Light gray
          doc.rect(20, currentY - 3, 170, 10, 'F')
        }
        
        // Transaction data
        const date = new Date(transaction.date).toLocaleDateString()
        const description = transaction.description.length > 35 
          ? transaction.description.substring(0, 32) + '...' 
          : transaction.description
        const amount = `$${transaction.amount.toFixed(2)}`
        const groupId = transaction.reconciliation_group?.substring(0, 8) || 'N/A'
        
        doc.text(date, 25, currentY)
        doc.text(description, 55, currentY)
        doc.text(amount, 130, currentY)
        doc.text(groupId, 155, currentY)
        
        currentY += 10
        
        // Add new page if needed
        if (currentY > 250) {
          doc.addPage()
          currentY = 30
        }
      })
      
      // Calculate total amount
      const totalAmount = reconciledTransactions.reduce((sum, t) => sum + t.amount, 0)
      const finalY = currentY + 10
      
      // Add total at the bottom
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, finalY + 15)
      
      // Generate PDF as blob
      const pdfBlob = doc.output('blob')
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reconciled-transactions-${exportDate.replace(/\//g, '-')}.pdf`
      link.setAttribute('type', 'application/pdf')
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Clean up
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Bank Reconciliation Tool</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Bar */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">
              {summary.reconciled} of {summary.total} transactions reconciled
            </div>
            <div className="flex space-x-6">
              <span>Total: {summary.total}</span>
              <span>Reconciled: {summary.reconciled}</span>
              <span>Unreconciled: {summary.unreconciled}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div>
                <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Upload CSV'}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Transactions</option>
                <option value="reconciled">Reconciled</option>
                <option value="unreconciled">Unreconciled</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={reconcileSelected}
                disabled={selectedTransactions.length < 2}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Reconcile Selected ({selectedTransactions.length})
              </button>

              <button
                onClick={exportReconciled}
                disabled={summary.reconciled === 0}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Export Reconciled
              </button>

              <button
                onClick={exportReconciledPDF}
                disabled={summary.reconciled === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Export as PDF
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reconciled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className={selectedTransactions.includes(transaction.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={() => handleTransactionSelect(transaction.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.is_reconciled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.is_reconciled ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.is_reconciled && transaction.reconciliation_group && (
                        <button
                          onClick={() => unreconcileGroup(transaction.reconciliation_group!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Unreconcile
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found. Upload a CSV file to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 