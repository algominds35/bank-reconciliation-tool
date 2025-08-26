import { ReconciliationJob, ReconciliationMatch } from './bulk-reconciliation'

export interface ReportData {
  clientId: string
  clientName: string
  reportPeriod: string
  generatedAt: string
  summary: {
    totalTransactions: number
    matchedTransactions: number
    unmatchedTransactions: number
    matchAccuracy: number
    totalAmount: number
    netAmount: number
  }
  matches: ReconciliationMatch[]
  unmatchedBank: any[]
  unmatchedBook: any[]
  recommendations: string[]
}

export interface ReportTemplate {
  id: string
  name: string
  type: 'summary' | 'detailed' | 'exception'
  format: 'pdf' | 'excel' | 'csv'
  includeCharts: boolean
  autoDeliver: boolean
  deliverySchedule?: 'daily' | 'weekly' | 'monthly'
}

class ReportGenerator {
  
  async generateReport(job: ReconciliationJob, template: ReportTemplate): Promise<ReportData> {
    console.log(`Generating ${template.type} report for ${job.clientName}`)

    const matchedTransactions = job.matches.filter(m => m.matchType !== 'unmatched')
    const totalAmount = job.bankTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const netAmount = job.bankTransactions.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0)

    const reportData: ReportData = {
      clientId: job.clientId,
      clientName: job.clientName,
      reportPeriod: this.getReportPeriod(),
      generatedAt: new Date().toISOString(),
      summary: {
        totalTransactions: job.bankTransactions.length,
        matchedTransactions: matchedTransactions.length,
        unmatchedTransactions: job.unmatchedBank.length + job.unmatchedBook.length,
        matchAccuracy: job.bankTransactions.length > 0 ? (matchedTransactions.length / job.bankTransactions.length) * 100 : 0,
        totalAmount,
        netAmount
      },
      matches: job.matches,
      unmatchedBank: job.unmatchedBank,
      unmatchedBook: job.unmatchedBook,
      recommendations: this.generateRecommendations(job)
    }

    return reportData
  }

  async generateBulkReports(jobs: ReconciliationJob[], template: ReportTemplate): Promise<ReportData[]> {
    console.log(`Generating bulk reports for ${jobs.length} clients`)

    const reports: ReportData[] = []
    
    for (const job of jobs) {
      if (job.status === 'completed') {
        const report = await this.generateReport(job, template)
        reports.push(report)
      }
    }

    return reports
  }

  generateRecommendations(job: ReconciliationJob): string[] {
    const recommendations: string[] = []
    
    // Accuracy-based recommendations
    const matchedCount = job.matches.filter(m => m.matchType !== 'unmatched').length
    const accuracy = job.bankTransactions.length > 0 ? (matchedCount / job.bankTransactions.length) * 100 : 0
    
    if (accuracy < 80) {
      recommendations.push('Consider reviewing transaction descriptions for better matching accuracy')
    }
    
    if (job.unmatchedBank.length > 10) {
      recommendations.push(`${job.unmatchedBank.length} bank transactions need manual review`)
    }
    
    if (job.unmatchedBook.length > 5) {
      recommendations.push(`${job.unmatchedBook.length} book entries may need adjustment`)
    }

    // Pattern-based recommendations
    const lowConfidenceMatches = job.matches.filter(m => m.confidence < 0.7).length
    if (lowConfidenceMatches > 0) {
      recommendations.push(`${lowConfidenceMatches} matches have low confidence - please review`)
    }

    // Amount discrepancy recommendations
    const significantDifferences = job.matches.filter(m => m.difference && m.difference > 1).length
    if (significantDifferences > 0) {
      recommendations.push(`${significantDifferences} matches have amount differences > $1`)
    }

    if (recommendations.length === 0) {
      recommendations.push('Reconciliation looks good! All transactions matched successfully.')
    }

    return recommendations
  }

  async generateSummaryReport(reports: ReportData[]): Promise<{
    totalClients: number
    totalTransactions: number
    overallAccuracy: number
    totalAmount: number
    clientSummaries: Array<{
      clientName: string
      status: 'excellent' | 'good' | 'needs_attention'
      accuracy: number
      unmatchedCount: number
    }>
    topIssues: string[]
  }> {
    const totalTransactions = reports.reduce((sum, r) => sum + r.summary.totalTransactions, 0)
    const totalMatched = reports.reduce((sum, r) => sum + r.summary.matchedTransactions, 0)
    const totalAmount = reports.reduce((sum, r) => sum + r.summary.totalAmount, 0)

    const clientSummaries = reports.map(report => ({
      clientName: report.clientName,
      status: report.summary.matchAccuracy >= 95 ? 'excellent' as const :
              report.summary.matchAccuracy >= 85 ? 'good' as const : 
              'needs_attention' as const,
      accuracy: report.summary.matchAccuracy,
      unmatchedCount: report.summary.unmatchedTransactions
    }))

    // Collect most common issues
    const allRecommendations = reports.flatMap(r => r.recommendations)
    const issueCount = allRecommendations.reduce((acc, rec) => {
      acc[rec] = (acc[rec] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topIssues = Object.entries(issueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue)

    return {
      totalClients: reports.length,
      totalTransactions,
      overallAccuracy: totalTransactions > 0 ? (totalMatched / totalTransactions) * 100 : 0,
      totalAmount,
      clientSummaries,
      topIssues
    }
  }

  formatReportAsHTML(report: ReportData): string {
    const { summary, clientName, reportPeriod, generatedAt, recommendations } = report

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Reconciliation Report - ${clientName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
        .stat-value { font-size: 2em; font-weight: bold; color: #2563eb; }
        .stat-label { color: #6b7280; font-size: 0.9em; }
        .recommendations { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; }
        .excellent { color: #059669; }
        .good { color: #2563eb; }
        .attention { color: #dc2626; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background-color: #f9fafb; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Bank Reconciliation Report</h1>
        <h2>${clientName}</h2>
        <p><strong>Period:</strong> ${reportPeriod}</p>
        <p><strong>Generated:</strong> ${new Date(generatedAt).toLocaleString()}</p>
    </div>

    <div class="summary">
        <div class="stat-card">
            <div class="stat-value">${summary.totalTransactions}</div>
            <div class="stat-label">Total Transactions</div>
        </div>
        <div class="stat-card">
            <div class="stat-value ${summary.matchAccuracy >= 95 ? 'excellent' : summary.matchAccuracy >= 85 ? 'good' : 'attention'}">
                ${summary.matchAccuracy.toFixed(1)}%
            </div>
            <div class="stat-label">Match Accuracy</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">$${summary.totalAmount.toLocaleString()}</div>
            <div class="stat-label">Total Amount</div>
        </div>
        <div class="stat-card">
            <div class="stat-value ${summary.unmatchedTransactions === 0 ? 'excellent' : summary.unmatchedTransactions <= 5 ? 'good' : 'attention'}">
                ${summary.unmatchedTransactions}
            </div>
            <div class="stat-label">Need Review</div>
        </div>
    </div>

    <div class="recommendations">
        <h3>📋 Recommendations</h3>
        <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>

    <h3>📊 Transaction Details</h3>
    <p><strong>Matched:</strong> ${summary.matchedTransactions} transactions</p>
    <p><strong>Unmatched Bank:</strong> ${report.unmatchedBank.length} transactions</p>
    <p><strong>Unmatched Book:</strong> ${report.unmatchedBook.length} entries</p>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 0.9em;">
        <p>Generated by ReconcileBook Pro - AI-Powered Bank Reconciliation</p>
        <p>Questions? Contact your bookkeeper or visit reconcilebook.com</p>
    </div>
</body>
</html>
    `
  }

  formatSummaryReportAsHTML(summary: Awaited<ReturnType<ReportGenerator['generateSummaryReport']>>): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Bulk Reconciliation Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
        .stat-value { font-size: 2em; font-weight: bold; color: #2563eb; }
        .stat-label { color: #6b7280; font-size: 0.9em; }
        .client-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .client-card { background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
        .excellent { border-left: 4px solid #059669; }
        .good { border-left: 4px solid #2563eb; }
        .needs_attention { border-left: 4px solid #dc2626; }
        .issues { background: #fef3c7; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Bulk Reconciliation Summary</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>

    <div class="summary">
        <div class="stat-card">
            <div class="stat-value">${summary.totalClients}</div>
            <div class="stat-label">Clients Processed</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${summary.totalTransactions}</div>
            <div class="stat-label">Total Transactions</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${summary.overallAccuracy.toFixed(1)}%</div>
            <div class="stat-label">Overall Accuracy</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">$${summary.totalAmount.toLocaleString()}</div>
            <div class="stat-label">Total Amount</div>
        </div>
    </div>

    <h3>📈 Client Performance</h3>
    <div class="client-grid">
        ${summary.clientSummaries.map(client => `
            <div class="client-card ${client.status}">
                <h4>${client.clientName}</h4>
                <p><strong>Accuracy:</strong> ${client.accuracy.toFixed(1)}%</p>
                <p><strong>Status:</strong> ${client.status.replace('_', ' ').toUpperCase()}</p>
                ${client.unmatchedCount > 0 ? `<p><strong>Need Review:</strong> ${client.unmatchedCount}</p>` : ''}
            </div>
        `).join('')}
    </div>

    ${summary.topIssues.length > 0 ? `
    <div class="issues">
        <h3>⚠️ Common Issues</h3>
        <ul>
            ${summary.topIssues.map(issue => `<li>${issue}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 0.9em;">
        <p>Generated by ReconcileBook Pro - Multi-Client Dashboard</p>
        <p>Saving bookkeepers 240+ hours per month with AI-powered reconciliation</p>
    </div>
</body>
</html>
    `
  }

  private getReportPeriod(): string {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }

  // Email delivery templates
  getEmailTemplate(report: ReportData): {
    subject: string
    htmlBody: string
    textBody: string
  } {
    const status = report.summary.matchAccuracy >= 95 ? '✅ Excellent' :
                   report.summary.matchAccuracy >= 85 ? '✔️ Good' : '⚠️ Needs Review'

    return {
      subject: `${status} - Reconciliation Complete for ${report.clientName}`,
      htmlBody: this.formatReportAsHTML(report),
      textBody: `
Reconciliation Report - ${report.clientName}
Period: ${report.reportPeriod}
Generated: ${new Date(report.generatedAt).toLocaleString()}

SUMMARY:
- Total Transactions: ${report.summary.totalTransactions}
- Match Accuracy: ${report.summary.matchAccuracy.toFixed(1)}%
- Total Amount: $${report.summary.totalAmount.toLocaleString()}
- Need Review: ${report.summary.unmatchedTransactions}

RECOMMENDATIONS:
${report.recommendations.map(rec => `• ${rec}`).join('\n')}

Generated by ReconcileBook Pro
      `
    }
  }
}

export const reportGenerator = new ReportGenerator()

export const defaultTemplates: ReportTemplate[] = [
  {
    id: 'summary',
    name: 'Summary Report',
    type: 'summary',
    format: 'pdf',
    includeCharts: true,
    autoDeliver: true,
    deliverySchedule: 'daily'
  },
  {
    id: 'detailed',
    name: 'Detailed Report',
    type: 'detailed',
    format: 'excel',
    includeCharts: false,
    autoDeliver: false
  },
  {
    id: 'exceptions',
    name: 'Exception Report',
    type: 'exception',
    format: 'csv',
    includeCharts: false,
    autoDeliver: true,
    deliverySchedule: 'daily'
  }
]
