// Temporary storage for CSV processing results
// In production, this should use Redis or a database

interface TemporaryResult {
  transactions: any[];
  duplicates: any[];
  unmatched: any[];
  timeSaved: number;
  processedAt: string;
  expiresAt: number;
}

const temporaryResults = new Map<string, TemporaryResult>();
const usedIPs = new Set<string>(); // Track IPs that have used the free trial

export function storeTemporaryResults(sessionId: string, results: Omit<TemporaryResult, 'expiresAt'>) {
  temporaryResults.set(sessionId, {
    ...results,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  });
}

export function checkIPUsage(ip: string): boolean {
  return usedIPs.has(ip);
}

export function markIPAsUsed(ip: string) {
  usedIPs.add(ip);
}

export function cleanupExpiredIPs() {
  // Clean up IPs after 24 hours to allow retry
  // In production, you'd want to use a more sophisticated approach
  const now = Date.now();
  if (now % (24 * 60 * 60 * 1000) < 1000) { // Reset once per day
    usedIPs.clear();
  }
}

export function getTemporaryResults(sessionId: string): TemporaryResult | null {
  const results = temporaryResults.get(sessionId);
  
  if (!results) {
    return null;
  }
  
  // Check if expired
  if (results.expiresAt < Date.now()) {
    temporaryResults.delete(sessionId);
    return null;
  }
  
  return results;
}

export function deleteTemporaryResults(sessionId: string) {
  temporaryResults.delete(sessionId);
}

export function cleanupExpiredResults() {
  const now = Date.now();
  const expiredIds: string[] = [];
  
  temporaryResults.forEach((result, id) => {
    if (result.expiresAt < now) {
      expiredIds.push(id);
    }
  });
  
  expiredIds.forEach(id => {
    temporaryResults.delete(id);
  });
}
