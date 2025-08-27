-- Create the client_intakes table for the intake form
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.client_intakes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_name TEXT NOT NULL,
    business_type TEXT,
    industry TEXT,
    ein TEXT,
    year_established INTEGER,
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
    start_date DATE,
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

-- Create policy to allow inserts (for form submissions)
CREATE POLICY "Allow public insert" ON public.client_intakes
    FOR INSERT 
    WITH CHECK (true);

-- Create policy to allow admin access (for bookkeeper dashboard)
CREATE POLICY "Allow admin access" ON public.client_intakes
    FOR ALL 
    USING (true);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_client_intakes_status ON public.client_intakes(status);
CREATE INDEX IF NOT EXISTS idx_client_intakes_submitted_at ON public.client_intakes(submitted_at);
CREATE INDEX IF NOT EXISTS idx_client_intakes_email ON public.client_intakes(email);

-- Insert some test data to verify the table works
INSERT INTO public.client_intakes (
    business_name,
    business_type,
    industry,
    contact_person,
    email,
    phone,
    services_needed,
    referral_source,
    goals,
    challenges,
    status
) VALUES (
    'Test Business LLC',
    'LLC',
    'Consulting',
    'John Doe',
    'test@example.com',
    '555-0123',
    ARRAY['Monthly Bookkeeping', 'Tax Preparation'],
    'Google Search',
    'Better financial organization',
    'Manual bookkeeping taking too much time',
    'new'
);

-- Verify the table was created successfully
SELECT 'client_intakes table created successfully!' as message;
SELECT * FROM public.client_intakes LIMIT 1;
