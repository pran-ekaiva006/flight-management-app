import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | SkyBooker',
  description: 'Reset your SkyBooker password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full text-center">
      <h1 className="text-2xl font-bold text-text font-heading tracking-tight mb-4">
        Forgot Password
      </h1>
      <p className="text-sm font-medium text-muted mb-8">
        Enter your email to reset your password.
      </p>
      <div className="rounded-xl border border-border/60 bg-card p-8 shadow-sm">
        <p className="text-muted text-sm">
          Password reset functionality is coming soon.
        </p>
      </div>
    </div>
  );
}
