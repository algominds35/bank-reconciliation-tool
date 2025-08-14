import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getQboAuthUrl } from '@/lib/qbo'

export async function GET(req: NextRequest) {
  try {
    console.log('QBO connect route - simplified approach')
    
    // For now, let's just generate the OAuth URL without authentication
    // We'll add auth back once we confirm the basic flow works
    
    const state: string = randomUUID()
    const url = getQboAuthUrl(state)
    
    console.log('Generated OAuth URL:', url)
    
    const res = NextResponse.redirect(url)
    res.cookies.set('qbo_oauth_state', state, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'lax', 
      maxAge: 600 
    })
    
    return res
    
  } catch (error) {
    console.error('QBO connect route error:', error)
    return NextResponse.redirect(new URL('/settings/qbo?error=connect_failed', req.url))
  }
}