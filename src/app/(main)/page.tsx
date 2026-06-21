import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FlightSearchForm } from '@/features/flights/components/flight-search-form';
import { AnimatedHeroBackground } from '@/components/marketing/animated-hero-background';
import { NewsletterForm } from '@/components/marketing/newsletter-form';
import { Search, Armchair, CheckCircle2, Tag, Headset, CalendarClock, ShieldCheck } from 'lucide-react';


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
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-700 p-6 text-white shadow-xl shadow-primary/20 sm:p-8">
          <p className="text-sm font-medium text-white/70">Welcome back,</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl font-heading">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}! ✈️
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Ready to explore the skies? Search flights and book your next
            adventure.
          </p>
          <Link
            href="/search"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
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
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{flightCount || 0}</p>
                <p className="text-xs text-muted">Available flights</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{activeBookings}</p>
                <p className="text-xs text-muted">Active bookings</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{uniqueRoutes}</p>
                <p className="text-xs text-muted">Routes available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/search"
            className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-text">Search Flights</h3>
              <p className="text-sm text-muted">Find and book your next flight</p>
            </div>
          </Link>

          <Link
            href="/bookings"
            className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-text">My Bookings</h3>
              <p className="text-sm text-muted">View and manage your bookings</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Guest: show public landing page ──────────────────
  return (
    <div className="w-[100vw] relative left-1/2 right-1/2 -translate-x-1/2 -mt-[5.5rem] -mb-6 min-h-screen bg-background flex flex-col pb-24 text-text overflow-hidden">

      {/* Animated Abstract Background */}
      <AnimatedHeroBackground />

      {/* Content Column */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-start pt-[5.5rem]">
        {/* Hero Content Section */}
        <div className="relative w-full flex flex-col items-center py-16 sm:py-24 space-y-12">
          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-text font-heading leading-tight">
              Find the Best Flights <br className="hidden sm:inline" /> at the Best Prices
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted font-medium">
              Search, compare, and book flights from hundreds of airlines worldwide. Experience travel booking without the friction.
            </p>
          </div>

          {/* Premium Glassmorphism Search Panel */}
          <div className="w-full max-w-4xl mx-auto rounded-3xl border border-border/60 bg-surface/40 backdrop-blur-2xl p-6 shadow-2xl shadow-primary/5">
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
                <img className="inline-block h-5 w-5 rounded-full ring-2 ring-surface object-cover" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="avatar" />
                <img className="inline-block h-5 w-5 rounded-full ring-2 ring-surface object-cover" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="avatar" />
                <img className="inline-block h-5 w-5 rounded-full ring-2 ring-surface object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="avatar" />
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
          <p className="text-[10px] font-bold text-muted tracking-widest uppercase mb-4">Supported Global Airlines</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 px-6">
            {[
              { name: 'Singapore Airlines', code: 'SQ' },
              { name: 'Emirates', code: 'EK' },
              { name: 'Qatar Airways', code: 'QR' },
              { name: 'Lufthansa', code: 'LH' },
              { name: 'British Airways', code: 'BA' },
              { name: 'Delta Air Lines', code: 'DL' },
            ].map((airline) => (
              <div key={airline.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/40 border border-border/40 text-xs text-muted hover:text-text hover:bg-surface/80 transition-all cursor-default">
                <span className="font-mono font-bold text-[10px] text-primary">{airline.code}</span>
                <span className="font-semibold tracking-wide">{airline.name}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Why Choose SkyBooker */}
        <div id="why-choose-us" className="mt-24 space-y-12 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl font-heading">
              Why Fly With SkyBooker?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted font-medium">
              We combine cutting-edge transactional security with premium customer travel guarantees.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Best Price Guarantee', desc: 'Find a cheaper published fare for the same route and cabin? We will match it and refund the difference.', icon: <Tag className="h-8 w-8" /> },
              { title: '24/7 Premium Support', desc: 'Direct access to our dedicated customer support desk. Real humans, not bots, ready to resolve issues.', icon: <Headset className="h-8 w-8" /> },
              { title: 'Zero Reschedule Fees', desc: 'Change your travel date up to 24 hours before departure with zero added rescheduling penalties.', icon: <CalendarClock className="h-8 w-8" /> },
              { title: 'Secure Flight Ticketing', desc: 'Fully encrypted transaction pathways coupled with instantaneous PNR registration at the airline.', icon: <ShieldCheck className="h-8 w-8" /> },
            ].map((item, idx) => (
              <div key={idx} className="card-3d rounded-3xl border border-border/40 bg-surface/50 backdrop-blur-md p-8 shadow-sm flex flex-col justify-between group hover:bg-surface/80 transition-all">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-text text-base font-heading">{item.title}</h4>
                  <p className="mt-3 text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Destinations */}
        <div id="destinations" className="mt-32 space-y-12 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl font-heading">
              Trending Destinations
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted font-medium">
              Explore hot schedules and live fares to our most popular connection hubs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { city: 'New Delhi', code: 'DEL', tagline: 'Capital Hub & Culture', price: '₹3,250', gradient: 'from-orange-500/10 to-rose-600/10 text-orange-600 dark:text-orange-400' },
              { city: 'Kolkata', code: 'CCU', tagline: 'City of Joy & Heritage', price: '₹4,100', gradient: 'from-violet-600/10 to-indigo-600/10 text-indigo-600 dark:text-indigo-400' },
              { city: 'Mumbai', code: 'BOM', tagline: 'Gateway of India & Finance', price: '₹3,800', gradient: 'from-emerald-500/10 to-teal-600/10 text-emerald-600 dark:text-emerald-400' },
            ].map((dest) => (
              <div key={dest.code} className="card-3d group overflow-hidden rounded-3xl border border-border/40 bg-surface shadow-sm">
                <div className={`h-32 bg-gradient-to-tr ${dest.gradient} border-b border-border/40 relative flex items-center justify-between p-6 overflow-hidden`}>
                  <div className="z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Flight Deal</p>
                    <h4 className="text-xl font-extrabold mt-1 font-heading">{dest.city}</h4>
                  </div>
                  <span className="z-10 text-5xl font-black opacity-10 tracking-tighter select-none">{dest.code}</span>
                </div>
                <div className="p-6 space-y-5 bg-surface">
                  <p className="text-xs text-muted">{dest.tagline}</p>
                  <div className="flex items-center justify-between border-t border-border/40 pt-5">
                    <div>
                      <p className="text-[10px] text-muted font-medium uppercase tracking-wider">One-way from</p>
                      <p className="text-lg font-extrabold text-text mt-1">{dest.price}</p>
                    </div>
                    <Link
                      href={`/search?origin=Delhi&destination=${dest.city}&departureDate=${new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]}&passengers=1`}
                      className="rounded-xl bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mt-32 space-y-12 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl font-heading">
              How SkyBooker Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted font-medium">
              A seamless and completely safe experience from booking to take-off.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-4 right-4 hidden h-0.5 -translate-y-1/2 bg-border/30 sm:block" />
            <div className="grid gap-8 sm:grid-cols-3 relative z-10">
              {[
                { step: '01', title: 'Explore Live Schedules', desc: 'Search direct flight schedules fetched in real-time from our global schedules provider.', icon: <Search className="h-6 w-6" /> },
                { step: '02', title: 'Select Seat Grid', desc: 'Pick your preferred seat class (Economy, Business, First) with absolute double-booking protection.', icon: <Armchair className="h-6 w-6" /> },
                { step: '03', title: 'Instant Confirmation', desc: 'Get your transactional PNR instantly. View, manage, or reschedule bookings from your dashboard.', icon: <CheckCircle2 className="h-6 w-6" /> },
              ].map((item) => (
                <div key={item.step} className="rounded-3xl border border-border/40 bg-surface/50 backdrop-blur-md p-8 text-center space-y-4 transition-all hover:bg-surface/80 group">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Step {item.step}</span>
                    <h3 className="text-lg font-bold text-text mt-1 font-heading">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Reviews */}
        <div id="reviews" className="mt-32 space-y-12 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl font-heading">
              Loved by Frequent Flyers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted font-medium">
              See what corporate travel managers, solo explorers, and families say about SkyBooker.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { name: 'Sarah Jenkins', role: 'Corporate Travel Manager', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120', rating: 5, text: 'SkyBooker has completely streamlined our company travel bookings. The live seat selection is fast, and the double-booking protection is a lifesaver.' },
              { name: 'David Chen', role: 'Solo Adventurer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120', rating: 5, text: 'The absolute cleanest interface for booking flights. The live seat map updates are instantaneous and the pricing is 100% transparent. Highly recommend.' },
              { name: 'Elena Rostova', role: 'Family Traveler', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120', rating: 5, text: 'Rescheduling our family holiday flights was incredibly simple. The support team handled our request in minutes with zero extra booking fees.' },
            ].map((review, idx) => (
              <div key={idx} className="card-3d rounded-3xl border border-border/40 bg-surface/50 backdrop-blur-md p-6 flex flex-col justify-between space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover border border-border/40" />
                  <div>
                    <h4 className="text-xs font-bold text-text">{review.name}</h4>
                    <p className="text-[10px] text-muted">{review.role}</p>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed italic">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-1 pt-2 border-t border-border/30">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">★</span>
                  ))}
                  <span className="text-[10px] text-muted ml-1">5.0 / 5.0 Rating</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div id="faqs" className="mt-32 max-w-3xl mx-auto space-y-12 scroll-fade">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl font-heading">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted font-medium">
              Everything you need to know about booking and safety protocols.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How do I check in or manage my booking?', a: 'You can manage all active and past bookings under the "My Bookings" tab after logging in. There, you can view your ticket details, download your receipt, cancel, or reschedule your flight dates instantly.' },
              { q: 'How is seat locking secured on SkyBooker?', a: 'SkyBooker uses transactional PostgreSQL row-level locks (RLS) during seat selection. When you select a seat and check out, the seat is locked exclusively for your transaction, making it impossible for two users to book the same seat simultaneously.' },
              { q: 'Is the flight search schedules board live?', a: 'Yes! All flight schedules are fetched live directly from the AirLabs developer schedule API, giving you actual flight schedules matching real-world airline routes.' },
            ].map((faq, idx) => (
              <details key={idx} className="group rounded-2xl border border-border/40 bg-surface/50 backdrop-blur-md p-5 transition-all hover:bg-surface/80 cursor-pointer">
                <summary className="flex items-center justify-between text-sm font-semibold text-text outline-none select-none">
                  <span>{faq.q}</span>
                  <span className="text-[10px] text-muted transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-xs text-muted leading-relaxed border-t border-border/30 pt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-32 w-full max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-xl p-8 sm:p-12 text-center space-y-8 relative overflow-hidden scroll-fade">
          <div className="space-y-3 relative z-10">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Never Miss a Fare Drop</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight font-heading">
              Subscribe for Flight Deals
            </h2>
            <p className="mx-auto max-w-md text-sm text-muted leading-relaxed">
              Join 50k+ savvy travelers who receive custom price alerts, exclusive airline discounts, and global itinerary suggestions direct to their inbox.
            </p>
          </div>
          <div className="relative z-10 max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>

        <div className="h-24"></div>
      </div>
    </div>
  );
}
