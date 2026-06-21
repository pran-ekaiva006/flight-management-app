'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './footer';

export function FooterWrapper({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  
  if (pathname !== '/' || isLoggedIn) return null;
  
  return <Footer />;
}
