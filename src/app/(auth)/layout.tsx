import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-text p-4 sm:p-8">
      {/* Super minimal startup layout - No noisy backgrounds, just pure focus */}
      <div className="w-full max-w-[440px]">
        {/* Header / Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-text text-background transition-transform group-hover:scale-105">
              <Plane className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">
              SkyBooker
            </span>
          </Link>
        </div>

        {/* Minimalist Card for Form */}
        <div className="rounded-2xl border border-border/60 bg-surface shadow-sm p-6 sm:p-7">
          {children}
        </div>

        {/* Footer links */}
        <div className="mt-8 text-center text-xs text-muted flex items-center justify-center gap-4">
          <Link href="/" className="hover:text-text transition-colors">Home</Link>
          <Link href="#" className="hover:text-text transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-text transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
