'use client';

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://scpfpdbbauimygjflfqr.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcGZwZGJiYXVpbXlnamZsZnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTc0OTEsImV4cCI6MjA1ODg5MzQ5MX0.q5bYMxust3VTNX1xqRNyvpMaOvWv_8XQAHtDvir-rL4';

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


