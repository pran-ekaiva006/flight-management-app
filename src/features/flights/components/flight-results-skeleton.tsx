'use client';

import { motion } from 'framer-motion';

/**
 * ─── Flight Results Skeleton ────────────────────────────
 * Premium shimmer loading skeleton shown while flight results load.
 */
export function FlightResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
          
          {/* Header skeleton */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-surface animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-20 rounded-md bg-surface animate-pulse" />
                <div className="h-3 w-32 rounded-md bg-surface/60 animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-24 rounded-full bg-surface animate-pulse" />
          </div>

          {/* Route timeline skeleton */}
          <div className="mb-6 flex items-center gap-6">
            {/* Departure */}
            <div className="flex-1 space-y-2">
              <div className="h-8 w-20 rounded-md bg-surface animate-pulse" />
              <div className="h-4 w-12 rounded-md bg-surface/80 animate-pulse" />
              <div className="h-3 w-24 rounded-md bg-surface/60 animate-pulse" />
            </div>

            {/* Duration line */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <div className="h-3 w-12 rounded-md bg-surface/60 animate-pulse" />
              <div className="relative w-full flex items-center">
                <div className="h-[2px] w-full bg-border/40" />
                <div className="absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-surface animate-pulse" />
              </div>
              <div className="h-3 w-10 rounded-md bg-surface/60 animate-pulse" />
            </div>

            {/* Arrival */}
            <div className="flex flex-1 flex-col items-end space-y-2">
              <div className="h-8 w-20 rounded-md bg-surface animate-pulse" />
              <div className="h-4 w-12 rounded-md bg-surface/80 animate-pulse" />
              <div className="h-3 w-24 rounded-md bg-surface/60 animate-pulse" />
            </div>
          </div>

          {/* Seat classes + price skeleton */}
          <div className="flex flex-col gap-4 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <div className="h-9 w-32 rounded-xl bg-surface/80 animate-pulse" />
              <div className="h-9 w-28 rounded-xl bg-surface/80 animate-pulse" />
              <div className="hidden h-9 w-24 rounded-xl bg-surface/80 animate-pulse sm:block" />
            </div>
            <div className="flex items-center gap-5">
              <div className="space-y-2 text-right">
                <div className="ml-auto h-3 w-10 rounded-md bg-surface/60 animate-pulse" />
                <div className="ml-auto h-7 w-24 rounded-md bg-surface animate-pulse" />
              </div>
              <div className="h-11 w-28 rounded-xl bg-primary/20 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
