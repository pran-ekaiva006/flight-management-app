import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/features/auth/actions/auth-actions';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      {/* Welcome Card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200/60 bg-white/80 p-8 text-center shadow-xl backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-800/60">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
          <svg
            className="h-8 w-8 text-white"
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
          Flight Management
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Welcome, {user.user_metadata?.full_name || user.email}
        </p>

        {/* Status badges */}
        <div className="mt-6 space-y-2 rounded-xl bg-gray-50 p-4 text-left text-xs dark:bg-gray-900/50">
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Authenticated
          </p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Session active
          </p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {user.email}
          </p>
        </div>

        {/* Logout */}
        <form action={logoutAction} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
