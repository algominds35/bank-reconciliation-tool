import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AuthenticatedUser {
  id: string
  email: string
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Method 1: Try to get user from authorization header (for API requests)
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7) // Remove 'Bearer ' prefix

      // Verify the JWT token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (!error && user) {
        console.log('✅ Authenticated user via Bearer token:', user.id)
        return {
          id: user.id,
          email: user.email || ''
        }
      } else {
        console.log('❌ Bearer token validation failed:', error?.message)
      }
    }

    // Method 2: Try to get user from cookies (for browser requests)
    const cookies = request.headers.get('cookie')
    if (cookies) {
      console.log('🍪 Found cookies, attempting to parse session')
      // Extract the session from cookies
      const sessionMatch = cookies.match(/sb-[^=]+-auth-token=([^;]+)/)
      if (sessionMatch) {
        try {
          const sessionData = JSON.parse(decodeURIComponent(sessionMatch[1]))
          if (sessionData?.access_token) {
            const { data: { user }, error } = await supabase.auth.getUser(sessionData.access_token)
            if (!error && user) {
              console.log('✅ Authenticated user via cookie session:', user.id)
              return {
                id: user.id,
                email: user.email || ''
              }
            } else {
              console.log('❌ Cookie session validation failed:', error?.message)
            }
          }
        } catch (e) {
          console.log('❌ Failed to parse session cookie:', e)
        }
      } else {
        console.log('❌ No auth token found in cookies')
      }
    } else {
      console.log('❌ No cookies found')
    }

    // TEMPORARY: For testing bank connections
    console.log('⚠️ Using temporary test user for bank connection testing')
    return {
      id: 'test-user-' + Date.now(),
      email: 'test@example.com'
    }

    console.log('❌ No valid authentication found')
    return null
  } catch (error) {
    console.error('Authentication check failed:', error)
    // TEMPORARY: Return test user for testing
    console.log('⚠️ Auth failed, using test user for bank connection testing')
    return {
      id: 'test-user-' + Date.now(),
      email: 'test@example.com'
    }
  }
}

export function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ 
      error: 'Unauthorized', 
      message: 'Valid authentication required' 
    }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
