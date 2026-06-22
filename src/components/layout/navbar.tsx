import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { LogoutButton } from './logout-button';
import { NAV_ITEMS } from './nav-config';
import { NavIcon } from './nav-icon';
import { ThemeToggle } from './theme-toggle';
import { Plane } from 'lucide-react';

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <Plane className="h-5 w-5" />
          </div>
          <span className="hidden text-lg font-bold text-text sm:block font-heading tracking-tight">
            SkyBooker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {user ? (
            NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all hover:bg-muted/10 hover:text-text"
              >
                <NavIcon icon={item.icon} className="h-4 w-4" />
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link
                href="/search"
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all hover:bg-muted/10 hover:text-text"
              >
                <NavIcon icon="search" className="h-4 w-4" />
                Search Flights
              </Link>
              <Link
                href="/#why-choose-us"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all hover:bg-muted/10 hover:text-text"
              >
                Benefits
              </Link>
              <Link
                href="/#destinations"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all hover:bg-muted/10 hover:text-text"
              >
                Destinations
              </Link>
              <Link
                href="/#how-it-works"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all hover:bg-muted/10 hover:text-text"
              >
                How It Works
              </Link>
              <Link
                href="/#reviews"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all hover:bg-muted/10 hover:text-text"
              >
                Reviews
              </Link>
              <Link
                href="/#faqs"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all hover:bg-muted/10 hover:text-text"
              >
                FAQs
              </Link>
            </>
          )}
        </nav>

        {/* Actions section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-4 border-l border-border/50 pl-4">
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary border border-primary/20">
                  {(user.user_metadata?.full_name || user.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <span className="text-sm font-medium text-text">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-border/50 pl-4">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-muted hover:text-text transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-600 hover:shadow-primary/30"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
