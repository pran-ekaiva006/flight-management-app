import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { LogoutButton } from './logout-button';
import { NAV_ITEMS } from './nav-config';
import { NavIcon } from './nav-icon';

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/20">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </div>
          <span className="hidden text-lg font-bold text-gray-900 dark:text-white sm:block">
            SkyBooker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.filter((item) => {
            if (!user) {
              return item.href === '/search';
            }
            return true;
          }).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <NavIcon icon={item.icon} className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-bold text-white">
                  {(user.user_metadata?.full_name || user.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/20 transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-primary-500/30"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
