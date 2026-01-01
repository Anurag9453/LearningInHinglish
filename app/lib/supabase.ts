import { createClient } from '@supabase/supabase-js'

let supabase: any = null

export function getSupabase() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase env vars missing')
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}
