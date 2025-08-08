import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse request body and query params
    let realmId: string | undefined
    let userId: string | undefined

    // Try to get from request body
    try {
      const body = await request.json()
      realmId = body.realmId
      userId = body.userId
    } catch {
      // If body parsing fails, continue - it's optional
    }

    // Try to get from query params if not in body
    if (!realmId || !userId) {
      const url = new URL(request.url)
      realmId = realmId || url.searchParams.get('realmId') || undefined
      userId = userId || url.searchParams.get('userId') || undefined
    }

    // Log the disconnect event
    console.log('QuickBooks disconnect webhook received:', {
      realmId,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    })

    // Always return success - never throw
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    // Log error but still return success to Intuit
    console.error('Error processing QuickBooks disconnect webhook:', error)
    return NextResponse.json({ ok: true }, { status: 200 })
  }
}

// Handle non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}