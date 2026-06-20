'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction, type AuthActionResult } from '../actions/auth-actions';
import Link from 'next/link';
import { toast } from 'sonner';

const initialState: AuthActionResult = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold
                 text-white shadow-sm transition-all hover:bg-gray-800
                 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Signing in...
        </span>
      ) : (
        'Sign in'
      )}
    </button>
  );
}

function DemoButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onClick}
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold
                 text-gray-700 shadow-sm transition-all hover:bg-gray-50
                 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Try demo account
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleTryDemo = () => {
    const emailInput = document.getElementById(
      'login-email',
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      'login-password',
    ) as HTMLInputElement;
    if (emailInput && passwordInput) {
      emailInput.value = 'demo@example.com';
      passwordInput.value = 'Demo@1234';
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      {/* Error message fallback for screen readers */}
      <div aria-live="polite" className="sr-only">
        {state?.error}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm
                     text-gray-900 shadow-sm transition-all placeholder:text-gray-400
                     focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm
                     text-gray-900 shadow-sm transition-all placeholder:text-gray-400
                     focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <SubmitButton />
        <DemoButton onClick={handleTryDemo} />
      </div>

      {/* Link to signup */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-gray-900"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
