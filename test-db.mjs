import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('Testing connection to Supabase...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Check courses table
    const { data: courses, error: coursesError } = await supabase.from('courses').select('count', { count: 'exact', head: true });
    if (coursesError) {
      console.error('❌ Failed to connect to "courses" table:', coursesError.message);
    } else {
      console.log('✅ Connected to "courses" table successfully.');
    }

    // Check students table
    const { data: students, error: studentsError } = await supabase.from('students').select('count', { count: 'exact', head: true });
    if (studentsError) {
      console.error('❌ Failed to connect to "students" table:', studentsError.message);
    } else {
      console.log('✅ Connected to "students" table successfully.');
    }

  } catch (e) {
    console.error('❌ Unexpected error:', e);
  }
}

checkConnection();
