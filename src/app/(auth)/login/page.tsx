import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Sign In | SkyBooker',
  description: 'Sign in to your SkyBooker account',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const isRegistered = searchParams?.registered === 'true';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text font-heading tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm font-medium text-muted">
          Sign in to your account
        </p>
      </div>

      {/* Form */}
      <LoginForm registered={isRegistered} />

      {/* Recruiter demo panel */}
      <div
        id="demo-panel"
        className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <svg
              className="h-4 w-4 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-text leading-relaxed">
              Reviewing this project? Click below to instantly sign in with a
              demo account.
            </p>
            {/* The DemoPanelButton renders here via Portal */}
          </div>
        </div>
      </div>
    </div>
  );
}
