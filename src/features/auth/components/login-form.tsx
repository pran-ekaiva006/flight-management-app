'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFormState, useFormStatus } from 'react-dom';
import {
  loginAction,
  signInWithGoogleAction,
  type AuthActionResult,
} from '../actions/auth-actions';
import Link from 'next/link';
import { toast } from 'sonner';

const initialState: AuthActionResult = {};

/* ─── Submit Button ──────────────────────────────────── */
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
          Signing in…
        </span>
      ) : (
        'Sign In'
      )}
    </button>
  );
}

/* ─── Google "G" Logo SVG ────────────────────────────── */
function GoogleLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ─── Demo Panel Button (portal-rendered into #demo-panel) */
function DemoPanelButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const target = document.getElementById('demo-panel');
  if (!target) return null;

  return createPortal(
    <button
      type="button"
      disabled={pending}
      onClick={onClick}
      className="mt-4 w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold
                 text-white transition-all shadow-md hover:bg-accent-600 hover:-translate-y-0.5 active:translate-y-0
                 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card
                 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? 'Signing in…' : 'Continue as Demo User'}
    </button>,
    target,
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

/* ─── Login Form ─────────────────────────────────────── */
export function LoginForm({ registered }: { registered?: boolean }) {
  const [state, formAction] = useFormState(loginAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (registered) {
      // Use setTimeout to ensure the toast renders after mount
      const timer = setTimeout(() => {
        toast.success('Account created successfully! Please sign in.');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [registered]);

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
    <form ref={formRef} action={formAction} className="space-y-4" noValidate autoComplete="off">
      {/* Error message fallback for screen readers */}
      <div aria-live="polite" className="sr-only">
        {state?.error}
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
          id="login-email"
          name="email"
          type="email"
          autoComplete="off"
          required
          aria-invalid={state?.error ? 'true' : undefined}
          placeholder="Email"
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
          id="login-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          aria-invalid={state?.error ? 'true' : undefined}
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

      {/* Primary submit */}
      <div className="pt-1">
        <SubmitButton />
      </div>

      {/* Register / Forgot Password links */}
      <div className="flex flex-col items-center justify-between gap-3 xs:flex-row pt-1">
        <p className="text-sm font-medium text-muted">
          New User?{' '}
          <Link
            href="/signup"
            className="font-bold text-primary transition-colors hover:text-primary-600"
          >
            Register
          </Link>
        </p>
        <Link
          href={'/forgot-password' as any}
          className="text-sm font-bold text-primary transition-colors hover:text-primary-600"
        >
          Forgot Password?
        </Link>
      </div>

      {/* ─── Divider ───────────────────────────────────── */}
      <div className="flex items-center gap-4 py-1.5">
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          or
        </span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      {/* ─── Google Sign-In ────────────────────────────── */}
      <button
        type="button"
        onClick={async () => {
          try {
            await signInWithGoogleAction();
          } catch {
            // redirect() throws NEXT_REDIRECT — this is expected
          }
        }}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/60 bg-surface/50 px-4 py-3
                   text-sm font-bold text-text transition-all hover:bg-surface hover:border-border hover:shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background"
      >
        <GoogleLogo />
        Continue with Google
      </button>

      {/* ─── Legal microcopy ───────────────────────────── */}
      <p className="text-center text-[10px] font-medium leading-relaxed text-muted uppercase tracking-wider pt-1">
        By continuing, you agree to SkyBooker&apos;s{' '}
        <Link
          href={'/terms' as any}
          className="underline decoration-border underline-offset-4 transition-colors hover:text-text"
        >
          Terms
        </Link>{' '}
        and{' '}
        <Link
          href={'/privacy' as any}
          className="underline decoration-border underline-offset-4 transition-colors hover:text-text"
        >
          Privacy
        </Link>
      </p>

      {/* ─── Demo Panel Button (rendered via portal into #demo-panel) */}
      <DemoPanelButton onClick={handleTryDemo} />
    </form>
  );
}
