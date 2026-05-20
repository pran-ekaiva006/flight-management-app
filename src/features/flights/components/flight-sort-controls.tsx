'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SORT_LABELS, type FlightSortOption } from '../types/flight';

/**
 * ─── Sort Controls ──────────────────────────────────────
 * Client component that updates the URL sort param.
 */
export function FlightSortControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort =
    (searchParams.get('sort') as FlightSortOption) || 'price_asc';

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-flights"
        className="text-xs font-medium text-gray-500 dark:text-gray-400"
      >
        Sort by
      </label>
      <select
        id="sort-flights"
        value={currentSort}
        onChange={handleSortChange}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium
                   text-gray-700 shadow-sm transition-colors
                   focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300
                   dark:focus:ring-gray-700"
      >
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
