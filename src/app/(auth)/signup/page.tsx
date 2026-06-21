import type { Metadata } from 'next';
import { SignupForm } from '@/features/auth/components/signup-form';

export const metadata: Metadata = {
  title: 'Create Account | SkyBooker',
  description: 'Create a new SkyBooker account',
};

export default function SignupPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text font-heading tracking-tight">Create an account</h1>
        <p className="mt-2 text-sm font-medium text-muted">
          Start booking flights in minutes
        </p>
      </div>

      {/* Form */}
      <SignupForm />
    </div>
  );
}
