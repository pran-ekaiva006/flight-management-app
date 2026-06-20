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

  // Map @example.com to @sourceasia.com to support resume-ready branding with existing DB accounts
  let loginEmail = parsed.data.email;
  if (loginEmail.endsWith('@example.com')) {
    loginEmail = loginEmail.replace('@example.com', '@sourceasia.com');
  }

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

export async function signupAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const raw = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid input' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
