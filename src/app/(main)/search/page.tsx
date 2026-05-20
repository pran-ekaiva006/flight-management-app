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
        icon={
          <svg
            className="h-7 w-7"
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
        }
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
      <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Flights from{' '}
                <span className="text-gray-500 dark:text-gray-400">
                  {searchParams.origin}
                </span>{' '}
                to{' '}
                <span className="text-gray-500 dark:text-gray-400">
                  {searchParams.destination}
                </span>
              </h2>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
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
