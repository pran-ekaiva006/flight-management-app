import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { FlightSearchForm } from '@/features/flights/components/flight-search-form';

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
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const hasSearched =
    searchParams.origin &&
    searchParams.destination &&
    searchParams.departureDate;

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

      {/* Search Results Placeholder — only visible after a search */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Results for{' '}
              <span className="text-gray-500">
                {searchParams.origin} → {searchParams.destination}
              </span>
            </h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {searchParams.departureDate}
            </span>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-10 text-center dark:border-gray-700 dark:bg-gray-900/50">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-6 w-6 text-gray-400"
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
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Flight results will appear here
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Results listing will be implemented in the next phase
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
