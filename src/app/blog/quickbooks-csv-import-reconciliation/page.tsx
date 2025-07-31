import Link from 'next/link';

export default function QuickBooksCSVImportReconciliation() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-6">
          QuickBooks CSV Import Reconciliation: Complete Guide (2024)
        </h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-blue-800">
            <strong>Bank Feed Issues?</strong> CSV import is often more reliable than bank feeds. 
            Here's the complete guide to importing and reconciling CSV files in QuickBooks.
          </p>
        </div>

        <p className="text-lg mb-6">
          When QuickBooks bank feeds fail or your bank isn't supported, CSV import becomes your best option. 
          While it requires more manual work, it gives you complete control over your reconciliation process. 
          This guide will show you how to import and reconcile CSV files effectively.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Why Use CSV Import Instead of Bank Feeds</h2>
        
        <p className="mb-4">
          CSV import has several advantages over bank feeds:
        </p>

        <ul className="list-disc pl-6 mb-6">
          <li><strong>Reliability:</strong> Works with any bank that provides CSV exports</li>
          <li><strong>Control:</strong> You decide exactly what gets imported</li>
          <li><strong>No Authentication Issues:</strong> No bank connection problems</li>
          <li><strong>Data Quality:</strong> You can clean and format data before import</li>
          <li><strong>Consistency:</strong> Same process regardless of bank</li>
          <li><strong>Backup:</strong> You always have a copy of your data</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Step-by-Step CSV Import Process</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">Step 1: Export Bank Data</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li>Log into your bank's online banking</li>
          <li>Navigate to "Download" or "Export" section</li>
          <li>Select CSV format (not Excel)</li>
          <li>Choose your date range (monthly is recommended)</li>
          <li>Download the file to your computer</li>
          <li>Note the file location for easy access</li>
        </ol>

        <h3 className="text-xl font-bold mt-6 mb-3">Step 2: Prepare Your CSV File</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li>Open the CSV file in Excel or Google Sheets</li>
          <li>Check the column headers and data format</li>
          <li>Ensure dates are in MM/DD/YYYY format</li>
          <li>Verify amounts are properly formatted (no currency symbols)</li>
          <li>Remove any header/footer rows that aren't data</li>
          <li>Save as CSV format</li>
        </ol>

        <h3 className="text-xl font-bold mt-6 mb-3">Step 3: Import into QuickBooks</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li>Open QuickBooks and go to Banking → Bank Feeds</li>
          <li>Click "Import" or "Upload"</li>
          <li>Select your CSV file</li>
          <li>Map the columns to QuickBooks fields</li>
          <li>Review the import preview</li>
          <li>Complete the import</li>
        </ol>

        <h2 className="text-2xl font-bold mt-8 mb-4">Column Mapping Guide</h2>

        <p className="mb-4">
          Proper column mapping is crucial for successful reconciliation:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Bank Column</th>
                <th className="border border-gray-300 px-4 py-2 text-left">QuickBooks Field</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Required</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Date</td>
                <td className="border border-gray-300 px-4 py-2">Transaction Date</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">MM/DD/YYYY format</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Description</td>
                <td className="border border-gray-300 px-4 py-2">Memo/Description</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">For matching</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Amount</td>
                <td className="border border-gray-300 px-4 py-2">Amount</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">No currency symbols</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Reference</td>
                <td className="border border-gray-300 px-4 py-2">Check Number</td>
                <td className="border border-gray-300 px-4 py-2">❌ No</td>
                <td className="border border-gray-300 px-4 py-2">Helpful for matching</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Common CSV Import Problems and Solutions</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">Problem 1: Date Format Issues</h3>
        <p className="mb-4">
          <strong>Issue:</strong> QuickBooks doesn't recognize the date format
        </p>
        <p className="mb-4">
          <strong>Solution:</strong> Convert dates to MM/DD/YYYY format in Excel before importing
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Problem 2: Amount Formatting</h3>
        <p className="mb-4">
          <strong>Issue:</strong> Currency symbols or commas in amounts
        </p>
        <p className="mb-4">
          <strong>Solution:</strong> Remove currency symbols and ensure amounts are numeric only
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Problem 3: Duplicate Transactions</h3>
        <p className="mb-4">
          <strong>Issue:</strong> Importing the same data multiple times
        </p>
        <p className="mb-4">
          <strong>Solution:</strong> Check for existing transactions before importing
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Problem 4: Column Mapping Errors</h3>
        <p className="mb-4">
          <strong>Issue:</strong> Data appears in wrong fields
        </p>
        <p className="mb-4">
          <strong>Solution:</strong> Carefully map each column during import
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Reconciling Imported CSV Data</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">Step 1: Review Imported Transactions</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li>Go to Banking → Bank Feeds → Bank Feeds Center</li>
          <li>Review all imported transactions</li>
          <li>Check for any import errors or duplicates</li>
          <li>Verify amounts and dates are correct</li>
          <li>Note any transactions that need manual categorization</li>
        </ol>

        <h3 className="text-xl font-bold mt-6 mb-3">Step 2: Categorize Transactions</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li>Select each uncategorized transaction</li>
          <li>Assign appropriate account/category</li>
          <li>Add vendor information if applicable</li>
          <li>Use consistent naming for recurring transactions</li>
          <li>Save changes</li>
        </ol>

        <h3 className="text-xl font-bold mt-6 mb-3">Step 3: Match with QuickBooks Transactions</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li>Look for matching transactions in your QuickBooks register</li>
          <li>Use the "Match" function for exact matches</li>
          <li>Manually match transactions with slight differences</li>
          <li>Create new transactions for unmatched items</li>
          <li>Reconcile any differences</li>
        </ol>

        <h2 className="text-2xl font-bold mt-8 mb-4">Best Practices for CSV Import</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">Data Preparation</h3>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Clean Data:</strong> Remove any non-transaction rows</li>
          <li><strong>Consistent Format:</strong> Use the same format every time</li>
          <li><strong>Date Ranges:</strong> Import monthly or weekly, not daily</li>
          <li><strong>Backup:</strong> Keep original CSV files for reference</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">Import Process</h3>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Test First:</strong> Import a small sample before full import</li>
          <li><strong>Review Mapping:</strong> Double-check column mapping</li>
          <li><strong>Preview Data:</strong> Always review the import preview</li>
          <li><strong>Document Process:</strong> Keep notes of your import process</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Automating CSV Import and Reconciliation</h2>

        <p className="mb-6">
          Manual CSV import and reconciliation can be time-consuming. Many users switch to 
          automated tools that handle the entire process.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">The Smart Alternative</h3>
          <p className="text-yellow-700">
            Modern reconciliation tools can automatically import CSV files, match transactions 
            with confidence scoring, and export the results back to QuickBooks, saving hours 
            of manual work.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">CSV Import vs. Bank Feeds Comparison</h2>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CSV Import</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Bank Feeds</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Reliability</td>
                <td className="border border-gray-300 px-4 py-2">✅ High</td>
                <td className="border border-gray-300 px-4 py-2">⚠️ Variable</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Control</td>
                <td className="border border-gray-300 px-4 py-2">✅ Full</td>
                <td className="border border-gray-300 px-4 py-2">❌ Limited</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Time Required</td>
                <td className="border border-gray-300 px-4 py-2">⚠️ Manual</td>
                <td className="border border-gray-300 px-4 py-2">✅ Automatic</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Data Quality</td>
                <td className="border border-gray-300 px-4 py-2">✅ Controllable</td>
                <td className="border border-gray-300 px-4 py-2">⚠️ Variable</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Bottom Line</h2>

        <p className="mb-6">
          CSV import is a reliable alternative to bank feeds when they fail or aren't available. 
          While it requires more manual work, it gives you complete control over your data.
        </p>

        <p className="mb-6">
          If you're spending too much time on manual CSV import and reconciliation, consider 
          an automated tool that handles the entire process for you.
        </p>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <h3 className="text-lg font-bold text-green-800 mb-2">Ready to Automate CSV Import?</h3>
          <p className="text-green-700 mb-4">
            Our smart reconciliation tool automatically imports CSV files, matches transactions 
            with confidence scoring, and exports results back to QuickBooks.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Try Automated CSV Import
          </Link>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">How often should I import CSV files?</h3>
        <p className="mb-4">
          Monthly imports are recommended for most businesses. Weekly imports work well for 
          high-volume businesses, but daily imports are usually unnecessary.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">What if my bank doesn't provide CSV exports?</h3>
        <p className="mb-4">
          Most banks provide some form of export. Look for "Download," "Export," or "Statement" 
          options. If not available, contact your bank directly.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Can I automate CSV import?</h3>
        <p className="mb-4">
          Yes, there are tools that can automatically download CSV files from your bank and 
          import them into QuickBooks, eliminating the manual process entirely.
        </p>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Need More Help?</h3>
          <p className="mb-4">
            If you're struggling with CSV import or want to automate the process, our team 
            can help you find the right solution.
          </p>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Visit Homepage →
          </Link>
        </div>
      </article>
    </div>
  );
} 