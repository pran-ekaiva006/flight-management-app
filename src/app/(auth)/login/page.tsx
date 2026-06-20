import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your SkyBooker account',
};

export default function LoginPage() {
  return (
    <div className="space-y-4">
      {/* Login card */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl shadow-black/40 sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-1.5">
            <svg
              className="h-4 w-4 text-blue-400"
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
            <span className="text-sm font-semibold text-gray-200">
              SkyBooker
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage your flights and bookings
          </p>
        </div>

        {/* Form */}
        <LoginForm />
      </div>

      {/* Recruiter demo panel */}
      <div
        id="demo-panel"
        className="rounded-xl border border-gray-800 bg-gray-900/80 p-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10">
            <svg
              className="h-4 w-4 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
            <p className="text-sm text-gray-300">
              If you&apos;re reviewing this project, click below to sign in with
              a demo account instantly.
            </p>
            {/* The "Continue" button is rendered by LoginForm via the
                DemoPanelButton component — it calls the existing handleTryDemo
                function which autofills demo@example.com / Demo@1234 and
                submits the form. */}
          </div>
        </div>
      </div>
    </div>
  );
}
