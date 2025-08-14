import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getQboAuthUrl } from '@/lib/qbo'

export async function GET(req: NextRequest) {
  try {
    // Create Supabase client with proper cookie handling
    const cookieStore = await cookies()
    
    const supabase = createServerSupabaseClient(cookieStore.toString())

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Authentication error in connect route:', authError)
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    console.log('User authenticated for QBO connect:', user.id)
    
    const state: string = randomUUID()
    const url = getQboAuthUrl(state)
    
    console.log('Redirecting to QBO OAuth URL:', url)
    
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