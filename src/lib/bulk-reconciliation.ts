import { Transaction } from './pdf-processor'

export interface ReconciliationJob {
  id: string
  clientId: string
  clientName: string
  bankTransactions: Transaction[]
  bookTransactions: Transaction[]
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  matches: ReconciliationMatch[]
  unmatchedBank: Transaction[]
  unmatchedBook: Transaction[]
  errors: string[]
  startTime?: string
  endTime?: string
}

export interface ReconciliationMatch {
  id: string
  bankTransaction: Transaction
  bookTransaction?: Transaction
  matchType: 'exact' | 'fuzzy' | 'manual' | 'unmatched'
  confidence: number
  difference?: number
  notes?: string
}

export interface BulkReconciliationResult {
  totalJobs: number
  completedJobs: number
  totalMatches: number
  totalUnmatched: number
  processingTime: number
  jobs: ReconciliationJob[]
}

class BulkReconciliationEngine {
  
  async processBulkReconciliation(jobs: Omit<ReconciliationJob, 'id' | 'status' | 'progress' | 'matches' | 'unmatchedBank' | 'unmatchedBook' | 'errors'>[]): Promise<BulkReconciliationResult> {
    const startTime = Date.now()
    
    const reconciliationJobs: ReconciliationJob[] = jobs.map(job => ({
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      progress: 0,
      matches: [],
      unmatchedBank: [],
      unmatchedBook: [],
      errors: []
    }))

    console.log(`Starting bulk reconciliation for ${reconciliationJobs.length} clients`)

    // Process each job
    for (const job of reconciliationJobs) {
      try {
        job.status = 'processing'
        job.startTime = new Date().toISOString()
        
        await this.processClientReconciliation(job)
        
        job.status = 'completed'
        job.progress = 100
        job.endTime = new Date().toISOString()
        
      } catch (error) {
        job.status = 'error'
        job.errors.push(error instanceof Error ? error.message : 'Unknown error')
        console.error(`Reconciliation failed for client ${job.clientName}:`, error)
      }
    }

    const endTime = Date.now()
    const processingTime = endTime - startTime

    const result: BulkReconciliationResult = {
      totalJobs: reconciliationJobs.length,
      completedJobs: reconciliationJobs.filter(j => j.status === 'completed').length,
      totalMatches: reconciliationJobs.reduce((sum, job) => sum + job.matches.length, 0),
      totalUnmatched: reconciliationJobs.reduce((sum, job) => sum + job.unmatchedBank.length + job.unmatchedBook.length, 0),
      processingTime,
      jobs: reconciliationJobs
    }

    console.log(`Bulk reconciliation completed: ${result.completedJobs}/${result.totalJobs} jobs, ${result.totalMatches} matches, ${result.processingTime}ms`)

    return result
  }

  private async processClientReconciliation(job: ReconciliationJob): Promise<void> {
    const { bankTransactions, bookTransactions } = job

    console.log(`Processing reconciliation for ${job.clientName}: ${bankTransactions.length} bank, ${bookTransactions.length} book transactions`)

    // Step 1: Exact matches (same amount, similar date, similar description)
    const exactMatches = this.findExactMatches(bankTransactions, bookTransactions)
    job.matches.push(...exactMatches)
    job.progress = 30

    // Step 2: Fuzzy matches (similar amount, date range, description similarity)
    const remainingBank = bankTransactions.filter(bt => 
      !job.matches.some(match => match.bankTransaction.id === bt.id)
    )
    const remainingBook = bookTransactions.filter(bt => 
      !job.matches.some(match => match.bookTransaction?.id === bt.id)
    )

    const fuzzyMatches = this.findFuzzyMatches(remainingBank, remainingBook)
    job.matches.push(...fuzzyMatches)
    job.progress = 70

    // Step 3: Mark remaining as unmatched
    job.unmatchedBank = remainingBank.filter(bt => 
      !job.matches.some(match => match.bankTransaction.id === bt.id)
    )
    job.unmatchedBook = remainingBook.filter(bt => 
      !job.matches.some(match => match.bookTransaction?.id === bt.id)
    )

    // Add unmatched transactions as individual matches
    job.unmatchedBank.forEach(transaction => {
      job.matches.push({
        id: `unmatched-bank-${transaction.id}`,
        bankTransaction: transaction,
        matchType: 'unmatched',
        confidence: 0,
        notes: 'No matching book transaction found'
      })
    })

    job.progress = 100

    console.log(`Completed ${job.clientName}: ${job.matches.filter(m => m.matchType !== 'unmatched').length} matches, ${job.unmatchedBank.length} unmatched bank, ${job.unmatchedBook.length} unmatched book`)
  }

  private findExactMatches(bankTransactions: Transaction[], bookTransactions: Transaction[]): ReconciliationMatch[] {
    const matches: ReconciliationMatch[] = []
    const usedBookTransactions = new Set<string>()

    for (const bankTxn of bankTransactions) {
      // Find exact amount matches within 3 days
      const potentialMatches = bookTransactions.filter(bookTxn => 
        !usedBookTransactions.has(bookTxn.id) &&
        Math.abs(bankTxn.amount - bookTxn.amount) < 0.01 &&
        this.isWithinDateRange(bankTxn.date, bookTxn.date, 3)
      )

      if (potentialMatches.length === 1) {
        // Single exact match found
        const bookTxn = potentialMatches[0]
        matches.push({
          id: `exact-${bankTxn.id}-${bookTxn.id}`,
          bankTransaction: bankTxn,
          bookTransaction: bookTxn,
          matchType: 'exact',
          confidence: 0.95,
          difference: Math.abs(bankTxn.amount - bookTxn.amount)
        })
        usedBookTransactions.add(bookTxn.id)
      } else if (potentialMatches.length > 1) {
        // Multiple matches - find best description match
        const bestMatch = this.findBestDescriptionMatch(bankTxn, potentialMatches)
        if (bestMatch && this.calculateDescriptionSimilarity(bankTxn.description, bestMatch.description) > 0.7) {
          matches.push({
            id: `exact-${bankTxn.id}-${bestMatch.id}`,
            bankTransaction: bankTxn,
            bookTransaction: bestMatch,
            matchType: 'exact',
            confidence: 0.9,
            difference: Math.abs(bankTxn.amount - bestMatch.amount)
          })
          usedBookTransactions.add(bestMatch.id)
        }
      }
    }

    return matches
  }

  private findFuzzyMatches(bankTransactions: Transaction[], bookTransactions: Transaction[]): ReconciliationMatch[] {
    const matches: ReconciliationMatch[] = []
    const usedBookTransactions = new Set<string>()

    for (const bankTxn of bankTransactions) {
      let bestMatch: Transaction | null = null
      let bestScore = 0

      for (const bookTxn of bookTransactions) {
        if (usedBookTransactions.has(bookTxn.id)) continue

        const score = this.calculateMatchScore(bankTxn, bookTxn)
        if (score > bestScore && score > 0.6) {
          bestScore = score
          bestMatch = bookTxn
        }
      }

      if (bestMatch && bestScore > 0.6) {
        matches.push({
          id: `fuzzy-${bankTxn.id}-${bestMatch.id}`,
          bankTransaction: bankTxn,
          bookTransaction: bestMatch,
          matchType: 'fuzzy',
          confidence: bestScore,
          difference: Math.abs(bankTxn.amount - bestMatch.amount),
          notes: bestScore < 0.8 ? 'Low confidence match - please review' : undefined
        })
        usedBookTransactions.add(bestMatch.id)
      }
    }

    return matches
  }

  private calculateMatchScore(bankTxn: Transaction, bookTxn: Transaction): number {
    // Amount similarity (40% weight)
    const amountDiff = Math.abs(bankTxn.amount - bookTxn.amount)
    const amountScore = amountDiff < 0.01 ? 1 : Math.max(0, 1 - (amountDiff / Math.max(bankTxn.amount, bookTxn.amount)))

    // Date similarity (30% weight)
    const daysDiff = this.getDaysDifference(bankTxn.date, bookTxn.date)
    const dateScore = daysDiff <= 1 ? 1 : daysDiff <= 3 ? 0.8 : daysDiff <= 7 ? 0.5 : 0

    // Description similarity (30% weight)
    const descScore = this.calculateDescriptionSimilarity(bankTxn.description, bookTxn.description)

    return (amountScore * 0.4) + (dateScore * 0.3) + (descScore * 0.3)
  }

  private calculateDescriptionSimilarity(desc1: string, desc2: string): number {
    const clean1 = desc1.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
    const clean2 = desc2.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()

    if (clean1 === clean2) return 1

    // Check for common words
    const words1 = clean1.split(/\s+/).filter(w => w.length > 2)
    const words2 = clean2.split(/\s+/).filter(w => w.length > 2)

    if (words1.length === 0 && words2.length === 0) return 0.5
    if (words1.length === 0 || words2.length === 0) return 0

    const commonWords = words1.filter(word => words2.includes(word))
    const similarity = (commonWords.length * 2) / (words1.length + words2.length)

    return Math.min(similarity, 1)
  }

  private findBestDescriptionMatch(bankTxn: Transaction, candidates: Transaction[]): Transaction | null {
    let bestMatch: Transaction | null = null
    let bestScore = 0

    for (const candidate of candidates) {
      const score = this.calculateDescriptionSimilarity(bankTxn.description, candidate.description)
      if (score > bestScore) {
        bestScore = score
        bestMatch = candidate
      }
    }

    return bestMatch
  }

  private isWithinDateRange(date1: string, date2: string, days: number): boolean {
    const daysDiff = this.getDaysDifference(date1, date2)
    return daysDiff <= days
  }

  private getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Generate realistic book transactions for testing (simulates QuickBooks data)
  generateMockBookTransactions(bankTransactions: Transaction[]): Transaction[] {
    const mockTransactions: Transaction[] = []

    bankTransactions.forEach((bankTxn, index) => {
      // 85% chance of having a matching book transaction (realistic match rate)
      if (Math.random() < 0.85) {
        const bookTxn: Transaction = {
          id: `book-${bankTxn.id}`,
          date: this.adjustDate(bankTxn.date, Math.floor(Math.random() * 3) - 1), // ±1 day variation
          description: this.varyDescription(bankTxn.description),
          amount: bankTxn.amount + (Math.random() < 0.15 ? (Math.random() - 0.5) * 0.05 : 0), // Small amount variations (15% chance)
          type: bankTxn.type,
          confidence: 0.9
        }
        mockTransactions.push(bookTxn)
      }

      // Add some extra book transactions (manual entries, accruals, etc.)
      if (Math.random() < 0.25) {
        const descriptions = [
          'Manual Journal Entry',
          'Accrual Adjustment', 
          'Depreciation Expense',
          'Prepaid Adjustment',
          'Reclassification Entry',
          'Month End Adjustment'
        ]
        
        mockTransactions.push({
          id: `book-extra-${index}`,
          date: bankTxn.date,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          amount: Math.random() * 500 + 25,
          type: Math.random() < 0.5 ? 'debit' : 'credit',
          confidence: 0.9
        })
      }
    })

    return mockTransactions
  }

  // Enhanced matching algorithm with better logic
  private findExactMatches(bankTransactions: Transaction[], bookTransactions: Transaction[]): ReconciliationMatch[] {
    const matches: ReconciliationMatch[] = []
    const usedBookTransactions = new Set<string>()

    for (const bankTxn of bankTransactions) {
      // Find exact amount matches within 5 days (more realistic)
      const potentialMatches = bookTransactions.filter(bookTxn => 
        !usedBookTransactions.has(bookTxn.id) &&
        Math.abs(bankTxn.amount - bookTxn.amount) < 0.01 &&
        this.isWithinDateRange(bankTxn.date, bookTxn.date, 5)
      )

      if (potentialMatches.length === 1) {
        // Single exact match found - high confidence
        const bookTxn = potentialMatches[0]
        matches.push({
          id: `exact-${bankTxn.id}-${bookTxn.id}`,
          bankTransaction: bankTxn,
          bookTransaction: bookTxn,
          matchType: 'exact',
          confidence: 0.98,
          difference: Math.abs(bankTxn.amount - bookTxn.amount)
        })
        usedBookTransactions.add(bookTxn.id)
      } else if (potentialMatches.length > 1) {
        // Multiple matches - find best description match
        const bestMatch = this.findBestDescriptionMatch(bankTxn, potentialMatches)
        if (bestMatch) {
          const descriptionSimilarity = this.calculateDescriptionSimilarity(bankTxn.description, bestMatch.description)
          if (descriptionSimilarity > 0.6) {
            matches.push({
              id: `exact-${bankTxn.id}-${bestMatch.id}`,
              bankTransaction: bankTxn,
              bookTransaction: bestMatch,
              matchType: 'exact',
              confidence: 0.85 + (descriptionSimilarity * 0.1),
              difference: Math.abs(bankTxn.amount - bestMatch.amount),
              notes: descriptionSimilarity < 0.8 ? 'Multiple amount matches - selected best description match' : undefined
            })
            usedBookTransactions.add(bestMatch.id)
          }
        }
      }
    }

    return matches
  }

  private adjustDate(dateStr: string, days: number): string {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  private varyDescription(description: string): string {
    // Simulate variations in description
    const variations = [
      description,
      description.toUpperCase(),
      description.replace(/\s+/g, ' ').trim(),
      description + ' - Online',
      description.replace(/\b\w+\b/, 'PURCHASE')
    ]
    return variations[Math.floor(Math.random() * variations.length)]
  }
}

export const bulkReconciliationEngine = new BulkReconciliationEngine()
