-- TEST PLAN DETECTION
-- This will show what plan should be assigned for each price tier

-- Test the plan detection logic that the webhook uses
SELECT 
  'Plan Detection Test' as test_name,
  '$29 → starter' as starter_test,
  '$79 → professional' as professional_test,
  '$199 → enterprise' as enterprise_test;

-- Check current user plan
SELECT 
  email,
  subscription_plan as current_plan,
  subscription_status,
  CASE 
    WHEN subscription_plan = 'starter' THEN 'Shows: Starter ✅'
    WHEN subscription_plan = 'professional' THEN 'Shows: Professional ✅'
    WHEN subscription_plan = 'enterprise' THEN 'Shows: Enterprise ✅'
    ELSE 'Shows: Unknown ❌'
  END as dashboard_display
FROM auth.users u
JOIN public.user_profiles p ON u.id = p.id
WHERE u.email = 'alex@usealgomind.com';

-- Test webhook plan assignment logic (simulated)
SELECT 
  amount_paid,
  CASE 
    WHEN amount_paid >= 199 THEN 'enterprise'
    WHEN amount_paid >= 79 THEN 'professional'
    WHEN amount_paid >= 29 THEN 'starter'
    ELSE 'unknown'
  END as assigned_plan,
  CASE 
    WHEN amount_paid >= 199 THEN 'Enterprise'
    WHEN amount_paid >= 79 THEN 'Professional'
    WHEN amount_paid >= 29 THEN 'Starter'
    ELSE 'Unknown'
  END as badge_shows
FROM (
  VALUES 
    (29.00),   -- Starter tier
    (79.00),   -- Professional tier  
    (199.00),  -- Enterprise tier
    (25.00),   -- Below starter (edge case)
    (150.00)   -- Between professional and enterprise
) AS test_amounts(amount_paid); 