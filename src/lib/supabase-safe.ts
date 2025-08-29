// Safe Supabase client that won't crash during build
export const createSafeSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }
  
  try {
    const { createClient } = require('@supabase/supabase-js')
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  } catch (error) {
    console.warn('Supabase client creation failed:', error)
    return null
  }
}

// Safe client for client-side usage
export const createSafeSupabaseClientClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }
  
  try {
    const { createClient } = require('@supabase/supabase-js')
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  } catch (error) {
    console.warn('Supabase client creation failed:', error)
    return null
  }
}
