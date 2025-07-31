import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, User, Tag } from 'lucide-react'

export default function EcommerceReconciliationMultiplePayments() {
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
            <Badge variant="secondary">E-commerce</Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">
            E-commerce Reconciliation: Handling Multiple Payment Methods
          </h1>
          <div className="flex items-center space-x-6 mt-4 text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Alex</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>11 min read</span>
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
            E-commerce businesses face unique reconciliation challenges with multiple payment processors, 
            refunds, chargebacks, and international transactions. Here's how to handle it all efficiently.
          </p>

          <h2>The E-commerce Reconciliation Challenge</h2>
          <p>
            Online businesses must reconcile transactions across multiple platforms:
          </p>
          <ul>
            <li><strong>Payment processors:</strong> Stripe, PayPal, Square, Shopify Payments</li>
            <li><strong>Marketplaces:</strong> Amazon, eBay, Etsy, Walmart</li>
            <li><strong>Payment methods:</strong> Credit cards, digital wallets, bank transfers</li>
            <li><strong>International sales:</strong> Multiple currencies and exchange rates</li>
            <li><strong>Refunds and chargebacks:</strong> Complex reversal transactions</li>
            <li><strong>Subscription billing:</strong> Recurring payments and cancellations</li>
          </ul>

          <h2>Common E-commerce Payment Platforms</h2>

          <h3>1. Stripe</h3>
          <p>
            Popular for its developer-friendly API and comprehensive features:
          </p>
          <ul>
            <li><strong>Transaction types:</strong> One-time payments, subscriptions, refunds</li>
            <li><strong>Fees:</strong> 2.9% + 30¢ per transaction</li>
            <li><strong>Settlement:</strong> 2-7 business days</li>
            <li><strong>Reconciliation challenges:</strong> Multiple fee types, currency conversion</li>
          </ul>

          <h3>2. PayPal</h3>
          <p>
            Widely trusted but complex reconciliation:
          </p>
          <ul>
            <li><strong>Transaction types:</strong> Standard payments, PayPal Credit, Venmo</li>
            <li><strong>Fees:</strong> 2.9% + fixed fee (varies by country)</li>
            <li><strong>Settlement:</strong> Instant to 3 business days</li>
            <li><strong>Reconciliation challenges:</strong> Multiple account types, hold periods</li>
          </ul>

          <h3>3. Shopify Payments</h3>
          <p>
            Integrated with Shopify but has limitations:
          </p>
          <ul>
            <li><strong>Transaction types:</strong> Shopify store payments only</li>
            <li><strong>Fees:</strong> 2.4% - 2.9% + 30¢ (varies by plan)</li>
            <li><strong>Settlement:</strong> 2-3 business days</li>
            <li><strong>Reconciliation challenges:</strong> Limited to Shopify ecosystem</li>
          </ul>

          <h2>E-commerce Reconciliation Process</h2>

          <h3>Step 1: Platform Data Collection</h3>
          <ol>
            <li>Export transaction data from each payment platform</li>
            <li>Download bank statements for all business accounts</li>
            <li>Collect marketplace settlement reports</li>
            <li>Gather refund and chargeback data</li>
          </ol>

          <h3>Step 2: Data Standardization</h3>
          <ol>
            <li>Standardize transaction formats across platforms</li>
            <li>Normalize currency amounts and exchange rates</li>
            <li>Map transaction types to your chart of accounts</li>
            <li>Create consistent transaction IDs across systems</li>
          </ol>

          <h3>Step 3: Multi-Platform Matching</h3>
          <ol>
            <li>Match platform transactions to bank deposits</li>
            <li>Account for processing fees and timing differences</li>
            <li>Reconcile refunds and chargebacks</li>
            <li>Verify subscription billing accuracy</li>
          </ol>

          <h2>Handling E-commerce Specific Transactions</h2>

          <h3>1. Refunds and Returns</h3>
          <p>
            E-commerce refunds require careful tracking:
          </p>
          <ul>
            <li><strong>Partial refunds:</strong> Split original transaction</li>
            <li><strong>Full refunds:</strong> Reverse entire transaction</li>
            <li><strong>Restocking fees:</strong> Track separately from refunds</li>
            <li><strong>Return shipping costs:</strong> Allocate to appropriate expense account</li>
          </ul>

          <h3>2. Chargebacks and Disputes</h3>
          <p>
            Chargebacks require special handling:
          </p>
          <ul>
            <li><strong>Dispute fees:</strong> Track as separate expense</li>
            <li><strong>Reversal transactions:</strong> Match to original sale</li>
            <li><strong>Dispute resolution:</strong> Track win/loss rates</li>
            <li><strong>Prevention strategies:</strong> Monitor chargeback ratios</li>
          </ul>

          <h3>3. Subscription Billing</h3>
          <p>
            Recurring payments need special attention:
          </p>
          <ul>
            <li><strong>Failed payments:</strong> Track retry attempts</li>
            <li><strong>Cancellations:</strong> Prorate refunds if necessary</li>
            <li><strong>Plan changes:</strong> Handle mid-cycle upgrades/downgrades</li>
            <li><strong>Trial periods:</strong> Track conversion rates</li>
          </ul>

          <h2>International E-commerce Considerations</h2>

          <h3>Currency Conversion</h3>
          <p>
            Multi-currency sales add complexity:
          </p>
          <ul>
            <li><strong>Exchange rates:</strong> Track rates used for each transaction</li>
            <li><strong>Conversion fees:</strong> Separate from processing fees</li>
            <li><strong>Foreign exchange gains/losses:</strong> Account for rate fluctuations</li>
            <li><strong>Multi-currency bank accounts:</strong> Reconcile each currency separately</li>
          </ul>

          <h3>International Tax Compliance</h3>
          <p>
            Tax considerations for international sales:
          </p>
          <ul>
            <li><strong>VAT/GST:</strong> Track tax collection and remittance</li>
            <li><strong>Import duties:</strong> Account for customs fees</li>
            <li><strong>Tax treaties:</strong> Understand withholding requirements</li>
            <li><strong>Reporting requirements:</strong> Comply with local tax laws</li>
          </ul>

          <h2>E-commerce Chart of Accounts Setup</h2>
          <p>
            Create these accounts for proper e-commerce reconciliation:
          </p>
          <ul>
            <li><strong>Sales Accounts:</strong> Online Sales, Marketplace Sales, Subscription Revenue</li>
            <li><strong>Payment Processing:</strong> Stripe Fees, PayPal Fees, Processing Fees</li>
            <li><strong>Refunds and Returns:</strong> Refunds, Return Shipping, Restocking Fees</li>
            <li><strong>Chargebacks:</strong> Chargeback Fees, Dispute Expenses</li>
            <li><strong>International:</strong> Currency Conversion, Foreign Exchange</li>
          </ul>

          <h2>Automation Strategies for E-commerce</h2>

          <h3>1. API Integration</h3>
          <p>
            Connect payment platforms directly to your accounting system:
          </p>
          <ul>
            <li>Real-time transaction imports</li>
            <li>Automated fee tracking</li>
            <li>Instant refund processing</li>
            <li>Automated reconciliation matching</li>
          </ul>

          <h3>2. Multi-Platform Reconciliation</h3>
          <p>
            Use tools like <Link href="/" className="text-blue-600 hover:text-blue-800">ReconcileBook</Link> to handle multiple platforms:
          </p>
          <ul>
            <li>Consolidate data from all payment processors</li>
            <li>Automated transaction matching across platforms</li>
            <li>Real-time reconciliation status</li>
            <li>Comprehensive reporting and analytics</li>
          </ul>

          <h3>3. Automated Error Detection</h3>
          <p>
            Set up alerts for common e-commerce issues:
          </p>
          <ul>
            <li>Failed payment notifications</li>
            <li>High chargeback rate alerts</li>
            <li>Currency conversion discrepancies</li>
            <li>Unmatched transaction reports</li>
          </ul>

          <h2>Common E-commerce Reconciliation Errors</h2>

          <h3>1. Not Accounting for Processing Fees</h3>
          <p>
            <strong>Problem:</strong> Bank deposits don't match sales due to fees<br/>
            <strong>Solution:</strong> Track processing fees separately and reconcile net amounts
          </p>

          <h3>2. Ignoring Timing Differences</h3>
          <p>
            <strong>Problem:</strong> Sales recorded today, deposits tomorrow<br/>
            <strong>Solution:</strong> Use accrual accounting or track timing differences
          </p>

          <h3>3. Poor Refund Tracking</h3>
          <p>
            <strong>Problem:</strong> Refunds not properly matched to original sales<br/>
            <strong>Solution:</strong> Use transaction IDs to link refunds to sales
          </p>

          <h2>E-commerce Reconciliation Best Practices</h2>

          <h3>1. Daily Reconciliation</h3>
          <p>
            Reconcile daily for better accuracy:
          </p>
          <ul>
            <li>Identify issues quickly</li>
            <li>Better cash flow management</li>
            <li>Reduced month-end stress</li>
            <li>Improved financial visibility</li>
          </ul>

          <h3>2. Separate Platform Tracking</h3>
          <p>
            Track each payment platform separately:
          </p>
          <ul>
            <li>Easier error identification</li>
            <li>Better platform performance analysis</li>
            <li>Simplified troubleshooting</li>
            <li>Improved financial reporting</li>
          </ul>

          <h3>3. Use Automation Tools</h3>
          <p>
            Leverage technology to handle complexity:
          </p>
          <ul>
            <li>Automated transaction matching</li>
            <li>Multi-platform data consolidation</li>
            <li>Real-time reconciliation status</li>
            <li>Detailed reporting and analytics</li>
          </ul>

          <h2>Getting Started</h2>
          <p>
            Start with your highest-volume payment platform and gradually add others. 
            Focus on automation early to handle the complexity of multiple payment methods.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-blue-900 font-semibold mb-2">Simplify E-commerce Reconciliation</h3>
            <p className="text-blue-800 mb-4">
              E-commerce reconciliation doesn't have to be overwhelming. 
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold"> ReconcileBook</Link> 
              handles multi-platform reconciliation and automates the complex matching process.
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