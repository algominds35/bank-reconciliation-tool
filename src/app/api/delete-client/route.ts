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
      console.error('❌ No client ID provided')
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      )
    }

    console.log(`🗑️ Attempting to delete client with ID: ${clientId}`)

    // First check if client exists
    const { data: existingClient, error: fetchError } = await supabase
      .from('clients')
      .select('id, name')
      .eq('id', clientId)
      .single()

    if (fetchError) {
      console.error('❌ Client not found:', fetchError)
      return NextResponse.json(
        { error: 'Client not found', details: fetchError.message },
        { status: 404 }
      )
    }

    console.log(`📋 Found client to delete: ${existingClient.name}`)

    // First delete any related invoices to avoid foreign key constraint
    const { error: invoiceDeleteError } = await supabase
      .from('invoices')
      .delete()
      .eq('client_id', clientId)

    if (invoiceDeleteError) {
      console.log('⚠️ No invoices to delete or error deleting invoices:', invoiceDeleteError.message)
    } else {
      console.log('🗑️ Deleted related invoices for client')
    }

    // Now delete the client from the database
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)

    if (deleteError) {
      console.error('❌ Supabase delete error:', deleteError)
      
      // Handle foreign key constraint error specifically
      if (deleteError.code === '23503') {
        return NextResponse.json(
          { 
            error: 'Cannot delete client - has related records', 
            details: 'This client has related invoices or other records. Delete those first.' 
          },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to delete client', details: deleteError.message },
        { status: 500 }
      )
    }

    console.log(`✅ Successfully deleted client: ${existingClient.name} (${clientId})`)

    return NextResponse.json({
      success: true,
      message: `Client '${existingClient.name}' deleted successfully`,
      deletedClient: existingClient
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