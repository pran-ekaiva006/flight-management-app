import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { FlightSearchForm } from '@/features/flights/components/flight-search-form';
import { FlightResultCard } from '@/features/flights/components/flight-result-card';
import { FlightResultsSkeleton } from '@/features/flights/components/flight-results-skeleton';
import { FlightSortControls } from '@/features/flights/components/flight-sort-controls';
import { searchFlights } from '@/features/flights/services/search-flights';
import type { FlightSortOption } from '@/features/flights/types/flight';
import { SearchX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search Flights',
  description:
    'Find the best flights for your journey across all available routes.',
};

interface SearchPageProps {
  searchParams: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    passengers?: string;
    sort?: FlightSortOption;
  };
}

/**
 * ─── Flight Results (Server Component) ──────────────────
 * Fetches and renders matching flights.
 * Wrapped in Suspense for skeleton loading.
 */
async function FlightResults({
  origin,
  destination,
  departureDate,
  passengers,
  sort,
}: {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  sort: FlightSortOption;
}) {
  const flights = await searchFlights({
    origin,
    destination,
    departureDate,
    passengers,
    sort,
  });

  if (flights.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-8 w-8" />}
        title="No flights found"
        description={`We couldn't find any flights from ${origin} to ${destination} on ${departureDate}. Try different dates or routes.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <FlightResultCard
          key={flight.id}
          flight={flight}
          passengers={passengers}
        />
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const hasSearched =
    searchParams.origin &&
    searchParams.destination &&
    searchParams.departureDate;

  const passengers = Number(searchParams.passengers) || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search Flights"
        description="Find the best flights for your journey"
      />

      {/* Search Form Card */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <FlightSearchForm
          defaultValues={{
            origin: searchParams.origin,
            destination: searchParams.destination,
            departureDate: searchParams.departureDate,
            passengers: searchParams.passengers,
          }}
        />
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          {/* Results header with sort controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-text font-heading">
                Flights from{' '}
                <span className="text-primary">
                  {searchParams.origin}
                </span>{' '}
                to{' '}
                <span className="text-primary">
                  {searchParams.destination}
                </span>
              </h2>
              <p className="mt-1 text-xs text-muted font-medium">
                {searchParams.departureDate} · {passengers}{' '}
                {passengers === 1 ? 'passenger' : 'passengers'}
              </p>
            </div>
            <FlightSortControls />
          </div>

          {/* Results list with skeleton fallback */}
          <Suspense
            key={`${searchParams.origin}-${searchParams.destination}-${searchParams.departureDate}-${searchParams.sort}`}
            fallback={<FlightResultsSkeleton />}
          >
            <FlightResults
              origin={searchParams.origin!}
              destination={searchParams.destination!}
              departureDate={searchParams.departureDate!}
              passengers={passengers}
              sort={searchParams.sort || 'price_asc'}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
