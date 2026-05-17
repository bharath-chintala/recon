import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tcmrisdbvzghjtqtdrys.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbXJpc2RidnpnaGp0cXRkcnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTIzNDEsImV4cCI6MjA5NDU4ODM0MX0.gFaTOt4uERHluw89F00Jfx6YeivKknOT78ANGKvMp_U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
