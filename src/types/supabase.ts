export type Database = {
  public: {
    Tables: {
      qbo_connections: {
        Row: {
          id: string
          user_id: string
          realm_id: string
          access_token_encrypted: string
          refresh_token_encrypted: string
          access_token_expires_at: string
          sync_status: string
          last_sync_at: string | null
          sync_error: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          realm_id: string
          access_token_encrypted: string
          refresh_token_encrypted: string
          access_token_expires_at: string
          sync_status?: string
          last_sync_at?: string | null
          sync_error?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          realm_id?: string
          access_token_encrypted?: string
          refresh_token_encrypted?: string
          access_token_expires_at?: string
          sync_status?: string
          last_sync_at?: string | null
          sync_error?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      qbo_accounts: {
        Row: {
          id: string
          user_id: string
          realm_id: string
          qbo_account_id: string
          account_name: string
          account_type: string
          account_sub_type: string | null
          active: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          realm_id: string
          qbo_account_id: string
          account_name: string
          account_type: string
          account_sub_type?: string | null
          active?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          realm_id?: string
          qbo_account_id?: string
          account_name?: string
          account_type?: string
          account_sub_type?: string | null
          active?: boolean
          updated_at?: string
        }
      }
      qbo_transactions: {
        Row: {
          id: string
          user_id: string
          realm_id: string
          entity_type: string
          qbo_transaction_id: string
          doc_number: string | null
          txn_date: string
          amount: number
          description: string | null
          account_ref: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          realm_id: string
          entity_type: string
          qbo_transaction_id: string
          doc_number?: string | null
          txn_date: string
          amount: number
          description?: string | null
          account_ref?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          realm_id?: string
          entity_type?: string
          qbo_transaction_id?: string
          doc_number?: string | null
          txn_date?: string
          amount?: number
          description?: string | null
          account_ref?: string | null
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          subscription_status: string
          is_subscribed: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          subscription_status?: string
          is_subscribed?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          subscription_status?: string
          is_subscribed?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 