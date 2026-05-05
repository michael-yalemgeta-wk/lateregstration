import { createClient } from '@supabase/supabase-js';

// Same exact credentials as lib/supabase.ts
const SUPABASE_URL = 'https://wcdyhshwwveidintdgyq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZHloc2h3d3ZlaWRpbnRkZ3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTk1MDQsImV4cCI6MjA5MzQ5NTUwNH0.0WO3gHjoUyX-jAHA78hbQpKk07fzMx7i64f-uoH2Uwc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log('\n========== DATABASE FULL TEST ==========\n');

  // TEST 1: Read courses
  console.log('TEST 1: Reading courses table...');
  const { data: courses, error: e1 } = await supabase.from('courses').select('*');
  if (e1) {
    console.log('  ❌ FAILED:', e1.message);
  } else {
    console.log(`  ✅ SUCCESS: Found ${courses.length} courses`);
    courses.forEach(c => console.log(`     - [${c.id}] ${c.course_name}`));
  }

  // TEST 2: Insert a course
  console.log('\nTEST 2: Inserting a test course...');
  const { data: inserted, error: e2 } = await supabase
    .from('courses')
    .insert([{ course_name: '__TEST_COURSE__' }])
    .select();
  if (e2) {
    console.log('  ❌ FAILED:', e2.message);
  } else {
    console.log('  ✅ SUCCESS: Inserted course with id =', inserted[0].id);

    // TEST 3: Delete the test course we just made
    console.log('\nTEST 3: Deleting the test course...');
    const { error: e3 } = await supabase.from('courses').delete().eq('id', inserted[0].id);
    if (e3) {
      console.log('  ❌ FAILED:', e3.message);
    } else {
      console.log('  ✅ SUCCESS: Deleted test course cleanly');
    }
  }

  // TEST 4: Read students
  console.log('\nTEST 4: Reading students table...');
  const { data: students, error: e4 } = await supabase.from('students').select('*');
  if (e4) {
    console.log('  ❌ FAILED:', e4.message);
  } else {
    console.log(`  ✅ SUCCESS: Found ${students.length} registered students`);
  }

  // TEST 5: Insert a test student
  console.log('\nTEST 5: Inserting a test student...');
  const { data: insertedStudent, error: e5 } = await supabase
    .from('students')
    .insert([{
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '0000000000',
      date_of_birth: '2000-01-01',
      gender: 'Male',
      address: 'Test Address',
      city: 'Test City',
      selected_courses: ['Introduction to Next.js'],
    }])
    .select();
  if (e5) {
    console.log('  ❌ FAILED:', e5.message);
  } else {
    console.log('  ✅ SUCCESS: Inserted student with id =', insertedStudent[0].id);

    // Clean up
    await supabase.from('students').delete().eq('id', insertedStudent[0].id);
    console.log('  🧹 Cleaned up test student');
  }

  console.log('\n========== ALL TESTS COMPLETE ==========\n');
}

runTests();
