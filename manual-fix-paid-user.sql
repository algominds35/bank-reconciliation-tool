-- EMERGENCY FIX: Update user account after payment
-- Run this in Supabase SQL Editor RIGHT NOW

-- Find your user account (replace with your actual email)
SELECT id, trial_start_date, trial_end_date, subscription_status, subscription_plan 
FROM user_profiles 
JOIN auth.users ON user_profiles.id = auth.users.id 
WHERE auth.users.email = 'YOUR_EMAIL_HERE';

-- Update your account to ACTIVE (replace YOUR_USER_ID with the ID from above)
UPDATE user_profiles 
SET 
  subscription_status = 'active',
  subscription_plan = 'professional',
  updated_at = now()
WHERE id = 'YOUR_USER_ID_HERE';

-- Verify the fix worked
SELECT id, subscription_status, subscription_plan
FROM user_profiles 
JOIN auth.users ON user_profiles.id = auth.users.id 
WHERE auth.users.email = 'YOUR_EMAIL_HERE'; 