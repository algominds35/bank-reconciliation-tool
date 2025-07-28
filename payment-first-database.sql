-- PAYMENT-FIRST SYSTEM DATABASE
-- Table to store payments from users who haven't created accounts yet

-- Create pending payments table
CREATE TABLE IF NOT EXISTS public.pending_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  subscription_plan TEXT CHECK (subscription_plan IN ('starter', 'professional', 'enterprise')) NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_session_id TEXT NOT NULL,
  amount_paid NUMERIC NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.pending_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for pending_payments
CREATE POLICY "Users can view their own pending payments" ON public.pending_payments
  FOR SELECT USING (true); -- Admins can view all, users can view their own email

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pending_payments_email ON public.pending_payments(email);
CREATE INDEX IF NOT EXISTS idx_pending_payments_processed ON public.pending_payments(processed);

-- Update user signup trigger to check for pending payments
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  pending_payment RECORD;
BEGIN
  -- First create the basic user profile with trial
  INSERT INTO public.user_profiles (id, trial_start_date, trial_end_date, subscription_status)
  VALUES (
    NEW.id,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()) + INTERVAL '14 days',
    'trial'
  );

  -- Check if this user has a pending payment
  SELECT * INTO pending_payment
  FROM public.pending_payments
  WHERE email = NEW.email
    AND processed = false
  ORDER BY created_at DESC
  LIMIT 1;

  -- If pending payment exists, upgrade the user immediately
  IF pending_payment IS NOT NULL THEN
    -- Update user profile to paid status
    UPDATE public.user_profiles 
    SET 
      subscription_status = 'active',
      subscription_plan = pending_payment.subscription_plan,
      stripe_customer_id = pending_payment.stripe_customer_id,
      trial_end_date = '2030-12-31'::timestamp,
      updated_at = timezone('utc'::text, now())
    WHERE id = NEW.id;

    -- Mark pending payment as processed
    UPDATE public.pending_payments
    SET 
      processed = true,
      processed_at = timezone('utc'::text, now())
    WHERE id = pending_payment.id;

    RAISE NOTICE 'User % upgraded to % plan via pending payment', NEW.email, pending_payment.subscription_plan;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 