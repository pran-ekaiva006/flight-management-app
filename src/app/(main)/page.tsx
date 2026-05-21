import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch stats concurrently
  const [
    { count: flightCount },
    { data: bookings }
  ] = await Promise.all([
    supabase.from('flights').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('id, status').eq('user_id', user.id)
  ]);

  const activeBookings = bookings?.filter((b) => b.status === 'confirmed').length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 text-white shadow-xl shadow-gray-900/20 sm:p-8">
        <p className="text-sm font-medium text-gray-400">Welcome back,</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}! ✈️
        </h1>
        <p className="mt-2 text-sm text-gray-300">
          Ready to explore the skies? Search flights and book your next adventure.
        </p>
        <Link
          href="/search"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          Search Flights
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{flightCount || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Available flights</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeBookings}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active bookings</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Routes available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/search"
          className="group flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Search Flights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find and book your next flight</p>
          </div>
        </Link>

        <Link
          href="/bookings"
          className="group flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">My Bookings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your bookings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
