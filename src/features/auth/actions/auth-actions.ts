'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { loginSchema, signupSchema } from '../schemas/auth-schema';

export type AuthActionResult = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid input' };
  }

  const loginEmail = parsed.data.email;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/');
}

export async function signInWithGoogleAction(): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signupAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  console.log('--- SIGNUP ACTION STARTED ---');
  
  const raw = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };
  
  console.log('Received raw data:', { ...raw, password: '[REDACTED]', confirmPassword: '[REDACTED]' });

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation failed:', parsed.error.issues);
    return { error: parsed.error.issues[0]?.message || 'Invalid input' };
  }

  console.log('Calling Supabase signUp for email:', parsed.data.email);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    console.error('Supabase signUp error:', error.message);
    return { error: error.message };
  }

  // If email confirmation is disabled, Supabase auto-logs the user in.
  // The user explicitly requested to be redirected to the sign in page.
  // We sign them out immediately to ensure they actually have to log in.
  await supabase.auth.signOut();

  console.log('Supabase signUp success:', data);
  return { success: true };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
