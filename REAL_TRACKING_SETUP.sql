-- 🚀 REAL TRACKING SYSTEM SETUP
-- This creates all tables needed for SendGrid webhooks and multi-channel delivery

-- 1. Email Tracking Events Table (SendGrid Webhooks)
CREATE TABLE IF NOT EXISTS email_tracking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'delivered', 'open', 'click', 'bounce', 'dropped', 'spamreport', 'unsubscribe'
  timestamp TIMESTAMPTZ NOT NULL,
  sendgrid_event_id TEXT,
  sendgrid_message_id TEXT,
  user_agent TEXT,
  ip_address INET,
  clicked_url TEXT,
  bounce_reason TEXT,
  status TEXT,
  device_info JSONB, -- Parsed user agent info
  metadata JSONB, -- Full SendGrid event data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_tracking_email ON email_tracking_events(email);
CREATE INDEX IF NOT EXISTS idx_email_tracking_event_type ON email_tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_tracking_timestamp ON email_tracking_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_email_tracking_message_id ON email_tracking_events(sendgrid_message_id);

-- 2. Delivery Records Table (Multi-Channel Tracking)
CREATE TABLE IF NOT EXISTS delivery_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  delivery_channel TEXT NOT NULL CHECK (delivery_channel IN ('email', 'sms', 'phone')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'scheduled')),
  error_message TEXT,
  message_id TEXT,
  phase TEXT CHECK (phase IN ('friendly', 'reminder', 'overdue', 'final')),
  sent_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for delivery records
CREATE INDEX IF NOT EXISTS idx_delivery_records_email ON delivery_records(client_email);
CREATE INDEX IF NOT EXISTS idx_delivery_records_invoice ON delivery_records(invoice_id);
CREATE INDEX IF NOT EXISTS idx_delivery_records_channel ON delivery_records(delivery_channel);
CREATE INDEX IF NOT EXISTS idx_delivery_records_status ON delivery_records(status);

-- 3. SMS Fallbacks Table
CREATE TABLE IF NOT EXISTS sms_fallbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  reason TEXT NOT NULL, -- 'email_bounce', 'email_dropped', 'manual_trigger'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  phone_number TEXT,
  sms_content TEXT,
  message_id TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for SMS fallbacks
CREATE INDEX IF NOT EXISTS idx_sms_fallbacks_email ON sms_fallbacks(email);
CREATE INDEX IF NOT EXISTS idx_sms_fallbacks_status ON sms_fallbacks(status);

-- 4. Phone Call Fallbacks Table
CREATE TABLE IF NOT EXISTS phone_call_fallbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  reason TEXT NOT NULL, -- 'email_dropped', 'sms_failed', 'manual_trigger'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'failed', 'cancelled')),
  phone_number TEXT,
  call_script TEXT,
  call_id TEXT,
  scheduled_time TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  call_duration INTEGER, -- in seconds
  call_result TEXT, -- 'answered', 'voicemail', 'busy', 'no_answer'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for phone call fallbacks
CREATE INDEX IF NOT EXISTS idx_phone_call_fallbacks_email ON phone_call_fallbacks(email);
CREATE INDEX IF NOT EXISTS idx_phone_call_fallbacks_status ON phone_call_fallbacks(status);
CREATE INDEX IF NOT EXISTS idx_phone_call_fallbacks_scheduled ON phone_call_fallbacks(scheduled_time);

-- 5. Phone Call Queue Table
CREATE TABLE IF NOT EXISTS phone_call_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  call_type TEXT NOT NULL, -- 'payment_reminder', 'follow_up', 'escalation'
  phase TEXT CHECK (phase IN ('friendly', 'reminder', 'overdue', 'final')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'failed', 'cancelled')),
  call_id TEXT,
  scheduled_time TIMESTAMPTZ NOT NULL,
  priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high, 4=urgent
  assigned_to TEXT, -- staff member assigned
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for phone call queue
CREATE INDEX IF NOT EXISTS idx_phone_call_queue_status ON phone_call_queue(status);
CREATE INDEX IF NOT EXISTS idx_phone_call_queue_scheduled ON phone_call_queue(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_phone_call_queue_priority ON phone_call_queue(priority);

-- 6. Delivery Guarantees Table (Money Back Guarantee)
CREATE TABLE IF NOT EXISTS delivery_guarantees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  guarantee_type TEXT NOT NULL, -- 'delivery_failure', 'response_time', 'quality'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'refunded', 'cancelled')),
  amount DECIMAL(10,2) NOT NULL, -- Amount to refund
  refund_method TEXT, -- 'stripe', 'bank_transfer', 'credit'
  refund_transaction_id TEXT,
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for delivery guarantees
CREATE INDEX IF NOT EXISTS idx_delivery_guarantees_email ON delivery_guarantees(client_email);
CREATE INDEX IF NOT EXISTS idx_delivery_guarantees_status ON delivery_guarantees(status);
CREATE INDEX IF NOT EXISTS idx_delivery_guarantees_type ON delivery_guarantees(guarantee_type);

-- 7. Update Invoices Table with Tracking Fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_email_status TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_email_event_time TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS email_tracking_data JSONB;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS delivery_guarantee_triggered BOOLEAN DEFAULT FALSE;

-- Indexes for invoice tracking
CREATE INDEX IF NOT EXISTS idx_invoices_email_status ON invoices(last_email_status);
CREATE INDEX IF NOT EXISTS idx_invoices_email_event_time ON invoices(last_email_event_time);

-- 8. Row Level Security for all tables
ALTER TABLE email_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_fallbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_call_fallbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_call_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_guarantees ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for Alex (Developer Access)
-- Replace 'YOUR_UUID_HERE' with your actual UUID from auth.users

-- Email tracking events policy
CREATE POLICY "Alex Developer Access" ON email_tracking_events 
  FOR ALL USING (true) WITH CHECK (true);

-- Delivery records policy
CREATE POLICY "Alex Developer Access" ON delivery_records 
  FOR ALL USING (true) WITH CHECK (true);

-- SMS fallbacks policy
CREATE POLICY "Alex Developer Access" ON sms_fallbacks 
  FOR ALL USING (true) WITH CHECK (true);

-- Phone call fallbacks policy
CREATE POLICY "Alex Developer Access" ON phone_call_fallbacks 
  FOR ALL USING (true) WITH CHECK (true);

-- Phone call queue policy
CREATE POLICY "Alex Developer Access" ON phone_call_queue 
  FOR ALL USING (true) WITH CHECK (true);

-- Delivery guarantees policy
CREATE POLICY "Alex Developer Access" ON delivery_guarantees 
  FOR ALL USING (true) WITH CHECK (true);

-- 10. Sample data for testing
INSERT INTO email_tracking_events (email, event_type, timestamp, sendgrid_event_id, sendgrid_message_id, user_agent, ip_address, clicked_url, bounce_reason, status, device_info, metadata) VALUES
('test@example.com', 'delivered', NOW() - INTERVAL '1 hour', 'sg_event_001', 'sg_message_001', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', '192.168.1.1', NULL, NULL, 'delivered', '{"device": {"family": "iPhone", "brand": "Apple", "model": "iPhone"}}', '{"test": "data"}'),
('test@example.com', 'open', NOW() - INTERVAL '30 minutes', 'sg_event_002', 'sg_message_001', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', '192.168.1.1', NULL, NULL, 'opened', '{"device": {"family": "iPhone", "brand": "Apple", "model": "iPhone"}}', '{"test": "data"}'),
('bounce@example.com', 'bounce', NOW() - INTERVAL '15 minutes', 'sg_event_003', 'sg_message_002', NULL, NULL, NULL, 'Invalid email address', 'bounced', NULL, '{"test": "data"}');

-- 11. Create views for easy reporting
CREATE OR REPLACE VIEW email_tracking_summary AS
SELECT 
  email,
  COUNT(*) as total_events,
  COUNT(CASE WHEN event_type = 'delivered' THEN 1 END) as delivered,
  COUNT(CASE WHEN event_type = 'open' THEN 1 END) as opened,
  COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicked,
  COUNT(CASE WHEN event_type = 'bounce' THEN 1 END) as bounced,
  COUNT(CASE WHEN event_type = 'dropped' THEN 1 END) as dropped,
  MAX(timestamp) as last_event_time
FROM email_tracking_events
GROUP BY email;

CREATE OR REPLACE VIEW delivery_channel_performance AS
SELECT 
  delivery_channel,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN status = 'sent' THEN 1 END) as successful,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
  ROUND(
    COUNT(CASE WHEN status = 'sent' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100, 2
  ) as success_rate
FROM delivery_records
GROUP BY delivery_channel;

-- 12. Grant permissions (if using service role)
-- These tables are accessible via service role key for webhook processing

COMMENT ON TABLE email_tracking_events IS 'Real-time email tracking events from SendGrid webhooks';
COMMENT ON TABLE delivery_records IS 'Multi-channel delivery tracking for invoice reminders';
COMMENT ON TABLE sms_fallbacks IS 'SMS fallback system when emails fail';
COMMENT ON TABLE phone_call_fallbacks IS 'Phone call fallback system when SMS fails';
COMMENT ON TABLE phone_call_queue IS 'Queue for scheduled phone call reminders';
COMMENT ON TABLE delivery_guarantees IS 'Money back guarantee system for failed deliveries';

-- 🎯 NEXT STEPS:
-- 1. Run this SQL in your Supabase SQL editor
-- 2. Configure SendGrid webhook URL: https://yourdomain.vercel.app/api/sendgrid-webhook
-- 3. Test with a real email to see tracking in action
-- 4. Monitor the tables for real-time delivery data
