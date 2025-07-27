export interface Transaction {
  id: string;
  user_id: string;
  client_id?: string;
  date: string;
  description: string;
  amount: number;
  is_reconciled: boolean;
  reconciliation_group?: string | null;
  transaction_type?: 'bank' | 'bookkeeping';
  category?: string;
  notes?: string;
  created_at?: string;
}

export interface TransactionUpload {
  date: string;
  description: string;
  amount: number;
  transaction_type: 'bank' | 'bookkeeping';
  category?: string;
}

export interface Client {
  id: string;
  name: string;
  business_name: string;
  email?: string;
  created_at: string;
  user_id: string;
}

export interface ReconciliationMatch {
  id: string;
  bank_transaction_id: string;
  bookkeeping_transaction_id: string;
  match_date: string;
  confidence_score?: number;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface ReconciliationSummary {
  total: number;
  reconciled: number;
  unreconciled: number;
  bankTransactions: number;
  bookkeepingTransactions: number;
} 