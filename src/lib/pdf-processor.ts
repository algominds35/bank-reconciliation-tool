import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.269/pdf.worker.min.js'
}

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'debit' | 'credit'
  balance?: number
  confidence: number
}

export interface ProcessedPDF {
  fileName: string
  bankName?: string
  accountNumber?: string
  statementPeriod?: string
  transactions: Transaction[]
  totalTransactions: number
  errors: string[]
}

class PDFProcessor {
  
  async processPDF(file: File): Promise<ProcessedPDF> {
    try {
      console.log('Processing PDF:', file.name)
      
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ''
      const numPages = pdf.numPages
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
      }
      
      console.log('Extracted text length:', fullText.length)
      
      // Parse bank statement
      const result = this.parseStatementText(fullText, file.name)
      
      return result
      
    } catch (error) {
      console.error('PDF processing error:', error)
      return {
        fileName: file.name,
        transactions: [],
        totalTransactions: 0,
        errors: [`Failed to process PDF: ${error}`]
      }
    }
  }
  
  private parseStatementText(text: string, fileName: string): ProcessedPDF {
    const result: ProcessedPDF = {
      fileName,
      transactions: [],
      totalTransactions: 0,
      errors: []
    }
    
    try {
      // Detect bank type
      const bankName = this.detectBankType(text)
      result.bankName = bankName
      
      // Extract account info
      result.accountNumber = this.extractAccountNumber(text)
      result.statementPeriod = this.extractStatementPeriod(text)
      
      // Extract transactions based on bank type
      result.transactions = this.extractTransactions(text, bankName)
      result.totalTransactions = result.transactions.length
      
      if (result.transactions.length === 0) {
        result.errors.push('No transactions found in PDF')
      }
      
    } catch (error) {
      result.errors.push(`Parsing error: ${error}`)
    }
    
    return result
  }
  
  private detectBankType(text: string): string {
    const bankPatterns = [
      { name: 'Chase', patterns: ['JPMorgan Chase', 'Chase Bank', 'chase.com'] },
      { name: 'Bank of America', patterns: ['Bank of America', 'bankofamerica.com'] },
      { name: 'Wells Fargo', patterns: ['Wells Fargo', 'wellsfargo.com'] },
      { name: 'Citibank', patterns: ['Citibank', 'Citi', 'citibank.com'] },
      { name: 'US Bank', patterns: ['U.S. Bank', 'US Bank', 'usbank.com'] },
      { name: 'Capital One', patterns: ['Capital One', 'capitalone.com'] },
      { name: 'PNC Bank', patterns: ['PNC Bank', 'pnc.com'] },
      { name: 'TD Bank', patterns: ['TD Bank', 'tdbank.com'] },
      { name: 'Regions Bank', patterns: ['Regions Bank', 'regions.com'] },
      { name: 'SunTrust', patterns: ['SunTrust', 'suntrust.com'] }
    ]
    
    for (const bank of bankPatterns) {
      for (const pattern of bank.patterns) {
        if (text.toLowerCase().includes(pattern.toLowerCase())) {
          return bank.name
        }
      }
    }
    
    return 'Unknown Bank'
  }
  
  private extractAccountNumber(text: string): string {
    // Common account number patterns
    const patterns = [
      /Account\s*(?:Number|#)?\s*:?\s*([0-9]{4,16})/i,
      /Account\s*([0-9]{4,16})/i,
      /Acct\s*(?:Number|#)?\s*:?\s*([0-9]{4,16})/i
    ]
    
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1]
      }
    }
    
    return 'Unknown'
  }
  
  private extractStatementPeriod(text: string): string {
    // Statement period patterns
    const patterns = [
      /Statement\s+Period\s*:?\s*([A-Za-z0-9\s,\-\/]+)/i,
      /Period\s*:?\s*([A-Za-z0-9\s,\-\/]+)/i,
      /From\s*([A-Za-z0-9\s,\-\/]+)\s*To\s*([A-Za-z0-9\s,\-\/]+)/i
    ]
    
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1] + (match[2] ? ` to ${match[2]}` : '')
      }
    }
    
    return 'Unknown'
  }
  
  private extractTransactions(text: string, bankName: string): Transaction[] {
    const transactions: Transaction[] = []
    
    try {
      // Split text into lines for processing
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      
      // Different parsing strategies based on bank
      switch (bankName) {
        case 'Chase':
          return this.parseChaseTransactions(lines)
        case 'Bank of America':
          return this.parseBankOfAmericaTransactions(lines)
        case 'Wells Fargo':
          return this.parseWellsFargoTransactions(lines)
        default:
          return this.parseGenericTransactions(lines)
      }
      
    } catch (error) {
      console.error('Transaction extraction error:', error)
      return []
    }
  }
  
  private parseGenericTransactions(lines: string[]): Transaction[] {
    const transactions: Transaction[] = []
    
    // Generic transaction patterns
    const transactionPatterns = [
      // Date Amount Description pattern
      /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(.+?)\s+([\-\+]?\$?[\d,]+\.?\d{0,2})$/,
      // Date Description Amount pattern  
      /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(.+?)\s+([\-\+]?\$?[\d,]+\.?\d{0,2})\s*$/,
      // MM/DD/YYYY pattern with balance
      /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(.+?)\s+([\-\+]?\$?[\d,]+\.?\d{0,2})\s+([\-\+]?\$?[\d,]+\.?\d{0,2})$/
    ]
    
    let transactionId = 1
    
    for (const line of lines) {
      for (const pattern of transactionPatterns) {
        const match = line.match(pattern)
        if (match) {
          const [, dateStr, description, amountStr, balanceStr] = match
          
          // Parse amount
          const amount = this.parseAmount(amountStr)
          if (amount === null) continue
          
          // Parse date
          const date = this.parseDate(dateStr)
          if (!date) continue
          
          // Determine transaction type
          const type = amount < 0 ? 'debit' : 'credit'
          
          // Parse balance if available
          const balance = balanceStr ? this.parseAmount(balanceStr) : undefined
          
          transactions.push({
            id: `txn-${transactionId++}`,
            date,
            description: description.trim(),
            amount: Math.abs(amount),
            type,
            balance: balance || undefined,
            confidence: 0.8
          })
          
          break // Found a match, move to next line
        }
      }
    }
    
    return transactions
  }
  
  private parseChaseTransactions(lines: string[]): Transaction[] {
    // Chase-specific parsing logic
    return this.parseGenericTransactions(lines)
  }
  
  private parseBankOfAmericaTransactions(lines: string[]): Transaction[] {
    // Bank of America-specific parsing logic
    return this.parseGenericTransactions(lines)
  }
  
  private parseWellsFargoTransactions(lines: string[]): Transaction[] {
    // Wells Fargo-specific parsing logic
    return this.parseGenericTransactions(lines)
  }
  
  private parseAmount(amountStr: string): number | null {
    // Remove currency symbols and spaces
    const cleaned = amountStr.replace(/[\$,\s]/g, '')
    
    // Handle negative amounts (parentheses or minus sign)
    let isNegative = false
    if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
      isNegative = true
    } else if (cleaned.startsWith('-')) {
      isNegative = true
    }
    
    // Extract numeric value
    const numericStr = cleaned.replace(/[\(\)\-\+]/g, '')
    const amount = parseFloat(numericStr)
    
    if (isNaN(amount)) return null
    
    return isNegative ? -amount : amount
  }
  
  private parseDate(dateStr: string): string | null {
    try {
      // Handle MM/DD/YYYY or MM/DD/YY formats
      const parts = dateStr.split('/')
      if (parts.length !== 3) return null
      
      let [month, day, year] = parts
      
      // Convert 2-digit year to 4-digit
      if (year.length === 2) {
        const currentYear = new Date().getFullYear()
        const currentCentury = Math.floor(currentYear / 100) * 100
        year = (parseInt(year) > 50 ? currentCentury - 100 : currentCentury) + parseInt(year)
      }
      
      // Validate date
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (isNaN(date.getTime())) return null
      
      // Return in YYYY-MM-DD format
      return date.toISOString().split('T')[0]
      
    } catch (error) {
      return null
    }
  }
}

export const pdfProcessor = new PDFProcessor()
