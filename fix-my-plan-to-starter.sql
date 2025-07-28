-- FIX: Change alex@usealgomind.com from Professional to Starter plan
-- Run this in Supabase SQL Editor

UPDATE public.user_profiles 
SET 
  subscription_plan = 'starter',
  updated_at = timezone('utc'::text, now())
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'alex@usealgomind.com'
);

-- Verify the fix worked
SELECT 
  email, 
  subscription_plan, 
  subscription_status,
  updated_at
FROM auth.users u
JOIN public.user_profiles p ON u.id = p.id
WHERE u.email = 'alex@usealgomind.com'; 