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
    // Method 1: Try to get user from authorization header (for HTTP requests)
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7) // Remove 'Bearer ' prefix

      // Verify the JWT token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (!error && user) {
        return {
          id: user.id,
          email: user.email || ''
        }
      }
    }

    // Method 2: Try to get user from Supabase session (for direct client calls)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email || ''
      }
    }

    // Method 3: TEMPORARY - For testing bank connections without full auth setup
    // This creates a demo user for testing purposes
    console.warn('⚠️ Using demo user for bank connection testing')
    return {
      id: 'demo-user-' + Date.now(),
      email: 'demo@example.com'
    }

    return null
  } catch (error) {
    console.error('Authentication check failed:', error)
    // TEMPORARY - Return demo user for testing
    console.warn('⚠️ Auth failed, using demo user for testing')
    return {
      id: 'demo-user-' + Date.now(),
      email: 'demo@example.com'
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
