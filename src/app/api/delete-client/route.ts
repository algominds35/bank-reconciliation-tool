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
        { error: 'Client ID is required' },
        { status: 400 }
      )
    }

    console.log(`🗑️ Deleting client with ID: ${clientId}`)

    // Delete the client from the database
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)

    if (error) {
      console.error('❌ Supabase delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete client', details: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Successfully deleted client: ${clientId}`)

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully'
    })

  } catch (error) {
    console.error('❌ Delete client API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete client',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}