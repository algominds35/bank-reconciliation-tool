import { createClient } from '@supabase/supabase-js'

// Simple working Supabase client
const supabaseUrl = 'https://ajdvqkvevaklcwhxijde.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHZxa3ZldmFrbGN3aHhpamRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkwOTYsImV4cCI6MjA2OTAwNTA5Nn0.551cSJSE4QlPdw1iRWBMslj2gBkcEIsQHenZRq6L7rs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}) 