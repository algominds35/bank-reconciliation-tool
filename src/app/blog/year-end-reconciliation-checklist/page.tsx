import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, User, Tag } from 'lucide-react'

export default function YearEndReconciliationChecklist() {
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
            <Badge variant="secondary">Year-End</Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">
            Year-End Reconciliation: Complete Checklist
          </h1>
          <div className="flex items-center space-x-6 mt-4 text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Alex</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>8 min read</span>
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
            Year-end reconciliation is crucial for accurate financial statements and tax preparation. 
            Use this comprehensive checklist to ensure nothing is missed during your year-end close.
          </p>

          <h2>Why Year-End Reconciliation Matters</h2>
          <p>
            Year-end reconciliation is more than just balancing accounts - it's about ensuring 
            financial accuracy for:
          </p>
          <ul>
            <li><strong>Tax preparation:</strong> Accurate income and expense reporting</li>
            <li><strong>Financial statements:</strong> Reliable year-end financial position</li>
            <li><strong>Audit readiness:</strong> Clean books for potential audits</li>
            <li><strong>Business planning:</strong> Accurate data for next year's planning</li>
            <li><strong>Compliance:</strong> Meeting regulatory requirements</li>
          </ul>

          <h2>Pre-Year-End Preparation (2-4 weeks before)</h2>

          <h3>1. Review Current Reconciliation Status</h3>
          <ol>
            <li>Check all bank accounts are reconciled through current month</li>
            <li>Verify credit card accounts are up to date</li>
            <li>Review outstanding checks and deposits</li>
            <li>Identify any unreconciled transactions</li>
          </ol>

          <h3>2. Gather Required Documents</h3>
          <ol>
            <li>Year-end bank statements for all accounts</li>
            <li>Credit card statements through year-end</li>
            <li>Investment account statements</li>
            <li>Loan statements and payment records</li>
            <li>Vendor statements for outstanding invoices</li>
          </ol>

          <h3>3. Prepare Reconciliation Tools</h3>
          <ol>
            <li>Update your accounting software</li>
            <li>Backup all financial data</li>
            <li>Prepare reconciliation templates</li>
            <li>Set up year-end adjustment accounts</li>
          </ol>

          <h2>Year-End Reconciliation Checklist</h2>

          <h3>Bank Account Reconciliation</h3>
          <ol>
            <li><strong>Reconcile all bank accounts</strong> through December 31st</li>
            <li><strong>Verify bank statement balances</strong> match your records</li>
            <li><strong>Clear outstanding checks</strong> and deposits</li>
            <li><strong>Account for bank fees</strong> and service charges</li>
            <li><strong>Verify interest earned</strong> on savings accounts</li>
            <li><strong>Check for bank errors</strong> or corrections</li>
          </ol>

          <h3>Credit Card Reconciliation</h3>
          <ol>
            <li><strong>Reconcile all credit cards</strong> through year-end</li>
            <li><strong>Verify statement balances</strong> match your records</li>
            <li><strong>Account for finance charges</strong> and fees</li>
            <li><strong>Check for disputed charges</strong> or refunds</li>
            <li><strong>Verify reward points</strong> and cash back</li>
            <li><strong>Ensure proper categorization</strong> of all transactions</li>
          </ol>

          <h3>Investment Account Reconciliation</h3>
          <ol>
            <li><strong>Reconcile investment accounts</strong> through year-end</li>
            <li><strong>Verify dividend income</strong> and interest earned</li>
            <li><strong>Account for capital gains/losses</strong> from sales</li>
            <li><strong>Check for management fees</strong> and expenses</li>
            <li><strong>Verify account balances</strong> match statements</li>
            <li><strong>Document investment income</strong> for tax reporting</li>
          </ol>

          <h3>Accounts Receivable Reconciliation</h3>
          <ol>
            <li><strong>Review all outstanding invoices</strong> at year-end</li>
            <li><strong>Age accounts receivable</strong> by payment terms</li>
            <li><strong>Identify bad debt</strong> for write-off consideration</li>
            <li><strong>Verify customer payments</strong> received after year-end</li>
            <li><strong>Check for unapplied payments</strong> or credits</li>
            <li><strong>Document payment terms</strong> and collection status</li>
          </ol>

          <h3>Accounts Payable Reconciliation</h3>
          <ol>
            <li><strong>Review all outstanding bills</strong> at year-end</li>
            <li><strong>Verify vendor statements</strong> match your records</li>
            <li><strong>Account for accrued expenses</strong> not yet billed</li>
            <li><strong>Check for duplicate payments</strong> or credits</li>
            <li><strong>Verify payment terms</strong> and due dates</li>
            <li><strong>Document prepaid expenses</strong> for next year</li>
          </ol>

          <h2>Year-End Adjustments</h2>

          <h3>1. Accrued Expenses</h3>
          <p>
            Record expenses incurred but not yet paid:
          </p>
          <ul>
            <li>Utilities used but not yet billed</li>
            <li>Employee wages earned but not yet paid</li>
            <li>Interest on loans accrued but not due</li>
            <li>Professional services received but not invoiced</li>
          </ul>

          <h3>2. Prepaid Expenses</h3>
          <p>
            Adjust prepaid expenses to reflect current period usage:
          </p>
          <ul>
            <li>Insurance premiums paid in advance</li>
            <li>Rent paid in advance</li>
            <li>Software subscriptions paid annually</li>
            <li>Maintenance contracts paid in advance</li>
          </ul>

          <h3>3. Depreciation and Amortization</h3>
          <p>
            Record depreciation for fixed assets:
          </p>
          <ul>
            <li>Equipment and machinery depreciation</li>
            <li>Vehicle depreciation</li>
            <li>Building depreciation (if applicable)</li>
            <li>Intangible asset amortization</li>
          </ul>

          <h3>4. Inventory Adjustments</h3>
          <p>
            Adjust inventory to reflect year-end physical count:
          </p>
          <ul>
            <li>Physical inventory count</li>
            <li>Inventory valuation adjustments</li>
            <li>Obsolete inventory write-offs</li>
            <li>Inventory shrinkage adjustments</li>
          </ul>

          <h2>Tax Preparation Considerations</h2>

          <h3>1. Income Recognition</h3>
          <ol>
            <li>Verify all income is recorded in correct year</li>
            <li>Check for income received after year-end</li>
            <li>Account for deferred revenue</li>
            <li>Verify proper revenue recognition timing</li>
          </ol>

          <h3>2. Expense Deductions</h3>
          <ol>
            <li>Ensure all deductible expenses are recorded</li>
            <li>Check for personal expenses mixed with business</li>
            <li>Verify proper expense categorization</li>
            <li>Account for business use of personal items</li>
          </ol>

          <h3>3. Asset and Liability Verification</h3>
          <ol>
            <li>Verify all assets are properly recorded</li>
            <li>Check for unrecorded liabilities</li>
            <li>Account for contingent liabilities</li>
            <li>Verify loan balances and terms</li>
          </ol>

          <h2>Final Year-End Review</h2>

          <h3>1. Trial Balance Review</h3>
          <ol>
            <li>Run trial balance as of December 31st</li>
            <li>Review all account balances for reasonableness</li>
            <li>Check for unusual balances or entries</li>
            <li>Verify debits equal credits</li>
          </ol>

          <h3>2. Financial Statement Review</h3>
          <ol>
            <li>Review income statement for accuracy</li>
            <li>Check balance sheet account balances</li>
            <li>Verify cash flow statement</li>
            <li>Compare to prior year for reasonableness</li>
          </ol>

          <h3>3. Documentation Review</h3>
          <ol>
            <li>Ensure all reconciliations are documented</li>
            <li>File all supporting documentation</li>
            <li>Create year-end closing entries</li>
            <li>Backup all financial data</li>
          </ol>

          <h2>Post-Year-End Tasks</h2>

          <h3>1. January Reconciliation</h3>
          <ol>
            <li>Reconcile January transactions promptly</li>
            <li>Check for year-end adjustments needed</li>
            <li>Verify opening balances are correct</li>
            <li>Set up new year budget and goals</li>
          </ol>

          <h3>2. Tax Preparation</h3>
          <ol>
            <li>Prepare tax returns using reconciled data</li>
            <li>Provide documentation to tax preparer</li>
            <li>Review tax return for accuracy</li>
            <li>Plan for estimated tax payments</li>
          </ol>

          <h2>Technology Solutions for Year-End</h2>
          <p>
            Modern reconciliation tools can streamline year-end processes:
          </p>
          <ul>
            <li><strong>Automated reconciliation:</strong> Speed up the reconciliation process</li>
            <li><strong>Multi-account management:</strong> Handle all accounts efficiently</li>
            <li><strong>Audit trail:</strong> Maintain detailed records</li>
            <li><strong>Reporting tools:</strong> Generate year-end reports quickly</li>
          </ul>

          <h2>Getting Started</h2>
          <p>
            Start your year-end reconciliation process early to avoid last-minute stress. 
            Use this checklist as a guide and customize it for your specific business needs.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-blue-900 font-semibold mb-2">Simplify Year-End Reconciliation</h3>
            <p className="text-blue-800 mb-4">
              Year-end reconciliation doesn't have to be overwhelming. 
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold"> ReconcileBook</Link> 
              automates the reconciliation process and provides comprehensive reporting for year-end close.
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