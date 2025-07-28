-- Add trial tracking to existing users
-- Run this in Supabase SQL Editor

-- Add trial fields to auth.users via user profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '14 days'),
  subscription_status TEXT CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')) DEFAULT 'trial',
  subscription_plan TEXT CHECK (subscription_plan IN ('starter', 'professional', 'enterprise')) DEFAULT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, trial_start_date, trial_end_date, subscription_status)
  VALUES (
    NEW.id,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()) + INTERVAL '14 days',
    'trial'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_trial_end ON public.user_profiles(trial_end_date);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_status ON public.user_profiles(subscription_status); 