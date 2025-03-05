
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://poddiiizllphqxhfssja.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZGRpaWl6bGxwaHF4aGZzc2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODk5MDQsImV4cCI6MjA1NjY2NTkwNH0.ElqC5vUzS1LnPcQu74B7ZFRY_-Nl2UUZdTKXsvmgRz4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
  },
});
