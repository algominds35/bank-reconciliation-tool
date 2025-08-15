import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getQboAuthUrl } from '@/lib/qbo'

export async function GET(req: NextRequest) {
  try {
    console.log('QBO connect - ENTERPRISE VERSION')
    console.log('🔍 Environment check:')
    console.log('🔍 QBO_CLIENT_ID:', process.env.QBO_CLIENT_ID ? '✅ Set' : '❌ Missing')
    console.log('🔍 QBO_CLIENT_SECRET:', process.env.QBO_CLIENT_SECRET ? '✅ Set' : '❌ Missing')
    console.log('🔍 QBO_REDIRECT_URI:', process.env.QBO_REDIRECT_URI ? '✅ Set' : '❌ Missing')
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV)
    
    // Log the actual values (partially masked for security)
    if (process.env.QBO_CLIENT_ID) {
      console.log('🔍 Client ID starts with:', process.env.QBO_CLIENT_ID.substring(0, 8) + '...')
    }
    if (process.env.QBO_REDIRECT_URI) {
      console.log('🔍 Redirect URI:', process.env.QBO_REDIRECT_URI)
    }
    
    // Validate environment variables
    if (!process.env.QBO_CLIENT_ID || !process.env.QBO_CLIENT_SECRET || !process.env.QBO_REDIRECT_URI) {
      console.error('❌ Missing required environment variables')
      console.error('❌ QBO_CLIENT_ID:', process.env.QBO_CLIENT_ID ? 'Set' : 'Missing')
      console.error('❌ QBO_CLIENT_SECRET:', process.env.QBO_CLIENT_SECRET ? 'Set' : 'Missing')
      console.error('❌ QBO_REDIRECT_URI:', process.env.QBO_REDIRECT_URI ? 'Set' : 'Missing')
      
      // Show user exactly what's missing
      const missingVars = []
      if (!process.env.QBO_CLIENT_ID) missingVars.push('QBO_CLIENT_ID')
      if (!process.env.QBO_CLIENT_SECRET) missingVars.push('QBO_CLIENT_SECRET')
      if (!process.env.QBO_REDIRECT_URI) missingVars.push('QBO_REDIRECT_URI')
      
      return NextResponse.redirect(new URL(`/settings/qbo?error=missing_config&vars=${missingVars.join(',')}`, req.url))
    }
    
    // Create OAuth URL using the proper function
    const state = randomUUID()
    const authUrl = getQboAuthUrl(state)
    
    console.log('🔍 Generated OAuth URL:', authUrl)
    console.log('🔍 Client ID:', process.env.QBO_CLIENT_ID)
    console.log('🔍 Redirect URI:', process.env.QBO_REDIRECT_URI)
    console.log('🔍 State:', state)
    
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