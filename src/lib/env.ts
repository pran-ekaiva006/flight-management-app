import { z } from 'zod';

/**
 * ─── Server-side environment variables ──────────────────
 * Validated at build-time / server startup.
 */
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Amadeus Flight Offers API (free self-service/test tier)
  // The human operator must create a free account at https://developers.amadeus.com,
  // register an app, and paste the real client_id/secret into .env.local.
  // That account-creation step cannot be automated from code.
  AMADEUS_CLIENT_ID: z.string().min(1, 'AMADEUS_CLIENT_ID is required'),
  AMADEUS_CLIENT_SECRET: z.string().min(1, 'AMADEUS_CLIENT_SECRET is required'),
  AMADEUS_API_BASE_URL: z.string().url().default('https://test.api.amadeus.com'),
});

/**
 * ─── Client-side environment variables ──────────────────
 * Must be prefixed with NEXT_PUBLIC_ to be available in the browser.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Flight Management App'),
});

type ClientEnv = z.infer<typeof clientSchema>;
type ServerEnv = z.infer<typeof serverSchema>;

/**
 * ─── Lazy Validation ────────────────────────────────────
 * Validates on first access so build doesn't fail when
 * env vars aren't set yet (e.g. in CI before secrets are injected).
 */
function createEnvProxy<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  values: Record<string, unknown>,
): T {
  let parsed: T | null = null;

  return new Proxy({} as T, {
    get(_, prop: string) {
      if (!parsed) {
        const result = schema.safeParse(values);
        if (!result.success) {
          console.error(
            '❌ Invalid environment variables:',
            result.error.flatten().fieldErrors,
          );
          throw new Error('Invalid environment variables. Check server logs.');
        }
        parsed = result.data;
      }
      return parsed[prop as keyof T];
    },
  });
}

export const clientEnv = createEnvProxy<ClientEnv>(clientSchema, {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

export const serverEnv =
  typeof window === 'undefined'
    ? createEnvProxy<ServerEnv>(serverSchema, {
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NODE_ENV: process.env.NODE_ENV,
        AMADEUS_CLIENT_ID: process.env.AMADEUS_CLIENT_ID,
        AMADEUS_CLIENT_SECRET: process.env.AMADEUS_CLIENT_SECRET,
        AMADEUS_API_BASE_URL: process.env.AMADEUS_API_BASE_URL,
      })
    : ({} as ServerEnv);
