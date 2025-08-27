-- Fix the clients table schema to match the application requirements
-- Run this in your Supabase SQL Editor

-- First, let's see what columns exist
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'clients';

-- Add missing columns if they don't exist
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS total_transactions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unmatched_transactions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_upload TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have default values
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

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position;
