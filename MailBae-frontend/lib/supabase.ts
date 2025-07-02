import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Only for server-side

// service role key for server-side API routes
export const supabase =
     typeof window === 'undefined'
       ? createClient(supabaseUrl, supabaseServiceRoleKey!)
       : createClient(supabaseUrl, supabaseKey)