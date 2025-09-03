-- Fix missing reconciliation_group columns
-- Run this in your Supabase SQL Editor

-- Add reconciliation_group column to bank_transactions
ALTER TABLE public.bank_transactions 
ADD COLUMN IF NOT EXISTS reconciliation_group UUID;

-- Add reconciliation_group column to book_transactions  
ALTER TABLE public.book_transactions 
ADD COLUMN IF NOT EXISTS reconciliation_group UUID;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bank_transactions_reconciliation_group 
ON public.bank_transactions(reconciliation_group);

CREATE INDEX IF NOT EXISTS idx_book_transactions_reconciliation_group 
ON public.book_transactions(reconciliation_group);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bank_transactions' 
AND column_name = 'reconciliation_group';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'book_transactions' 
AND column_name = 'reconciliation_group';
