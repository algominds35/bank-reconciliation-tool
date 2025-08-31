import { NextRequest, NextResponse } from 'next/server'
import { generateExcelReport, ReportData } from '@/lib/excel-reports'

export async function POST(request: NextRequest) {
  try {
    const { clientId, startDate, endDate, reportType } = await request.json() as ReportData

    // Validate required fields
    if (!clientId || !startDate || !endDate || !reportType) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: clientId, startDate, endDate, reportType'
      }, { status: 400 })
    }

    // Validate report type
    const validReportTypes = ['balance-sheet', 'cash-flow', 'pl-statement', 'reconciliation']
    if (!validReportTypes.includes(reportType)) {
      return NextResponse.json({
        success: false,
        error: `Invalid report type. Must be one of: ${validReportTypes.join(', ')}`
      }, { status: 400 })
    }

    console.log(`📊 Generating ${reportType} report for client ${clientId} from ${startDate} to ${endDate}`)

    // Generate Excel report
    const excelBuffer = await generateExcelReport({
      clientId,
      startDate,
      endDate,
      reportType
    })

    // Create filename
    const filename = `${reportType}-${startDate}-to-${endDate}.xlsx`

    console.log(`✅ Successfully generated ${reportType} report`)

    // Return Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('❌ Excel report generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate Excel report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
