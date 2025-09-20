-- Stripe Financial Connections Database Schema
-- Tables for bank account connections and transaction sync

-- Create bank_accounts table for storing connected accounts
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  provider TEXT NOT NULL DEFAULT 'stripe_fc',
  account_id TEXT UNIQUE NOT NULL,          -- Stripe Financial Connections account ID
  bank_name TEXT,                           -- Chase, Bank of America, etc.
  account_type TEXT,                        -- checking, savings, etc.
  last_four TEXT,                           -- Last 4 digits of account
  status TEXT DEFAULT 'active',             -- active, disconnected, error
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create financial_connections_sessions table for tracking sessions
CREATE TABLE IF NOT EXISTS public.financial_connections_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_id TEXT UNIQUE NOT NULL,          -- Stripe session ID
  client_secret TEXT NOT NULL,              -- For frontend
  status TEXT DEFAULT 'pending',            -- pending, completed, expired
  accounts_linked TEXT[],                   -- Array of account IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create bank_transactions_sync table for synced transactions
CREATE TABLE IF NOT EXISTS public.bank_transactions_sync (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  bank_account_id UUID REFERENCES public.bank_accounts(id) NOT NULL,
  stripe_transaction_id TEXT UNIQUE NOT NULL,
  amount NUMERIC NOT NULL,                  -- Amount in dollars (positive/negative)
  currency TEXT DEFAULT 'usd',
  description TEXT,
  transaction_date DATE NOT NULL,
  transaction_type TEXT,                    -- debit, credit, transfer
  category TEXT,                            -- Stripe category if available
  reference TEXT,                           -- Bank reference number
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_with TEXT,                     -- ID of matched bookkeeping transaction
  raw_data JSONB,                           -- Full Stripe transaction object
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create sync_logs table for tracking sync operations
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  bank_account_id UUID REFERENCES public.bank_accounts(id),
  sync_type TEXT NOT NULL,                  -- manual, scheduled, webhook
  status TEXT NOT NULL,                     -- success, error, partial
  transactions_synced INTEGER DEFAULT 0,
  error_message TEXT,
  sync_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  sync_end TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security on all tables
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_connections_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bank_accounts
CREATE POLICY "Users can view their own bank accounts" ON public.bank_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank accounts" ON public.bank_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts" ON public.bank_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for financial_connections_sessions
CREATE POLICY "Users can view their own FC sessions" ON public.financial_connections_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FC sessions" ON public.financial_connections_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own FC sessions" ON public.financial_connections_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for bank_transactions_sync
CREATE POLICY "Users can view their own bank transactions" ON public.bank_transactions_sync
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank transactions" ON public.bank_transactions_sync
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank transactions" ON public.bank_transactions_sync
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for sync_logs
CREATE POLICY "Users can view their own sync logs" ON public.sync_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync logs" ON public.sync_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_account_id ON public.bank_accounts(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_status ON public.bank_accounts(status);

CREATE INDEX IF NOT EXISTS idx_fc_sessions_user_id ON public.financial_connections_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_fc_sessions_session_id ON public.financial_connections_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_fc_sessions_status ON public.financial_connections_sessions(status);

CREATE INDEX IF NOT EXISTS idx_bank_transactions_user_id ON public.bank_transactions_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account_id ON public.bank_transactions_sync(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_stripe_id ON public.bank_transactions_sync(stripe_transaction_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON public.bank_transactions_sync(transaction_date);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_reconciled ON public.bank_transactions_sync(is_reconciled);

CREATE INDEX IF NOT EXISTS idx_sync_logs_user_id ON public.sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_bank_account_id ON public.sync_logs(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_sync_start ON public.sync_logs(sync_start);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_bank_accounts_updated_at 
    BEFORE UPDATE ON public.bank_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.bank_accounts TO authenticated;
GRANT ALL ON public.financial_connections_sessions TO authenticated;
GRANT ALL ON public.bank_transactions_sync TO authenticated;
GRANT ALL ON public.sync_logs TO authenticated;
