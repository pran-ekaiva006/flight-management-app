import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { FlightSearchForm } from '@/features/flights/components/flight-search-form';
import { AnimatedHeroBackground } from '@/components/marketing/animated-hero-background';
import { NewsletterForm } from '@/components/marketing/newsletter-form';
import {
  Search,
  Armchair,
  CheckCircle2,
  Tag,
  Headset,
  CalendarClock,
  ShieldCheck,
  PlaneTakeoff,
  Map,
  Ticket,
  Compass,
  Navigation,
  ArrowRight,
  Globe,
  QrCode,
} from 'lucide-react';

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
    const [{ count: flightCount }, { data: bookings }, { data: flightRoutes }] =
      await Promise.all([
        supabase.from('flights').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('id, status').eq('user_id', user.id),
        supabase.from('flights').select('origin, destination'),
      ]);

    const activeBookings =
      bookings?.filter((b) => b.status === 'confirmed').length || 0;

    const uniqueRoutes = new Set(
      flightRoutes?.map(
        (f) => `${f.origin.toUpperCase()}-${f.destination.toUpperCase()}`,
      ) || [],
    ).size;

    return (
      <div className="space-y-8">
        {/* Modern Travel Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-surface to-surface border border-border/40 p-8 sm:p-10 shadow-sm">
          {/* Detailed flight path graphic background */}
          <div className="absolute right-0 top-0 w-full h-full opacity-[0.04] dark:opacity-[0.06] pointer-events-none transition-transform duration-1000 hover:scale-105 flex justify-end overflow-hidden">
            <svg
              viewBox="0 0 400 200"
              className="h-full text-primary fill-none stroke-current w-[150%] sm:w-auto"
              strokeWidth="1"
              strokeDasharray="4 4"
            >
              <path d="M 50 150 Q 200 50 350 100" />
              <circle cx="50" cy="150" r="4" className="fill-current" />
              <circle cx="350" cy="100" r="4" className="fill-current" />
              <path
                d="M 100 180 Q 250 80 380 140"
                strokeDasharray="2 6"
                className="opacity-50"
              />
            </svg>
            <PlaneTakeoff className="absolute right-[10%] top-[35%] w-24 h-24 text-primary opacity-10 -rotate-12" />
          </div>

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" /> SkyBooker Travel
            </p>
            <h1 className="text-3xl font-extrabold sm:text-4xl font-heading text-text tracking-tight">
              Welcome back,{' '}
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted font-medium">
              {activeBookings > 0
                ? `You have ${activeBookings} upcoming flight reservation${activeBookings > 1 ? 's' : ''}. Your next adventure awaits.`
                : 'The world is waiting. Where will you explore next?'}
            </p>
          </div>
        </div>

        {/* Primary Content (Bento Grid) */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Search Action - Made MORE prominent */}
          <Link
            href="/search"
            className="lg:col-span-1 group relative overflow-hidden rounded-3xl bg-primary p-8 shadow-lg shadow-primary/20 transition-all hover:bg-primary-600 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="absolute right-0 top-0 w-full h-full opacity-10 pointer-events-none transition-transform group-hover:scale-110 group-hover:rotate-6 duration-700 flex items-center justify-end">
              <svg
                viewBox="0 0 100 100"
                className="w-64 h-64 fill-white translate-x-1/4 -translate-y-1/4"
              >
                <path
                  d="M50 15a35 35 0 1 0 0 70 35 35 0 1 0 0-70z"
                  opacity="0.5"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-md transition-transform duration-500 group-hover:scale-110">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-extrabold font-heading text-white tracking-tight">
                Find Flights
              </h3>
              <p className="mt-3 text-sm text-white/80 font-medium">
                Search our global network and book your next destination
                instantly.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-white transition-all relative z-10">
              <span className="group-hover:mr-2 transition-all">
                Start searching
              </span>{' '}
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Upcoming Trip / Empty State */}
          <div className="lg:col-span-2 rounded-3xl border border-border/40 bg-surface/50 backdrop-blur-xl p-8 shadow-sm flex flex-col justify-center transition-all hover:bg-surface/80 group relative overflow-hidden">
            {/* Background Map Graphic */}
            <Map className="absolute -right-10 -bottom-10 w-64 h-64 text-primary opacity-[0.02] dark:opacity-[0.04] pointer-events-none" />

            {activeBookings > 0 ? (
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-heading text-text flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" /> Active Itinerary
                  </h2>
                  <Link
                    href="/bookings"
                    className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Manage bookings <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Boarding Pass Style Card */}
                <div className="relative flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-background border border-border/40 p-0 shadow-sm overflow-hidden">
                  {/* Left edge decoration */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>

                  <div className="flex-1 space-y-4 w-full p-6 pl-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                          Reservation Status
                        </p>
                        <p className="mt-1.5 inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          Confirmed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                          Total Flights
                        </p>
                        <p className="mt-1 text-lg font-bold text-text">
                          {activeBookings} Booked
                        </p>
                      </div>
                    </div>

                    <div className="h-px w-full border-t-2 border-dashed border-border/60 my-2" />

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted font-medium max-w-sm">
                        Your flight reservations are confirmed. Access your full
                        itinerary to view departure details and seat
                        assignments.
                      </p>
                      <QrCode className="h-10 w-10 text-muted opacity-40 hidden sm:block" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 relative z-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
                  <Compass className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-heading text-text">
                    Ready for departure?
                  </h2>
                  <p className="mt-3 text-sm text-muted font-medium max-w-sm mx-auto">
                    You have no active flight reservations. The perfect getaway
                    is just a search away.
                  </p>
                </div>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-xl bg-surface border border-border px-6 py-3 text-sm font-bold text-text shadow-sm transition-all hover:bg-border/50 hover:shadow-md"
                >
                  <Map className="h-4 w-4 text-primary" /> Explore Destinations
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Content (Platform Overview) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-5 ml-1">
            Explore the World
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Available Routes */}
            <div className="rounded-3xl border border-border/40 bg-surface/50 backdrop-blur-xl p-6 shadow-sm flex items-center gap-5 group hover:bg-surface/80 transition-all relative overflow-hidden">
              <Globe className="absolute -right-4 -bottom-4 w-24 h-24 text-secondary opacity-5 pointer-events-none transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 transition-transform duration-500 group-hover:scale-110">
                <Navigation className="h-6 w-6" />
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-black tracking-tight text-text font-heading">
                  {uniqueRoutes}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1.5">
                  Global Destinations
                </p>
              </div>
            </div>

            {/* Total Flights */}
            <div className="rounded-3xl border border-border/40 bg-surface/50 backdrop-blur-xl p-6 shadow-sm flex items-center gap-5 group hover:bg-surface/80 transition-all relative overflow-hidden">
              <PlaneTakeoff className="absolute -right-4 -bottom-4 w-24 h-24 text-accent opacity-5 pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-12 duration-700" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20 transition-transform duration-500 group-hover:scale-110">
                <Ticket className="h-6 w-6" />
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-black tracking-tight text-text font-heading">
                  {flightCount || 0}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1.5">
                  Daily Departures
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Guest: show public landing page ──────────────────
  return (
    <div className="w-[100vw] relative left-1/2 right-1/2 -translate-x-1/2 -mt-[5.5rem] -mb-6 min-h-[85vh] bg-background flex flex-col pb-16 text-text overflow-hidden">
      {/* Animated Abstract Background */}
      <AnimatedHeroBackground />

      {/* Content Column */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-start pt-[6.5rem]">
        {/* Hero Content Section */}
        <div className="relative w-full flex flex-col items-center py-12 sm:py-16 space-y-10">
          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-7xl text-text font-heading leading-tight drop-shadow-sm">
              Fly Further. <br className="hidden sm:inline" /> Search Smarter.{' '}
              <br className="hidden sm:inline" /> Land Happier.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-muted font-medium">
              Search, compare, and book flights in real-time with zero hidden
              fees.
            </p>
          </div>

          {/* Premium Glassmorphism Search Panel */}
          <div className="w-full max-w-4xl mx-auto rounded-3xl glass-surface p-6 shadow-2xl shadow-violet-500/10">
            <FlightSearchForm compact={false} />
          </div>

          {/* Trust Metrics Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-text w-full max-w-5xl mx-auto px-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface/50 border border-border/50 backdrop-blur-md shadow-sm">
              <span className="text-primary text-base">✈️</span>
              <span>450+ Airlines</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface/50 border border-border/50 backdrop-blur-md shadow-sm">
              <span className="text-primary text-base">🌍</span>
              <span>12,230+ Destinations</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface/50 border border-border/50 backdrop-blur-md shadow-sm">
              <span className="text-primary text-base">🔥</span>
              <span>8.5M+ Flights Booked</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface/50 border border-border/50 backdrop-blur-md shadow-sm">
              <div className="flex -space-x-1.5">
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-surface object-cover"
                  src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="avatar"
                />
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-surface object-cover"
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="avatar"
                />
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-surface object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                  alt="avatar"
                />
              </div>
              <span className="flex items-center gap-1 text-muted">
                <span className="text-yellow-400">★</span> 4.9{' '}
                <span className="text-[10px]">(75.3k reviews)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Trusted Partners Banner */}
        <div className="w-full mt-10 mb-6 py-6 border-y border-border/30 bg-surface/30 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl scroll-fade">
          <p className="text-[10px] font-bold text-muted tracking-widest uppercase mb-4">
            Supported Global Airlines
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 px-6">
            {[
              { name: 'Singapore Airlines', code: 'SQ' },
              { name: 'Emirates', code: 'EK' },
              { name: 'Qatar Airways', code: 'QR' },
              { name: 'Lufthansa', code: 'LH' },
              { name: 'British Airways', code: 'BA' },
              { name: 'Delta Air Lines', code: 'DL' },
            ].map((airline) => (
              <div
                key={airline.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/40 border border-border/40 text-xs text-muted hover:text-text hover:bg-surface/80 transition-all cursor-default"
              >
                <span className="font-mono font-bold text-[10px] text-primary">
                  {airline.code}
                </span>
                <span className="font-semibold tracking-wide">
                  {airline.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose SkyBooker — Secondary Tier */}
        <div
          id="why-choose-us"
          className="mt-16 sm:mt-20 space-y-8 scroll-fade"
        >
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl font-heading">
              Why Fly With SkyBooker?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted font-medium">
              We combine cutting-edge transactional security with premium
              customer travel guarantees.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Best Price Guarantee',
                desc: 'Find a cheaper published fare for the same route and cabin? We will match it and refund the difference.',
                icon: <Tag className="h-6 w-6" />,
              },
              {
                title: '24/7 Premium Support',
                desc: 'Direct access to our dedicated customer support desk. Real humans, not bots, ready to resolve issues.',
                icon: <Headset className="h-6 w-6" />,
              },
              {
                title: 'Zero Reschedule Fees',
                desc: 'Change your travel date up to 24 hours before departure with zero added rescheduling penalties.',
                icon: <CalendarClock className="h-6 w-6" />,
              },
              {
                title: 'Secure Flight Ticketing',
                desc: 'Fully encrypted transaction pathways coupled with instantaneous PNR registration at the airline.',
                icon: <ShieldCheck className="h-6 w-6" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/30 bg-surface/30 p-6 flex flex-col gap-4 group hover:bg-surface/50 transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-text text-sm font-heading">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Destinations — Primary Tier */}
        <div
          id="destinations"
          className="mt-16 sm:mt-24 space-y-10 scroll-fade"
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl font-heading">
              Explore Popular Hubs
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted font-medium">
              Discover exclusive fares to the world's most sought-after
              destinations.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                city: 'New Delhi',
                code: 'DEL',
                price: '₹3,250',
                image:
                  'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600&h=750',
              },
              {
                city: 'Mumbai',
                code: 'BOM',
                price: '₹3,800',
                image:
                  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=600&h=750',
              },
              {
                city: 'Bangkok',
                code: 'BKK',
                price: '₹9,500',
                image:
                  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600&h=750',
              },
              {
                city: 'Dubai',
                code: 'DXB',
                price: '₹12,400',
                image:
                  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600&h=750',
              },
            ].map((dest, idx) => (
              <Link
                key={dest.code}
                href={`/search?origin=Delhi&destination=${dest.city}&departureDate=${new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]}&passengers=1`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/20"
              >
                <Image
                  src={dest.image}
                  alt={`${dest.city} skyline`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={idx < 2}
                />

                {/* Gradient Overlay for Text Readability */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.85) 100%)',
                  }}
                />

                {/* Airport Code Pill */}
                <div className="absolute top-4 right-4 z-20 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/30 shadow-sm">
                  {dest.code}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col items-start justify-end">
                  <h4 className="text-3xl font-extrabold text-white font-heading tracking-tight mb-4">
                    {dest.city}
                  </h4>

                  <div className="w-full flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold mb-1">
                        One-way from
                      </p>
                      <div className="rounded-lg accent-gradient px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                        {dest.price}
                      </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works — Secondary Tier */}
        <div id="how-it-works" className="mt-16 sm:mt-20 space-y-8 scroll-fade">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl font-heading">
              How SkyBooker Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted font-medium">
              A seamless and completely safe experience from booking to
              take-off.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-4 right-4 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border/40 to-transparent sm:block" />
            <div className="grid gap-6 sm:grid-cols-3 relative z-10">
              {[
                {
                  step: '01',
                  title: 'Explore Live Schedules',
                  desc: 'Search direct flight schedules fetched in real-time from our global schedules provider.',
                  icon: <Search className="h-5 w-5" />,
                },
                {
                  step: '02',
                  title: 'Select Seat Grid',
                  desc: 'Pick your preferred seat class (Economy, Business, First) with absolute double-booking protection.',
                  icon: <Armchair className="h-5 w-5" />,
                },
                {
                  step: '03',
                  title: 'Instant Confirmation',
                  desc: 'Get your transactional PNR instantly. View, manage, or reschedule bookings from your dashboard.',
                  icon: <CheckCircle2 className="h-5 w-5" />,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-border/30 bg-surface/30 p-6 text-center space-y-3 transition-all hover:bg-surface/50 group"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500 transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-500 tracking-widest uppercase">
                      Step {item.step}
                    </span>
                    <h3 className="text-base font-bold text-text mt-1 font-heading">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Reviews — Secondary Tier */}
        <div
          id="reviews"
          className="mt-16 sm:mt-20 space-y-8 scroll-fade overflow-hidden"
        >
          <div className="text-center px-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl font-heading">
              Loved by Frequent Flyers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted font-medium">
              See what corporate travel managers, solo explorers, and families
              say about SkyBooker.
            </p>
          </div>

          <div
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 sm:px-8 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {[
              {
                name: 'Sarah Jenkins',
                initials: 'SJ',
                role: 'Corporate Travel Manager',
                route: 'JFK → LHR',
                text: 'SkyBooker has completely streamlined our company travel bookings. The live seat selection is fast, and the double-booking protection is a lifesaver.',
              },
              {
                name: 'David Chen',
                initials: 'DC',
                role: 'Solo Adventurer',
                route: 'SFO → NRT',
                text: 'The absolute cleanest interface for booking flights. The live seat map updates are instantaneous and the pricing is 100% transparent.',
              },
              {
                name: 'Elena Rostova',
                initials: 'ER',
                role: 'Family Traveler',
                route: 'CDG → DXB',
                text: 'Rescheduling our family holiday flights was incredibly simple. The support team handled our request in minutes with zero extra booking fees.',
              },
              {
                name: 'Marcus Adebayo',
                initials: 'MA',
                role: 'Digital Nomad',
                route: 'LHR → CPT',
                text: 'I book flights almost weekly, and the speed of this platform is unmatched. Real-time pricing with no hidden checkout fees keeps me coming back.',
              },
              {
                name: 'Chloe Dubois',
                initials: 'CD',
                role: 'Event Coordinator',
                route: 'YVR → JFK',
                text: 'Coordinating group travel used to be a nightmare. The clear itinerary management and fast ticketing on SkyBooker made it completely frictionless.',
              },
              {
                name: 'Arjun Patel',
                initials: 'AP',
                role: 'Business Consultant',
                route: 'BOM → SIN',
                text: 'The interface is incredibly premium and fast. Secure ticketing gives me peace of mind when booking last-minute expensive business class seats.',
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-[85vw] sm:w-[400px] rounded-3xl border border-border/40 bg-surface p-6 flex flex-col space-y-5 shadow-sm transition-all hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${review.initials}&backgroundColor=6d28d9,38bdf8&textColor=ffffff`}
                      alt={review.name}
                      className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-border"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-text flex items-center gap-1.5">
                        {review.name}
                        <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                      </h4>
                      <p className="text-[10px] text-muted">{review.role}</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-surface/50 border border-border px-2.5 py-1 text-[10px] font-bold text-muted flex items-center gap-1">
                    <PlaneTakeoff className="h-3 w-3 text-violet-500" />{' '}
                    {review.route}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-3.5 w-3.5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm text-text/80 leading-relaxed font-medium">
                  &quot;{review.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs — Tertiary Tier */}
        <div
          id="faqs"
          className="mt-12 sm:mt-16 max-w-3xl mx-auto space-y-6 scroll-fade"
        >
          <div className="text-center">
            <h2 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl font-heading">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-muted font-medium">
              Everything you need to know about booking and safety protocols.
            </p>
          </div>

          <div className="space-y-3">
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
                className="group rounded-xl border border-border/30 bg-surface/30 p-4 transition-all hover:bg-surface/50 cursor-pointer"
              >
                <summary className="flex items-center justify-between text-sm font-semibold text-text outline-none select-none">
                  <span>{faq.q}</span>
                  <span className="text-[10px] text-muted transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-xs text-muted leading-relaxed border-t border-border/30 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Newsletter — Single-Row CTA Banner (Tertiary Tier) */}
        <div className="mt-12 sm:mt-16 w-full rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 via-sky-500/5 to-violet-500/5 backdrop-blur-xl px-6 py-5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 scroll-fade">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl accent-gradient text-white shrink-0">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-text font-heading">
                Never Miss a Fare Drop
              </h3>
              <p className="text-xs text-muted">
                Join 50k+ travelers getting exclusive flight deals.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto sm:max-w-xs shrink-0">
            <NewsletterForm />
          </div>
        </div>

        <div className="h-12"></div>
      </div>
    </div>
  );
}
