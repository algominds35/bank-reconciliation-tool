-- Create tables for real transaction data (no fake data)

-- Bank transactions table
CREATE TABLE IF NOT EXISTS public.bank_transactions (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT CHECK (type IN ('credit', 'debit')) NOT NULL,
    category TEXT,
    account TEXT,
    reference TEXT,
    is_reconciled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QuickBooks transactions table
CREATE TABLE IF NOT EXISTS public.book_transactions (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT CHECK (type IN ('credit', 'debit')) NOT NULL,
    category TEXT,
    account TEXT,
    reference TEXT,
    is_reconciled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction matches table
CREATE TABLE IF NOT EXISTS public.transaction_matches (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    bank_transaction_id TEXT NOT NULL REFERENCES public.bank_transactions(id) ON DELETE CASCADE,
    book_transaction_id TEXT REFERENCES public.book_transactions(id) ON DELETE CASCADE,
    match_type TEXT CHECK (match_type IN ('exact', 'fuzzy', 'manual', 'unmatched')) NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    difference DECIMAL(10,2),
    notes TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bank_transactions
CREATE POLICY "Users can view their own bank transactions" ON public.bank_transactions
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can insert their own bank transactions" ON public.bank_transactions
    FOR INSERT WITH CHECK (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can update their own bank transactions" ON public.bank_transactions
    FOR UPDATE USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can delete their own bank transactions" ON public.bank_transactions
    FOR DELETE USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

-- RLS Policies for book_transactions
CREATE POLICY "Users can view their own book transactions" ON public.book_transactions
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can insert their own book transactions" ON public.book_transactions
    FOR INSERT WITH CHECK (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can update their own book transactions" ON public.book_transactions
    FOR UPDATE USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can delete their own book transactions" ON public.book_transactions
    FOR DELETE USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

-- RLS Policies for transaction_matches
CREATE POLICY "Users can view their own transaction matches" ON public.transaction_matches
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can insert their own transaction matches" ON public.transaction_matches
    FOR INSERT WITH CHECK (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can update their own transaction matches" ON public.transaction_matches
    FOR UPDATE USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

CREATE POLICY "Users can delete their own transaction matches" ON public.transaction_matches
    FOR DELETE USING (
        client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.jwt() ->> 'user_id'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bank_transactions_client_id ON public.bank_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON public.bank_transactions(date);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_amount ON public.bank_transactions(amount);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_is_reconciled ON public.bank_transactions(is_reconciled);

CREATE INDEX IF NOT EXISTS idx_book_transactions_client_id ON public.book_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_book_transactions_date ON public.book_transactions(date);
CREATE INDEX IF NOT EXISTS idx_book_transactions_amount ON public.book_transactions(amount);
CREATE INDEX IF NOT EXISTS idx_book_transactions_is_reconciled ON public.book_transactions(is_reconciled);

CREATE INDEX IF NOT EXISTS idx_transaction_matches_client_id ON public.transaction_matches(client_id);
CREATE INDEX IF NOT EXISTS idx_transaction_matches_bank_transaction_id ON public.transaction_matches(bank_transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_matches_book_transaction_id ON public.transaction_matches(book_transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_matches_confidence ON public.transaction_matches(confidence);
CREATE INDEX IF NOT EXISTS idx_transaction_matches_status ON public.transaction_matches(status);

-- Update clients table to include new status options
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'ready', 'ready_for_reconciliation', 'processing', 'completed', 'error'));

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_bank_transactions_updated_at 
    BEFORE UPDATE ON public.bank_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_transactions_updated_at 
    BEFORE UPDATE ON public.book_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_matches_updated_at 
    BEFORE UPDATE ON public.transaction_matches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
