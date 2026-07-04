import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Navigation,
  ArrowRight,
  Plane,
  Globe,
  MapPin,
} from 'lucide-react';
import {
  ROUTE_DEFINITIONS,
  getAirportName,
  getRegionLabel,
  type RouteDefinition,
} from '@/features/flights/utils/airport-codes';

export const metadata: Metadata = {
  title: 'Global Destinations',
  description:
    'Explore all available flight routes across domestic India, Southeast Asia, Middle East, Europe, Americas, and more.',
};

/** Format price range based on distance. */
function estimatePriceRange(distanceKm: number, isDomestic: boolean): string {
  const ratePerKm = isDomestic ? 3.2 : 2.8;
  const basePrice = Math.max(distanceKm * ratePerKm, isDomestic ? 2500 : 8000);
  const lowPrice = Math.round((basePrice * 0.8) / 50) * 50;
  const highPrice = Math.round((basePrice * 1.3) / 50) * 50;

  const formatPrice = (p: number) => {
    if (p >= 10000) {
      return `₹${(p / 1000).toFixed(1)}k`;
    }
    return `₹${p.toLocaleString('en-IN')}`;
  };

  return `${formatPrice(lowPrice)} – ${formatPrice(highPrice)}`;
}

/** Get tomorrow's date as ISO string. */
function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0] ?? new Date().toISOString().slice(0, 10);
}

/** Region icons mapping. */
function getRegionEmoji(region: RouteDefinition['region']): string {
  const map: Record<RouteDefinition['region'], string> = {
    domestic: '🇮🇳',
    'south-asia': '🏔️',
    'southeast-asia': '🌴',
    'middle-east': '🏜️',
    'east-asia': '🏯',
    europe: '🏛️',
    americas: '🗽',
    oceania: '🦘',
    africa: '🌍',
  };
  return map[region] || '✈️';
}

/** Region gradient classes. */
function getRegionGradient(region: RouteDefinition['region']): string {
  const map: Record<RouteDefinition['region'], string> = {
    domestic: 'from-orange-500/10 to-amber-500/5',
    'south-asia': 'from-emerald-500/10 to-teal-500/5',
    'southeast-asia': 'from-cyan-500/10 to-sky-500/5',
    'middle-east': 'from-amber-500/10 to-yellow-500/5',
    'east-asia': 'from-rose-500/10 to-pink-500/5',
    europe: 'from-blue-500/10 to-indigo-500/5',
    americas: 'from-violet-500/10 to-purple-500/5',
    oceania: 'from-lime-500/10 to-green-500/5',
    africa: 'from-orange-600/10 to-red-500/5',
  };
  return map[region] || 'from-primary/10 to-primary/5';
}

/** Region accent color. */
function getRegionAccent(region: RouteDefinition['region']): string {
  const map: Record<RouteDefinition['region'], string> = {
    domestic: 'text-orange-500',
    'south-asia': 'text-emerald-500',
    'southeast-asia': 'text-cyan-500',
    'middle-east': 'text-amber-500',
    'east-asia': 'text-rose-500',
    europe: 'text-blue-500',
    americas: 'text-violet-500',
    oceania: 'text-lime-500',
    africa: 'text-orange-600',
  };
  return map[region] || 'text-primary';
}

export default function DestinationsPage() {
  const tomorrow = getTomorrowDate();

  // Group routes by region
  const routesByRegion = new Map<RouteDefinition['region'], RouteDefinition[]>();
  for (const route of ROUTE_DEFINITIONS) {
    const existing = routesByRegion.get(route.region) || [];
    existing.push(route);
    routesByRegion.set(route.region, existing);
  }

  // Define display order
  const regionOrder: RouteDefinition['region'][] = [
    'domestic',
    'south-asia',
    'southeast-asia',
    'middle-east',
    'east-asia',
    'europe',
    'americas',
    'oceania',
    'africa',
  ];

  const totalRoutes = ROUTE_DEFINITIONS.length;
  const uniqueDestinations = new Set(ROUTE_DEFINITIONS.map((r) => r.destination)).size;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-surface to-surface border border-border/40 p-8 sm:p-10 shadow-sm">
        <div className="absolute right-0 top-0 w-full h-full opacity-[0.04] dark:opacity-[0.06] pointer-events-none flex justify-end overflow-hidden">
          <Globe className="w-64 h-64 translate-x-1/4 -translate-y-1/4 text-primary" />
        </div>

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
            <Navigation className="h-4 w-4" /> Global Flight Network
          </p>
          <h1 className="text-3xl font-extrabold sm:text-4xl font-heading text-text tracking-tight">
            All Destinations
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted font-medium">
            Explore {totalRoutes} flight routes across {uniqueDestinations}+ airports worldwide. 
            Search, compare, and book with confidence.
          </p>

          {/* Quick Stats */}
          <div className="mt-6 flex flex-wrap gap-3">
            {regionOrder.map((region) => {
              const routes = routesByRegion.get(region);
              if (!routes || routes.length === 0) return null;
              return (
                <a
                  key={region}
                  href={`#region-${region}`}
                  className="inline-flex items-center gap-2 rounded-full bg-surface/50 border border-border/50 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-muted hover:text-text hover:bg-surface/80 transition-all"
                >
                  <span>{getRegionEmoji(region)}</span>
                  <span>{getRegionLabel(region)}</span>
                  <span className="text-[10px] text-primary font-mono">{routes.length}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Route Sections by Region */}
      {regionOrder.map((region) => {
        const routes = routesByRegion.get(region);
        if (!routes || routes.length === 0) return null;

        return (
          <section
            key={region}
            id={`region-${region}`}
            className="space-y-4 scroll-mt-24"
          >
            {/* Region Header */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getRegionEmoji(region)}</span>
              <div>
                <h2 className="text-xl font-bold font-heading text-text tracking-tight">
                  {getRegionLabel(region)}
                </h2>
                <p className="text-xs text-muted font-medium">
                  {routes.length} route{routes.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            {/* Route Cards Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {routes.map((route) => {
                const isDomestic = route.region === 'domestic';
                const priceRange = estimatePriceRange(route.distanceKm, isDomestic);
                const searchUrl = `/search?origin=${encodeURIComponent(getAirportName(route.origin))}&destination=${encodeURIComponent(getAirportName(route.destination))}&departureDate=${tomorrow}&passengers=1`;

                return (
                  <Link
                    key={`${route.origin}-${route.destination}`}
                    href={searchUrl as any}
                    className={`group relative flex flex-col justify-between rounded-2xl border border-border/40 bg-gradient-to-br ${getRegionGradient(route.region)} p-5 shadow-sm transition-all hover:border-border hover:shadow-md hover:-translate-y-0.5 overflow-hidden`}
                  >
                    {/* Background Icon */}
                    <Plane className="absolute -right-3 -bottom-3 w-16 h-16 text-muted opacity-[0.04] pointer-events-none transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500" />

                    {/* Route Info */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="font-mono font-bold text-text">{route.origin}</span>
                          <span className={`${getRegionAccent(route.region)}`}>
                            <MapPin className="h-3 w-3" />
                          </span>
                        </div>
                        <div className="flex-1 flex items-center gap-1">
                          <div className="h-px flex-1 bg-border/50 group-hover:bg-border transition-colors" />
                          <Plane className={`h-3 w-3 ${getRegionAccent(route.region)} transition-transform group-hover:translate-x-1`} />
                          <div className="h-px flex-1 bg-border/50 group-hover:bg-border transition-colors" />
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className={`${getRegionAccent(route.region)}`}>
                            <MapPin className="h-3 w-3" />
                          </span>
                          <span className="font-mono font-bold text-text">{route.destination}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-text">
                            {getAirportName(route.origin)} → {getAirportName(route.destination)}
                          </p>
                          <p className="text-[10px] text-muted font-medium mt-0.5">
                            ~{Math.round(route.distanceKm).toLocaleString()} km
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30 relative z-10">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-muted font-bold">From</p>
                        <p className="text-sm font-bold text-text">{priceRange}</p>
                      </div>
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-surface border border-border/50 ${getRegionAccent(route.region)} transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-sm`}>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <div className="rounded-2xl border border-border/40 bg-surface/50 p-6 text-center space-y-3">
        <p className="text-sm font-bold text-text">
          Can&apos;t find your route?
        </p>
        <p className="text-xs text-muted max-w-md mx-auto">
          Type any city name or IATA code in the search bar. Our system supports {Object.keys(ROUTE_DEFINITIONS).length}+ routes with new destinations added regularly.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-600 hover:-translate-y-0.5"
        >
          <Plane className="h-4 w-4" /> Search All Flights
        </Link>
      </div>
    </div>
  );
}
