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
const usedEmails = new Set<string>(); // Track emails that have used the free trial

export function storeTemporaryResults(sessionId: string, results: Omit<TemporaryResult, 'expiresAt'>) {
  temporaryResults.set(sessionId, {
    ...results,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  });
}

export function checkEmailUsage(email: string): boolean {
  return usedEmails.has(email.toLowerCase().trim());
}

export function markEmailAsUsed(email: string) {
  usedEmails.add(email.toLowerCase().trim());
}

export function cleanupExpiredEmails() {
  // In production, you'd want to use a database with expiration dates
  // For now, we'll keep emails permanently to prevent abuse
  // You could implement a 30-day expiration if needed
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
