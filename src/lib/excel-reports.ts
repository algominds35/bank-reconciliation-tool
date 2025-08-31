import ExcelJS from 'exceljs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ReportData {
  clientId: string
  startDate: string
  endDate: string
  reportType: 'balance-sheet' | 'cash-flow' | 'pl-statement' | 'reconciliation'
}

export interface FinancialData {
  bankTransactions: any[]
  bookTransactions: any[]
  client: any
}

// Fetch financial data from database
async function fetchFinancialData(clientId: string, startDate: string, endDate: string): Promise<FinancialData> {
  // Fetch bank transactions
  const { data: bankTransactions } = await supabase
    .from('bank_transactions')
    .select('*')
    .eq('client_id', clientId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  // Fetch bookkeeping transactions
  const { data: bookTransactions } = await supabase
    .from('book_transactions')
    .select('*')
    .eq('client_id', clientId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  // Fetch client information
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single()

  return {
    bankTransactions: bankTransactions || [],
    bookTransactions: bookTransactions || [],
    client: client || {}
  }
}

// Apply professional formatting to worksheet
function applyProfessionalFormatting(worksheet: ExcelJS.Worksheet) {
  // Set column widths
  worksheet.getColumn('A').width = 35
  worksheet.getColumn('B').width = 20
  worksheet.getColumn('C').width = 20

  // Add borders and styling to header rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 5) { // Header rows
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        cell.font = {
          bold: true,
          size: 12
        }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6E6E6' }
        }
      })
    }
  })
}

// Generate Balance Sheet
export async function generateBalanceSheet(data: ReportData): Promise<ExcelJS.Buffer> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Balance Sheet')
  
  const financialData = await fetchFinancialData(data.clientId, data.startDate, data.endDate)
  
  // Add company header
  worksheet.addRow([financialData.client.business_name || 'Company Name'])
  worksheet.addRow(['Balance Sheet'])
  worksheet.addRow([`As of ${data.endDate}`])
  worksheet.addRow([])
  
  // Calculate totals
  const totalAssets = financialData.bankTransactions
    .filter(t => t.type === 'credit' && t.amount > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  const totalLiabilities = financialData.bankTransactions
    .filter(t => t.type === 'debit' && t.amount > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  const totalEquity = totalAssets - totalLiabilities
  
  // Add Assets section
  worksheet.addRow(['ASSETS'])
  worksheet.addRow(['Current Assets'])
  worksheet.addRow(['Cash and Cash Equivalents', totalAssets.toFixed(2), ''])
  worksheet.addRow(['Total Current Assets', totalAssets.toFixed(2), ''])
  worksheet.addRow(['Total Assets', totalAssets.toFixed(2), ''])
  worksheet.addRow([])
  
  // Add Liabilities section
  worksheet.addRow(['LIABILITIES'])
  worksheet.addRow(['Current Liabilities'])
  worksheet.addRow(['Accounts Payable', totalLiabilities.toFixed(2), ''])
  worksheet.addRow(['Total Current Liabilities', totalLiabilities.toFixed(2), ''])
  worksheet.addRow(['Total Liabilities', totalLiabilities.toFixed(2), ''])
  worksheet.addRow([])
  
  // Add Equity section
  worksheet.addRow(['EQUITY'])
  worksheet.addRow(['Retained Earnings', totalEquity.toFixed(2), ''])
  worksheet.addRow(['Total Equity', totalEquity.toFixed(2), ''])
  worksheet.addRow([])
  
  // Add total
  worksheet.addRow(['TOTAL LIABILITIES & EQUITY', (totalLiabilities + totalEquity).toFixed(2), ''])
  
  applyProfessionalFormatting(worksheet)
  
  return await workbook.xlsx.writeBuffer()
}

// Generate Cash Flow Statement
export async function generateCashFlowStatement(data: ReportData): Promise<ExcelJS.Buffer> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Cash Flow Statement')
  
  const financialData = await fetchFinancialData(data.clientId, data.startDate, data.endDate)
  
  // Add header
  worksheet.addRow([financialData.client.business_name || 'Company Name'])
  worksheet.addRow(['Cash Flow Statement'])
  worksheet.addRow([`For the period ending ${data.endDate}`])
  worksheet.addRow([])
  
  // Calculate cash flows
  const operatingCashFlow = financialData.bankTransactions
    .filter(t => t.category && ['income', 'expense', 'revenue'].includes(t.category.toLowerCase()))
    .reduce((sum, t) => sum + (t.type === 'credit' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0)
  
  const investingCashFlow = financialData.bankTransactions
    .filter(t => t.category && ['equipment', 'investment', 'asset'].includes(t.category.toLowerCase()))
    .reduce((sum, t) => sum + (t.type === 'credit' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0)
  
  const financingCashFlow = financialData.bankTransactions
    .filter(t => t.category && ['loan', 'debt', 'equity'].includes(t.category.toLowerCase()))
    .reduce((sum, t) => sum + (t.type === 'credit' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0)
  
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow
  
  // Add Operating Activities
  worksheet.addRow(['Operating Activities'])
  worksheet.addRow(['Net Income', operatingCashFlow.toFixed(2), ''])
  worksheet.addRow(['Net Cash from Operating Activities', operatingCashFlow.toFixed(2), ''])
  worksheet.addRow([])
  
  // Add Investing Activities
  worksheet.addRow(['Investing Activities'])
  worksheet.addRow(['Capital Expenditures', investingCashFlow.toFixed(2), ''])
  worksheet.addRow(['Net Cash from Investing Activities', investingCashFlow.toFixed(2), ''])
  worksheet.addRow([])
  
  // Add Financing Activities
  worksheet.addRow(['Financing Activities'])
  worksheet.addRow(['Net Borrowings', financingCashFlow.toFixed(2), ''])
  worksheet.addRow(['Net Cash from Financing Activities', financingCashFlow.toFixed(2), ''])
  worksheet.addRow([])
  
  // Add Net Change
  worksheet.addRow(['Net Change in Cash', netCashFlow.toFixed(2), ''])
  
  applyProfessionalFormatting(worksheet)
  
  return await workbook.xlsx.writeBuffer()
}

// Generate P&L Statement
export async function generatePLStatement(data: ReportData): Promise<ExcelJS.Buffer> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Profit & Loss')
  
  const financialData = await fetchFinancialData(data.clientId, data.startDate, data.endDate)
  
  // Add header
  worksheet.addRow([financialData.client.business_name || 'Company Name'])
  worksheet.addRow(['Profit & Loss Statement'])
  worksheet.addRow([`For the period ending ${data.endDate}`])
  worksheet.addRow([])
  
  // Calculate revenue and expenses
  const revenue = financialData.bankTransactions
    .filter(t => t.type === 'credit' && t.amount > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  const expenses = financialData.bankTransactions
    .filter(t => t.type === 'debit' && t.amount > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  const netIncome = revenue - expenses
  
  // Add Revenue section
  worksheet.addRow(['REVENUE'])
  worksheet.addRow(['Total Revenue', revenue.toFixed(2), ''])
  worksheet.addRow([])
  
  // Add Expenses section
  worksheet.addRow(['EXPENSES'])
  
  // Group expenses by category
  const expenseCategories = financialData.bankTransactions
    .filter(t => t.type === 'debit' && t.amount > 0)
    .reduce((acc, t) => {
      const category = t.category || 'Other'
      acc[category] = (acc[category] || 0) + parseFloat(t.amount)
      return acc
    }, {} as Record<string, number>)
  
  Object.entries(expenseCategories).forEach(([category, amount]) => {
    worksheet.addRow([category, (amount as number).toFixed(2), ''])
  })
  
  worksheet.addRow(['Total Expenses', expenses.toFixed(2), ''])
  worksheet.addRow([])
  
  // Add Net Income
  worksheet.addRow(['NET INCOME', netIncome.toFixed(2), ''])
  
  applyProfessionalFormatting(worksheet)
  
  return await workbook.xlsx.writeBuffer()
}

// Generate Monthly Reconciliation Report
export async function generateReconciliationReport(data: ReportData): Promise<ExcelJS.Buffer> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Monthly Reconciliation')
  
  const financialData = await fetchFinancialData(data.clientId, data.startDate, data.endDate)
  
  // Add header
  worksheet.addRow([financialData.client.business_name || 'Company Name'])
  worksheet.addRow(['Monthly Reconciliation Report'])
  worksheet.addRow([`For the period ${data.startDate} to ${data.endDate}`])
  worksheet.addRow([])
  
  // Add summary
  worksheet.addRow(['SUMMARY'])
  worksheet.addRow(['Total Bank Transactions', financialData.bankTransactions.length.toString(), ''])
  worksheet.addRow(['Total Bookkeeping Transactions', financialData.bookTransactions.length.toString(), ''])
  worksheet.addRow([])
  
  // Add bank transactions
  worksheet.addRow(['BANK TRANSACTIONS'])
  worksheet.addRow(['Date', 'Description', 'Amount', 'Type', 'Category'])
  
  financialData.bankTransactions.forEach(transaction => {
    worksheet.addRow([
      transaction.date,
      transaction.description,
      transaction.amount,
      transaction.type,
      transaction.category || 'Uncategorized'
    ])
  })
  
  worksheet.addRow([])
  
  // Add bookkeeping transactions
  worksheet.addRow(['BOOKKEEPING TRANSACTIONS'])
  worksheet.addRow(['Date', 'Description', 'Amount', 'Type', 'Category'])
  
  financialData.bookTransactions.forEach(transaction => {
    worksheet.addRow([
      transaction.date,
      transaction.description,
      transaction.amount,
      transaction.type,
      transaction.category || 'Uncategorized'
    ])
  })
  
  applyProfessionalFormatting(worksheet)
  
  return await workbook.xlsx.writeBuffer()
}

// Main function to generate any report type
export async function generateExcelReport(data: ReportData): Promise<ExcelJS.Buffer> {
  switch (data.reportType) {
    case 'balance-sheet':
      return await generateBalanceSheet(data)
    case 'cash-flow':
      return await generateCashFlowStatement(data)
    case 'pl-statement':
      return await generatePLStatement(data)
    case 'reconciliation':
      return await generateReconciliationReport(data)
    default:
      throw new Error(`Unknown report type: ${data.reportType}`)
  }
}
