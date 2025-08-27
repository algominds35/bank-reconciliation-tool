-- Fix client_intakes table
-- Run this in your Supabase SQL editor

-- Create client_intakes table
CREATE TABLE IF NOT EXISTS public.client_intakes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_name TEXT NOT NULL,
    business_type TEXT,
    industry TEXT,
    ein TEXT,
    year_established TEXT,
    contact_person TEXT NOT NULL,
    title TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    annual_revenue TEXT,
    number_of_employees TEXT,
    current_bookkeeper TEXT,
    accounting_software TEXT,
    bank_accounts TEXT,
    services_needed TEXT[], -- Array of services
    frequency TEXT,
    start_date TEXT,
    special_requirements TEXT,
    referral_source TEXT,
    goals TEXT,
    challenges TEXT,
    status TEXT DEFAULT 'new',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.client_intakes ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can submit intake form)
CREATE POLICY "Allow public insert on client_intakes" ON public.client_intakes
FOR INSERT TO anon
WITH CHECK (true);

-- Create policy for admin access (you can read all)
CREATE POLICY "Allow admin access to client_intakes" ON public.client_intakes
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_intakes_email ON public.client_intakes(email);
CREATE INDEX IF NOT EXISTS idx_client_intakes_status ON public.client_intakes(status);
CREATE INDEX IF NOT EXISTS idx_client_intakes_submitted_at ON public.client_intakes(submitted_at);
CREATE INDEX IF NOT EXISTS idx_client_intakes_business_name ON public.client_intakes(business_name);

-- Insert some test data to verify it works
INSERT INTO public.client_intakes (
    business_name,
    contact_person,
    email,
    services_needed,
    referral_source
) VALUES (
    'Test Company LLC',
    'John Test',
    'test@example.com',
    ARRAY['Monthly Bookkeeping', 'Tax Preparation'],
    'Website'
) ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'client_intakes' 
ORDER BY ordinal_position;
