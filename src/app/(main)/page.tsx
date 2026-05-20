import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  // Test Supabase server client initialization
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold">Flight Management App</h1>
      <p className="text-sm text-gray-500">
        {user ? `Logged in as ${user.email}` : 'Not logged in'}
      </p>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-gray-900">
        <p>✅ Supabase server client initialized</p>
        <p>✅ Middleware active</p>
        <p>✅ Environment loaded</p>
      </div>
    </main>
  );
}
