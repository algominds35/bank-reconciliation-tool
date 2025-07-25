export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  description: string;
  amount: number;
  is_reconciled: boolean;
  reconciliation_group?: string | null;
  created_at?: string;
}

export interface TransactionUpload {
  date: string;
  description: string;
  amount: number;
}

export interface User {
  id: string;
  email: string;
}

export interface ReconciliationSummary {
  total: number;
  reconciled: number;
  unreconciled: number;
} 