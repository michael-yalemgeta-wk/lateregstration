import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wcdyhshwwveidintdgyq.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZHloc2h3d3ZlaWRpbnRkZ3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTk1MDQsImV4cCI6MjA5MzQ5NTUwNH0.0WO3gHjoUyX-jAHA78hbQpKk07fzMx7i64f-uoH2Uwc';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZHloc2h3d3ZlaWRpbnRkZ3lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkxOTUwNCwiZXhwIjoyMDkzNDk1NTA0fQ.IPnJGaiJ_Wr-EyFQYWdfUiUrElvTxQzkcrpIjiY3Al8';

async function test() {
  const anonClient = createClient(supabaseUrl, anonKey);
  const { data: anonData, error: anonError } = await anonClient.from('courses').select('*');
  console.log('ANON DATA:', anonData, 'ANON ERROR:', anonError);

  const serviceClient = createClient(supabaseUrl, serviceKey);
  const { data: serviceData, error: serviceError } = await serviceClient.from('courses').select('*');
  console.log('SERVICE DATA:', serviceData, 'SERVICE ERROR:', serviceError);
}

test();
