import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FlightSearchForm } from '@/features/flights/components/flight-search-form';
import { HeroIllustration } from '@/components/marketing/hero-illustration';

interface HomePageProps {
  searchParams: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    passengers?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─── Logged-in: show personalised dashboard ───────────
  if (user) {
    const [
      { count: flightCount },
      { data: bookings },
      { data: flightRoutes },
    ] = await Promise.all([
      supabase.from('flights').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('id, status').eq('user_id', user.id),
      supabase.from('flights').select('origin, destination'),
    ]);

    const activeBookings =
      bookings?.filter((b) => b.status === 'confirmed').length || 0;

    const uniqueRoutes = new Set(
      flightRoutes?.map((f) => `${f.origin.toUpperCase()}-${f.destination.toUpperCase()}`) || []
    ).size;

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
                  {uniqueRoutes}
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
    <div className="w-[100vw] relative left-1/2 right-1/2 -translate-x-1/2 -mt-[5.5rem] -mb-6 min-h-screen bg-[url('/images/skybooker_hero_bg.png')] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col pb-24 text-white">
      {/* Semi-transparent dark/blue gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-sky-950/15 to-sky-950/40 backdrop-blur-[1px] pointer-events-none" />

      {/* Content Column */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-start pt-[5.5rem]">
        {/* Hero Content Section */}
        <div className="relative w-full flex flex-col justify-center items-center py-16 sm:py-24">
          {/* Headline Centered */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              Find the Best Flights <br className="hidden sm:inline" /> at the Best Prices
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-white/90 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Search, compare, and book flights from hundreds of airlines worldwide.
            </p>
          </div>

          {/* Action button to explore flights */}
          <Link
            href="/search"
            className="mt-6 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-sky-950 hover:scale-[1.02]"
          >
            Explore Flights
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
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>

          {/* Horizontal glass metrics ribbon below search card */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-white/95 relative z-10 w-full max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
              <span className="text-sky-300">✈️</span>
              <span>450+ Airlines Supported</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
              <span className="text-sky-300">🌍</span>
              <span>12,230+ Destinations</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
              <span className="text-sky-300">🔥</span>
              <span>8.5M+ Flights Booked</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
              <div className="flex -space-x-1.5">
                <img
                  className="inline-block h-5 w-5 rounded-full ring-1 ring-white/30 object-cover"
                  src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="avatar"
                />
                <img
                  className="inline-block h-5 w-5 rounded-full ring-1 ring-white/30 object-cover"
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="avatar"
                />
                <img
                  className="inline-block h-5 w-5 rounded-full ring-1 ring-white/30 object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                  alt="avatar"
                />
              </div>
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span> 4.9{' '}
                <span className="text-[10px] text-white/70">(75.3k reviews)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Feature Highlights section in matching glass design */}
        <div className="grid gap-6 sm:grid-cols-3 mt-4 pb-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col justify-start">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
              <svg
                className="h-5 w-5"
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
            <h3 className="font-semibold text-white text-base">Smart Search</h3>
            <p className="mt-2 text-sm text-gray-200 leading-relaxed font-light">
              Filter by origin, destination, date, and passenger count across all available
              routes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col justify-start">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-white text-base">Live Seat Map</h3>
            <p className="mt-2 text-sm text-gray-200 leading-relaxed font-light">
              Interactive seat selection with real-time availability powered by WebSocket
              updates.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col justify-start">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-white text-base">Race-Condition Safe</h3>
            <p className="mt-2 text-sm text-gray-200 leading-relaxed font-light">
              PostgreSQL row-level locking ensures no two users can book the same seat
              simultaneously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
