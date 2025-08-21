-- Standalone Invoice System Database Schema (No QuickBooks Required)

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  invoice_number VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reminder_sent TIMESTAMP WITH TIME ZONE,
  reminder_phase VARCHAR(20) CHECK (reminder_phase IN ('friendly', 'reminder', 'overdue', 'final')),
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create clients table (if not exists)
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection_reminders table
CREATE TABLE IF NOT EXISTS collection_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  phase VARCHAR(20) NOT NULL CHECK (phase IN ('friendly', 'reminder', 'overdue', 'final')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked')),
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection_settings table
CREATE TABLE IF NOT EXISTS collection_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friendly_reminder_days INTEGER DEFAULT 7,
  reminder_days INTEGER DEFAULT 14,
  overdue_days INTEGER DEFAULT 21,
  final_notice_days INTEGER DEFAULT 30,
  email_template_friendly TEXT DEFAULT 'Hi {{client_name}}, This is a friendly reminder that invoice {{invoice_number}} for {{amount}} is due on {{due_date}}. Please let us know if you have any questions.',
  email_template_reminder TEXT DEFAULT 'Hi {{client_name}}, Invoice {{invoice_number}} for {{amount}} was due on {{due_date}}. Please process payment at your earliest convenience.',
  email_template_overdue TEXT DEFAULT 'Hi {{client_name}}, Invoice {{invoice_number}} for {{amount}} is now {{days_overdue}} days overdue. Please process payment immediately to avoid any late fees.',
  email_template_final TEXT DEFAULT 'Hi {{client_name}}, Invoice {{invoice_number}} for {{amount}} is {{days_overdue}} days overdue. This is our final notice before we take further action.',
  company_name VARCHAR(255) DEFAULT 'Your Company',
  company_email VARCHAR(255) DEFAULT 'noreply@yourcompany.com',
  payment_link_base VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_collection_reminders_invoice_id ON collection_reminders(invoice_id);
CREATE INDEX IF NOT EXISTS idx_collection_settings_user_id ON collection_settings(user_id);

-- Insert default collection settings for new users
INSERT INTO collection_settings (
  user_id,
  friendly_reminder_days,
  reminder_days,
  overdue_days,
  final_notice_days,
  company_name,
  company_email
) VALUES (
  'temp_user',
  7,
  14,
  21,
  30,
  'Your Company',
  'noreply@yourcompany.com'
) ON CONFLICT (user_id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collection_settings_updated_at BEFORE UPDATE ON collection_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically mark invoices as overdue
CREATE OR REPLACE FUNCTION mark_overdue_invoices()
RETURNS void AS $$
BEGIN
  UPDATE invoices 
  SET status = 'overdue'
  WHERE due_date < NOW() 
    AND status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run this function daily (optional)
-- This would need to be set up in your application or using pg_cron extension
