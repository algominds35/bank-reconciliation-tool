/**
 * Duplicate Detection for QuickBooks & Bank Transactions
 * 
 * Accurately detects:
 * 1. Duplicates within QuickBooks data
 * 2. Transactions that exist in both Bank and QuickBooks
 * 3. Discrepancies between Bank and QuickBooks
 */

export interface Transaction {
  id: string
  date: string
  amount: number
  description?: string
  memo?: string
  transaction_type?: string
  reference_number?: string
}

export interface DuplicateMatch {
  transaction1: Transaction
  transaction2: Transaction
  confidence: number
  reason: string
  type: 'exact' | 'likely' | 'possible'
}

export interface DiscrepancyReport {
  inBankOnly: Transaction[]
  inQuickBooksOnly: Transaction[]
  duplicatesInQuickBooks: DuplicateMatch[]
  duplicatesAcrossSystems: DuplicateMatch[]
  summary: {
    totalBankTransactions: number
    totalQBTransactions: number
    matched: number
    missingFromQB: number
    missingFromBank: number
    potentialDuplicates: number
  }
}

export class DuplicateDetector {
  // Matching thresholds
  private readonly EXACT_MATCH_THRESHOLD = 0.95
  private readonly LIKELY_MATCH_THRESHOLD = 0.85
  private readonly POSSIBLE_MATCH_THRESHOLD = 0.70
  private readonly DATE_TOLERANCE_DAYS = 2
  private readonly AMOUNT_TOLERANCE = 0.01

  /**
   * Find duplicate transactions within QuickBooks data
   */
  findDuplicatesInQB(transactions: Transaction[]): DuplicateMatch[] {
    const duplicates: DuplicateMatch[] = []
    const checked = new Set<string>()

    for (let i = 0; i < transactions.length; i++) {
      for (let j = i + 1; j < transactions.length; j++) {
        const tx1 = transactions[i]
        const tx2 = transactions[j]
        const pairKey = `${tx1.id}-${tx2.id}`

        if (checked.has(pairKey)) continue
        checked.add(pairKey)

        const match = this.calculateDuplicateProbability(tx1, tx2)
        
        if (match.confidence >= this.POSSIBLE_MATCH_THRESHOLD) {
          duplicates.push(match)
        }
      }
    }

    return duplicates.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Find transactions that exist in both Bank and QuickBooks
   * (These are matches, not errors - but bookkeeper needs to know)
   */
  findMatchesAcrossSystems(
    bankTransactions: Transaction[],
    qbTransactions: Transaction[]
  ): DuplicateMatch[] {
    const matches: DuplicateMatch[] = []
    const matchedBankIds = new Set<string>()
    const matchedQBIds = new Set<string>()

    for (const bankTx of bankTransactions) {
      if (matchedBankIds.has(bankTx.id)) continue

      let bestMatch: DuplicateMatch | null = null

      for (const qbTx of qbTransactions) {
        if (matchedQBIds.has(qbTx.id)) continue

        const match = this.calculateDuplicateProbability(bankTx, qbTx)

        if (
          match.confidence >= this.LIKELY_MATCH_THRESHOLD &&
          (!bestMatch || match.confidence > bestMatch.confidence)
        ) {
          bestMatch = match
        }
      }

      if (bestMatch) {
        matches.push(bestMatch)
        matchedBankIds.add(bankTx.id)
        matchedQBIds.add(bestMatch.transaction2.id)
      }
    }

    return matches
  }

  /**
   * Generate comprehensive discrepancy report
   */
  generateDiscrepancyReport(
    bankTransactions: Transaction[],
    qbTransactions: Transaction[]
  ): DiscrepancyReport {
    // Find matches across systems
    const matchesAcrossSystems = this.findMatchesAcrossSystems(
      bankTransactions,
      qbTransactions
    )

    // Find duplicates within QB
    const duplicatesInQuickBooks = this.findDuplicatesInQB(qbTransactions)

    // Extract matched IDs
    const matchedBankIds = new Set(
      matchesAcrossSystems.map((m) => m.transaction1.id)
    )
    const matchedQBIds = new Set(
      matchesAcrossSystems.map((m) => m.transaction2.id)
    )

    // Find unmatched transactions
    const inBankOnly = bankTransactions.filter(
      (tx) => !matchedBankIds.has(tx.id)
    )
    const inQuickBooksOnly = qbTransactions.filter(
      (tx) => !matchedQBIds.has(tx.id)
    )

    return {
      inBankOnly,
      inQuickBooksOnly,
      duplicatesInQuickBooks,
      duplicatesAcrossSystems: matchesAcrossSystems,
      summary: {
        totalBankTransactions: bankTransactions.length,
        totalQBTransactions: qbTransactions.length,
        matched: matchesAcrossSystems.length,
        missingFromQB: inBankOnly.length,
        missingFromBank: inQuickBooksOnly.length,
        potentialDuplicates: duplicatesInQuickBooks.length,
      },
    }
  }

  /**
   * Calculate probability that two transactions are duplicates
   * Returns confidence score (0-1) and reasoning
   */
  private calculateDuplicateProbability(
    tx1: Transaction,
    tx2: Transaction
  ): DuplicateMatch {
    let confidence = 0
    const reasons: string[] = []

    // 1. Amount match (50% of confidence)
    const amountDiff = Math.abs(tx1.amount - tx2.amount)
    if (amountDiff <= this.AMOUNT_TOLERANCE) {
      confidence += 0.5
      reasons.push('Exact amount match')
    } else if (amountDiff / Math.abs(tx1.amount) < 0.01) {
      // Within 1% difference
      confidence += 0.4
      reasons.push('Very close amount')
    }

    // 2. Date match (30% of confidence)
    const daysDiff = this.getDaysDifference(tx1.date, tx2.date)
    if (daysDiff === 0) {
      confidence += 0.3
      reasons.push('Same date')
    } else if (daysDiff <= this.DATE_TOLERANCE_DAYS) {
      confidence += 0.2
      reasons.push(`Within ${daysDiff} days`)
    } else if (daysDiff <= 7) {
      confidence += 0.1
      reasons.push('Within a week')
    }

    // 3. Description/Memo similarity (20% of confidence)
    const desc1 = this.getDescription(tx1)
    const desc2 = this.getDescription(tx2)
    
    if (desc1 && desc2) {
      const similarity = this.calculateStringSimilarity(desc1, desc2)
      if (similarity > 0.9) {
        confidence += 0.2
        reasons.push('Nearly identical description')
      } else if (similarity > 0.7) {
        confidence += 0.15
        reasons.push('Similar description')
      } else if (similarity > 0.5) {
        confidence += 0.1
        reasons.push('Somewhat similar description')
      }
    }

    // Determine match type
    let type: 'exact' | 'likely' | 'possible'
    if (confidence >= this.EXACT_MATCH_THRESHOLD) {
      type = 'exact'
    } else if (confidence >= this.LIKELY_MATCH_THRESHOLD) {
      type = 'likely'
    } else {
      type = 'possible'
    }

    return {
      transaction1: tx1,
      transaction2: tx2,
      confidence: Math.round(confidence * 100) / 100,
      reason: reasons.join(', '),
      type,
    }
  }

  /**
   * Calculate days difference between two dates
   */
  private getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  /**
   * Get description from transaction (handles different field names)
   */
  private getDescription(tx: Transaction): string {
    return (
      tx.description ||
      tx.memo ||
      tx.reference_number ||
      ''
    ).toLowerCase().trim()
  }

  /**
   * Calculate string similarity using simple algorithm
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0
    if (str1 === str2) return 1

    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()

    // Count common words
    const words1 = s1.split(/\s+/)
    const words2 = s2.split(/\s+/)
    const commonWords = words1.filter((word) => 
      word.length > 2 && words2.includes(word)
    )

    if (words1.length === 0 && words2.length === 0) return 1
    if (words1.length === 0 || words2.length === 0) return 0

    // Calculate Jaccard similarity
    const allWords = new Set([...words1, ...words2])
    const intersection = commonWords.length
    const union = allWords.size

    return intersection / union
  }

  /**
   * Flag transactions that should NOT be imported to QB
   * (Because they already exist)
   */
  flagAlreadyInQuickBooks(
    bankTransactions: Transaction[],
    qbTransactions: Transaction[]
  ): Map<string, { alreadyExists: boolean; matchedTo?: Transaction; confidence: number }> {
    const flags = new Map()

    const matches = this.findMatchesAcrossSystems(bankTransactions, qbTransactions)

    // Flag all matched bank transactions
    for (const match of matches) {
      flags.set(match.transaction1.id, {
        alreadyExists: true,
        matchedTo: match.transaction2,
        confidence: match.confidence,
      })
    }

    // Mark unmatched as safe to import
    for (const bankTx of bankTransactions) {
      if (!flags.has(bankTx.id)) {
        flags.set(bankTx.id, {
          alreadyExists: false,
          confidence: 0,
        })
      }
    }

    return flags
  }
}

// Export singleton instance
export const duplicateDetector = new DuplicateDetector()

