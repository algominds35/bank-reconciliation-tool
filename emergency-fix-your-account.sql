-- EMERGENCY FIX - YOU PAID, YOU GET ACCESS
-- Run this RIGHT NOW in Supabase SQL Editor

UPDATE public.user_profiles 
SET 
  subscription_status = 'active',
  subscription_plan = 'professional',
  trial_end_date = '2025-12-31'  -- Extend far into future
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email-here@example.com'  -- REPLACE WITH YOUR EMAIL
);

-- Verify it worked:
SELECT 
  email,
  subscription_status,
  subscription_plan,
  trial_end_date
FROM public.user_profiles up
JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'your-email-here@example.com';  -- REPLACE WITH YOUR EMAIL 