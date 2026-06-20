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
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-4rem)] bg-[url('/images/skybooker_hero_bg.png')] bg-cover bg-center bg-no-repeat bg-fixed relative flex flex-col pb-24 text-white">
      {/* Semi-transparent dark/blue gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-sky-950/15 to-sky-950/40 backdrop-blur-[1px] pointer-events-none" />

      {/* Content Column */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-start">
        {/* Local Container Nav (as a gorgeous floating glass pill navbar) */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3.5 shadow-lg relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
              SkyBooker
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={'/search' as any}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors drop-shadow-sm"
            >
              Deals
            </Link>
            <Link
              href={'/search' as any}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors drop-shadow-sm"
            >
              Destinations
            </Link>
            <Link
              href={'/search' as any}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors drop-shadow-sm"
            >
              Travel Guides
            </Link>
            <Link
              href={'/search' as any}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors drop-shadow-sm"
            >
              Support
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition-all shadow-sm"
            >
              Book a Flight
            </Link>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white text-xs font-bold shadow-sm">
              👤
            </div>
          </div>
        </div>

        {/* Hero Content Section */}
        <div className="relative w-full flex flex-col justify-center items-center py-16 sm:py-24">
          {/* Left Stats Ribbons (hidden on small screens, floated absolute relative to the page area) */}
          <div className="hidden xl:flex flex-col gap-3.5 absolute left-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="flex items-center gap-2 rounded-r-xl border-l-4 border-l-blue-500 bg-sky-950/30 backdrop-blur-md border border-white/10 px-4 py-3 text-xs font-bold text-white shadow-lg tracking-wide">
              450+ Airlines Supported
            </div>
            <div className="flex items-center gap-2 rounded-r-xl border-l-4 border-l-blue-500 bg-sky-950/30 backdrop-blur-md border border-white/10 px-4 py-3 text-xs font-bold text-white shadow-lg tracking-wide">
              12,230+ Destinations
            </div>
            <div className="flex items-center gap-2 rounded-r-xl border-l-4 border-l-blue-500 bg-sky-950/30 backdrop-blur-md border border-white/10 px-4 py-3 text-xs font-bold text-white shadow-lg tracking-wide">
              8.5M+ Flights Booked
            </div>
          </div>

          {/* Right Avatar Rating Stack (hidden on small screens, floated absolute) */}
          <div className="hidden xl:flex flex-col items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-sky-950/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
            <div className="flex -space-x-2">
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white/40 object-cover"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="avatar"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white/40 object-cover"
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="avatar"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white/40 object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                alt="avatar"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white/40 object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="avatar"
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-bold text-white flex items-center gap-1 drop-shadow-sm">
                <span className="text-yellow-400">★</span> 4.9
              </span>
              <span className="text-[10px] text-white/70 font-semibold drop-shadow-sm">
                (75.3k reviews)
              </span>
            </div>
          </div>

          {/* Headline Centered */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              Find the Best Flights <br className="hidden sm:inline" /> at the
              Best Prices
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-white/90 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Search, compare, and book flights from hundreds of airlines
              worldwide.
            </p>
          </div>

          {/* Overlapping Flight Search Widget with Glass Tabs */}
          <div className="w-full max-w-5xl mx-auto mt-6">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              {/* Tab Row matching reference image */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-white/15">
                {/* Left tabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    🏨 Hotel
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold bg-white text-blue-600 rounded-xl shadow-md transition-all"
                  >
                    ✈️ Flight
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    🍴 Restaurant
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    🗺️ Tour & Guides
                  </button>
                </div>
                {/* Right dropdown placeholders */}
                <div className="flex items-center gap-4 text-xs font-bold text-white/80">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <span>One way</span>
                    <span className="text-[9px]">▼</span>
                  </div>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <span>Business</span>
                    <span className="text-[9px]">▼</span>
                  </div>
                </div>
              </div>

              <FlightSearchForm
                compact={true}
                defaultValues={{
                  origin: searchParams?.origin,
                  destination: searchParams?.destination,
                  departureDate: searchParams?.departureDate,
                  passengers: searchParams?.passengers,
                }}
              />
            </div>
          </div>
        </div>

        {/* Feature Highlights section in matching glass design */}
        <div className="grid gap-6 sm:grid-cols-3 mt-8 pb-12">
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
            <h3 className="font-semibold text-white text-base font-medium">
              Smart Search
            </h3>
            <p className="mt-2 text-sm text-gray-200 leading-relaxed font-light">
              Filter by origin, destination, date, and passenger count across
              all available routes.
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
            <h3 className="font-semibold text-white text-base font-medium">
              Live Seat Map
            </h3>
            <p className="mt-2 text-sm text-gray-200 leading-relaxed font-light">
              Interactive seat selection with real-time availability powered by
              WebSocket updates.
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
            <h3 className="font-semibold text-white text-base font-medium">
              Race-Condition Safe
            </h3>
            <p className="mt-2 text-sm text-gray-200 leading-relaxed font-light">
              PostgreSQL row-level locking ensures no two users can book the
              same seat simultaneously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
