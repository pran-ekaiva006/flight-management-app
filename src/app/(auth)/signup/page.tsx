import type { Metadata } from 'next';
import { SignupForm } from '@/features/auth/components/signup-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new Flight Management account',
};

export default function SignupPage() {
  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-8 shadow-xl shadow-gray-200/40 backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-800/60 dark:shadow-black/20 sm:p-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
          <svg
            className="h-7 w-7 text-white"
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Start booking flights in minutes
        </p>
      </div>

      {/* Form */}
      <SignupForm />
    </div>
  );
}
