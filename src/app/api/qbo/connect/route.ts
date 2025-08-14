import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function GET(req: NextRequest) {
  try {
    console.log('QBO connect - WORKING VERSION')
    
    // Create a simple OAuth URL that will work
    const state = randomUUID()
    const clientId = process.env.QBO_CLIENT_ID || 'ABAfMz4qhZ8Z0mJaitl'
    const redirectUri = process.env.QBO_REDIRECT_URI || 'https://www.reconcilebook.com/api/qbo/callback'
    
    const url = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
    
    console.log('Redirecting to:', url)
    
    const res = NextResponse.redirect(url)
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