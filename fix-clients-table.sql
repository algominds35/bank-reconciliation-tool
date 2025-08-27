-- COMPLETE DATABASE FIX - Run this in your Supabase SQL Editor
-- This fixes both the schema and foreign key constraint issues

-- STEP 1: Add missing columns to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS total_transactions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unmatched_transactions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_upload TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- STEP 2: Update existing records to have default values
UPDATE public.clients 
SET 
  total_transactions = COALESCE(total_transactions, 0),
  unmatched_transactions = COALESCE(unmatched_transactions, 0),
  status = COALESCE(status, 'pending'),
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW())
WHERE total_transactions IS NULL 
   OR unmatched_transactions IS NULL 
   OR status IS NULL 
   OR created_at IS NULL 
   OR updated_at IS NULL;

-- STEP 3: Delete fake/broken clients and their related records
-- First delete related invoices for fake clients
DELETE FROM public.invoices 
WHERE client_id IN (
  SELECT id FROM public.clients 
  WHERE name IN ('alex', 'Test Client') 
     OR total_transactions = 0 
     OR total_transactions IS NULL
);

-- Then delete the fake clients themselves
DELETE FROM public.clients 
WHERE name IN ('alex', 'Test Client') 
   OR total_transactions = 0 
   OR total_transactions IS NULL;

-- STEP 4: Verify the cleanup worked
SELECT 'Remaining clients:' as info;
SELECT id, name, total_transactions, status, created_at 
FROM public.clients 
ORDER BY created_at DESC;

-- STEP 5: Verify table structure
SELECT 'Table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position;
