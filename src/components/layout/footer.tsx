import Link from 'next/link';
import { Plane } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-surface/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
                <Plane className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-text font-heading tracking-tight">
                SkyBooker
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
              Experience the future of flight management. Book instantly, manage effortlessly, and travel with confidence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider font-heading">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/search" className="text-sm text-muted hover:text-text transition-colors">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-sm text-muted hover:text-text transition-colors">
                  Manage Bookings
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted/50 cursor-not-allowed">
                  Travel Insurance (Soon)
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider font-heading">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  Contact
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider font-heading">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted text-center md:text-left">
            &copy; {new Date().getFullYear()} SkyBooker. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
