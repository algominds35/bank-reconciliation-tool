import { NextRequest, NextResponse } from 'next/server'
import { pdfProcessor } from '@/lib/pdf-processor'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      )
    }
    
    console.log(`Processing PDF: ${file.name} for client: ${clientId}`)
    
    // Process the PDF
    const result = await pdfProcessor.processPDF(file)
    
    // Log results for debugging
    console.log(`Extracted ${result.transactions.length} transactions from ${file.name}`)
    
    return NextResponse.json({
      success: true,
      result: {
        fileName: result.fileName,
        bankName: result.bankName,
        accountNumber: result.accountNumber,
        statementPeriod: result.statementPeriod,
        transactions: result.transactions,
        totalTransactions: result.totalTransactions,
        errors: result.errors,
        clientId
      }
    })
    
  } catch (error) {
    console.error('PDF processing API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
