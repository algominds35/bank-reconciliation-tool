// Duplicate Detection v2 - Professional Grade System
// Optimized for trust (bookkeepers) and speed (SMBs)

export interface Txn {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // positive=income, negative=expense
  type: 'income' | 'expense';
  description: string;
  category?: string;
  bank_reference_id?: string | null;
  check_number?: string | null;
  created_at?: string;
}

export interface DuplicateGroup {
  group_id: string;
  label: 'definite' | 'possible';
  confidence: number; // 0..1
  key: { amount: number; description: string };
  suggested_keep_id?: string;
  txns: Array<{ txn: Txn; suggested_remove: boolean }>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actions: Array<{
    txn_id: string;
    action: 'keep' | 'remove';
    reason: string;
    confidence: number;
  }>;
  summary: {
    total_processed: number;
    definite_duplicates: number;
    possible_duplicates: number;
    removed_count: number;
  };
}

export interface DedupeSettings {
  date_window_expense: number; // days
  date_window_income: number; // days
  similarity_threshold: number; // 0.85 default
  treat_same_amount_different_date: boolean;
  auto_select_keep: boolean;
  vendor_aliases: Record<string, string>;
}

// Default settings
export const DEFAULT_SETTINGS: DedupeSettings = {
  date_window_expense: 5,
  date_window_income: 3,
  similarity_threshold: 0.85,
  treat_same_amount_different_date: true,
  auto_select_keep: true,
  vendor_aliases: {
    'p g & e': 'pge',
    'pg&e': 'pge',
    'pge': 'pge',
    'amazon mktp': 'amazon',
    'amazon marketplace': 'amazon',
    'google ads': 'google',
    'google advertising': 'google',
    'paypal': 'paypal',
    'pp': 'paypal',
    'stripe': 'stripe',
    'square': 'square',
    'quickbooks': 'quickbooks',
    'qb': 'quickbooks',
    'microsoft': 'microsoft',
    'msft': 'microsoft',
    'apple': 'apple',
    'aapl': 'apple'
  }
};

// Normalize description for comparison
export function normalizeDescription(description: string, aliases: Record<string, string> = {}): string {
  let normalized = description.toLowerCase().trim();
  
  // Collapse whitespace
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Remove punctuation except spaces and hyphens
  normalized = normalized.replace(/[^\w\s-]/g, '');
  
  // Remove invoice/PO/reference numbers (4+ digits)
  normalized = normalized.replace(/#?\d{4,}/g, '');
  
  // Remove common prefixes/suffixes
  normalized = normalized.replace(/\b(inc|llc|ltd|corp|corporation|company)\b/g, '');
  
  // Apply vendor aliases
  for (const [alias, canonical] of Object.entries(aliases)) {
    if (normalized.includes(alias)) {
      normalized = normalized.replace(new RegExp(alias, 'g'), canonical);
    }
  }
  
  return normalized.trim();
}

// Calculate similarity between two descriptions
export function calculateSimilarity(desc1: string, desc2: string): number {
  const normalized1 = normalizeDescription(desc1);
  const normalized2 = normalizeDescription(desc2);
  
  if (normalized1 === normalized2) return 1.0;
  
  // Token-based Jaccard similarity
  const tokens1 = new Set(normalized1.split(' ').filter(t => t.length > 2));
  const tokens2 = new Set(normalized2.split(' ').filter(t => t.length > 2));
  
  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  
  return intersection.size / union.size;
}

// Check if two transactions are definite duplicates
export function isDefiniteDuplicate(txn1: Txn, txn2: Txn, settings: DedupeSettings): boolean {
  // Same date
  if (txn1.date !== txn2.date) return false;
  
  // Same amount (with 2-decimal rounding)
  const amount1 = Math.round(txn1.amount * 100) / 100;
  const amount2 = Math.round(txn2.amount * 100) / 100;
  if (amount1 !== amount2) return false;
  
  // Same type
  if (txn1.type !== txn2.type) return false;
  
  // Same normalized description
  const desc1 = normalizeDescription(txn1.description, settings.vendor_aliases);
  const desc2 = normalizeDescription(txn2.description, settings.vendor_aliases);
  if (desc1 !== desc2) return false;
  
  // If present, check bank_reference_id or check_number
  if (txn1.bank_reference_id && txn2.bank_reference_id) {
    if (txn1.bank_reference_id !== txn2.bank_reference_id) return false;
  }
  
  if (txn1.check_number && txn2.check_number) {
    if (txn1.check_number !== txn2.check_number) return false;
  }
  
  return true;
}

// Check if two transactions are possible duplicates
export function isPossibleDuplicate(txn1: Txn, txn2: Txn, settings: DedupeSettings): boolean {
  // Same amount
  const amount1 = Math.round(txn1.amount * 100) / 100;
  const amount2 = Math.round(txn2.amount * 100) / 100;
  if (amount1 !== amount2) return false;
  
  // Same type
  if (txn1.type !== txn2.type) return false;
  
  // Similar description
  const similarity = calculateSimilarity(txn1.description, txn2.description);
  if (similarity < settings.similarity_threshold) return false;
  
  // Date within window
  const date1 = new Date(txn1.date);
  const date2 = new Date(txn2.date);
  const daysDiff = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
  
  const maxDays = txn1.type === 'expense' ? settings.date_window_expense : settings.date_window_income;
  
  return daysDiff <= maxDays;
}

// Main deduplication preview function
export function dedupePreview(txns: Txn[], settings: DedupeSettings = DEFAULT_SETTINGS): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const processed = new Set<string>();
  
  // Group by amount for performance (reduces comparisons)
  const amountGroups = new Map<number, Txn[]>();
  txns.forEach(txn => {
    const amount = Math.round(txn.amount * 100) / 100;
    if (!amountGroups.has(amount)) {
      amountGroups.set(amount, []);
    }
    amountGroups.get(amount)!.push(txn);
  });
  
  // Process each amount group
  for (const [amount, amountTxns] of amountGroups) {
    if (amountTxns.length < 2) continue; // Skip if only one transaction with this amount
    
    for (let i = 0; i < amountTxns.length; i++) {
      const txn1 = amountTxns[i];
      if (processed.has(txn1.id)) continue;
      
      const groupTxns = [txn1];
      processed.add(txn1.id);
      
      // Find definite duplicates first
      for (let j = i + 1; j < amountTxns.length; j++) {
        const txn2 = amountTxns[j];
        if (processed.has(txn2.id)) continue;
        
        if (isDefiniteDuplicate(txn1, txn2, settings)) {
          groupTxns.push(txn2);
          processed.add(txn2.id);
        }
      }
      
      // If we found definite duplicates, create definite group
      if (groupTxns.length > 1) {
        const groupId = `definite_${amount}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Sort by created_at (oldest first) for auto-select keep
        groupTxns.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(a.date);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        
        const suggestedKeep = settings.auto_select_keep ? groupTxns[0] : undefined;
        
        groups.push({
          group_id: groupId,
          label: 'definite',
          confidence: 0.95,
          key: { amount, description: normalizeDescription(txn1.description, settings.vendor_aliases) },
          suggested_keep_id: suggestedKeep?.id,
          txns: groupTxns.map(txn => ({
            txn,
            suggested_remove: settings.auto_select_keep ? txn.id !== suggestedKeep?.id : false
          }))
        });
        continue;
      }
      
      // If no definite duplicates, look for possible duplicates
      const possibleGroup = [txn1];
      for (let j = i + 1; j < amountTxns.length; j++) {
        const txn2 = amountTxns[j];
        if (processed.has(txn2.id)) continue;
        
        if (isPossibleDuplicate(txn1, txn2, settings)) {
          possibleGroup.push(txn2);
          processed.add(txn2.id);
        }
      }
      
      // Create possible group if found
      if (possibleGroup.length > 1) {
        const groupId = `possible_${amount}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        groups.push({
          group_id: groupId,
          label: 'possible',
          confidence: 0.80,
          key: { amount, description: normalizeDescription(txn1.description, settings.vendor_aliases) },
          txns: possibleGroup.map(txn => ({
            txn,
            suggested_remove: false // Never auto-remove possible duplicates
          }))
        });
      }
    }
  }
  
  return groups;
}

// Apply deduplication with soft deletes
export function dedupeApply(
  groups: DuplicateGroup[], 
  keepMap: Record<string, string>, // group_id -> txn_id to keep
  userId?: string
): AuditLog {
  const auditLog: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    actions: [],
    summary: {
      total_processed: 0,
      definite_duplicates: 0,
      possible_duplicates: 0,
      removed_count: 0
    }
  };
  
  groups.forEach(group => {
    const keepId = keepMap[group.group_id];
    if (!keepId) return; // Skip if no keep decision made
    
    group.txns.forEach(({ txn, suggested_remove }) => {
      auditLog.summary.total_processed++;
      
      if (group.label === 'definite') {
        auditLog.summary.definite_duplicates++;
      } else {
        auditLog.summary.possible_duplicates++;
      }
      
      const action = txn.id === keepId ? 'keep' : 'remove';
      if (action === 'remove') {
        auditLog.summary.removed_count++;
      }
      
      auditLog.actions.push({
        txn_id: txn.id,
        action,
        reason: `${group.label} duplicate (confidence: ${group.confidence})`,
        confidence: group.confidence
      });
    });
  });
  
  return auditLog;
}

// Export clean data (without duplicates)
export function exportCleanData(txns: Txn[], auditLog: AuditLog, format: 'csv' | 'xlsx' | 'pdf' = 'csv'): any {
  const removedIds = new Set(
    auditLog.actions
      .filter(action => action.action === 'remove')
      .map(action => action.txn_id)
  );
  
  const cleanTxns = txns.filter(txn => !removedIds.has(txn.id));
  
  switch (format) {
    case 'csv':
      return {
        data: cleanTxns,
        headers: ['id', 'date', 'amount', 'type', 'description', 'category', 'bank_reference_id', 'check_number'],
        filename: `clean_transactions_${new Date().toISOString().split('T')[0]}.csv`
      };
    
    case 'xlsx':
      return {
        data: cleanTxns,
        filename: `clean_transactions_${new Date().toISOString().split('T')[0]}.xlsx`
      };
    
    case 'pdf':
      return {
        data: cleanTxns,
        summary: auditLog.summary,
        filename: `clean_transactions_${new Date().toISOString().split('T')[0]}.pdf`
      };
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Export audit log
export function exportAuditLog(auditLog: AuditLog, format: 'csv' | 'json' = 'csv'): any {
  switch (format) {
    case 'csv':
      return {
        data: auditLog.actions,
        headers: ['txn_id', 'action', 'reason', 'confidence', 'timestamp'],
        filename: `audit_log_${auditLog.id}.csv`
      };
    
    case 'json':
      return {
        data: auditLog,
        filename: `audit_log_${auditLog.id}.json`
      };
    
    default:
      throw new Error(`Unsupported audit format: ${format}`);
  }
}
