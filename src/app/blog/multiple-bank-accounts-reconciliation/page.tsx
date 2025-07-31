import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, User, Tag } from 'lucide-react'

export default function MultipleBankAccountsReconciliation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/blog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <Badge variant="secondary">Advanced</Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">
            Reconciliation for Multiple Bank Accounts: Complete Guide
          </h1>
          <div className="flex items-center space-x-6 mt-4 text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Alex</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>9 min read</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              <span>January 16, 2024</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Managing multiple bank accounts adds complexity to reconciliation. Learn how to handle 
            multiple accounts efficiently and avoid common pitfalls.
          </p>

          <h2>Why Multiple Bank Accounts Complicate Reconciliation</h2>
          <p>
            Businesses use multiple accounts for various reasons, each adding reconciliation complexity:
          </p>
          <ul>
            <li><strong>Operating accounts:</strong> Daily business transactions</li>
            <li><strong>Savings accounts:</strong> Emergency funds and reserves</li>
            <li><strong>Tax accounts:</strong> Quarterly tax payments</li>
            <li><strong>Payroll accounts:</strong> Dedicated payroll processing</li>
            <li><strong>Investment accounts:</strong> Business investments and securities</li>
            <li><strong>Foreign currency accounts:</strong> International transactions</li>
          </ul>

          <h2>Types of Multiple Account Setups</h2>

          <h3>1. Business Structure Accounts</h3>
          <p>
            Common account structure for growing businesses:
          </p>
          <ul>
            <li><strong>Main operating account:</strong> Daily income and expenses</li>
            <li><strong>Payroll account:</strong> Dedicated for employee payments</li>
            <li><strong>Tax account:</strong> Quarterly estimated tax payments</li>
            <li><strong>Savings account:</strong> Emergency fund and reserves</li>
          </ul>

          <h3>2. Multi-Entity Accounts</h3>
          <p>
            Multiple businesses or subsidiaries:
          </p>
          <ul>
            <li><strong>Parent company account:</strong> Centralized management</li>
            <li><strong>Subsidiary accounts:</strong> Individual business units</li>
            <li><strong>Intercompany transfers:</strong> Funds moved between entities</li>
            <li><strong>Consolidated reporting:</strong> Combined financial statements</li>
          </ul>

          <h3>3. Specialized Purpose Accounts</h3>
          <p>
            Accounts for specific business functions:
          </p>
          <ul>
            <li><strong>Merchant account:</strong> Credit card processing</li>
            <li><strong>Escrow account:</strong> Client funds held in trust</li>
            <li><strong>Investment account:</strong> Business securities and investments</li>
            <li><strong>Foreign currency account:</strong> International transactions</li>
          </ul>

          <h2>Multiple Account Reconciliation Process</h2>

          <h3>Step 1: Account Mapping</h3>
          <ol>
            <li>Create a master list of all bank accounts</li>
            <li>Map each account to your chart of accounts</li>
            <li>Define the purpose and typical transactions for each account</li>
            <li>Set up account-specific reconciliation rules</li>
          </ol>

          <h3>Step 2: Transaction Categorization</h3>
          <ol>
            <li>Categorize transactions by account type</li>
            <li>Set up account-specific categorization rules</li>
            <li>Handle inter-account transfers properly</li>
            <li>Track account-specific fees and charges</li>
          </ol>

          <h3>Step 3: Inter-Account Reconciliation</h3>
          <ol>
            <li>Reconcile transfers between accounts</li>
            <li>Verify transfer amounts and timing</li>
            <li>Account for transfer fees</li>
            <li>Ensure no double-counting of funds</li>
          </ol>

          <h2>Common Multiple Account Challenges</h2>

          <h3>1. Inter-Account Transfers</h3>
          <p>
            Transfers between accounts require special handling:
          </p>
          <ul>
            <li><strong>Timing differences:</strong> Transfers may take 1-3 business days</li>
            <li><strong>Transfer fees:</strong> Some banks charge for transfers</li>
            <li><strong>Double counting:</strong> Avoid counting transfers as income/expense</li>
            <li><strong>Reconciliation matching:</strong> Match outgoing and incoming transfers</li>
          </ul>

          <h3>2. Account-Specific Fees</h3>
          <p>
            Different accounts may have different fee structures:
          </p>
          <ul>
            <li><strong>Monthly maintenance fees:</strong> Track by account</li>
            <li><strong>Transaction fees:</strong> Vary by account type</li>
            <li><strong>Overdraft fees:</strong> Monitor account balances</li>
            <li><strong>Wire transfer fees:</strong> Account for transfer costs</li>
          </ul>

          <h3>3. Currency Differences</h3>
          <p>
            Multi-currency accounts add complexity:
          </p>
          <ul>
            <li><strong>Exchange rates:</strong> Track rates for each transaction</li>
            <li><strong>Currency conversion fees:</strong> Account for conversion costs</li>
            <li><strong>Foreign exchange gains/losses:</strong> Report separately</li>
            <li><strong>Multi-currency reconciliation:</strong> Reconcile each currency</li>
          </ul>

          <h2>Chart of Accounts for Multiple Accounts</h2>
          <p>
            Set up these accounts for proper multi-account reconciliation:
          </p>
          <ul>
            <li><strong>Bank Accounts:</strong> Operating Account, Payroll Account, Tax Account</li>
            <li><strong>Inter-Account Transfers:</strong> Transfer In, Transfer Out</li>
            <li><strong>Account Fees:</strong> Bank Fees, Transfer Fees, Maintenance Fees</li>
            <li><strong>Currency Exchange:</strong> Foreign Exchange Gain/Loss</li>
            <li><strong>Investment Accounts:</strong> Securities, Investments, Dividends</li>
          </ul>

          <h2>Automation Strategies for Multiple Accounts</h2>

          <h3>1. Multi-Account Bank Feeds</h3>
          <p>
            Connect all accounts to your accounting system:
          </p>
          <ul>
            <li>Automatic transaction imports from all accounts</li>
            <li>Account-specific categorization rules</li>
            <li>Automated transfer matching</li>
            <li>Real-time balance monitoring</li>
          </ul>

          <h3>2. Account-Specific Rules</h3>
          <p>
            Create rules for each account type:
          </p>
          <ul>
            <li>Payroll account: Only payroll-related transactions</li>
            <li>Tax account: Only tax payments and refunds</li>
            <li>Operating account: All other business transactions</li>
            <li>Investment account: Securities and investment income</li>
          </ul>

          <h3>3. Consolidated Reporting</h3>
          <p>
            Use tools like <Link href="/" className="text-blue-600 hover:text-blue-800">ReconcileBook</Link> for multi-account management:
          </p>
          <ul>
            <li>Consolidated view of all accounts</li>
            <li>Automated inter-account transfer matching</li>
            <li>Account-specific reconciliation status</li>
            <li>Comprehensive multi-account reporting</li>
          </ul>

          <h2>Common Multiple Account Errors</h2>

          <h3>1. Double Counting Transfers</h3>
          <p>
            <strong>Problem:</strong> Counting transfers as both income and expense<br/>
            <strong>Solution:</strong> Use transfer accounts, not income/expense accounts
          </p>

          <h3>2. Ignoring Account-Specific Fees</h3>
          <p>
            <strong>Problem:</strong> Not tracking fees for each account<br/>
            <strong>Solution:</strong> Set up account-specific fee tracking
          </p>

          <h3>3. Poor Transfer Timing</h3>
          <p>
            <strong>Problem:</strong> Not accounting for transfer delays<br/>
            <strong>Solution:</strong> Use accrual accounting or track timing differences
          </p>

          <h2>Multiple Account Reconciliation Best Practices</h2>

          <h3>1. Account-Specific Reconciliation</h3>
          <p>
            Reconcile each account separately:
          </p>
          <ul>
            <li>Focus on one account at a time</li>
            <li>Use account-specific rules and categories</li>
            <li>Track account-specific fees and charges</li>
            <li>Maintain separate reconciliation schedules</li>
          </ul>

          <h3>2. Transfer Documentation</h3>
          <p>
            Document all inter-account transfers:
          </p>
          <ul>
            <li>Record transfer amounts and dates</li>
            <li>Track transfer fees and charges</li>
            <li>Verify transfer completion</li>
            <li>Maintain transfer audit trail</li>
          </ul>

          <h3>3. Regular Account Review</h3>
          <p>
            Review account structure regularly:
          </p>
          <ul>
            <li>Assess account usage and efficiency</li>
            <li>Consolidate accounts when possible</li>
            <li>Optimize account structure for business needs</li>
            <li>Update account purposes as business evolves</li>
          </ul>

          <h2>Technology Solutions for Multiple Accounts</h2>
          <p>
            Modern reconciliation tools can handle multiple accounts efficiently:
          </p>
          <ul>
            <li><strong>Multi-account integration:</strong> Connect all bank accounts</li>
            <li><strong>Automated transfer matching:</strong> Match inter-account transfers</li>
            <li><strong>Account-specific rules:</strong> Customize for each account</li>
            <li><strong>Consolidated reporting:</strong> View all accounts together</li>
          </ul>

          <h2>Getting Started</h2>
          <p>
            Start with your main operating account and gradually add others. Focus on 
            automation early to handle the complexity of multiple accounts efficiently.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-blue-900 font-semibold mb-2">Simplify Multi-Account Reconciliation</h3>
            <p className="text-blue-800 mb-4">
              Multiple bank accounts don't have to complicate reconciliation. 
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold"> ReconcileBook</Link> 
              handles multi-account reconciliation and automates the complex matching process.
            </p>
            <div className="flex space-x-4">
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Try ReconcileBook Free
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline">
                  More Reconciliation Tips
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
} 