/**
 * ─── Flight Results Skeleton ────────────────────────────
 * Shimmer loading skeleton shown while flight results load.
 */
export function FlightResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
        >
          {/* Header skeleton */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800/50" />
              </div>
            </div>
            <div className="h-6 w-20 rounded-full bg-gray-100 dark:bg-gray-800" />
          </div>

          {/* Route timeline skeleton */}
          <div className="mb-5 flex items-center gap-4">
            {/* Departure */}
            <div className="flex-1 space-y-1.5">
              <div className="h-7 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800/50" />
            </div>

            {/* Duration line */}
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <div className="h-3 w-10 rounded bg-gray-100 dark:bg-gray-800/50" />
              <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-8 rounded bg-gray-100 dark:bg-gray-800/50" />
            </div>

            {/* Arrival */}
            <div className="flex flex-1 flex-col items-end space-y-1.5">
              <div className="h-7 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800/50" />
            </div>
          </div>

          {/* Seat classes + price skeleton */}
          <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <div className="h-8 w-32 rounded-lg bg-gray-100 dark:bg-gray-800/50" />
              <div className="h-8 w-28 rounded-lg bg-gray-100 dark:bg-gray-800/50" />
              <div className="hidden h-8 w-24 rounded-lg bg-gray-100 dark:bg-gray-800/50 sm:block" />
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-1 text-right">
                <div className="ml-auto h-3 w-8 rounded bg-gray-100 dark:bg-gray-800/50" />
                <div className="ml-auto h-6 w-20 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="h-10 w-20 rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
