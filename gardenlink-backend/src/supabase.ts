import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for public operations (frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server-side operations (backend)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase; 