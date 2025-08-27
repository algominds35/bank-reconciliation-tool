-- URGENT PRIVACY FIX - Add user_id column to separate user data
-- Run this in Supabase SQL Editor IMMEDIATELY

-- Add user_id column to clients table
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'demo-user';

-- Update existing clients to have demo-user ID (temporary)
UPDATE public.clients SET user_id = 'demo-user' WHERE user_id IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- Update RLS policies to filter by user_id
DROP POLICY IF EXISTS "Allow authenticated users to manage clients" ON public.clients;

CREATE POLICY "Users can only see their own clients" ON public.clients
FOR ALL TO authenticated
USING (user_id = current_user::text)
WITH CHECK (user_id = current_user::text);

-- Allow public access for demo purposes (temporary)
CREATE POLICY "Allow demo access to demo-user clients" ON public.clients
FOR ALL TO anon
USING (user_id = 'demo-user')
WITH CHECK (user_id = 'demo-user');

-- Verify the changes
SELECT user_id, COUNT(*) as client_count FROM public.clients GROUP BY user_id;
