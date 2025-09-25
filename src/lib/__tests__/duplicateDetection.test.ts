// Unit tests for Duplicate Detection v2
import {
  Txn,
  DedupeSettings,
  DEFAULT_SETTINGS,
  dedupePreview,
  dedupeApply,
  normalizeDescription,
  calculateSimilarity,
  isDefiniteDuplicate,
  isPossibleDuplicate,
  exportCleanData,
  exportAuditLog
} from '../duplicateDetection';

// Test data
const testTxns: Txn[] = [
  // Test Case 1: Two identical $2,500 deposits on same date
  {
    id: '1',
    date: '2024-01-15',
    amount: 2500,
    type: 'income',
    description: 'Client Payment - ABC Corp',
    category: 'Revenue',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-15',
    amount: 2500,
    type: 'income',
    description: 'Client Payment - ABC Corp',
    category: 'Revenue',
    created_at: '2024-01-15T10:05:00Z'
  },
  
  // Test Case 2: Three $2,500 deposits on different dates
  {
    id: '3',
    date: '2024-01-23',
    amount: 2500,
    type: 'income',
    description: 'Client Payment - ABC Corp',
    category: 'Revenue',
    created_at: '2024-01-23T10:00:00Z'
  },
  {
    id: '4',
    date: '2024-01-29',
    amount: 2500,
    type: 'income',
    description: 'Client Payment - ABC Corp',
    category: 'Revenue',
    created_at: '2024-01-29T10:00:00Z'
  },
  {
    id: '5',
    date: '2024-01-30',
    amount: 2500,
    type: 'income',
    description: 'Client Payment - ABC Corp',
    category: 'Revenue',
    created_at: '2024-01-30T10:00:00Z'
  },
  
  // Test Case 3: $99 subscription duplicated on same date
  {
    id: '6',
    date: '2024-01-18',
    amount: -99,
    type: 'expense',
    description: 'Software Subscription',
    category: 'Technology',
    created_at: '2024-01-18T09:00:00Z'
  },
  {
    id: '7',
    date: '2024-01-18',
    amount: -99,
    type: 'expense',
    description: 'Software Subscription',
    category: 'Technology',
    created_at: '2024-01-18T09:15:00Z'
  },
  
  // Test Case 4: Vendor alias normalization
  {
    id: '8',
    date: '2024-01-20',
    amount: -150,
    type: 'expense',
    description: 'P G & E Electric Bill',
    category: 'Utilities',
    created_at: '2024-01-20T08:00:00Z'
  },
  {
    id: '9',
    date: '2024-01-20',
    amount: -150,
    type: 'expense',
    description: 'PG&E Electric Bill',
    category: 'Utilities',
    created_at: '2024-01-20T08:05:00Z'
  },
  
  // Test Case 5: Non-duplicates (should not be grouped)
  {
    id: '10',
    date: '2024-01-25',
    amount: 1000,
    type: 'income',
    description: 'Consulting Fee',
    category: 'Revenue',
    created_at: '2024-01-25T14:00:00Z'
  },
  {
    id: '11',
    date: '2024-01-26',
    amount: 500,
    type: 'income',
    description: 'Different Service',
    category: 'Revenue',
    created_at: '2024-01-26T15:00:00Z'
  }
];

describe('Duplicate Detection v2', () => {
  describe('normalizeDescription', () => {
    it('should normalize vendor names using aliases', () => {
      const result1 = normalizeDescription('P G & E Electric Bill', DEFAULT_SETTINGS.vendor_aliases);
      const result2 = normalizeDescription('PG&E Electric Bill', DEFAULT_SETTINGS.vendor_aliases);
      
      expect(result1).toBe('pge electric bill');
      expect(result2).toBe('pge electric bill');
      expect(result1).toBe(result2);
    });

    it('should remove invoice numbers and normalize text', () => {
      const result = normalizeDescription('Amazon Mktp US*abcd1234 Order #5678', DEFAULT_SETTINGS.vendor_aliases);
      expect(result).toBe('amazon order');
    });

    it('should handle empty and whitespace descriptions', () => {
      expect(normalizeDescription('')).toBe('');
      expect(normalizeDescription('   ')).toBe('');
      expect(normalizeDescription('  Multiple   Spaces  ')).toBe('multiple spaces');
    });
  });

  describe('calculateSimilarity', () => {
    it('should return 1.0 for identical descriptions', () => {
      const similarity = calculateSimilarity('Client Payment', 'Client Payment');
      expect(similarity).toBe(1.0);
    });

    it('should return high similarity for similar descriptions', () => {
      const similarity = calculateSimilarity('Amazon Mktp US', 'Amazon Marketplace');
      expect(similarity).toBeGreaterThan(0.7);
    });

    it('should return low similarity for different descriptions', () => {
      const similarity = calculateSimilarity('Client Payment', 'Office Supplies');
      expect(similarity).toBeLessThan(0.5);
    });
  });

  describe('isDefiniteDuplicate', () => {
    it('should identify definite duplicates', () => {
      const txn1 = testTxns[0]; // 2024-01-15, $2500, Client Payment - ABC Corp
      const txn2 = testTxns[1]; // 2024-01-15, $2500, Client Payment - ABC Corp
      
      expect(isDefiniteDuplicate(txn1, txn2, DEFAULT_SETTINGS)).toBe(true);
    });

    it('should not identify as definite duplicate if dates differ', () => {
      const txn1 = testTxns[0]; // 2024-01-15
      const txn2 = testTxns[2]; // 2024-01-23
      
      expect(isDefiniteDuplicate(txn1, txn2, DEFAULT_SETTINGS)).toBe(false);
    });

    it('should not identify as definite duplicate if amounts differ', () => {
      const txn1 = testTxns[0]; // $2500
      const txn10 = testTxns[9]; // $1000
      
      expect(isDefiniteDuplicate(txn1, txn10, DEFAULT_SETTINGS)).toBe(false);
    });
  });

  describe('isPossibleDuplicate', () => {
    it('should identify possible duplicates with same amount and similar description', () => {
      const txn3 = testTxns[2]; // 2024-01-23
      const txn4 = testTxns[3]; // 2024-01-29
      
      expect(isPossibleDuplicate(txn3, txn4, DEFAULT_SETTINGS)).toBe(true);
    });

    it('should not identify as possible duplicate if dates are too far apart', () => {
      const txn3 = testTxns[2]; // 2024-01-23
      const txn5 = testTxns[4]; // 2024-01-30
      
      // Income window is 3 days by default, so 7 days apart should not match
      expect(isPossibleDuplicate(txn3, txn5, DEFAULT_SETTINGS)).toBe(false);
    });
  });

  describe('dedupePreview', () => {
    it('should find definite duplicates for identical transactions', () => {
      const result = dedupePreview(testTxns, DEFAULT_SETTINGS);
      
      const definiteGroups = result.filter(g => g.label === 'definite');
      expect(definiteGroups.length).toBeGreaterThan(0);
      
      // Should find the $2500 deposits on same date
      const sameDateGroup = definiteGroups.find(g => 
        g.txns.some(t => t.txn.id === '1') && 
        g.txns.some(t => t.txn.id === '2')
      );
      expect(sameDateGroup).toBeDefined();
      expect(sameDateGroup!.confidence).toBe(0.95);
    });

    it('should find possible duplicates for similar transactions on different dates', () => {
      const result = dedupePreview(testTxns, DEFAULT_SETTINGS);
      
      const possibleGroups = result.filter(g => g.label === 'possible');
      expect(possibleGroups.length).toBeGreaterThan(0);
      
      // Should find the $2500 deposits on different dates
      const differentDateGroup = possibleGroups.find(g => 
        g.txns.some(t => t.txn.id === '3') && 
        g.txns.some(t => t.txn.id === '4')
      );
      expect(differentDateGroup).toBeDefined();
      expect(differentDateGroup!.confidence).toBe(0.80);
    });

    it('should handle vendor alias normalization', () => {
      const result = dedupePreview(testTxns, DEFAULT_SETTINGS);
      
      // Should find PG&E duplicates despite different formatting
      const pgeGroup = result.find(g => 
        g.txns.some(t => t.txn.id === '8') && 
        g.txns.some(t => t.txn.id === '9')
      );
      expect(pgeGroup).toBeDefined();
    });

    it('should not group non-duplicates', () => {
      const result = dedupePreview(testTxns, DEFAULT_SETTINGS);
      
      // Should not group the $1000 and $500 transactions
      const mixedGroup = result.find(g => 
        g.txns.some(t => t.txn.id === '10') && 
        g.txns.some(t => t.txn.id === '11')
      );
      expect(mixedGroup).toBeUndefined();
    });

    it('should auto-select oldest transaction to keep for definite duplicates', () => {
      const result = dedupePreview(testTxns, DEFAULT_SETTINGS);
      
      const definiteGroup = result.find(g => g.label === 'definite');
      expect(definiteGroup?.suggested_keep_id).toBeDefined();
      
      // Should suggest keeping the oldest (earliest created_at)
      const suggestedKeep = definiteGroup?.suggested_keep_id;
      const suggestedTxn = testTxns.find(t => t.id === suggestedKeep);
      expect(suggestedTxn?.created_at).toBe('2024-01-15T10:00:00Z'); // Oldest
    });
  });

  describe('dedupeApply', () => {
    it('should create audit log with correct summary', () => {
      const groups = dedupePreview(testTxns, DEFAULT_SETTINGS);
      const keepMap: Record<string, string> = {};
      
      // Set up keep map
      groups.forEach(group => {
        if (group.suggested_keep_id) {
          keepMap[group.group_id] = group.suggested_keep_id;
        }
      });
      
      const auditLog = dedupeApply(groups, keepMap);
      
      expect(auditLog.id).toBeDefined();
      expect(auditLog.timestamp).toBeDefined();
      expect(auditLog.actions.length).toBeGreaterThan(0);
      expect(auditLog.summary.total_processed).toBeGreaterThan(0);
      expect(auditLog.summary.definite_duplicates).toBeGreaterThan(0);
    });

    it('should mark correct transactions as keep vs remove', () => {
      const groups = dedupePreview(testTxns, DEFAULT_SETTINGS);
      const keepMap: Record<string, string> = {};
      
      // Set up keep map
      groups.forEach(group => {
        if (group.suggested_keep_id) {
          keepMap[group.group_id] = group.suggested_keep_id;
        }
      });
      
      const auditLog = dedupeApply(groups, keepMap);
      
      const keepActions = auditLog.actions.filter(a => a.action === 'keep');
      const removeActions = auditLog.actions.filter(a => a.action === 'remove');
      
      expect(keepActions.length).toBeGreaterThan(0);
      expect(removeActions.length).toBeGreaterThan(0);
      expect(keepActions.length + removeActions.length).toBe(auditLog.actions.length);
    });
  });

  describe('exportCleanData', () => {
    it('should export clean data without removed transactions', () => {
      const groups = dedupePreview(testTxns, DEFAULT_SETTINGS);
      const keepMap: Record<string, string> = {};
      
      groups.forEach(group => {
        if (group.suggested_keep_id) {
          keepMap[group.group_id] = group.suggested_keep_id;
        }
      });
      
      const auditLog = dedupeApply(groups, keepMap);
      const exportData = exportCleanData(testTxns, auditLog, 'csv');
      
      expect(exportData.data.length).toBeLessThan(testTxns.length);
      expect(exportData.headers).toContain('id');
      expect(exportData.filename).toContain('clean_transactions');
    });

    it('should support different export formats', () => {
      const groups = dedupePreview(testTxns, DEFAULT_SETTINGS);
      const keepMap: Record<string, string> = {};
      
      groups.forEach(group => {
        if (group.suggested_keep_id) {
          keepMap[group.group_id] = group.suggested_keep_id;
        }
      });
      
      const auditLog = dedupeApply(groups, keepMap);
      
      expect(() => exportCleanData(testTxns, auditLog, 'csv')).not.toThrow();
      expect(() => exportCleanData(testTxns, auditLog, 'xlsx')).not.toThrow();
      expect(() => exportCleanData(testTxns, auditLog, 'pdf')).not.toThrow();
    });
  });

  describe('exportAuditLog', () => {
    it('should export audit log in different formats', () => {
      const groups = dedupePreview(testTxns, DEFAULT_SETTINGS);
      const keepMap: Record<string, string> = {};
      
      groups.forEach(group => {
        if (group.suggested_keep_id) {
          keepMap[group.group_id] = group.suggested_keep_id;
        }
      });
      
      const auditLog = dedupeApply(groups, keepMap);
      
      const csvExport = exportAuditLog(auditLog, 'csv');
      const jsonExport = exportAuditLog(auditLog, 'json');
      
      expect(csvExport.data).toEqual(auditLog.actions);
      expect(csvExport.headers).toContain('txn_id');
      expect(jsonExport.data).toEqual(auditLog);
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      // Generate 1000 test transactions
      const largeTxns: Txn[] = [];
      for (let i = 0; i < 1000; i++) {
        largeTxns.push({
          id: `large_${i}`,
          date: '2024-01-15',
          amount: 100,
          type: 'income',
          description: `Transaction ${i}`,
          category: 'Test',
          created_at: `2024-01-15T${String(i % 24).padStart(2, '0')}:00:00Z`
        });
      }
      
      const startTime = Date.now();
      const result = dedupePreview(largeTxns, DEFAULT_SETTINGS);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(2000); // Should complete in under 2 seconds
      expect(result).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty transaction list', () => {
      const result = dedupePreview([], DEFAULT_SETTINGS);
      expect(result).toEqual([]);
    });

    it('should handle single transaction', () => {
      const singleTxn = [testTxns[0]];
      const result = dedupePreview(singleTxn, DEFAULT_SETTINGS);
      expect(result).toEqual([]);
    });

    it('should handle transactions with missing fields', () => {
      const incompleteTxns: Txn[] = [
        {
          id: 'incomplete1',
          date: '2024-01-15',
          amount: 100,
          type: 'income',
          description: 'Test'
        },
        {
          id: 'incomplete2',
          date: '2024-01-15',
          amount: 100,
          type: 'income',
          description: 'Test'
        }
      ];
      
      expect(() => dedupePreview(incompleteTxns, DEFAULT_SETTINGS)).not.toThrow();
    });
  });
});
