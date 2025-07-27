// TEMPORARILY DISABLED SUPABASE TO FIX LANDING PAGE CRASH
// This creates a mock object that won't crash but won't work for dashboard

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signUp: async () => ({ data: null, error: { message: 'Auth disabled' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Auth disabled' } }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    updateUser: async () => ({ error: null }),
    signInWithOAuth: async () => ({ error: null })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
    eq: () => ({ data: [], error: null }),
    order: () => ({ data: [], error: null })
  })
} 