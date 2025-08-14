import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    console.log('Session test started')
    
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    console.log('All cookies found:', allCookies.map(c => ({ name: c.name, value: c.value?.substring(0, 20) + '...' })))
    
    // Look for Supabase auth cookies
    const authCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('auth'))
    console.log('Auth-related cookies:', authCookies.map(c => ({ name: c.name, value: c.value?.substring(0, 20) + '...' })))
    
    const supabase = createServerSupabaseClient(cookieStore.toString())
    
    console.log('Attempting to get user...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({
        success: false,
        error: authError.message,
        cookies: allCookies.map(c => c.name),
        authCookies: authCookies.map(c => c.name)
      })
    }
    
    if (!user) {
      console.log('No user found')
      return NextResponse.json({
        success: false,
        message: 'No authenticated user',
        cookies: allCookies.map(c => c.name),
        authCookies: authCookies.map(c => c.name)
      })
    }
    
    console.log('User found:', user.id)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      cookies: allCookies.map(c => c.name),
      authCookies: authCookies.map(c => c.name)
    })
    
  } catch (error) {
    console.error('Session test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 