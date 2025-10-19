// Export format converters for various accounting software

import { Transaction } from '@/types'

/**
 * Format date for QuickBooks (MM/DD/YYYY)
 */
function formatDateForQB(dateString: string): string {
  try {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  } catch (error) {
    return dateString
  }
}

/**
 * Format amount for QuickBooks (negative for expenses, positive for income)
 */
function formatAmountForQB(amount: number, type: string = 'Bank'): number {
  // If it's an expense/debit, make it negative
  if (type === 'Bank' && amount > 0) {
    return -Math.abs(amount)
  }
  return amount
}

/**
 * Export transactions as QuickBooks Desktop IIF format
 * IIF = Intuit Interchange Format
 * This format can be double-clicked to open directly in QuickBooks Desktop
 */
export function exportAsQBDesktopIIF(transactions: Transaction[]): string {
  // IIF file header
  let iif = '!TRNS\tTRNSID\tTRNSTYPE\tDATE\tACCNT\tNAME\tCLASS\tAMOUNT\tDOCNUM\tMEMO\tCLEAR\tTOPRINT\tNAMEISTAXABLE\tEXPENSEDATED\n'
  iif += '!SPL\tSPLID\tTRNSTYPE\tDATE\tACCNT\tNAME\tCLASS\tAMOUNT\tDOCNUM\tMEMO\tCLEAR\tQNTY\tPRICE\tINVITEM\tPAYMETH\tTAXABLE\tREIMBEXP\tEXTRA\n'
  iif += '!ENDTRNS\n'

  // Process each transaction
  transactions.forEach((txn, index) => {
    const date = formatDateForQB(txn.date)
    const amount = txn.amount || 0
    const description = (txn.description || 'Transaction').replace(/\t/g, ' ')
    const category = (txn.category || 'Uncategorized').replace(/\t/g, ' ')
    const type = txn.type || 'Bank'
    
    // Determine if this is income or expense
    const isExpense = amount < 0 || type === 'Expense'
    const absAmount = Math.abs(amount)
    
    // TRNS line (main transaction)
    iif += `TRNS\t${index}\t${isExpense ? 'CHECK' : 'DEPOSIT'}\t${date}\tChecking\t\t\t${isExpense ? -absAmount : absAmount}\t\t${description}\tN\tN\tN\t${date}\n`
    
    // SPL line (split/category)
    iif += `SPL\t${index}\t${isExpense ? 'CHECK' : 'DEPOSIT'}\t${date}\t${category}\t\t\t${isExpense ? absAmount : -absAmount}\t\t${description}\tN\t\t\t\t\tN\tN\t\n`
    
    // End transaction
    iif += 'ENDTRNS\n'
  })

  return iif
}

/**
 * Export transactions as QuickBooks Online CSV format
 * This format is optimized for QB Online's import feature
 */
export function exportAsQBOnlineCSV(transactions: Transaction[]): string {
  // QB Online expects these columns
  const headers = 'Date,Description,Amount,Category,Account,Payee,Tax'
  
  const rows = transactions.map(txn => {
    const date = formatDateForQB(txn.date)
    const description = (txn.description || 'Transaction').replace(/,/g, ';')
    const amount = txn.amount || 0
    const category = (txn.category || 'Uncategorized').replace(/,/g, ';')
    const payee = (txn.vendor || '').replace(/,/g, ';')
    
    return `${date},"${description}",${amount},"${category}","Checking","${payee}","Non"`
  }).join('\n')
  
  return `${headers}\n${rows}`
}

/**
 * Export transactions as Xero CSV format
 */
export function exportAsXeroCSV(transactions: Transaction[]): string {
  const headers = '*Date,*Amount,Payee,Description,Reference,*Code,Tax Type,Tax Amount'
  
  const rows = transactions.map(txn => {
    const date = formatDateForQB(txn.date)
    const description = (txn.description || 'Transaction').replace(/,/g, ';')
    const amount = Math.abs(txn.amount || 0)
    const payee = (txn.vendor || '').replace(/,/g, ';')
    const category = txn.category || '200' // Default expense code
    
    return `${date},${amount},"${payee}","${description}","","${category}","Tax Exempt",0.00`
  }).join('\n')
  
  return `${headers}\n${rows}`
}

/**
 * Export transactions as generic CSV
 */
export function exportAsGenericCSV(transactions: Transaction[]): string {
  const headers = 'Date,Description,Amount,Type,Category,Vendor,Status'
  
  const rows = transactions.map(txn => {
    const description = (txn.description || '').replace(/,/g, ';')
    const category = (txn.category || '').replace(/,/g, ';')
    const vendor = (txn.vendor || '').replace(/,/g, ';')
    const type = txn.type || 'Bank'
    const status = txn.status || 'Unreconciled'
    
    return `${txn.date},"${description}",${txn.amount || 0},"${type}","${category}","${vendor}","${status}"`
  }).join('\n')
  
  return `${headers}\n${rows}`
}

/**
 * Download a file with given content and filename
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

