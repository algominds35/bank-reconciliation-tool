import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  Invoice, 
  Client, 
  QuickBooksInvoice, 
  QuickBooksCustomer, 
  InvoiceSyncResult 
} from '@/types/invoice-collections';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { user_id, realm_id } = await req.json();

    if (!user_id || !realm_id) {
      return NextResponse.json({
        success: false,
        message: 'User ID and Realm ID are required'
      }, { status: 400 });
    }

    // Get QuickBooks connection
    const { data: connection, error: connectionError } = await supabase
      .from('qbo_connections')
      .select('*')
      .eq('user_id', user_id)
      .eq('realm_id', realm_id)
      .single();

    if (connectionError || !connection) {
      return NextResponse.json({
        success: false,
        message: 'QuickBooks connection not found'
      }, { status: 404 });
    }

    // Check if token is expired and refresh if needed
    const now = new Date();
    if (new Date(connection.access_token_expires_at) <= now) {
      // Token expired, need to refresh
      return NextResponse.json({
        success: false,
        message: 'QuickBooks token expired. Please reconnect your account.'
      }, { status: 401 });
    }

    const result = await syncInvoicesAndClients(connection, user_id, realm_id);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Invoice sync error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function syncInvoicesAndClients(
  connection: any, 
  user_id: string, 
  realm_id: string
): Promise<InvoiceSyncResult> {
  const errors: string[] = [];
  let invoices_processed = 0;
  let clients_processed = 0;

  try {
    // Step 1: Sync customers/clients first
    const customers = await fetchQuickBooksCustomers(connection.access_token_encrypted, realm_id);
    
    for (const customer of customers) {
      try {
        await upsertClient(customer, user_id, realm_id);
        clients_processed++;
      } catch (error) {
        errors.push(`Failed to sync customer ${customer.Id}: ${error}`);
      }
    }

    // Step 2: Sync invoices
    const invoices = await fetchQuickBooksInvoices(connection.access_token_encrypted, realm_id);
    
    for (const invoice of invoices) {
      try {
        await upsertInvoice(invoice, user_id, realm_id);
        invoices_processed++;
      } catch (error) {
        errors.push(`Failed to sync invoice ${invoice.Id}: ${error}`);
      }
    }

    // Step 3: Update overdue status and create reminders
    await updateOverdueStatuses(user_id, realm_id);
    await createPaymentReminders(user_id, realm_id);

    return {
      success: true,
      invoices_processed,
      clients_processed,
      errors,
      message: `Successfully synced ${invoices_processed} invoices and ${clients_processed} clients`
    };

  } catch (error) {
    errors.push(`Sync failed: ${error}`);
    return {
      success: false,
      invoices_processed,
      clients_processed,
      errors,
      message: 'Invoice sync failed'
    };
  }
}

async function fetchQuickBooksCustomers(accessToken: string, realmId: string): Promise<QuickBooksCustomer[]> {
  const response = await fetch(
    `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=SELECT * FROM Customer WHERE Active = true&minorversion=65`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.statusText}`);
  }

  const data = await response.json();
  return data.QueryResponse?.Customer || [];
}

async function fetchQuickBooksInvoices(accessToken: string, realmId: string): Promise<QuickBooksInvoice[]> {
  const response = await fetch(
    `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=SELECT * FROM Invoice WHERE Balance > 0 ORDER BY DueDate DESC&minorversion=65`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch invoices: ${response.statusText}`);
  }

  const data = await response.json();
  return data.QueryResponse?.Invoice || [];
}

async function upsertClient(customer: QuickBooksCustomer, user_id: string, realm_id: string): Promise<void> {
  const clientData = {
    user_id,
    realm_id,
    qbo_customer_id: customer.Id,
    company_name: customer.CompanyName || null,
    first_name: customer.GivenName || null,
    last_name: customer.FamilyName || null,
    email: customer.PrimaryEmailAddr?.Address || null,
    phone: customer.PrimaryPhone?.FreeFormNumber || null,
    address: customer.BillAddr ? formatAddress(customer.BillAddr) : null,
    is_active: true
  };

  const { error } = await supabase
    .from('clients')
    .upsert(clientData, { onConflict: 'user_id,realm_id,qbo_customer_id' });

  if (error) throw error;
}

async function upsertInvoice(invoice: QuickBooksInvoice, user_id: string, realm_id: string): Promise<void> {
  // Get client ID first
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user_id)
    .eq('realm_id', realm_id)
    .eq('qbo_customer_id', invoice.CustomerRef.value)
    .single();

  if (!client) {
    throw new Error(`Client not found for customer ${invoice.CustomerRef.value}`);
  }

  const dueDate = new Date(invoice.DueDate);
  const today = new Date();
  const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

  const invoiceData = {
    user_id,
    realm_id,
    qbo_invoice_id: invoice.Id,
    client_id: client.id,
    invoice_number: invoice.DocNumber,
    invoice_date: invoice.TxnDate,
    due_date: invoice.DueDate,
    amount: invoice.TotalAmt,
    balance: invoice.Balance,
    status: daysOverdue > 0 ? 'overdue' : 'open',
    days_overdue: daysOverdue,
    is_reminder_active: daysOverdue > 0,
    next_reminder_date: daysOverdue > 0 ? calculateNextReminderDate(daysOverdue) : null
  };

  const { error } = await supabase
    .from('invoices')
    .upsert(invoiceData, { onConflict: 'user_id,realm_id,qbo_invoice_id' });

  if (error) throw error;
}

function formatAddress(billAddr: any): string {
  const parts = [
    billAddr.Line1,
    billAddr.Line2,
    billAddr.City,
    billAddr.CountrySubDivisionCode,
    billAddr.PostalCode,
    billAddr.Country
  ].filter(Boolean);
  
  return parts.join(', ');
}

function calculateNextReminderDate(daysOverdue: number): string {
  const today = new Date();
  
  if (daysOverdue <= 7) {
    // Send friendly reminder tomorrow
    return new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  } else if (daysOverdue <= 14) {
    // Send firm notice tomorrow
    return new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  } else {
    // Send final notice tomorrow
    return new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
}

async function updateOverdueStatuses(user_id: string, realm_id: string): Promise<void> {
  const today = new Date();
  
  // Update all invoices to recalculate overdue status
  const { error } = await supabase
    .from('invoices')
    .update({
      days_overdue: supabase.sql`EXTRACT(DAY FROM (${today.toISOString()}::date - due_date::date))`,
      status: supabase.sql`CASE 
        WHEN EXTRACT(DAY FROM (${today.toISOString()}::date - due_date::date)) > 0 THEN 'overdue'
        ELSE 'open'
      END`,
      updated_at: today.toISOString()
    })
    .eq('user_id', user_id)
    .eq('realm_id', realm_id)
    .neq('status', 'paid');

  if (error) throw error;
}

async function createPaymentReminders(user_id: string, realm_id: string): Promise<void> {
  // Get overdue invoices that don't have active reminders
  const { data: overdueInvoices, error: fetchError } = await supabase
    .from('invoices')
    .select('id, days_overdue')
    .eq('user_id', user_id)
    .eq('realm_id', realm_id)
    .eq('status', 'overdue')
    .eq('is_reminder_active', false);

  if (fetchError) throw fetchError;

  for (const invoice of overdueInvoices || []) {
    const reminderType = getReminderType(invoice.days_overdue);
    
    if (reminderType) {
      const { error: insertError } = await supabase
        .from('payment_reminders')
        .insert({
          user_id,
          invoice_id: invoice.id,
          reminder_type: reminderType,
          days_overdue: invoice.days_overdue,
          is_active: true,
          next_send_date: new Date().toISOString().split('T')[0]
        });

      if (insertError) {
        console.error(`Failed to create reminder for invoice ${invoice.id}:`, insertError);
      }
    }
  }
}

function getReminderType(daysOverdue: number): 'friendly' | 'firm' | 'final' | null {
  if (daysOverdue <= 7) return 'friendly';
  if (daysOverdue <= 14) return 'firm';
  if (daysOverdue > 14) return 'final';
  return null;
}
