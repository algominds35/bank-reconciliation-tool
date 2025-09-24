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

export function storeTemporaryResults(sessionId: string, results: Omit<TemporaryResult, 'expiresAt'>) {
  temporaryResults.set(sessionId, {
    ...results,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  });
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
  for (const [id, result] of temporaryResults.entries()) {
    if (result.expiresAt < now) {
      temporaryResults.delete(id);
    }
  }
}
