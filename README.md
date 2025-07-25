# Bank Reconciliation Tool

A private bank reconciliation tool for small business owners built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Secure email/password login and signup with Supabase
- 📥 **CSV Upload**: Upload transaction CSV files with date, description, and amount
- 🗃️ **Data Management**: Store transactions in Supabase PostgreSQL database
- 📄 **Transaction View**: Scrollable table with filtering options
- ✅ **Manual Matching**: Select and reconcile multiple transactions
- 📊 **Summary Dashboard**: Real-time reconciliation progress tracking
- 📤 **Export**: Download reconciled transactions as CSV or PDF

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo>
cd quickbooks-tool
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Create transactions table
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    is_reconciled BOOLEAN DEFAULT FALSE,
    reconciliation_group UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own transactions
CREATE POLICY "Users can only see their own transactions" ON transactions
    FOR ALL USING (auth.uid() = user_id);

-- Create policy for users to insert their own transactions
CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own transactions
CREATE POLICY "Users can update their own transactions" ON transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create waitlist table for landing page
CREATE TABLE waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100),
    feature_interest TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for waitlist
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (public form)
CREATE POLICY "Anyone can join waitlist" ON waitlist
    FOR INSERT WITH CHECK (true);
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### CSV Upload Format

Your CSV file should have these columns:
- `date` - Transaction date (YYYY-MM-DD format)
- `description` - Transaction description
- `amount` - Transaction amount (positive or negative number)

Example:
```csv
date,description,amount
2024-01-15,Office Supplies,-45.67
2024-01-15,Client Payment,1200.00
2024-01-16,Internet Bill,-89.99
```

### Manual Reconciliation

1. Upload your CSV files
2. Select 2 or more transactions using checkboxes
3. Click "Reconcile Selected" to group them
4. Use "Unreconcile" to undo a reconciliation group
5. Export reconciled transactions when ready

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your Vercel environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, API)
- **CSV Parsing**: Papa Parse
- **PDF Generation**: jsPDF
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## Project Structure

```
src/
├── app/                 # Next.js 13+ app directory
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main application dashboard
│   └── globals.css     # Global styles
├── components/         # Reusable React components
├── lib/               # Utilities and configurations
│   └── supabase.ts    # Supabase client setup
└── types/             # TypeScript type definitions
```

## Contributing

This is a private tool for small business bank reconciliation. No external contributions are needed at this time.

## License

Private project - All rights reserved. 