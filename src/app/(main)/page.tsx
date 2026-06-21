import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FlightSearchForm } from '@/features/flights/components/flight-search-form';
import { HeroIllustration } from '@/components/marketing/hero-illustration';
import { NewsletterForm } from '@/components/marketing/newsletter-form';


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
    <div className="w-[100vw] relative left-1/2 right-1/2 -translate-x-1/2 -mt-[5.5rem] -mb-6 min-h-screen bg-[url('/images/skybooker_sky_blue_3d_bg.png')] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col pb-24 text-white">
      {/* Semi-transparent dark/blue gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-900/10 to-sky-950/60 backdrop-blur-[0.5px] pointer-events-none" />

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

        {/* Trusted Partners Banner */}
        <div className="w-full mt-10 mb-6 py-6 border-t border-b border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center rounded-2xl scroll-fade">
          <p className="text-[10px] font-bold text-sky-300 tracking-widest uppercase mb-4 opacity-80">Supported Global Airlines</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 px-6">
            {[
              { name: 'Singapore Airlines', logo: '🇸🇬' },
              { name: 'Emirates', logo: '🇦🇪' },
              { name: 'Qatar Airways', logo: '🇶🇦' },
              { name: 'Lufthansa', logo: '🇩🇪' },
              { name: 'British Airways', logo: '🇬🇧' },
              { name: 'Delta Air Lines', logo: '🇺🇸' },
            ].map((airline) => (
              <div key={airline.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-default">
                <span>{airline.logo}</span>
                <span className="font-semibold tracking-wide">{airline.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights section in matching glass design */}
        <div className="grid gap-6 sm:grid-cols-3 mt-4 pb-12 scroll-fade">
          <div className="card-3d rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg flex flex-col justify-start">
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

          <div className="card-3d rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg flex flex-col justify-start">
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

          <div className="card-3d rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg flex flex-col justify-start">
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

        {/* Why Choose SkyBooker Grid */}
        <div className="mt-20 space-y-8 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Why Fly With SkyBooker?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 font-medium">
              We combine cutting-edge transactional security with premium customer travel guarantees.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Best Price Guarantee',
                desc: 'Find a cheaper published fare for the same route and cabin? We will match it and refund the difference.',
                icon: '🏷️',
              },
              {
                title: '24/7 Premium Support',
                desc: 'Direct access to our dedicated customer support desk. Real humans, not bots, ready to resolve issues.',
                icon: '📞',
              },
              {
                title: 'Zero Reschedule Fees',
                desc: 'Change your travel date up to 24 hours before departure with zero added rescheduling penalties.',
                icon: '🔄',
              },
              {
                title: 'Secure Flight Ticketing',
                desc: 'Fully encrypted transaction pathways coupled with instantaneous PNR registration at the airline.',
                icon: '🛡️',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card-3d rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-md flex flex-col justify-between"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-white text-base">{item.title}</h4>
                  <p className="mt-2 text-xs text-gray-300 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Section */}
        <div className="mt-24 space-y-8 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Trending Destinations
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 font-medium">
              Explore hot schedules and live fares to our most popular connection hubs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                city: 'New Delhi',
                code: 'DEL',
                tagline: 'Capital Hub & Culture',
                price: '₹3,250',
                gradient: 'from-orange-500/30 to-rose-600/30 border-orange-500/20',
              },
              {
                city: 'Kolkata',
                code: 'CCU',
                tagline: 'City of Joy & Heritage',
                price: '₹4,100',
                gradient: 'from-violet-600/30 to-indigo-600/30 border-indigo-500/20',
              },
              {
                city: 'Mumbai',
                code: 'BOM',
                tagline: 'Gateway of India & Finance',
                price: '₹3,800',
                gradient: 'from-emerald-500/30 to-teal-600/30 border-emerald-500/20',
              },
            ].map((dest) => (
              <div
                key={dest.code}
                className="card-3d group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
              >
                {/* Decorative Gradient Top Block */}
                <div className={`h-32 bg-gradient-to-tr ${dest.gradient} border-b relative flex items-center justify-between p-6 overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                  <div className="z-10">
                    <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">Flight Deal</p>
                    <h4 className="text-xl font-bold text-white mt-0.5">{dest.city}</h4>
                  </div>
                  <span className="z-10 text-4xl font-extrabold text-white/15 tracking-tighter select-none">{dest.code}</span>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-xs text-gray-300">{dest.tagline}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[10px] text-gray-400">One-way starts from</p>
                      <p className="text-lg font-extrabold text-white">{dest.price}</p>
                    </div>
                    <Link
                      href={`/search?origin=Delhi&destination=${dest.city}&departureDate=${new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]}&passengers=1`}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-white/20 hover:scale-105"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-28 space-y-10 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              How SkyBooker Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 font-medium">
              A seamless and completely safe experience from booking to take-off.
            </p>
          </div>

          <div className="relative">
            {/* Visual connecting line for desktop */}
            <div className="absolute top-1/2 left-4 right-4 hidden h-0.5 -translate-y-1/2 bg-white/10 sm:block" />

            <div className="grid gap-8 sm:grid-cols-3 relative z-10">
              {[
                {
                  step: '01',
                  title: 'Explore Live Schedules',
                  desc: 'Search direct flight schedules fetched in real-time from our global schedules provider.',
                  icon: '🔍',
                },
                {
                  step: '02',
                  title: 'Select Seat Grid',
                  desc: 'Pick your preferred seat class (Economy, Business, First) with absolute double-booking protection.',
                  icon: '💺',
                },
                {
                  step: '03',
                  title: 'Instant Confirmation',
                  desc: 'Get your transactional PNR instantly. View, manage, or reschedule bookings from your dashboard.',
                  icon: '✅',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-center space-y-3 transition-all hover:bg-white/10"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-2xl text-white">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Step {item.step}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-light font-sans">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Reviews / Testimonials Section */}
        <div className="mt-28 space-y-8 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Loved by Frequent Flyers
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 font-medium">
              See what corporate travel managers, solo explorers, and families say about SkyBooker.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                name: 'Sarah Jenkins',
                role: 'Corporate Travel Manager',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120',
                rating: 5,
                text: 'SkyBooker has completely streamlined our company travel bookings. The live seat selection is fast, and the double-booking protection is a lifesaver.',
              },
              {
                name: 'David Chen',
                role: 'Solo Adventurer',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
                rating: 5,
                text: 'The absolute cleanest interface for booking flights. The live seat map updates are instantaneous and the pricing is 100% transparent. Highly recommend.',
              },
              {
                name: 'Elena Rostova',
                role: 'Family Traveler',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
                rating: 5,
                text: 'Rescheduling our family holiday flights was incredibly simple. The support team handled our request in minutes with zero extra booking fees.',
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="card-3d rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-10 w-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{review.name}</h4>
                    <p className="text-[10px] text-gray-400 font-light">{review.role}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-light italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">★</span>
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">5.0 / 5.0 Rating</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-28 max-w-3xl mx-auto space-y-8 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 font-medium">
              Everything you need to know about booking and safety protocols.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How do I check in or manage my booking?',
                a: 'You can manage all active and past bookings under the "My Bookings" tab after logging in. There, you can view your ticket details, download your receipt, cancel, or reschedule your flight dates instantly.',
              },
              {
                q: 'How is seat locking secured on SkyBooker?',
                a: 'SkyBooker uses transactional PostgreSQL row-level locks (RLS) during seat selection. When you select a seat and check out, the seat is locked exclusively for your transaction, making it impossible for two users to book the same seat simultaneously.',
              },
              {
                q: 'Is the flight search schedules board live?',
                a: 'Yes! All flight schedules are fetched live directly from the AirLabs developer schedule API, giving you actual flight schedules matching real-world airline routes.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 transition-all hover:bg-white/10 cursor-pointer"
              >
                <summary className="flex items-center justify-between text-sm font-semibold text-white outline-none select-none">
                  <span>{faq.q}</span>
                  <span className="text-[10px] text-gray-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-xs text-gray-300 leading-relaxed font-light border-t border-white/10 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Travel Newsletter Subscription Section */}
        <div className="mt-28 w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-tr from-blue-950/40 to-sky-900/30 backdrop-blur-xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden scroll-fade">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Never Miss a Fare Drop</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Subscribe for Flight Deals
            </h2>
            <p className="mx-auto max-w-md text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Join 50k+ savvy travelers who receive custom price alerts, exclusive airline discounts, and global itinerary suggestions direct to their inbox.
            </p>
          </div>
          <div className="relative z-10">
            <NewsletterForm />
          </div>
        </div>

        {/* Premium Corporate Footer */}
        <footer className="mt-32 pt-12 border-t border-white/10 space-y-8 relative z-10">
          <div className="grid gap-8 sm:grid-cols-4 text-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">✈️</span>
                <span className="text-base font-extrabold tracking-tight text-white">SkyBooker</span>
              </div>
              <p className="text-gray-400 leading-relaxed font-light">
                Premium autonomous flight booking platform. Real-time schedules, interactive seat locking, and live passenger ticketing updates.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/search" className="hover:text-white transition-colors">Flight Search</Link></li>
                <li><Link href="/bookings" className="hover:text-white transition-colors">Interactive Seats</Link></li>
                <li><span className="text-white/30 cursor-not-allowed">Hotel Deals (Soon)</span></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Security Standards</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Partner Portal</span></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href={"/terms" as any} className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href={"/privacy" as any} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">GDPR Compliance</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-[10px] text-gray-500 sm:flex-row">
            <p>© {new Date().getFullYear()} SkyBooker. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
              <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
