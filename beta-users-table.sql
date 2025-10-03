-- Create beta_users table for tracking beta program participants
CREATE TABLE IF NOT EXISTS beta_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signup_source TEXT DEFAULT 'beta_program',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'converted')),
  last_login TIMESTAMP WITH TIME ZONE,
  total_logins INTEGER DEFAULT 0,
  files_uploaded INTEGER DEFAULT 0,
  transactions_processed INTEGER DEFAULT 0,
  feedback_submitted INTEGER DEFAULT 0,
  features_used JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_beta_users_user_id ON beta_users(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_users_email ON beta_users(email);
CREATE INDEX IF NOT EXISTS idx_beta_users_status ON beta_users(status);
CREATE INDEX IF NOT EXISTS idx_beta_users_signup_date ON beta_users(signup_date);

-- Enable RLS (Row Level Security)
ALTER TABLE beta_users ENABLE ROW LEVEL SECURITY;

-- Create policy for beta users to view their own data
CREATE POLICY "Beta users can view own data" ON beta_users
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for service role to manage all beta user data
CREATE POLICY "Service role can manage all beta user data" ON beta_users
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_beta_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_beta_users_updated_at_trigger
  BEFORE UPDATE ON beta_users
  FOR EACH ROW
  EXECUTE FUNCTION update_beta_users_updated_at();
