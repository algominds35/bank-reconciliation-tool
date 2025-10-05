/**
 * Single-File Auto-Matching Engine
 * Works with just bank statements to find duplicates, patterns, and suggest categories
 */

export interface SingleFileMatch {
  id: string
  type: 'duplicate' | 'pattern' | 'category_suggestion'
  confidence: number
  transactions: Transaction[]
  suggestion?: string
  reason: string
}

export interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  category?: string
  type: 'Credit' | 'Debit'
}

export interface CategorySuggestion {
  description: string
  category: string
  confidence: number
  transactionCount: number
}

export class SingleFileMatcher {
  private confidence_threshold = 0.7
  private duplicate_amount_tolerance = 0.01
  private date_tolerance_days = 7

  /**
   * Find all types of matches in a single file
   */
  findMatches(transactions: Transaction[]): SingleFileMatch[] {
    console.log(`Analyzing ${transactions.length} transactions for single-file matches...`)
    
    const matches: SingleFileMatch[] = []
    
    // 1. Find exact duplicates
    const duplicates = this.findExactDuplicates(transactions)
    matches.push(...duplicates)
    
    // 2. Find pattern matches (recurring transactions)
    const patterns = this.findPatternMatches(transactions)
    matches.push(...patterns)
    
    // 3. Generate category suggestions
    const categories = this.generateCategorySuggestions(transactions)
    matches.push(...categories)
    
    console.log(`Found ${matches.length} total matches:`, {
      duplicates: duplicates.length,
      patterns: patterns.length,
      categories: categories.length
    })
    
    return matches
  }

  /**
   * Find exact duplicate transactions
   */
  private findExactDuplicates(transactions: Transaction[]): SingleFileMatch[] {
    const duplicates: SingleFileMatch[] = []
    const processed = new Set<string>()
    
    for (let i = 0; i < transactions.length; i++) {
      const tx1 = transactions[i]
      const key1 = this.getTransactionKey(tx1)
      
      if (processed.has(key1)) continue
      
      const duplicateGroup = [tx1]
      
      for (let j = i + 1; j < transactions.length; j++) {
        const tx2 = transactions[j]
        const key2 = this.getTransactionKey(tx2)
        
        if (processed.has(key2)) continue
        
        // Use exact key matching for duplicates (same amount, description, date)
        if (key1 === key2) {
          duplicateGroup.push(tx2)
          processed.add(key2)
        }
      }
      
      if (duplicateGroup.length > 1) {
        duplicates.push({
          id: `duplicate_${tx1.id}`,
          type: 'duplicate',
          confidence: 0.95,
          transactions: duplicateGroup,
          reason: `Found ${duplicateGroup.length} exact duplicates with same amount and description`
        })
        processed.add(key1)
      }
    }
    
    return duplicates
  }

  /**
   * Find recurring transaction patterns
   */
  private findPatternMatches(transactions: Transaction[]): SingleFileMatch[] {
    const patterns: SingleFileMatch[] = []
    const vendorGroups = this.groupByVendor(transactions)
    
    for (const [vendor, vendorTransactions] of Array.from(vendorGroups.entries())) {
      if (vendorTransactions.length < 3) continue // Need at least 3 transactions to be a pattern
      
      // Group by amount to find recurring payments
      const amountGroups = this.groupByAmount(vendorTransactions)
      
      for (const [amount, amountTransactions] of Array.from(amountGroups.entries())) {
        if (amountTransactions.length >= 3) {
          // Check if these are regularly spaced (monthly, weekly, etc.)
          const isRegular = this.isRegularPattern(amountTransactions)
          
          if (isRegular) {
            patterns.push({
              id: `pattern_${vendor}_${amount}`,
              type: 'pattern',
              confidence: 0.85,
              transactions: amountTransactions,
              suggestion: `Recurring ${this.getFrequency(amountTransactions)} payment to ${vendor}`,
              reason: `Found ${amountTransactions.length} recurring ${this.getFrequency(amountTransactions)} payments of $${amount} to ${vendor}`
            })
          }
        }
      }
    }
    
    return patterns
  }

  /**
   * Generate category suggestions based on transaction descriptions
   */
  private generateCategorySuggestions(transactions: Transaction[]): SingleFileMatch[] {
    const suggestions: SingleFileMatch[] = []
    const vendorGroups = this.groupByVendor(transactions)
    
    for (const [vendor, vendorTransactions] of Array.from(vendorGroups.entries())) {
      if (vendorTransactions.length < 2) continue
      
      const suggestedCategory = this.suggestCategory(vendor)
      if (suggestedCategory) {
        suggestions.push({
          id: `category_${vendor}`,
          type: 'category_suggestion',
          confidence: this.getCategoryConfidence(vendor, suggestedCategory),
          transactions: vendorTransactions,
          suggestion: `Categorize all ${vendor} transactions as "${suggestedCategory}"`,
          reason: `${vendor} appears ${vendorTransactions.length} times and typically belongs to "${suggestedCategory}" category`
        })
      }
    }
    
    return suggestions
  }

  /**
   * Check if two transactions are exact duplicates
   */
  private isExactDuplicate(tx1: Transaction, tx2: Transaction): boolean {
    const amountMatch = Math.abs(tx1.amount - tx2.amount) < this.duplicate_amount_tolerance
    const descMatch = tx1.description.toLowerCase() === tx2.description.toLowerCase()
    const dateDiff = Math.abs(new Date(tx1.date).getTime() - new Date(tx2.date).getTime()) / (1000 * 60 * 60 * 24)
    const dateMatch = dateDiff <= this.date_tolerance_days
    
    return amountMatch && descMatch && dateMatch
  }

  /**
   * Get a unique key for transaction grouping
   */
  private getTransactionKey(tx: Transaction): string {
    // Use exact match for duplicates - same amount, description, and date
    return `${tx.amount}_${tx.description.toLowerCase().trim()}_${tx.date}`
  }

  /**
   * Group transactions by vendor (extracted from description)
   */
  private groupByVendor(transactions: Transaction[]): Map<string, Transaction[]> {
    const groups = new Map<string, Transaction[]>()
    
    for (const tx of transactions) {
      const vendor = this.extractVendor(tx.description)
      if (!groups.has(vendor)) {
        groups.set(vendor, [])
      }
      groups.get(vendor)!.push(tx)
    }
    
    return groups
  }

  /**
   * Group transactions by amount
   */
  private groupByAmount(transactions: Transaction[]): Map<number, Transaction[]> {
    const groups = new Map<number, Transaction[]>()
    
    for (const tx of transactions) {
      const amount = Math.round(tx.amount * 100) / 100 // Round to 2 decimal places
      if (!groups.has(amount)) {
        groups.set(amount, [])
      }
      groups.get(amount)!.push(tx)
    }
    
    return groups
  }

  /**
   * Extract vendor name from transaction description
   */
  private extractVendor(description: string): string {
    // Remove common prefixes and suffixes
    let vendor = description
      .replace(/^(DEPOSIT|WITHDRAWAL|TRANSFER|PAYMENT|AUTOMATIC)\s+/i, '')
      .replace(/\s+(PAYMENT|DEPOSIT|TRANSFER|AUTOMATIC)$/i, '')
      .replace(/\s+#\d+/g, '') // Remove transaction numbers
      .replace(/\s+\d{4}-\d{2}-\d{2}/g, '') // Remove dates
      .trim()
    
    // Take first 3 words as vendor name
    const words = vendor.split(' ')
    return words.slice(0, 3).join(' ')
  }

  /**
   * Check if transactions follow a regular pattern
   */
  private isRegularPattern(transactions: Transaction[]): boolean {
    if (transactions.length < 3) return false
    
    const sortedDates = transactions
      .map(tx => new Date(tx.date).getTime())
      .sort((a, b) => a - b)
    
    const intervals: number[] = []
    for (let i = 1; i < sortedDates.length; i++) {
      intervals.push(sortedDates[i] - sortedDates[i - 1])
    }
    
    // Check if intervals are consistent (within 20% variance)
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    
    return intervals.every(interval => 
      Math.abs(interval - avgInterval) / avgInterval <= 0.2
    )
  }

  /**
   * Get frequency of recurring pattern
   */
  private getFrequency(transactions: Transaction[]): string {
    if (transactions.length < 2) return 'unknown'
    
    const sortedDates = transactions
      .map(tx => new Date(tx.date).getTime())
      .sort((a, b) => a - b)
    
    const avgInterval = (sortedDates[sortedDates.length - 1] - sortedDates[0]) / (transactions.length - 1)
    const days = avgInterval / (1000 * 60 * 60 * 24)
    
    if (days <= 7) return 'weekly'
    if (days <= 14) return 'bi-weekly'
    if (days <= 35) return 'monthly'
    if (days <= 90) return 'quarterly'
    return 'annual'
  }

  /**
   * Suggest category based on vendor name
   */
  private suggestCategory(vendor: string): string | null {
    const vendorLower = vendor.toLowerCase()
    
    // Office supplies
    if (vendorLower.includes('office') || vendorLower.includes('staples') || 
        vendorLower.includes('depot') || vendorLower.includes('supplies')) {
      return 'Office Supplies'
    }
    
    // Meals
    if (vendorLower.includes('starbucks') || vendorLower.includes('mcdonald') ||
        vendorLower.includes('restaurant') || vendorLower.includes('cafe')) {
      return 'Meals & Entertainment'
    }
    
    // Software
    if (vendorLower.includes('microsoft') || vendorLower.includes('adobe') ||
        vendorLower.includes('software') || vendorLower.includes('subscription')) {
      return 'Software & Subscriptions'
    }
    
    // Utilities
    if (vendorLower.includes('electric') || vendorLower.includes('gas') ||
        vendorLower.includes('water') || vendorLower.includes('utility')) {
      return 'Utilities'
    }
    
    // Rent
    if (vendorLower.includes('rent') || vendorLower.includes('lease')) {
      return 'Rent'
    }
    
    // Insurance
    if (vendorLower.includes('insurance') || vendorLower.includes('premium')) {
      return 'Insurance'
    }
    
    return null
  }

  /**
   * Get confidence level for category suggestion
   */
  private getCategoryConfidence(vendor: string, category: string): number {
    const vendorLower = vendor.toLowerCase()
    
    // High confidence for exact matches
    if (vendorLower.includes('starbucks') || vendorLower.includes('microsoft')) {
      return 0.95
    }
    
    // Medium confidence for partial matches
    if (vendorLower.includes('office') || vendorLower.includes('restaurant')) {
      return 0.8
    }
    
    // Lower confidence for general terms
    return 0.7
  }
}
