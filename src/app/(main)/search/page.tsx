import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Search Flights',
};

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Search Flights"
        description="Find the best flights for your journey"
      />

      {/* Search form placeholder */}
      <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Flight search form will be implemented in the next step.
        </p>
      </div>
    </div>
  );
}
