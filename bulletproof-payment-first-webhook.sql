-- BULLETPROOF PAYMENT-FIRST WEBHOOK
-- This creates user accounts automatically when they pay (even if no account exists)

CREATE OR REPLACE FUNCTION activate_user_by_email(
  user_email TEXT,
  plan TEXT,
  stripe_customer TEXT
) RETURNS JSON AS $$
DECLARE
  user_id UUID;
  result JSON;
  account_created BOOLEAN := false;
BEGIN
  -- Try to find existing user
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  -- If user doesn't exist, create account automatically
  IF user_id IS NULL THEN
    -- Insert into auth.users (this creates the account)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated', 
      user_email,
      crypt('TEMP_PASSWORD_' || extract(epoch from now()), gen_salt('bf')), -- Temporary password
      timezone('utc'::text, now()), -- Email confirmed (they paid, so email is valid)
      timezone('utc'::text, now()),
      timezone('utc'::text, now()),
      '{"provider": "stripe_payment", "providers": ["stripe_payment"]}',
      '{"created_via": "payment_webhook"}',
      false,
      '',
      '',
      ''
    ) RETURNING id INTO user_id;
    
    account_created := true;
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
  
  -- Return success with account creation info
  RETURN json_build_object(
    'success', true,
    'user_id', user_id,
    'email', user_email,
    'plan', plan,
    'account_created', account_created,
    'message', CASE 
      WHEN account_created THEN 'Account created and activated'
      ELSE 'Existing account activated'
    END
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to process payment: ' || SQLERRM,
      'email', user_email
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 