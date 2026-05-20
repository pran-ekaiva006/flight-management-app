import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

/**
 * ─── Admin Supabase Client ──────────────────────────────
 * Uses the SERVICE_ROLE_KEY — bypasses RLS.
 * ⚠️  NEVER expose this on the client side.
 * Use only in server-side code (Server Actions, Route Handlers, scripts).
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
