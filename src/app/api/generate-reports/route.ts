import { NextRequest, NextResponse } from 'next/server'
import { reportGenerator, defaultTemplates } from '@/lib/report-generator'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
import SendGridService from '@/lib/sendgrid'

export async function POST(request: NextRequest) {
  try {
    const { reconciliationJobs, templateId, autoDeliver } = await request.json()

    if (!reconciliationJobs || !Array.isArray(reconciliationJobs)) {
      return NextResponse.json(
        { error: 'Invalid reconciliation jobs data' },
        { status: 400 }
      )
    }

    const template = defaultTemplates.find(t => t.id === templateId) || defaultTemplates[0]

    console.log(`Generating reports for ${reconciliationJobs.length} clients using template: ${template.name}`)

    // Generate individual client reports
    const reports = await reportGenerator.generateBulkReports(reconciliationJobs, template)

    // Generate summary report
    const summaryReport = await reportGenerator.generateSummaryReport(reports)

    // Auto-deliver reports if enabled
    const deliveryResults = []
    if (autoDeliver && template.autoDeliver) {
      const sendGrid = SendGridService.getInstance()
      
      for (const report of reports) {
        try {
          const emailTemplate = reportGenerator.getEmailTemplate(report)
          
          // Get real client email from database
          const { data: clientData } = await supabase
            .from('clients')
            .select('email, name')
            .eq('id', report.clientId)
            .single()
          
          const clientEmail = clientData?.email || `${report.clientName}@company.com`
          
          await sendGrid.sendEmail({
            to: clientEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.htmlBody,
            text: emailTemplate.textBody
          })

          deliveryResults.push({
            clientId: report.clientId,
            clientName: report.clientName,
            status: 'delivered',
            email: clientEmail
          })
          
        } catch (error) {
          console.error(`Failed to deliver report to ${report.clientName}:`, error)
          deliveryResults.push({
            clientId: report.clientId,
            clientName: report.clientName,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      // Send summary report to bookkeeper
      try {
        const summaryHTML = reportGenerator.formatSummaryReportAsHTML(summaryReport)
        await sendGrid.sendEmail({
          to: 'jimmie@j2bookkeeping.com', // Jimmie gets summary reports
          subject: `📊 Bulk Reconciliation Complete - ${summaryReport.totalClients} Clients Processed`,
          html: summaryHTML,
          text: `Bulk reconciliation completed for ${summaryReport.totalClients} clients. Overall accuracy: ${summaryReport.overallAccuracy.toFixed(1)}%`
        })

        deliveryResults.push({
          clientId: 'bookkeeper-summary',
          clientName: 'Bookkeeper Summary',
          status: 'delivered',
          email: 'alex@usealgomind.com'
        })
      } catch (error) {
        console.error('Failed to deliver summary report:', error)
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        reports,
        summaryReport,
        template: template.name,
        deliveryResults: autoDeliver ? deliveryResults : null,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Report generation API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate reports',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve available templates
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      templates: defaultTemplates
    })
  } catch (error) {
    console.error('Templates API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve templates'
      },
      { status: 500 }
    )
  }
}
