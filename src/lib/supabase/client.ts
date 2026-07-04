import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

// Helper to safely extract the first key in case of accidental multiple paste
const parseKey = (key?: string) => (key || '').split('\n')[0]?.trim() || '';

export function createClient() {
  return createBrowserClient<Database>(
    parseKey(process.env.NEXT_PUBLIC_SUPABASE_URL),
    parseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}
