import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const clientId = url.searchParams.get('id')
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID required' },
        { status: 400 }
      )
    }

    // Delete the client
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)

    if (error) {
      console.error('Delete client error:', error)
      return NextResponse.json(
        { error: 'Failed to delete client' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully'
    })

  } catch (error) {
    console.error('Delete client API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete client',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
