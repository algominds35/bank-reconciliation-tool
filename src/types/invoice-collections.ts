// Invoice Collections System TypeScript Types

export interface Client {
  id: string;
  user_id: string;
  realm_id: string;
  qbo_customer_id: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  last_contact_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  realm_id: string;
  qbo_invoice_id: string;
  client_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  balance: number;
  status: 'open' | 'paid' | 'overdue' | 'cancelled';
  days_overdue: number;
  last_payment_date?: string;
  notes?: string;
  is_reminder_active: boolean;
  last_reminder_sent?: string;
  next_reminder_date?: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  client?: Client;
  email_campaigns?: EmailCampaign[];
  payment_reminders?: PaymentReminder[];
}

export interface EmailCampaign {
  id: string;
  user_id: string;
  invoice_id: string;
  client_id: string;
  campaign_type: 'friendly' | 'firm' | 'final' | 'custom';
  email_subject: string;
  email_body: string;
  recipient_email: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  bounced: boolean;
  bounce_reason?: string;
  response_received: boolean;
  response_text?: string;
  created_at: string;
  
  // Joined fields
  invoice?: Invoice;
  client?: Client;
}

export interface PaymentReminder {
  id: string;
  user_id: string;
  invoice_id: string;
  reminder_type: 'friendly' | 'firm' | 'final';
  days_overdue: number;
  is_active: boolean;
  next_send_date: string;
  last_sent_date?: string;
  email_template_id?: string;
  custom_message?: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  invoice?: Invoice;
}

export interface EmailTemplate {
  id: string;
  user_id: string;
  template_name: string;
  template_type: 'friendly' | 'firm' | 'final' | 'custom';
  subject_line: string;
  email_body: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuickBooksInvoice {
  Id: string;
  DocNumber: string;
  TxnDate: string;
  DueDate: string;
  TotalAmt: number;
  Balance: number;
  CustomerRef: {
    value: string;
    name: string;
  };
  CustomerMemo?: {
    value: string;
  };
  Line?: Array<{
    Amount: number;
    Description?: string;
  }>;
}

export interface QuickBooksCustomer {
  Id: string;
  CompanyName?: string;
  GivenName?: string;
  FamilyName?: string;
  PrimaryEmailAddr?: {
    Address: string;
  };
  PrimaryPhone?: {
    FreeFormNumber: string;
  };
  BillAddr?: {
    Line1?: string;
    Line2?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
    Country?: string;
  };
}

export interface InvoiceSyncResult {
  success: boolean;
  invoices_processed: number;
  clients_processed: number;
  errors: string[];
  message: string;
}

export interface EmailSendResult {
  success: boolean;
  campaign_id?: string;
  message_id?: string;
  error?: string;
}

export interface DashboardStats {
  total_invoices: number;
  overdue_invoices: number;
  total_overdue_amount: number;
  active_campaigns: number;
  emails_sent_today: number;
  payments_received_today: number;
  average_days_to_pay: number;
  collection_rate: number;
}

export interface InvoiceFilters {
  status?: string[];
  days_overdue?: number[];
  client_id?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
  amount_range?: {
    min: number;
    max: number;
  };
}

export interface EmailTemplateVariables {
  client_name: string;
  invoice_number: string;
  amount: string;
  due_date: string;
  days_overdue: number;
  your_name: string;
  deadline_date?: string;
  [key: string]: string | number;
}
