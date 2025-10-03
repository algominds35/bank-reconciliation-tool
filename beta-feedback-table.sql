-- Create beta_feedback table for collecting user feedback
CREATE TABLE IF NOT EXISTS beta_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  category TEXT NOT NULL CHECK (category IN ('Bug Report', 'Feature Request', 'User Experience', 'Performance', 'General Feedback', 'Other')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_beta_feedback_user_id ON beta_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_category ON beta_feedback(category);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_status ON beta_feedback(status);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_created_at ON beta_feedback(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE beta_feedback ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own feedback
CREATE POLICY "Users can insert their own feedback" ON beta_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to view their own feedback
CREATE POLICY "Users can view their own feedback" ON beta_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for service role to manage all feedback
CREATE POLICY "Service role can manage all feedback" ON beta_feedback
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_beta_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_beta_feedback_updated_at_trigger
  BEFORE UPDATE ON beta_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_beta_feedback_updated_at();
