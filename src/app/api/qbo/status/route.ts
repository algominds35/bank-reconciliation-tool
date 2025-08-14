import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    console.log('QBO status check started - using simple auth approach')
    
    // Get the authorization header from the request
    const authHeader = req.headers.get('authorization')
    console.log('Auth header present:', !!authHeader)
    
    // For now, let's just return a basic response to test if the route works
    // We'll implement proper auth once we confirm the basic structure works
    
    return NextResponse.json({
      message: 'Route is working - auth to be implemented',
      timestamp: new Date().toISOString(),
      hasAuthHeader: !!authHeader
    })
    
  } catch (error) {
    console.error('QBO status check error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 