-- Create clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('bank', 'bookkeeping')),
  category TEXT,
  notes TEXT,
  is_reconciled BOOLEAN DEFAULT false,
  reconciliation_group UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Users can view their own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for transactions table
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_client_id ON transactions(client_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_reconciled ON transactions(is_reconciled);
CREATE INDEX idx_clients_user_id ON clients(user_id);

-- Create team_invitations table
CREATE TABLE team_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member', 'viewer')) DEFAULT 'member',
  status TEXT CHECK (status IN ('pending', 'accepted', 'expired')) DEFAULT 'pending',
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security for team_invitations
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for team_invitations table
CREATE POLICY "Users can view invitations they sent" ON team_invitations
  FOR SELECT USING (auth.uid() = invited_by);

CREATE POLICY "Users can create invitations" ON team_invitations
  FOR INSERT WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "Users can update their own invitations" ON team_invitations
  FOR UPDATE USING (auth.uid() = invited_by);

CREATE POLICY "Users can delete their own invitations" ON team_invitations
  FOR DELETE USING (auth.uid() = invited_by);

-- Create indexes for team_invitations
CREATE INDEX idx_team_invitations_invited_by ON team_invitations(invited_by);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_invitations_status ON team_invitations(status);

-- Create user_mfa_factors table for Two-Factor Authentication
CREATE TABLE user_mfa_factors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  factor_type TEXT CHECK (factor_type IN ('totp', 'sms', 'email')) NOT NULL,
  secret_key TEXT,
  status TEXT CHECK (status IN ('unverified', 'verified', 'disabled')) DEFAULT 'unverified',
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security for user_mfa_factors
ALTER TABLE user_mfa_factors ENABLE ROW LEVEL SECURITY;

-- Create policies for user_mfa_factors table
CREATE POLICY "Users can manage their own MFA factors" ON user_mfa_factors
  USING (auth.uid() = user_id);

-- Create indexes for user_mfa_factors
CREATE INDEX idx_user_mfa_factors_user_id ON user_mfa_factors(user_id);
CREATE INDEX idx_user_mfa_factors_factor_type ON user_mfa_factors(factor_type);
CREATE INDEX idx_user_mfa_factors_status ON user_mfa_factors(status); 