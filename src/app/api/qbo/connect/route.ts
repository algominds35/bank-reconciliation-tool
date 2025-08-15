import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getQboAuthUrl } from '@/lib/qbo'

export async function GET(req: NextRequest) {
  try {
    console.log('QBO connect - ENTERPRISE VERSION')
    
    // Validate environment variables
    if (!process.env.QBO_CLIENT_ID || !process.env.QBO_REDIRECT_URI) {
      console.error('Missing required environment variables')
      return NextResponse.redirect(new URL('/settings/qbo?error=missing_config', req.url))
    }
    
    // Create OAuth URL using the proper function
    const state = randomUUID()
    const authUrl = getQboAuthUrl(state)
    
    console.log('🔍 Generated OAuth URL:', authUrl)
    console.log('🔍 Client ID:', process.env.QBO_CLIENT_ID)
    console.log('🔍 Redirect URI:', process.env.QBO_REDIRECT_URI)
    
    const res = NextResponse.redirect(authUrl)
    res.cookies.set('qbo_oauth_state', state, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'lax', 
      maxAge: 600 
    })
    
    return res
    
  } catch (error) {
    console.error('QBO connect error:', error)
    return NextResponse.redirect(new URL('/settings/qbo?error=connect_failed', req.url))
  }
}