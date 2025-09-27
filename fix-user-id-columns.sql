-- EMERGENCY FIX: Add missing user_id columns to transaction tables
-- This fixes the critical database error: "Could not find the 'user_id' column"

-- Add user_id column to bank_transactions table
ALTER TABLE public.bank_transactions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to book_transactions table  
ALTER TABLE public.book_transactions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bank_transactions_user_id ON public.bank_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_book_transactions_user_id ON public.book_transactions(user_id);

-- Update existing records to have user_id (if any exist)
-- This will set user_id to null for existing records, which is fine for new setup
-- New records will be inserted with proper user_id

-- Update RLS policies to include user_id checks
DROP POLICY IF EXISTS "Users can view their own bank transactions" ON public.bank_transactions;
DROP POLICY IF EXISTS "Users can insert their own bank transactions" ON public.bank_transactions;
DROP POLICY IF EXISTS "Users can update their own bank transactions" ON public.bank_transactions;
DROP POLICY IF EXISTS "Users can delete their own bank transactions" ON public.bank_transactions;

DROP POLICY IF EXISTS "Users can view their own book transactions" ON public.book_transactions;
DROP POLICY IF EXISTS "Users can insert their own book transactions" ON public.book_transactions;
DROP POLICY IF EXISTS "Users can update their own book transactions" ON public.book_transactions;
DROP POLICY IF EXISTS "Users can delete their own book transactions" ON public.book_transactions;

-- Create new RLS policies that check user_id directly
CREATE POLICY "Users can view their own bank transactions" ON public.bank_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank transactions" ON public.bank_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank transactions" ON public.bank_transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank transactions" ON public.bank_transactions
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own book transactions" ON public.book_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own book transactions" ON public.book_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own book transactions" ON public.book_transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book transactions" ON public.book_transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Add reconciliation_group column if missing
ALTER TABLE public.bank_transactions 
ADD COLUMN IF NOT EXISTS reconciliation_group UUID;

ALTER TABLE public.book_transactions 
ADD COLUMN IF NOT EXISTS reconciliation_group UUID;

-- Create indexes for reconciliation groups
CREATE INDEX IF NOT EXISTS idx_bank_transactions_reconciliation_group ON public.bank_transactions(reconciliation_group);
CREATE INDEX IF NOT EXISTS idx_book_transactions_reconciliation_group ON public.book_transactions(reconciliation_group);
