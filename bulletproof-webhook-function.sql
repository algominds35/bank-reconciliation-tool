-- BULLETPROOF WEBHOOK FUNCTION
-- This function activates ANY user by email automatically when they pay

CREATE OR REPLACE FUNCTION activate_user_by_email(
  user_email TEXT,
  plan TEXT,
  stripe_customer TEXT
) RETURNS JSON AS $$
DECLARE
  user_id UUID;
  result JSON;
BEGIN
  -- Find the user ID by email
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  -- If user not found, return error
  IF user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not found: ' || user_email
    );
  END IF;
  
  -- Create or update user profile to ACTIVE/PAID status
  INSERT INTO public.user_profiles (
    id,
    subscription_status,
    subscription_plan,
    stripe_customer_id,
    trial_end_date, -- Set far in future since they're paid
    created_at,
    updated_at
  ) VALUES (
    user_id,
    'active',
    plan,
    stripe_customer,
    '2030-12-31'::timestamp,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    subscription_status = 'active',
    subscription_plan = plan,
    stripe_customer_id = stripe_customer,
    trial_end_date = '2030-12-31'::timestamp,
    updated_at = timezone('utc'::text, now());
  
  -- Return success
  RETURN json_build_object(
    'success', true,
    'user_id', user_id,
    'email', user_email,
    'plan', plan
  );
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 