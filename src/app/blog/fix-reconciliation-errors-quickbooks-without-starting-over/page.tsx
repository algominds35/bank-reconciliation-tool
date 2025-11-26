import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Fix Reconciliation Errors in QuickBooks Without Starting Over (2025 Guide)',
  description: 'Stop wasting hours re-reconciling! Learn how to fix QuickBooks reconciliation errors, discrepancies, and balance issues in minutes using smart file comparison and duplicate detection.',
  keywords: 'QuickBooks reconciliation error, fix reconciliation QuickBooks, QuickBooks opening balance wrong, undo reconciliation QuickBooks, reconciliation discrepancy QuickBooks, QuickBooks balance not matching, reconciliation beginning balance off',
  openGraph: {
    title: 'How to Fix Reconciliation Errors in QuickBooks Without Starting Over',
    description: 'Learn the smarter way to fix QuickBooks reconciliation errors without undoing months of work. Save hours with file-to-file comparison.',
    type: 'article',
  }
}

export default function BlogPost() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          How to Fix Reconciliation Errors in QuickBooks Without Starting Over
        </h1>
        <div className="flex items-center gap-4 text-slate-600 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-[#F45B49] to-[#E63946] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-medium">Alex Martinez, CPA</span>
          </div>
          <span>•</span>
          <time dateTime="2025-01-10">Updated January 2025</time>
          <span>•</span>
          <span>12 min read</span>
        </div>
        <div className="text-lg text-slate-700 leading-relaxed border-l-4 border-[#F45B49] pl-6 py-2">
          <strong>TL;DR:</strong> QuickBooks reconciliation errors don't require starting over. Use file-to-file comparison, date filtering, and smart duplicate detection to fix discrepancies in minutes—not hours.
        </div>
      </header>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none text-slate-800">
        
        {/* Introduction Story */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Friday Afternoon Nightmare</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              It's 4:47 PM on a Friday. You just spent 3 hours reconciling your biggest client's business checking account. All 247 transactions matched perfectly. Beginning balance: ✓. Ending balance: ✓. You hit "Finish Now" and start closing your laptop.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Monday morning at 9:03 AM, you open QuickBooks to print the reconciliation report for your client meeting at 10:00 AM.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4 font-semibold text-lg">
              Your stomach drops.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The reconciliation report shows a <strong className="text-red-600">$347.62 discrepancy</strong>. The beginning balance is suddenly off. Transactions you reconciled on Friday are now showing as "unreconciled." It's like your entire afternoon vanished.
            </p>
            <p className="text-slate-700 leading-relaxed font-medium">
              Sound familiar? This exact scenario happens to thousands of bookkeepers every single week. And here's the worst part: Most people waste 6-10 hours "fixing" it the wrong way.
            </p>
          </div>

          <p className="text-xl text-slate-900 font-semibold mb-4">
            But there's a smarter, faster solution that takes minutes—not days.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            In this guide, you'll learn exactly how to fix QuickBooks reconciliation errors without undoing months of work, breaking your audit trail, or losing your sanity. Let's dive in.
          </p>
        </section>

        {/* Why Errors Happen */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">Why QuickBooks Reconciliation Errors Happen (And Why They're So Frustrating)</h2>
          
          <p className="text-slate-700 leading-relaxed mb-8">
            Before we fix the problem, let's understand what causes reconciliation discrepancies in the first place. Knowing the "why" helps you prevent future errors and diagnose issues faster.
          </p>

          {/* Cause 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Deleted or Modified Transactions After Reconciliation</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>The scenario:</strong> You reconcile on January 5th. On January 12th, your client asks you to change a transaction date from December to November. You update it without thinking twice.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>The problem:</strong> That transaction was part of December's reconciliation. By changing its date, you just broke the beginning balance for January—and QuickBooks won't warn you.
            </p>
            <p className="text-slate-700 leading-relaxed">
              <strong>Why it's so frustrating:</strong> The error might not surface until weeks later. By then, you've done 3 more reconciliations, and now you're hunting through hundreds of transactions trying to figure out what changed.
            </p>
          </div>

          {/* Cause 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Duplicate Transaction Imports from Bank Feeds</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              This is the <strong>#1 cause</strong> of reconciliation headaches. Duplicates sneak in when:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>A client manually enters a transaction, then accepts the same one from the bank feed</li>
              <li>The bank feed disconnects and re-syncs, importing transactions twice</li>
              <li>You upload a CSV file, then the bank feed imports the same data</li>
              <li>Credit card transactions appear on overlapping statements (more on this below)</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              <strong>The trap:</strong> You might reconcile successfully in March, but the duplicate doesn't cause a visible discrepancy until April when it affects your beginning balance. By then, you're searching for a needle in a haystack of 300+ transactions.
            </p>
          </div>

          {/* Cause 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Missing Transactions from Broken Bank Feeds</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Bank feeds are amazing—until they're not. Here's what happens:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Your bank updates its authentication system → QuickBooks feed breaks silently</li>
              <li>Security settings get reset → Transactions stop importing</li>
              <li>The feed works intermittently → You get Monday and Wednesday transactions but miss Tuesday</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              You don't realize anything is wrong until your reconciliation doesn't balance. Then you're manually cross-referencing bank statements against QuickBooks to find the gaps.
            </p>
          </div>

          {/* Cause 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">4. Credit Card Statement Overlaps (The Silent Killer)</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Credit cards have a unique problem: <strong>transactions can appear on multiple statement periods.</strong>
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>Example:</strong> Your Amex statement closes on March 28th. But transactions that posted on March 26th-28th might also show up on your April 1st statement due to processing delays.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you're importing from multiple sources (bank feed + CSV + manual entry), you'll reconcile these transactions twice—once in March, once in April. This creates artificial duplicates that throw off your balance.
            </p>
            <p className="text-slate-700 leading-relaxed font-medium">
              <strong>Real case:</strong> A bookkeeper we work with had 23 duplicate credit card transactions spanning 3 months. She spent 7 hours finding them manually. Our tool found them in 12 seconds.
            </p>
          </div>

          {/* Cause 5 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">5. Incorrect Opening Balances and Prior Period Adjustments</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your QuickBooks opening balance should match the ending balance from your previous reconciliation. But what happens when:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Someone makes a prior period adjustment <em>after</em> you've reconciled</li>
              <li>A vendor refund from last month posts in the current month</li>
              <li>An old check from 6 months ago finally clears</li>
              <li>Your previous reconciliation had a hidden error</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              Now your opening balance is "wrong" even though your current month's transactions are perfect. You're stuck with a discrepancy you can't fix by reconciling the current period.
            </p>
          </div>
        </section>

        {/* Why Start Over Fails */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100 mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why "Undo and Start Over" Is the WORST Solution</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              When you Google "QuickBooks reconciliation discrepancy" or call QuickBooks support, you'll hear the same advice: <strong>"Undo your reconciliations and start fresh."</strong>
            </p>
            
            <p className="text-xl font-semibold text-red-700 mb-4">
              This is terrible advice. Here's why:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">⏰ The Time Trap</h3>
                <p className="text-slate-700 leading-relaxed">
                  Let's say you discover an error in June, but it started in February. You need to undo <strong>5 months of work</strong>. If each reconciliation takes 2-3 hours, you're looking at <strong>10-15 hours of re-work</strong> just to get back to where you already were.
                </p>
                <p className="text-slate-700 leading-relaxed mt-3 font-medium">
                  And here's the kicker: Undoing reconciliations <strong>doesn't fix the underlying problem.</strong> Those duplicates are still there. You'll hit the exact same errors again.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">🔍 The Audit Trail Disaster</h3>
                <p className="text-slate-700 leading-relaxed">
                  When you undo reconciliations in QuickBooks, you're not just reverting changes—<strong>you're erasing financial history.</strong> This creates serious problems:
                </p>
                <ul className="list-disc pl-6 mt-3 text-slate-700 space-y-2">
                  <li><strong>Audit compliance issues:</strong> Auditors need unbroken reconciliation history. Gaps raise red flags.</li>
                  <li><strong>Lost documentation:</strong> Reports you sent to clients won't match QuickBooks anymore.</li>
                  <li><strong>Regulatory violations:</strong> Some industries require unbroken audit trails by law.</li>
                  <li><strong>Internal control failures:</strong> You can't track who changed what and when.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">😰 The Error Multiplication Effect</h3>
                <p className="text-slate-700 leading-relaxed">
                  Re-reconciling from scratch often <strong>introduces NEW errors.</strong> Why? Because you're tired, frustrated, and rushing. You might mark the wrong transactions as cleared, miss entries, or enter incorrect ending balances.
                </p>
                <p className="text-slate-700 leading-relaxed mt-3 font-medium">
                  Now you have the original error PLUS new errors to fix. You're in deeper than when you started.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">💔 The Client Trust Problem</h3>
                <p className="text-slate-700 leading-relaxed italic">
                  "Hey client, remember those financial statements I sent last month? And the tax return we filed? Well, I had to undo all the reconciliations, so those numbers might not be accurate. We're starting over."
                </p>
                <p className="text-slate-700 leading-relaxed mt-3">
                  That's a conversation no bookkeeper wants to have. It destroys client confidence—even though the error wasn't your fault.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Smart Solution */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">The Smarter Solution: Fix Errors in Minutes, Not Days</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6 text-lg">
              Instead of starting over, modern reconciliation tools use <strong>intelligent file-to-file comparison</strong> and <strong>smart duplicate detection</strong> to identify exactly what changed—without disrupting your existing work.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">✨ File-to-File Comparison (The Game Changer)</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  By comparing your current QuickBooks data against your latest bank statements or CSV files, you can automatically identify:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li><strong>Deleted transactions</strong> that need to be restored</li>
                  <li><strong>Modified transactions</strong> that changed dates or amounts</li>
                  <li><strong>Duplicate entries</strong> causing balance discrepancies</li>
                  <li><strong>Missing transactions</strong> from broken bank feeds</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">📅 Intelligent Date Filtering</h3>
                <p className="text-slate-700 leading-relaxed">
                  Use a "last import date" filter to focus <strong>only on transactions that changed</strong> since your last successful reconciliation. No more re-examining 1,200 transactions when only 14 are the problem.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">🔍 Automatic Credit Card Overlap Detection</h3>
                <p className="text-slate-700 leading-relaxed">
                  Advanced tools can automatically detect and resolve credit card statement overlaps—the transactions that appear on both March's and April's statements. What takes you 2 hours manually takes the software 8 seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step by Step */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">5-Step Process to Fix Reconciliation Errors (Without Starting Over)</h2>
          
          <div className="space-y-6">
            <div className="bg-white border-l-4 border-[#F45B49] p-6 rounded-r-xl shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Step 1: Export Your Current QuickBooks Data</h3>
              <p className="text-slate-700 leading-relaxed">
                Go to <strong>Reports → Custom Reports → Transaction Detail</strong> and export your bank transactions for the affected account. Save this as your "baseline" file—it shows what's currently in QuickBooks.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#F45B49] p-6 rounded-r-xl shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Step 2: Upload to a File Comparison Tool</h3>
              <p className="text-slate-700 leading-relaxed">
                Upload both your QuickBooks export and your latest bank statement (CSV, OFX, or QBO format) to a reconciliation tool like ReconcileBook. The system will automatically compare the two files.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#F45B49] p-6 rounded-r-xl shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Step 3: Use Date Filtering to Narrow the Search</h3>
              <p className="text-slate-700 leading-relaxed">
                Set your "last import date" to the date of your last successful reconciliation. This filters out everything that was already reconciled correctly, so you only review <strong>new or changed transactions.</strong>
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#F45B49] p-6 rounded-r-xl shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Step 4: Review Flagged Items</h3>
              <p className="text-slate-700 leading-relaxed mb-3">
                The system will automatically flag:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong className="text-red-600">Duplicates:</strong> Same transaction imported twice</li>
                <li><strong className="text-yellow-600">Missing:</strong> In bank statement but not in QuickBooks</li>
                <li><strong className="text-blue-600">Modified:</strong> Date or amount changed after reconciliation</li>
                <li><strong className="text-purple-600">Credit card overlaps:</strong> Transactions appearing on multiple statements</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-[#F45B49] p-6 rounded-r-xl shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Step 5: Fix Only What's Broken</h3>
              <p className="text-slate-700 leading-relaxed">
                Delete duplicates, add missing transactions, and restore modified entries. Then reconcile <strong>only the corrected data</strong>—not the entire year. Your existing reconciliation history stays intact.
              </p>
            </div>
          </div>
        </section>

        {/* Case Study */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Real Case Study: From 4 Hours to 5 Minutes</h2>
            
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                <strong>The Problem:</strong> Sarah, a bookkeeper in Austin, TX, discovered her client's reconciliation was off by $0.01. Yes, <strong>one penny.</strong>
              </p>
              
              <p className="text-slate-700 leading-relaxed">
                <strong>The Old Way:</strong> She would have spent 3-4 hours manually comparing 412 transactions between QuickBooks and the bank statement, line by line, looking for that single penny difference.
              </p>
              
              <p className="text-slate-700 leading-relaxed">
                <strong>The Smart Way:</strong> She uploaded both files to ReconcileBook's file comparison tool. In <strong>12 seconds</strong>, the system flagged a duplicate transaction: A $247.83 vendor payment that was entered manually, then accepted again from the bank feed.
              </p>
              
              <p className="text-slate-700 leading-relaxed">
                The duplicate had a rounding difference of $0.01 due to how the bank feed formatted the amount. Sarah deleted the duplicate, re-reconciled, and was done in <strong>5 minutes total.</strong>
              </p>
              
              <div className="bg-white rounded-xl p-6 mt-6 border border-blue-200">
                <p className="text-2xl font-bold text-[#F45B49] mb-2">Time Saved: 3 hours 55 minutes</p>
                <p className="text-slate-600">That's $200-300 in billable time (or time she can spend on higher-value client work).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">The Bottom Line: Reconciliation Errors Are Fixable</h2>
            
            <p className="text-slate-700 leading-relaxed text-lg mb-6">
              QuickBooks reconciliation errors are frustrating, but they don't require starting over. By using intelligent file-to-file comparison, date filtering, and automated duplicate detection, you can:
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>Identify the exact cause</strong> of discrepancies in minutes</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>Fix issues without disrupting</strong> existing work</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>Preserve audit trails</strong> and maintain client trust</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>Save 6-10 hours</strong> of manual investigation time</span>
              </li>
            </ul>
            
            <p className="text-xl font-semibold text-slate-900">
              The days of spending entire weekends re-reconciling accounts are over. Modern reconciliation tools handle these challenges in seconds.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#F45B49] to-[#E63946] rounded-2xl p-10 text-white shadow-xl">
            <h2 className="text-4xl font-bold mb-6">Ready to Fix Your Reconciliation Errors in Minutes?</h2>
            
            <p className="text-xl mb-6 opacity-95 leading-relaxed">
              Stop wasting hours manually hunting for duplicates and discrepancies. ReconcileBook's intelligent file comparison tool identifies reconciliation errors automatically—so you can fix them in minutes instead of days.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4">What You Get During Trial:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span><strong>Automatic file-to-file comparison</strong> (QuickBooks vs. bank statements)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span><strong>Smart duplicate detection</strong> (catches exact matches + fuzzy duplicates)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span><strong>Credit card overlap handling</strong> (eliminates end-of-statement duplicates)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span><strong>Date filtering</strong> to isolate problem transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span><strong>Detailed audit reports</strong> showing exactly what changed</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/auth/signup"
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-[#F45B49] bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Free Trial →
              </a>
              <a 
                href="/demo"
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white border-3 border-white rounded-xl hover:bg-white hover:text-[#F45B49] transition-all duration-300"
              >
                Watch 2-Min Demo
              </a>
            </div>
            
            <p className="text-sm mt-6 opacity-80">
              💳 No credit card required • ⚡ Setup in under 2 minutes • 🔒 Bank-level security
            </p>
          </div>
        </section>

        {/* Author Bio */}
        <section className="border-t border-slate-200 pt-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#F45B49] to-[#E63946] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              A
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">About the Author</h3>
              <p className="text-slate-700 leading-relaxed mb-3">
                <strong>Alex Martinez, CPA</strong> is a QuickBooks ProAdvisor and founder of ReconcileBook, a reconciliation automation platform built specifically for bookkeepers and accountants.
              </p>
              <p className="text-slate-700 leading-relaxed">
                With over 12 years of experience helping small businesses and accounting firms streamline their financial processes, Alex has personally reconciled over 50,000 bank accounts and understands every frustrating edge case that QuickBooks throws at you.
              </p>
            </div>
          </div>
        </section>

      </div>
    </article>
  )
}

