'use client'

import React, { useEffect, useState } from 'react'

interface QboAccount {
  id: string
  account_name: string
  account_type: string
  balance: number
  currency: string
}

interface QboTransaction {
  id: string
  transaction_date: string
  transaction_type: string
  amount: number
  memo: string
  reference_number: string
}

interface Duplicate {
  transaction1: QboTransaction
  transaction2: QboTransaction
  confidence: number
  reason: string
  type: 'exact' | 'likely' | 'possible'
}

interface QboDashboardProps {
  realmId: string
}

interface BankTransaction {
  date: string
  amount: number
  description: string
}

interface DiscrepancyReport {
  inBankOnly: BankTransaction[]
  inQuickBooksOnly: QboTransaction[]
  duplicatesAcrossSystems: any[]
  summary: {
    totalBankTransactions: number
    totalQBTransactions: number
    matched: number
    missingFromQB: number
    missingFromBank: number
  }
}

export default function QboDashboard({ realmId }: QboDashboardProps) {
  const [accounts, setAccounts] = useState<QboAccount[]>([])
  const [transactions, setTransactions] = useState<QboTransaction[]>([])
  const [duplicates, setDuplicates] = useState<Duplicate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bankFile, setBankFile] = useState<File | null>(null)
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([])
  const [discrepancyReport, setDiscrepancyReport] = useState<DiscrepancyReport | null>(null)
  const [comparing, setComparing] = useState(false)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [reconciledTransactions, setReconciledTransactions] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (realmId) {
      fetchDashboardData()
    }
  }, [realmId])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch accounts
      const accountsResponse = await fetch(`/api/qbo/accounts?realmId=${realmId}`)
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        setAccounts(accountsData.accounts || [])
      }
      
      // Fetch recent transactions
      const transactionsResponse = await fetch(`/api/qbo/transactions?realmId=${realmId}&limit=50`)
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData.transactions || [])
      }
      
      // Fetch duplicates
      const duplicatesResponse = await fetch(`/api/qbo/duplicates?realmId=${realmId}`)
      if (duplicatesResponse.ok) {
        const duplicatesData = await duplicatesResponse.json()
        setDuplicates(duplicatesData.duplicates || [])
      }
      
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBankFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setBankFile(file)

    // Parse CSV
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].toLowerCase().split(',')
    
    const parsed: BankTransaction[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      const dateIdx = headers.findIndex(h => h.includes('date'))
      const amountIdx = headers.findIndex(h => h.includes('amount'))
      const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('memo') || h.includes('payee'))
      
      if (dateIdx >= 0 && amountIdx >= 0) {
        parsed.push({
          date: values[dateIdx]?.trim() || '',
          amount: parseFloat(values[amountIdx]?.replace(/[^0-9.-]/g, '') || '0'),
          description: values[descIdx]?.trim() || ''
        })
      }
    }
    
    setBankTransactions(parsed)
    console.log(`Parsed ${parsed.length} bank transactions`)
  }

  const generateDiscrepancyReport = async () => {
    if (bankTransactions.length === 0) {
      alert('Please upload a bank statement first')
      return
    }

    setComparing(true)
    try {
      const response = await fetch('/api/qbo/discrepancy-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          realmId,
          bankTransactions
        })
      })

      if (response.ok) {
        const data = await response.json()
        setDiscrepancyReport(data.report)
      } else {
        alert('Failed to generate discrepancy report')
      }
    } catch (err) {
      console.error('Discrepancy report error:', err)
      alert('Failed to generate report')
    } finally {
      setComparing(false)
    }
  }

  const exportDiscrepancyReport = () => {
    if (!discrepancyReport) return

    let csv = 'Category,Date,Description,Amount\n'
    
    discrepancyReport.inBankOnly.forEach(tx => {
      csv += `Missing from QuickBooks,${tx.date},"${tx.description}",${tx.amount}\n`
    })
    
    discrepancyReport.inQuickBooksOnly.forEach(tx => {
      csv += `Missing from Bank,${tx.transaction_date},"${tx.memo}",${tx.amount}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `discrepancy-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading QuickBooks data...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#dc2626' }}>
        Error: {error}
      </div>
    )
  }

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0)

  // Check if a transaction is involved in any duplicate pair
  const isDuplicate = (txId: string) => {
    return duplicates.some(dup => 
      dup.transaction1.id === txId || dup.transaction2.id === txId
    )
  }

  // Reconciliation handlers
  const handleSelectTransaction = (txId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(txId) 
        ? prev.filter(id => id !== txId)
        : [...prev, txId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(transactions.map(t => t.id))
    }
  }

  const handleReconcileSelected = () => {
    if (selectedTransactions.length === 0) {
      alert('Please select transactions to reconcile')
      return
    }

    const newReconciled = new Set(reconciledTransactions)
    selectedTransactions.forEach(id => newReconciled.add(id))
    setReconciledTransactions(newReconciled)
    setSelectedTransactions([])
    
    alert(`✅ Reconciled ${selectedTransactions.length} transaction(s)!`)
  }

  const handleClearAll = () => {
    setSelectedTransactions([])
  }

  const handleExportTransactions = () => {
    if (transactions.length === 0) {
      alert('No transactions to export')
      return
    }

    // Create CSV content
    const headers = ['Date', 'Type', 'Description', 'Reference', 'Amount', 'Status']
    const rows = transactions.map(tx => [
      new Date(tx.transaction_date).toLocaleDateString(),
      tx.transaction_type,
      tx.memo || 'No description',
      tx.reference_number || '-',
      Math.abs(tx.amount || 0).toFixed(2),
      reconciledTransactions.has(tx.id) ? 'Reconciled' : 'Unreconciled'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quickbooks-transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
        QuickBooks Dashboard
      </h2>

      {/* Duplicate Warning Banner */}
      {duplicates.length > 0 && (
        <div style={{ 
          background: '#fef3c7', 
          border: '1px solid #fbbf24', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <svg style={{ width: '24px', height: '24px', color: '#d97706', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', margin: '0 0 4px 0' }}>
              ⚠️ {duplicates.length} Potential Duplicate{duplicates.length > 1 ? 's' : ''} Found
            </h3>
            <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>
              Review transactions marked with ⚠️ below. These may be duplicate entries that should be removed.
            </p>
          </div>
        </div>
      )}
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Total Balance</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: '#0f172a' }}>
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Total Transactions</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: '#0f172a' }}>
            {transactions.length}
          </p>
        </div>

        <div style={{ background: '#dcfce7', border: '1px solid #16a34a', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#166534', margin: '0 0 8px 0' }}>✓ Reconciled</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: '#16a34a' }}>
            {reconciledTransactions.size}
          </p>
        </div>

        <div style={{ background: '#fee2e2', border: '1px solid #dc2626', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#991b1b', margin: '0 0 8px 0' }}>Unreconciled</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: '#dc2626' }}>
            {transactions.length - reconciledTransactions.size}
          </p>
        </div>
        
        <div style={{ background: duplicates.length > 0 ? '#fef3c7' : '#f8fafc', border: `1px solid ${duplicates.length > 0 ? '#fbbf24' : '#e2e8f0'}`, borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>⚠️ Potential Duplicates</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: duplicates.length > 0 ? '#d97706' : '#16a34a' }}>
            {duplicates.length}
          </p>
        </div>
      </div>

      {/* Accounts Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Connected Bank Accounts</h3>
        {accounts.length > 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Account Name
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Type
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      {account.account_name}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>
                      {account.account_type}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: '500' }}>
                      ${(account.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No accounts found. Try running a sync first.</p>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Recent Transactions</h3>
        
        {/* Action Buttons */}
        {transactions.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={handleReconcileSelected}
              disabled={selectedTransactions.length === 0}
              style={{
                padding: '10px 20px',
                background: selectedTransactions.length === 0 ? '#94a3b8' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: selectedTransactions.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ✓ Reconcile Selected ({selectedTransactions.length})
            </button>
            
            <button
              onClick={handleExportTransactions}
              style={{
                padding: '10px 20px',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ↓ Export ({transactions.length})
            </button>
            
            <button
              onClick={handleClearAll}
              disabled={selectedTransactions.length === 0}
              style={{
                padding: '10px 20px',
                background: selectedTransactions.length === 0 ? '#f1f5f9' : '#ef4444',
                color: selectedTransactions.length === 0 ? '#94a3b8' : '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: selectedTransactions.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Clear All
            </button>
          </div>
        )}
        
        {transactions.length > 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500', width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                      onChange={handleSelectAll}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Type
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Description
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Reference
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Amount
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((transaction) => {
                  const hasDuplicate = isDuplicate(transaction.id)
                  const isReconciled = reconciledTransactions.has(transaction.id)
                  const isSelected = selectedTransactions.includes(transaction.id)
                  const rowStyle = hasDuplicate ? { background: '#fef3c7' } : isReconciled ? { background: '#dcfce7' } : {}
                  
                  return (
                    <tr key={transaction.id} style={rowStyle}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectTransaction(transaction.id)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          disabled={isReconciled}
                        />
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {hasDuplicate && (
                            <>
                              <span title="Potential duplicate transaction" style={{ color: '#d97706', fontSize: '16px' }}>
                                ⚠️
                              </span>
                              <span style={{ 
                                color: '#d97706', 
                                fontSize: '11px', 
                                fontWeight: '600',
                                letterSpacing: '0.5px'
                              }}>
                                [DUPLICATE]
                              </span>
                            </>
                          )}
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#e0e7ff',
                          color: '#3730a3'
                        }}>
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                        {transaction.memo || 'No description'}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#64748b' }}>
                        {transaction.reference_number || '-'}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: '500' }}>
                        ${Math.abs(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                        {isReconciled ? (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: '#dcfce7',
                            color: '#166534'
                          }}>
                            ✓ Reconciled
                          </span>
                        ) : (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: '#fee2e2',
                            color: '#991b1b'
                          }}>
                            Unreconciled
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No transactions found. Try running a sync first.</p>
        )}
      </div>

      {/* Bank Statement Upload & Reconciliation */}
      <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Bank Reconciliation
        </h2>
        
        {/* Upload Section */}
        <div style={{ background: '#fff', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '30px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '15px' }}>
            <svg style={{ width: '48px', height: '48px', color: '#64748b', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Upload Bank Statement</h3>
          <p style={{ color: '#64748b', marginBottom: '15px' }}>Upload your bank CSV to find missing transactions</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleBankFileUpload}
            style={{ display: 'none' }}
            id="bank-csv-upload"
          />
          <label
            htmlFor="bank-csv-upload"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: '#3b82f6',
              color: '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Choose CSV File
          </label>
          {bankFile && (
            <div style={{ marginTop: '15px', color: '#16a34a' }}>
              ✅ {bankFile.name} ({bankTransactions.length} transactions)
            </div>
          )}
        </div>

        {/* Compare Button */}
        {bankTransactions.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button
              onClick={generateDiscrepancyReport}
              disabled={comparing}
              style={{
                padding: '12px 30px',
                background: comparing ? '#94a3b8' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: comparing ? 'not-allowed' : 'pointer'
              }}
            >
              {comparing ? 'Comparing...' : '🔍 Compare Bank vs QuickBooks'}
            </button>
          </div>
        )}

        {/* Discrepancy Report */}
        {discrepancyReport && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Reconciliation Report</h3>
              <button
                onClick={exportDiscrepancyReport}
                style={{
                  padding: '8px 16px',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                📥 Export Report
              </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
              <div style={{ background: '#dcfce7', border: '1px solid #16a34a', borderRadius: '8px', padding: '15px' }}>
                <div style={{ fontSize: '14px', color: '#166534', marginBottom: '5px' }}>✅ Matched</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#166534' }}>{discrepancyReport.summary.matched}</div>
              </div>
              <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '15px' }}>
                <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '5px' }}>⚠️ Missing from QB</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#92400e' }}>{discrepancyReport.summary.missingFromQB}</div>
              </div>
              <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', padding: '15px' }}>
                <div style={{ fontSize: '14px', color: '#991b1b', marginBottom: '5px' }}>❗ Missing from Bank</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#991b1b' }}>{discrepancyReport.summary.missingFromBank}</div>
              </div>
            </div>

            {/* Missing from QuickBooks */}
            {discrepancyReport.inBankOnly.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#92400e' }}>
                  ⚠️ Missing from QuickBooks ({discrepancyReport.inBankOnly.length})
                </h4>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>
                  These transactions are in your bank statement but not in QuickBooks. You may need to add them.
                </p>
                <div style={{ background: '#fff', border: '1px solid #fbbf24', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#fef3c7' }}>
                      <tr>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Date</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Description</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discrepancyReport.inBankOnly.slice(0, 10).map((tx, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '10px', borderBottom: '1px solid #fef3c7' }}>{tx.date}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #fef3c7' }}>{tx.description}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #fef3c7', textAlign: 'right', fontWeight: '500' }}>
                            ${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Missing from Bank */}
            {discrepancyReport.inQuickBooksOnly.length > 0 && (
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#991b1b' }}>
                  ❗ Missing from Bank Statement ({discrepancyReport.inQuickBooksOnly.length})
                </h4>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>
                  These transactions are in QuickBooks but not in your bank statement. They may be pending or errors.
                </p>
                <div style={{ background: '#fff', border: '1px solid #ef4444', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#fee2e2' }}>
                      <tr>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Date</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Description</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discrepancyReport.inQuickBooksOnly.slice(0, 10).map((tx, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '10px', borderBottom: '1px solid #fee2e2' }}>{tx.transaction_date}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #fee2e2' }}>{tx.memo || 'No description'}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #fee2e2', textAlign: 'right', fontWeight: '500' }}>
                            ${Math.abs(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 