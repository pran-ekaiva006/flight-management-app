'use client';

import { logoutAction } from '@/features/auth/actions/auth-actions';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-all hover:bg-muted/10 hover:text-text"
      >
        Sign out
      </button>
    </form>
  );
}
