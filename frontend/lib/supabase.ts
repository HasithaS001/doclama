'use client';

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdubrsxundbzhjocbisc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdWJyc3h1bmRiemhqb2NiaXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODQ2ODcsImV4cCI6MjA1Nzg2MDY4N30.kgch3tF-qI3rCdjA8N16EU22El307AxGTnrU59k4cU4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is connected
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('documents').select('count', { count: 'exact' }).limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};
