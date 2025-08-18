-- Invoice Collections System Database Schema
-- Run this in your Supabase SQL Editor

-- 1. CLIENTS TABLE (stores client information)
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    realm_id VARCHAR(255) NOT NULL,
    qbo_customer_id VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    last_contact_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, realm_id, qbo_customer_id)
);

-- 2. INVOICES TABLE (stores invoice data from QuickBooks)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    realm_id VARCHAR(255) NOT NULL,
    qbo_invoice_id VARCHAR(255) NOT NULL,
    client_id UUID REFERENCES clients(id),
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'paid', 'overdue', 'cancelled')),
    days_overdue INTEGER DEFAULT 0,
    last_payment_date DATE,
    notes TEXT,
    is_reminder_active BOOLEAN DEFAULT false,
    last_reminder_sent DATE,
    next_reminder_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, realm_id, qbo_invoice_id)
);

-- 3. EMAIL_CAMPAIGNS TABLE (tracks email sending and responses)
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    invoice_id UUID REFERENCES invoices(id),
    client_id UUID REFERENCES clients(id),
    campaign_type VARCHAR(50) NOT NULL CHECK (campaign_type IN ('friendly', 'firm', 'final', 'custom')),
    email_subject VARCHAR(255) NOT NULL,
    email_body TEXT NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced BOOLEAN DEFAULT false,
    bounce_reason TEXT,
    response_received BOOLEAN DEFAULT false,
    response_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PAYMENT_REMINDERS TABLE (manages reminder schedules)
CREATE TABLE IF NOT EXISTS payment_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    invoice_id UUID REFERENCES invoices(id),
    reminder_type VARCHAR(50) NOT NULL CHECK (reminder_type IN ('friendly', 'firm', 'final')),
    days_overdue INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    next_send_date DATE NOT NULL,
    last_sent_date DATE,
    email_template_id VARCHAR(100),
    custom_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. EMAIL_TEMPLATES TABLE (stores email templates)
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('friendly', 'firm', 'final', 'custom')),
    subject_line VARCHAR(255) NOT NULL,
    email_body TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_realm ON clients(user_id, realm_id);
CREATE INDEX IF NOT EXISTS idx_clients_qbo_customer ON clients(qbo_customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_realm ON invoices(user_id, realm_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_days_overdue ON invoices(days_overdue);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_invoice ON email_campaigns(invoice_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_client ON email_campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_invoice ON payment_reminders(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_next_send ON payment_reminders(next_send_date);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own clients" ON clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON invoices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own email campaigns" ON email_campaigns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email campaigns" ON email_campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email campaigns" ON email_campaigns
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payment reminders" ON payment_reminders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment reminders" ON payment_reminders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment reminders" ON payment_reminders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own email templates" ON email_templates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email templates" ON email_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email templates" ON email_templates
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_reminders_updated_at BEFORE UPDATE ON payment_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Insert default email templates
INSERT INTO email_templates (user_id, template_name, template_type, subject_line, email_body, is_default) VALUES
('00000000-0000-0000-0000-000000000000', 'Friendly Reminder', 'friendly', 'Payment Reminder - Invoice #{invoice_number}', 
'Hi {client_name},

I hope this email finds you well. I wanted to follow up on invoice #{invoice_number} for {amount}, which was due on {due_date}.

I understand how busy things can get, and I wanted to make sure this invoice hasn''t slipped through the cracks. If you could process this payment at your earliest convenience, I would greatly appreciate it.

If you have any questions about this invoice or need to discuss payment arrangements, please don''t hesitate to reach out.

Thank you for your business!

Best regards,
{your_name}', true),

('00000000-0000-0000-0000-000000000000', 'Firm Notice', 'firm', 'URGENT: Payment Required - Invoice #{invoice_number}', 
'Hi {client_name},

I''m writing regarding invoice #{invoice_number} for {amount}, which is now {days_overdue} days overdue.

This payment is past due and requires immediate attention. Please process this payment as soon as possible to avoid any further delays.

If you''re experiencing financial difficulties, please contact me immediately to discuss payment arrangements. However, please note that continued non-payment may result in additional fees or collection actions.

I value our business relationship and want to resolve this matter amicably.

Please respond to this email or call me at your earliest convenience.

Best regards,
{your_name}', true),

('00000000-0000-0000-0000-000000000000', 'Final Demand', 'final', 'FINAL NOTICE: Immediate Payment Required - Invoice #{invoice_number}', 
'Hi {client_name},

This is a FINAL NOTICE regarding invoice #{invoice_number} for {amount}, which is now {days_overdue} days overdue.

This matter requires IMMEDIATE attention. Payment must be received within 48 hours to avoid further action.

If payment is not received by {deadline_date}, this account will be turned over to collections, which may affect your credit rating and result in additional fees.

I strongly encourage you to resolve this matter immediately to avoid these consequences.

Please contact me immediately to arrange payment or discuss your situation.

Best regards,
{your_name}', true);
