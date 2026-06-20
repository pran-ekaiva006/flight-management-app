import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─── Logged-in: show personalised dashboard ───────────
  if (user) {
    const [{ count: flightCount }, { data: bookings }] = await Promise.all([
      supabase.from('flights').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('id, status').eq('user_id', user.id),
    ]);

    const activeBookings =
      bookings?.filter((b) => b.status === 'confirmed').length || 0;

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 text-white shadow-xl shadow-gray-900/20 sm:p-8">
          <p className="text-sm font-medium text-gray-400">Welcome back,</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}! ✈️
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Ready to explore the skies? Search flights and book your next
            adventure.
          </p>
          <Link
            href="/search"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
          >
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            Search Flights
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <svg
                  className="h-5 w-5"
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
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {flightCount || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Available flights
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeBookings}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active bookings
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  4
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Routes available
                </p>
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
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Search Flights
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Find and book your next flight
              </p>
            </div>
          </Link>

          <Link
            href="/bookings"
            className="group flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                My Bookings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and manage your bookings
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Guest: show public landing page ──────────────────
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-16 text-center text-white shadow-2xl shadow-gray-900/30 sm:px-12 sm:py-24">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
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

          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Book your next flight
            <br />
            <span className="text-gray-400">with SkyBooker</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Search hundreds of flights, pick your seat in real time, and get
            instant booking confirmation — all in one place.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/search"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl sm:w-auto"
            >
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              Search Flights
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Smart Search</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Filter by origin, destination, date, and passenger count across all
            available routes.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Live Seat Map</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Interactive seat selection with real-time availability powered by
            WebSocket updates.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Race-Condition Safe</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            PostgreSQL row-level locking ensures no two users can book the same
            seat simultaneously.
          </p>
        </div>
      </div>
    </div>
  );
}
