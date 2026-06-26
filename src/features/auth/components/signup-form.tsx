'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { signupAction, type AuthActionResult } from '../actions/auth-actions';
import Link from 'next/link';
import { toast } from 'sonner';

const initialState: AuthActionResult = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold
                 text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-600 hover:-translate-y-0.5 active:translate-y-0
                 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card
                 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-white"
            viewBox="0 0 24 24"
            fill="none"
          >
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
          Creating account...
        </span>
      ) : (
        'Create account'
      )}
    </button>
  );
}

/* ─── Password Toggle Icon ───────────────────────────── */
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    );
  }
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signupAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success('Account created successfully! Redirecting to sign in...');
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state?.error, state?.success, router]);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {/* Error message fallback for screen readers */}
      <div aria-live="polite" className="sr-only">
        {state?.error}
      </div>

      {/* Success message */}
      {state?.success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Account created! Check your email for a confirmation link, then{' '}
          <Link
            href="/login"
            className="font-bold underline decoration-emerald-500/40 underline-offset-4 hover:decoration-emerald-500 transition-colors"
          >
            sign in
          </Link>
          .
        </div>
      )}

      {/* Full Name */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-4 w-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <input
          id="signup-name"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="Full name"
          className="w-full rounded-xl border border-border/60 bg-transparent py-3 pl-11 pr-4 text-sm font-medium
                     text-text shadow-sm transition-all placeholder:text-muted/60
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-4 w-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.917V6.75"
            />
          </svg>
        </div>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email address"
          className="w-full rounded-xl border border-border/60 bg-transparent py-3 pl-11 pr-4 text-sm font-medium
                     text-text shadow-sm transition-all placeholder:text-muted/60
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-4 w-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <input
          id="signup-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          placeholder="Password"
          className="w-full rounded-xl border border-border/60 bg-transparent py-3 pl-11 pr-11 text-sm font-medium
                     text-text shadow-sm transition-all placeholder:text-muted/60
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted
                     transition-colors hover:text-text focus:outline-none focus:text-text"
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-4 w-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <input
          id="signup-confirm"
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          required
          placeholder="Confirm password"
          className="w-full rounded-xl border border-border/60 bg-transparent py-3 pl-11 pr-11 text-sm font-medium
                     text-text shadow-sm transition-all placeholder:text-muted/60
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setShowConfirm((prev) => !prev)}
          aria-label={showConfirm ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted
                     transition-colors hover:text-text focus:outline-none focus:text-text"
        >
          <EyeIcon open={showConfirm} />
        </button>
      </div>

      {/* Submit */}
      <div className="pt-1">
        <SubmitButton />
      </div>

      {/* Link to login */}
      <p className="text-center text-sm font-medium text-muted pt-1">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-bold text-primary transition-colors hover:text-primary-600"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
