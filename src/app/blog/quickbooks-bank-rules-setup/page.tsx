import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, User, Tag } from 'lucide-react'

export default function QuickBooksBankRulesSetup() {
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
            <Badge variant="secondary">QuickBooks</Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">
            QuickBooks Bank Rules: How to Set Them Up Right
          </h1>
          <div className="flex items-center space-x-6 mt-4 text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Alex</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>10 min read</span>
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
            QuickBooks bank rules can save you hours every month by automatically categorizing transactions. 
            But setting them up correctly is crucial for accurate reconciliation. Here's your complete guide.
          </p>

          <h2>What Are QuickBooks Bank Rules?</h2>
          <p>
            Bank rules in QuickBooks are automated instructions that tell the software how to categorize 
            transactions when they're imported from your bank. Think of them as smart filters that recognize 
            patterns in your transaction data and apply the appropriate category, payee, or account.
          </p>

          <h2>Why Bank Rules Matter for Reconciliation</h2>
          <p>
            Properly configured bank rules are essential for:
          </p>
          <ul>
            <li><strong>Time savings:</strong> Automatic categorization reduces manual work</li>
            <li><strong>Accuracy:</strong> Consistent categorization prevents reconciliation errors</li>
            <li><strong>Efficiency:</strong> Faster bank feeds processing</li>
            <li><strong>Error reduction:</strong> Fewer manual categorization mistakes</li>
          </ul>

          <h2>Step-by-Step Bank Rules Setup</h2>

          <h3>Step 1: Access Bank Rules</h3>
          <ol>
            <li>Go to <strong>Banking</strong> → <strong>Bank Feeds</strong></li>
            <li>Click on <strong>Rules</strong> in the top menu</li>
            <li>Select <strong>Create Rule</strong></li>
          </ol>

          <h3>Step 2: Define Your Rule Criteria</h3>
          <p>
            Choose what triggers your rule:
          </p>
          <ul>
            <li><strong>Text in description:</strong> Contains, starts with, ends with</li>
            <li><strong>Amount:</strong> Exact amount, greater than, less than</li>
            <li><strong>Bank account:</strong> Specific account</li>
            <li><strong>Date range:</strong> Specific dates or recurring patterns</li>
          </ul>

          <h3>Step 3: Set the Action</h3>
          <p>
            Define what happens when the rule matches:
          </p>
          <ul>
            <li><strong>Assign to account:</strong> Choose the correct chart of accounts</li>
            <li><strong>Assign to payee:</strong> Set the vendor or customer</li>
            <li><strong>Add memo:</strong> Include additional notes</li>
            <li><strong>Auto-add to register:</strong> Automatically accept the transaction</li>
          </ul>

          <h2>Common Bank Rules Examples</h2>

          <h3>Example 1: Office Supplies</h3>
          <p>
            <strong>Criteria:</strong> Description contains "Staples" or "Office Depot"<br/>
            <strong>Action:</strong> Assign to "Office Supplies" account, Payee: "Staples"
          </p>

          <h3>Example 2: Gas Station Purchases</h3>
          <p>
            <strong>Criteria:</strong> Description contains "Shell" or "Exxon"<br/>
            <strong>Action:</strong> Assign to "Vehicle Expenses" account, Payee: "Gas Station"
          </p>

          <h3>Example 3: Recurring Subscriptions</h3>
          <p>
            <strong>Criteria:</strong> Description contains "Netflix" or "Spotify"<br/>
            <strong>Action:</strong> Assign to "Software Subscriptions" account
          </p>

          <h2>Advanced Bank Rules Strategies</h2>

          <h3>1. Use Multiple Criteria</h3>
          <p>
            Combine text and amount criteria for more precise rules:
          </p>
          <ul>
            <li>Text contains "Amazon" AND amount greater than $100 → "Equipment Purchases"</li>
            <li>Text contains "Amazon" AND amount less than $50 → "Office Supplies"</li>
          </ul>

          <h3>2. Prioritize Your Rules</h3>
          <p>
            QuickBooks processes rules in order. Put your most specific rules first:
          </p>
          <ol>
            <li>Exact vendor names (e.g., "Staples Business Advantage")</li>
            <li>Partial vendor names (e.g., "Staples")</li>
            <li>General categories (e.g., "Office Supplies")</li>
          </ol>

          <h3>3. Regular Rule Maintenance</h3>
          <p>
            Review and update your rules monthly:
          </p>
          <ul>
            <li>Check for new vendors that need rules</li>
            <li>Remove rules for vendors you no longer use</li>
            <li>Update categories based on business changes</li>
          </ul>

          <h2>Common Bank Rules Mistakes</h2>

          <h3>1. Too Broad Rules</h3>
          <p>
            <strong>Problem:</strong> Rule catches unintended transactions<br/>
            <strong>Solution:</strong> Use more specific criteria or multiple conditions
          </p>

          <h3>2. Conflicting Rules</h3>
          <p>
            <strong>Problem:</strong> Multiple rules match the same transaction<br/>
            <strong>Solution:</strong> Prioritize rules and use "Stop processing rules" option
          </p>

          <h3>3. Not Testing Rules</h3>
          <p>
            <strong>Problem:</strong> Rules don't work as expected<br/>
            <strong>Solution:</strong> Test with sample transactions before applying broadly
          </p>

          <h2>Testing Your Bank Rules</h2>
          <ol>
            <li>Create a test rule with a unique identifier</li>
            <li>Import a small batch of transactions</li>
            <li>Verify the rule applied correctly</li>
            <li>Adjust criteria if needed</li>
            <li>Apply to larger batches once confirmed</li>
          </ol>

          <h2>Bank Rules vs. Manual Categorization</h2>
          <p>
            While bank rules save time, they're not perfect. Consider using a hybrid approach:
          </p>
          <ul>
            <li><strong>Use rules for:</strong> Regular vendors, recurring expenses, clear patterns</li>
            <li><strong>Manual review for:</strong> Large transactions, new vendors, unusual amounts</li>
          </ul>

          <h2>Integration with ReconcileBook</h2>
          <p>
            While QuickBooks bank rules help with categorization, they don't solve all reconciliation challenges. 
            <Link href="/" className="text-blue-600 hover:text-blue-800">ReconcileBook</Link> complements your 
            QuickBooks setup by providing advanced matching algorithms and detailed reconciliation reports.
          </p>

          <h2>Best Practices Summary</h2>
          <ul>
            <li>Start with your most frequent vendors</li>
            <li>Use specific criteria rather than broad ones</li>
            <li>Test rules before applying broadly</li>
            <li>Review and update rules regularly</li>
            <li>Combine with manual review for accuracy</li>
            <li>Document your rule logic for team members</li>
          </ul>

          <h2>Getting Started</h2>
          <p>
            Ready to streamline your QuickBooks bank rules setup? Start with your top 5 vendors and build 
            from there. Remember, the goal is to save time while maintaining accuracy.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-blue-900 font-semibold mb-2">Need Help with Reconciliation?</h3>
            <p className="text-blue-800 mb-4">
              Even with perfect bank rules, reconciliation can still be time-consuming. 
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold"> ReconcileBook</Link> 
              helps you match transactions 10x faster with smart automation.
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