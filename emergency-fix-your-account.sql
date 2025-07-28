-- EMERGENCY FIX: Restore access after payment
-- Copy this ENTIRE script and run in Supabase SQL Editor

-- Step 1: Find and fix your account (replace YOUR_EMAIL with your actual email)
UPDATE user_profiles 
SET 
  subscription_status = 'active',
  subscription_plan = 'professional',
  updated_at = now()
WHERE id = (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = 'YOUR_EMAIL_HERE'
);

-- Step 2: Verify it worked
SELECT 
  auth.users.email,
  user_profiles.subscription_status,
  user_profiles.subscription_plan,
  user_profiles.trial_end_date
FROM user_profiles 
JOIN auth.users ON user_profiles.id = auth.users.id 
WHERE auth.users.email = 'YOUR_EMAIL_HERE'; 