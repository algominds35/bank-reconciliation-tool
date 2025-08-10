-- QuickBooks Online Integration Database Setup
-- Run this in your Supabase SQL Editor

-- 1. QBO Connections Table (stores OAuth tokens and connection info)
CREATE TABLE IF NOT EXISTS qbo_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    realm_id VARCHAR(255) NOT NULL,
    access_token_encrypted TEXT NOT NULL,
    refresh_token_encrypted TEXT NOT NULL,
    access_token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sync_status VARCHAR(50) DEFAULT 'idle' CHECK (sync_status IN ('idle', 'syncing', 'completed', 'failed')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, realm_id)
);

-- 2. QBO Accounts Table (stores bank accounts from QuickBooks)
CREATE TABLE IF NOT EXISTS qbo_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    realm_id VARCHAR(255) NOT NULL,
    qbo_account_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(100),
    account_number VARCHAR(100),
    balance DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, realm_id, qbo_account_id)
);

-- 3. QBO Transactions Table (stores bank transactions from QuickBooks)
CREATE TABLE IF NOT EXISTS qbo_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    realm_id VARCHAR(255) NOT NULL,
    qbo_transaction_id VARCHAR(255) NOT NULL,
    account_id UUID REFERENCES qbo_accounts(id),
    transaction_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    memo TEXT,
    check_number VARCHAR(50),
    reference_number VARCHAR(100),
    transaction_type VARCHAR(100),
    category_name VARCHAR(255),
    category_id VARCHAR(255),
    is_reconciled BOOLEAN DEFAULT false,
    reconciliation_date DATE,
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, realm_id, qbo_transaction_id)
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qbo_connections_user_id ON qbo_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_qbo_connections_realm_id ON qbo_connections(realm_id);
CREATE INDEX IF NOT EXISTS idx_qbo_accounts_user_realm ON qbo_accounts(user_id, realm_id);
CREATE INDEX IF NOT EXISTS idx_qbo_transactions_user_realm ON qbo_transactions(user_id, realm_id);
CREATE INDEX IF NOT EXISTS idx_qbo_transactions_account ON qbo_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_qbo_transactions_date ON qbo_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_qbo_transactions_reconciled ON qbo_transactions(is_reconciled);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE qbo_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE qbo_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE qbo_transactions ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own QBO connections" ON qbo_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QBO connections" ON qbo_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QBO connections" ON qbo_connections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own QBO accounts" ON qbo_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QBO accounts" ON qbo_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QBO accounts" ON qbo_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own QBO transactions" ON qbo_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QBO transactions" ON qbo_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QBO transactions" ON qbo_transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create triggers for updated_at
CREATE TRIGGER update_qbo_connections_updated_at BEFORE UPDATE ON qbo_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qbo_accounts_updated_at BEFORE UPDATE ON qbo_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qbo_transactions_updated_at BEFORE UPDATE ON qbo_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Insert sample data for testing (optional - remove in production)
-- INSERT INTO qbo_connections (user_id, realm_id, access_token_encrypted, refresh_token_encrypted, access_token_expires_at)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'test-realm', 'encrypted-token', 'encrypted-refresh', NOW() + INTERVAL '1 hour'); 