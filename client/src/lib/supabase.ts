import { createClient } from '@supabase/supabase-js'
console.log("ENV CHECK:", import.meta.env.VITE_SUPABASE_URL);

// Load environment variables with fallbacks for build/development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Log warning if using fallback values
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Using fallback Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for full functionality.')
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to check if Supabase is configured properly
export const isSupabaseConfigured = () =>
  !!supabaseUrl && !!supabaseAnonKey

// --------------------
// Types for the database
// --------------------

export interface Agent {
  id: string
  name: string
  description: string
  tone: string
  personality: string
  knowledge_base: string[]
  lyzr_agent_id?: string
  user_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  agent_id: string
  question: string
  user_session: string
  status: 'open' | 'in_progress' | 'resolved'
  confidence_score?: number
  manual_response?: string
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  agent_id: string
  user_session: string
  message: string
  response: string
  confidence_score?: number
  created_at: string
}
