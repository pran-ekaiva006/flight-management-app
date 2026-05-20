import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * ─── Next.js Middleware ─────────────────────────────────
 * Runs on every matched request to refresh the Supabase
 * auth session and enforce route protection.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public assets (icons, images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|icons/|screenshots/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
