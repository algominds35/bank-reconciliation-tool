import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Invoice, DashboardStats, InvoiceFilters } from '@/types/invoice-collections';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const realm_id = searchParams.get('realm_id');
    const status = searchParams.get('status');
    const days_overdue = searchParams.get('days_overdue');
    const client_id = searchParams.get('client_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!user_id || !realm_id) {
      return NextResponse.json({
        success: false,
        message: 'User ID and Realm ID are required'
      }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from('invoices')
      .select(`
        *,
        client:clients(
          id,
          company_name,
          first_name,
          last_name,
          email,
          phone
        ),
        email_campaigns(
          id,
          campaign_type,
          sent_at,
          opened_at,
          clicked_at
        ),
        payment_reminders(
          id,
          reminder_type,
          next_send_date,
          last_sent_date
        )
      `)
      .eq('user_id', user_id)
      .eq('realm_id', realm_id);

    // Apply filters
    if (status) {
      const statusArray = status.split(',');
      query = query.in('status', statusArray);
    }

    if (days_overdue) {
      const daysArray = days_overdue.split(',').map(d => parseInt(d));
      query = query.in('days_overdue', daysArray);
    }

    if (client_id) {
      query = query.eq('client_id', client_id);
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('realm_id', realm_id);

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Order by days overdue (most overdue first)
    query = query.order('days_overdue', { ascending: false });

    const { data: invoices, error } = await query;

    if (error) {
      throw error;
    }

    // Get dashboard stats
    const stats = await getDashboardStats(user_id, realm_id);

    return NextResponse.json({
      success: true,
      invoices: invoices || [],
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getDashboardStats(user_id: string, realm_id: string): Promise<DashboardStats> {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  try {
    // Get total invoices
    const { count: totalInvoices } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('realm_id', realm_id);

    // Get overdue invoices
    const { count: overdueInvoices } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('realm_id', realm_id)
      .eq('status', 'overdue');

    // Get total overdue amount
    const { data: overdueAmounts } = await supabase
      .from('invoices')
      .select('balance')
      .eq('user_id', user_id)
      .eq('realm_id', realm_id)
      .eq('status', 'overdue');

    const totalOverdueAmount = overdueAmounts?.reduce((sum, inv) => sum + (inv.balance || 0), 0) || 0;

    // Get active campaigns
    const { count: activeCampaigns } = await supabase
      .from('payment_reminders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('is_active', true);

    // Get emails sent today
    const { count: emailsSentToday } = await supabase
      .from('email_campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .gte('sent_at', todayStr);

    // Get payments received today (this would need to be tracked separately)
    const paymentsReceivedToday = 0; // Placeholder - would need payment tracking

    // Calculate average days to pay (for paid invoices)
    const { data: paidInvoices } = await supabase
      .from('invoices')
      .select('invoice_date, last_payment_date')
      .eq('user_id', user_id)
      .eq('realm_id', realm_id)
      .eq('status', 'paid')
      .not('last_payment_date', 'is', null);

    let totalDaysToPay = 0;
    let paidInvoiceCount = 0;

    paidInvoices?.forEach(invoice => {
      if (invoice.last_payment_date) {
        const invoiceDate = new Date(invoice.invoice_date);
        const paymentDate = new Date(invoice.last_payment_date);
        const daysDiff = Math.ceil((paymentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDaysToPay += daysDiff;
        paidInvoiceCount++;
      }
    });

    const averageDaysToPay = paidInvoiceCount > 0 ? Math.round(totalDaysToPay / paidInvoiceCount) : 0;

    // Calculate collection rate (paid invoices / total invoices)
    const collectionRate = totalInvoices ? Math.round((paidInvoiceCount / totalInvoices) * 100) : 0;

    return {
      total_invoices: totalInvoices || 0,
      overdue_invoices: overdueInvoices || 0,
      total_overdue_amount: totalOverdueAmount,
      active_campaigns: activeCampaigns || 0,
      emails_sent_today: emailsSentToday || 0,
      payments_received_today: paymentsReceivedToday,
      average_days_to_pay: averageDaysToPay,
      collection_rate: collectionRate
    };

  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    // Return default stats on error
    return {
      total_invoices: 0,
      overdue_invoices: 0,
      total_overdue_amount: 0,
      active_campaigns: 0,
      emails_sent_today: 0,
      payments_received_today: 0,
      average_days_to_pay: 0,
      collection_rate: 0
    };
  }
}
