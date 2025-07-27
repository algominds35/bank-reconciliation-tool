import { createClient } from '@supabase/supabase-js'

// Ensure environment variables are properly accessed
const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

console.log('Supabase setup:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlLength: supabaseUrl.length,
  keyLength: supabaseAnonKey.length,
  urlStart: supabaseUrl.substring(0, 20),
  keyStart: supabaseAnonKey.substring(0, 20)
})

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined' || supabaseAnonKey === 'undefined') {
  throw new Error(`Supabase env vars invalid: URL=${!!supabaseUrl}, Key=${!!supabaseAnonKey}`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}) 