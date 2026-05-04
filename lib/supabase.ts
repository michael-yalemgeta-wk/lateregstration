import { createClient } from '@supabase/supabase-js';

// Credentials are hardcoded to ensure reliable connection
// RLS has been disabled on all tables so the anon key works freely
const SUPABASE_URL = 'https://wcdyhshwwveidintdgyq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZHloc2h3d3ZlaWRpbnRkZ3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTk1MDQsImV4cCI6MjA5MzQ5NTUwNH0.0WO3gHjoUyX-jAHA78hbQpKk07fzMx7i64f-uoH2Uwc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
