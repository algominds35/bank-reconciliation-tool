-- REAL DATA DATABASE SETUP
-- Remove all mock data and create tables for real data

-- 1. CLIENT MESSAGES TABLE (for Communication Dashboard)
CREATE TABLE IF NOT EXISTS public.client_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  business_name TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'documents', 'billing', 'technical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. REMINDER TEMPLATES TABLE (for Automated Reminders)
CREATE TABLE IF NOT EXISTS public.reminder_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('days_after', 'monthly', 'quarterly', 'custom')),
  trigger_value INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  category TEXT NOT NULL CHECK (category IN ('onboarding', 'documents', 'follow_up', 'reporting')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. SCHEDULED REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.scheduled_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT,
  template_id TEXT REFERENCES public.reminder_templates(id),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. BOOK TRANSACTIONS TABLE (for real reconciliation data)
CREATE TABLE IF NOT EXISTS public.book_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT,
  account TEXT,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. INSERT DEFAULT REMINDER TEMPLATES
INSERT INTO public.reminder_templates (id, name, subject, message, trigger_type, trigger_value, is_active, category)
VALUES 
  (
    'welcome-day1',
    'Welcome Email (Day 1)',
    'Welcome to ReconcileBook - Next Steps',
    'Hi {CLIENT_NAME},

Welcome to ReconcileBook! We''re excited to help streamline your financial operations.

Here''s what happens next:
• We''ll review your business requirements
• Schedule your consultation call within 24 hours
• Create your custom service plan
• Begin onboarding within 5 business days

Please have the following ready for our call:
✓ Recent bank statements (last 3 months)
✓ Current accounting software access
✓ List of specific pain points you want to solve

We''ll be in touch soon!

Best regards,
ReconcileBook Team',
    'days_after',
    1,
    true,
    'onboarding'
  ),
  (
    'document-reminder',
    'Document Request Reminder',
    'Missing Documents - {CLIENT_NAME}',
    'Hi {CLIENT_NAME},

I hope you''re doing well! I wanted to follow up on the documents we discussed for your bookkeeping setup.

Still needed:
• Bank statements (last 3 months)
• Credit card statements
• Current QuickBooks file (if applicable)
• Vendor and customer lists

Having these documents will help us get your books up to date quickly and accurately.

Could you please upload these to your secure client portal or email them to us by {DUE_DATE}?

Thanks!
ReconcileBook Team',
    'days_after',
    3,
    true,
    'documents'
  ),
  (
    'monthly-checkin',
    'Monthly Check-in',
    'Monthly Financial Update - {CLIENT_NAME}',
    'Hi {CLIENT_NAME},

Hope your business is going well! Time for our monthly check-in.

This month I''ve completed:
✅ All transactions categorized
✅ Bank accounts reconciled
✅ Financial statements updated
✅ Any discrepancies noted and resolved

Your reports are ready and will be sent separately. 

Questions for you:
1. Any new business expenses or income sources?
2. Planning any major purchases or investments?
3. Any bookkeeping concerns or questions?

Let me know if you''d like to schedule a quick call to review your numbers.

Best,
ReconcileBook Team',
    'monthly',
    1,
    true,
    'reporting'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_client_messages_email ON public.client_messages(client_email);
CREATE INDEX IF NOT EXISTS idx_client_messages_status ON public.client_messages(status);
CREATE INDEX IF NOT EXISTS idx_client_messages_timestamp ON public.client_messages(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_client_email ON public.scheduled_reminders(client_email);
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_status ON public.scheduled_reminders(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_date ON public.scheduled_reminders(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_book_transactions_client ON public.book_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_book_transactions_date ON public.book_transactions(date DESC);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_transactions ENABLE ROW LEVEL SECURITY;

-- 8. CREATE POLICIES FOR ACCESS
CREATE POLICY "Allow all operations for authenticated users" ON public.client_messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON public.reminder_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON public.scheduled_reminders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON public.book_transactions
  FOR ALL USING (auth.role() = 'authenticated');
