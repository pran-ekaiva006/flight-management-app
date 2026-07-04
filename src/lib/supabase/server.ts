import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

// Helper to safely extract the first key in case of accidental multiple paste
const parseKey = (key?: string) => (key || '').split('\n')[0]?.trim() || '';

/**
 * ─── Server Supabase Client ─────────────────────────────
 * Use this in Server Components, Server Actions, and Route Handlers.
 * Creates a fresh client per request with cookie-based auth.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    parseKey(process.env.NEXT_PUBLIC_SUPABASE_URL),
    parseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    },
  );
}
