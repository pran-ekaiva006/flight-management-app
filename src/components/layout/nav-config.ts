/**
 * Shared navigation configuration — safe to import in both
 * server and client components.
 */

export const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/search', label: 'Search', icon: 'search' },
  { href: '/bookings', label: 'My Bookings', icon: 'bookings' },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
