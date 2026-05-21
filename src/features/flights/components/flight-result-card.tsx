import { memo } from 'react';
import type { FlightSearchResult } from '../types/flight';

/**
 * ─── Flight Result Card ─────────────────────────────────
 * Premium card displaying a single flight search result.
 */
export const FlightResultCard = memo(function FlightResultCard({
  flight,
  passengers,
}: {
  flight: FlightSearchResult;
  passengers: number;
}) {
  const departsAt = new Date(flight.departs_at);
  const arrivesAt = new Date(flight.arrives_at);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const classColors = {
    economy:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    business: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    first: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  };

  const classLabels = {
    economy: 'Economy',
    business: 'Business',
    first: 'First',
  };

  const lowestPrice = Math.min(
    ...flight.seatClasses.map((sc) => sc.startingPrice),
  );

  return (
    <div
      id={`flight-card-${flight.id}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white
                 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md
                 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:from-gray-600 dark:via-gray-400 dark:to-gray-600" />

      <div className="p-5 sm:p-6">
        {/* ─── Header: Flight No + Aircraft ─── */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-4 w-4 text-gray-600 dark:text-gray-400"
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
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {flight.flight_no}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {flight.aircraft_type}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {flight.status}
          </span>
        </div>

        {/* ─── Route Timeline ─── */}
        <div className="mb-5 flex items-center gap-3 sm:gap-4">
          {/* Departure */}
          <div className="flex-1 text-left">
            <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {formatTime(departsAt)}
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {flight.origin}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(departsAt)}
            </p>
          </div>

          {/* Duration line */}
          <div className="flex flex-1 flex-col items-center gap-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {formatDuration(flight.durationMinutes)}
            </p>
            <div className="flex w-full items-center gap-1">
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
              <svg
                className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Direct</p>
          </div>

          {/* Arrival */}
          <div className="flex-1 text-right">
            <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {formatTime(arrivesAt)}
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {flight.destination}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(arrivesAt)}
            </p>
          </div>
        </div>

        {/* ─── Seat Classes + Price ─── */}
        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between">
          {/* Seat class badges */}
          <div className="flex flex-wrap gap-2">
            {flight.seatClasses.map((sc) => (
              <div
                key={sc.class}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${classColors[sc.class]}`}
              >
                <span className="font-semibold">{classLabels[sc.class]}</span>
                <span className="mx-1.5 opacity-40">·</span>
                <span>{sc.available} seats</span>
                <span className="mx-1.5 opacity-40">·</span>
                <span>{formatPrice(sc.startingPrice)}</span>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 dark:text-gray-500">from</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(lowestPrice)}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                per person
              </p>
            </div>
            <a
              href={`/booking/${flight.id}?passengers=${passengers}`}
              aria-label={`Select flight ${flight.flight_no} to ${flight.destination} starting from ${formatPrice(lowestPrice)}`}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white
                         shadow-sm transition-all hover:bg-gray-800 hover:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                         dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Select
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
