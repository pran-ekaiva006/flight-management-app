'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signupAction, type AuthActionResult } from '../actions/auth-actions';
import Link from 'next/link';

const initialState: AuthActionResult = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700
                 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25
                 transition-all hover:from-primary-700 hover:to-primary-800
                 hover:shadow-primary-500/40 focus:outline-none focus:ring-2
                 focus:ring-primary-500/50 focus:ring-offset-2
                 disabled:cursor-not-allowed disabled:opacity-60
                 dark:shadow-primary-500/10 dark:focus:ring-offset-gray-900"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Creating account...
        </span>
      ) : (
        'Create account'
      )}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signupAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {/* Error message */}
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          {state.error}
        </div>
      )}

      {/* Success message */}
      {state?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400">
          Account created! Check your email for a confirmation link, then{' '}
          <Link href="/login" className="font-semibold underline">
            sign in
          </Link>
          .
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <label
          htmlFor="signup-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full name
        </label>
        <input
          id="signup-name"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="Pranjal Kumar Verma"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
                     text-gray-900 shadow-sm transition-all placeholder:text-gray-400
                     focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                     dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
                     dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
                     text-gray-900 shadow-sm transition-all placeholder:text-gray-400
                     focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                     dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
                     dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
                     text-gray-900 shadow-sm transition-all placeholder:text-gray-400
                     focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                     dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
                     dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="signup-confirm"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirm password
        </label>
        <input
          id="signup-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
                     text-gray-900 shadow-sm transition-all placeholder:text-gray-400
                     focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                     dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
                     dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
        />
      </div>

      {/* Submit */}
      <SubmitButton />

      {/* Link to login */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
