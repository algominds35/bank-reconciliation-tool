export interface Transaction {
  id: string;
  user_id: string;
  client_id?: string;
  date: string;
  description: string;
  amount: number;
  is_reconciled: boolean;
  reconciliation_group?: string | null;
  transaction_type?: 'bank' | 'bookkeeping' | 'quickbooks';
  category?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // QuickBooks specific fields
  qbo_id?: string;
  qbo_realm_id?: string;
  qbo_account_id?: string;
  qbo_account_name?: string;
  is_credit?: boolean;
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
  totalAmount: number;
  reconciled: number;
  unreconciled: number;
  bankTransactions: number;
  bookkeepingTransactions: number;
  quickbooksTransactions: number;
}

// NEW: Standalone Invoice Types (No QuickBooks Required)
export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  created_at: string;
  updated_at: string;
  last_reminder_sent?: string;
  reminder_phase?: 'friendly' | 'reminder' | 'overdue' | 'final';
  payment_date?: string;
  notes?: string;
  // Related client data when joined
  clients?: {
    name: string;
    business_name?: string;
    email?: string;
  };
}

export interface InvoiceUpload {
  client_name: string;
  client_email: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  description: string;
}

export interface CollectionReminder {
  id: string;
  invoice_id: string;
  user_id: string;
  phase: 'friendly' | 'reminder' | 'overdue' | 'final';
  sent_at: string;
  email: string;
  subject: string;
  content: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked';
  response?: string;
}

export interface CollectionSettings {
  id: string;
  user_id: string;
  friendly_reminder_days: number;
  reminder_days: number;
  overdue_days: number;
  final_notice_days: number;
  email_template_friendly: string;
  email_template_reminder: string;
  email_template_overdue: string;
  email_template_final: string;
  company_name: string;
  company_email: string;
  payment_link_base: string;
} 