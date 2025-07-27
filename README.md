# Bank Reconciliation Tool

A comprehensive React application for bank transaction reconciliation with client management, built with Next.js, TailwindCSS, and shadcn/ui components.

## Features

### ✨ Core Functionality
- **CSV Upload**: Upload bank and bookkeeping transactions separately
- **Manual Matching**: Side-by-side transaction matching interface
- **Client Management**: Switch between different business clients
- **PDF Export**: Generate professional reconciliation reports
- **Smart Filtering**: Filter by reconciliation status and transaction type

### 🎨 Modern UI/UX
- Clean, professional interface using shadcn/ui components
- Responsive design that works on all devices
- Intuitive navigation with tabbed interface
- Real-time summary cards showing reconciliation progress

### 👥 Multi-Client Support
- Client switcher in the header
- Separate transaction sets per client
- Client management dashboard
- Add, edit, and delete business clients

### 📊 Advanced Features
- Side-by-side transaction matching
- Bulk reconciliation options
- Comprehensive PDF reports with client information
- Transaction categorization and notes
- Bank vs Bookkeeping transaction types

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account for database (optional for demo)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd quickbooks-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### 1. Getting Started
- Visit the homepage at `/`
- Navigate to the dashboard at `/dashboard`
- The app works without authentication for demo purposes

### 2. Client Management
- Use the client selector in the header to switch between clients
- Click "Add Client" to create new business clients
- Each client has separate transaction data

### 3. Uploading Transactions

#### Bank Transactions
1. Click "Upload Bank CSV" in the dashboard
2. Use the provided `sample-bank-transactions.csv` or your own data
3. Required columns: `date`, `description`, `amount`
4. Optional columns: `category`

#### Bookkeeping Transactions
1. Click "Upload Bookkeeping CSV" in the dashboard
2. Use the provided `sample-bookkeeping-transactions.csv` or your own data
3. Required columns: `date`, `description`, `amount`
4. Optional columns: `category`

### 4. Reconciling Transactions

#### Manual Bulk Reconciliation
1. Go to the "All Transactions" tab
2. Select multiple transactions using checkboxes
3. Click "Reconcile Selected" to group them together

#### Smart Matching (Recommended)
1. Go to the "Smart Matching" tab
2. View bank transactions on the left, bookkeeping on the right
3. Click transactions to select them (one from each side)
4. Click "Match Transactions" to reconcile the pair

### 5. Exporting Reports
- **CSV Export**: Click "Export CSV" to download reconciled transactions
- **PDF Export**: Click "Export PDF" to generate a professional report
- Reports include client information when a client is selected

## CSV File Format

### Bank Transactions
```csv
date,description,amount,category
2024-01-15,Client Payment,1500.00,Income
2024-01-16,Office Rent,-1200.00,Rent
```

### Bookkeeping Transactions
```csv
date,description,amount,category
2024-01-15,Service Revenue,1500.00,Revenue
2024-01-16,Rent Expense,-1200.00,Rent
```

### Required Fields
- `date`: Date in YYYY-MM-DD format
- `description`: Transaction description
- `amount`: Positive for income, negative for expenses

### Optional Fields
- `category`: Transaction category for organization
- `notes`: Additional transaction notes

## Database Schema (Supabase)

### Tables Required

#### `clients`
```sql
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `transactions`
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES clients(id),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('bank', 'bookkeeping')),
  category TEXT,
  notes TEXT,
  is_reconciled BOOLEAN DEFAULT false,
  reconciliation_group UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **File Processing**: PapaParse for CSV handling
- **PDF Generation**: jsPDF with autoTable
- **Icons**: Lucide React

## Component Architecture

### Core Components
- `ClientSelector`: Multi-client switching interface
- `TransactionTable`: Enhanced transaction display with filtering
- `MatchingInterface`: Side-by-side transaction matching
- `ClientManagement`: Full CRUD for business clients

### UI Components (shadcn/ui)
- `Button`, `Card`, `Table`, `Select`, `Badge`
- `Dialog`, `Tabs`, `Checkbox`, `Separator`

## Features in Detail

### Smart Matching Interface
- Visual side-by-side comparison
- Click-to-select interaction
- Real-time selection feedback
- Automatic reconciliation grouping

### PDF Export Features
- Professional report formatting
- Client information inclusion
- Transaction grouping by reconciliation
- Summary totals and statistics

### Client Management
- Add/edit/delete business clients
- Client-specific transaction isolation
- Business name and contact tracking
- Optional email integration

## Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Key Files
- `/src/app/dashboard/page.tsx` - Main dashboard
- `/src/components/` - Reusable components
- `/src/types/index.ts` - TypeScript definitions
- `/src/lib/supabase.ts` - Database configuration

## Troubleshooting

### Common Issues

1. **CSV Upload Fails**
   - Ensure CSV has required columns: date, description, amount
   - Check date format (YYYY-MM-DD)
   - Verify amount is numeric

2. **Transactions Not Showing**
   - Check client selection in header
   - Verify database connection
   - Check browser console for errors

3. **PDF Export Issues**
   - Large datasets may take time to generate
   - Check browser popup blockers
   - Ensure reconciled transactions exist

### Sample Data
Use the provided sample CSV files to test the application:
- `sample-bank-transactions.csv`
- `sample-bookkeeping-transactions.csv`

These files contain matching transactions that can be easily reconciled for demonstration purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

---

**Need Help?** Check the sample data files and follow the usage guide above. The application is designed to work out of the box with the provided sample transactions. 