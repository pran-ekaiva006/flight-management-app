import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Helper to safely extract the first key in case of accidental multiple paste
const parseKey = (key?: string) => (key || '').split('\n')[0].trim();

export function createAdminClient() {
  return createClient<Database>(
    parseKey(process.env.NEXT_PUBLIC_SUPABASE_URL),
    parseKey(process.env.SUPABASE_SERVICE_ROLE_KEY),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
