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
        className="text-xs font-bold text-muted uppercase tracking-wider"
      >
        Sort by
      </label>
      <select
        id="sort-flights"
        value={currentSort}
        onChange={handleSortChange}
        className="rounded-lg border border-border/40 bg-surface px-3 py-1.5 text-xs font-medium
                   text-text shadow-sm transition-colors cursor-pointer
                   focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                   hover:border-border"
      >
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value} className="bg-card text-text font-medium">
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
