import { NextRequest, NextResponse } from 'next/server'

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
    
    console.log(`Received PDF: ${file.name} for client: ${clientId}`)
    
    // For now, return mock data - will implement server-side processing later
    const mockTransactions = Math.floor(Math.random() * 50) + 10
    const bankNames = ['Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank', 'US Bank']
    const mockBankName = bankNames[Math.floor(Math.random() * bankNames.length)]
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({
      success: true,
      result: {
        fileName: file.name,
        bankName: mockBankName,
        accountNumber: '****' + Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
        statementPeriod: 'January 1 - January 31, 2025',
        transactions: [],
        totalTransactions: mockTransactions,
        errors: [],
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
