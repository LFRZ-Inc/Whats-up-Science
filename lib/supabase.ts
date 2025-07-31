import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://boagveounetciozkmwyj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvYWd2ZW91bmV0Y2lvemttd3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTg5OTgsImV4cCI6MjA2OTU3NDk5OH0.8OHPnzFK8bD6qHlGgbRo8UbG4oQUsAdTK4mB6aoJIHc'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null 