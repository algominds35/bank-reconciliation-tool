import { NextRequest, NextResponse } from 'next/server'
import { bulkReconciliationEngine } from '@/lib/bulk-reconciliation'
import { Transaction } from '@/lib/pdf-processor'

export async function POST(request: NextRequest) {
  try {
    const { clientJobs } = await request.json()

    if (!clientJobs || !Array.isArray(clientJobs)) {
      return NextResponse.json(
        { error: 'Invalid client jobs data' },
        { status: 400 }
      )
    }

    console.log(`Processing bulk reconciliation for ${clientJobs.length} clients`)

    // For demo purposes, generate mock book transactions
    const jobsWithMockData = clientJobs.map(job => ({
      ...job,
      bookTransactions: bulkReconciliationEngine.generateMockBookTransactions(job.bankTransactions || [])
    }))

    // Process bulk reconciliation
    const result = await bulkReconciliationEngine.processBulkReconciliation(jobsWithMockData)

    return NextResponse.json({
      success: true,
      result
    })

  } catch (error) {
    console.error('Bulk reconciliation API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process bulk reconciliation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve reconciliation status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const jobId = url.searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID required' },
        { status: 400 }
      )
    }

    // In a real app, this would query the database
    // For now, return mock status
    const mockStatus = {
      jobId,
      status: 'completed',
      progress: 100,
      matches: 45,
      unmatched: 3,
      processingTime: 2300
    }

    return NextResponse.json({
      success: true,
      status: mockStatus
    })

  } catch (error) {
    console.error('Bulk reconciliation status API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve reconciliation status'
      },
      { status: 500 }
    )
  }
}
