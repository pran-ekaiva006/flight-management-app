import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FlightSearchForm } from '@/features/flights/components/flight-search-form';
import { HeroIllustration } from '@/components/marketing/hero-illustration';

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
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-300 to-sky-100 dark:from-sky-950 dark:via-sky-900 dark:to-gray-950 px-6 py-20 pb-28 sm:px-12 sm:py-24 sm:pb-36 shadow-xl shadow-sky-500/10">
        {/* Background cloud blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-white/20 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute right-12 top-1/4 h-80 w-80 rounded-full bg-white/25 blur-3xl dark:bg-sky-400/10" />
          <div className="absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-white/20 blur-3xl dark:bg-sky-600/10" />
        </div>

        {/* Rotated Plane Silhouette */}
        <HeroIllustration />

        <div className="relative z-10 text-center lg:text-left lg:max-w-2xl">
          {/* Stat Chips */}
          <div className="flex flex-wrap gap-2.5 mb-6 justify-center lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1 text-xs font-semibold text-sky-950 shadow-sm backdrop-blur-sm dark:bg-gray-800/80 dark:text-sky-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
              4 Active Routes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1 text-xs font-semibold text-sky-950 shadow-sm backdrop-blur-sm dark:bg-gray-800/80 dark:text-sky-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
              Real-Time Seat Maps
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1 text-xs font-semibold text-sky-950 shadow-sm backdrop-blur-sm dark:bg-gray-800/80 dark:text-sky-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
              Instant Booking
            </span>
          </div>

          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-sky-950 dark:text-white leading-tight">
            Find Your Next Flight, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent dark:from-sky-400 dark:to-indigo-400">Faster.</span>
          </h1>

          <p className="mx-auto lg:mx-0 mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-sky-900/85 dark:text-sky-200/80">
            Compare routes, view live interactive seat availability, and lock in your next trip instantly.
          </p>
        </div>
      </div>

      {/* Overlapping Flight Search Widget */}
      <div className="-mt-20 sm:-mt-24 relative z-10 mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-gray-200/60 bg-white/95 p-6 shadow-xl backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-900/95">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
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
            </div>
            <h2 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Search Flights</h2>
          </div>
          <FlightSearchForm compact={true} />
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid gap-6 sm:grid-cols-3 pt-4">
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
