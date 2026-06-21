'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './nav-config';
import { NavIcon } from './nav-icon';

export function MobileNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-surface/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {NAV_ITEMS.filter((item) => {
          if (!isLoggedIn) {
            return item.href === '/search';
          }
          return true;
        }).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-0.5 rounded-xl px-4 py-1.5 transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-muted hover:text-text'
              }`}
            >
              <NavIcon
                icon={item.icon}
                className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
