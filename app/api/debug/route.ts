import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { data, error } = await supabase.from('courses').select('*');

  return NextResponse.json({
    env_url: url ? url.slice(0, 30) + '...' : 'MISSING',
    env_key: key ? key.slice(0, 20) + '...' : 'MISSING',
    courses_count: data?.length ?? 0,
    error: error?.message ?? null,
  });
}
