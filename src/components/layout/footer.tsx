import Link from 'next/link';
import { Plane, ShieldCheck, Lock, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-surface/30 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg accent-gradient text-white shadow-sm transition-transform group-hover:scale-105">
                <Plane className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-text font-heading tracking-tight">
                SkyBooker
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
              Experience the future of flight management. Book instantly, manage
              effortlessly, and travel with confidence.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {[
                {
                  label: 'X / Twitter',
                  icon: (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: 'LinkedIn',
                  icon: (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  icon: (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <button
                  key={social.label}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/40 bg-surface/50 text-muted transition-all hover:text-violet-400 hover:border-violet-500/30 hover:bg-surface"
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-bold text-text uppercase tracking-widest font-heading">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted hover:text-text transition-colors"
                >
                  Search Flights
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="text-sm text-muted hover:text-text transition-colors"
                >
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

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold text-text uppercase tracking-widest font-heading">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  Cancellation Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold text-text uppercase tracking-widest font-heading">
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
              <li>
                <span className="text-sm text-muted hover:text-text transition-colors cursor-pointer">
                  Cookie Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border/30 bg-surface/20 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>PCI DSS Compliant</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border/40" />
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Lock className="h-4 w-4 text-sky-500" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border/40" />
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Globe className="h-4 w-4 text-violet-500" />
            <span>IATA Registered</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border/40" />
          {/* Payment Method Icons */}
          <div className="flex items-center gap-3 text-muted">
            {['Visa', 'Mastercard', 'UPI', 'PayPal'].map((method) => (
              <span
                key={method}
                className="rounded-md border border-border/40 bg-surface/50 px-2.5 py-1 text-[10px] font-bold tracking-wide"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted text-center sm:text-left">
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
