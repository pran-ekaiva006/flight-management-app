import { memo } from 'react';
import type { FlightSearchResult } from '../types/flight';
import { PlaneTakeoff, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

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
    economy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    business: 'bg-primary/10 text-primary border border-primary/20',
    first: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
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
      className="card-3d group relative overflow-hidden rounded-3xl border border-border/40 bg-card
                 shadow-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100 duration-500" />

      <div className="p-6 sm:p-8">
        {/* ─── Header: Flight No + Aircraft ─── */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface/80 border border-border/40 text-primary shadow-inner">
              <PlaneTakeoff className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-text font-heading">
                  {flight.flight_no}
                </p>
                {flight.source === 'airlabs' && (
                  <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-accent border border-accent/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                    </span>
                    Live Fare
                  </span>
                )}
              </div>
              <p className="text-xs text-muted font-medium tracking-wide">
                {flight.aircraft_type}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-surface/50 border border-border/40 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            {flight.status}
          </span>
        </div>

        {/* ─── Route Timeline ─── */}
        <div className="mb-8 flex items-center gap-4 sm:gap-6 bg-surface/30 rounded-2xl p-4 sm:p-6 border border-border/30">
          {/* Departure */}
          <div className="flex-1 text-left">
            <p className="text-3xl font-extrabold text-text font-heading tracking-tight">
              {formatTime(departsAt)}
            </p>
            <p className="text-base font-bold text-primary mt-1">
              {flight.origin}
            </p>
            <p className="text-xs text-muted font-medium mt-0.5">
              {formatDate(departsAt)}
            </p>
          </div>

          {/* Duration line */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted">
              <Clock className="h-3 w-3" />
              {formatDuration(flight.durationMinutes)}
            </p>
            <div className="flex w-full items-center gap-2">
              <div className="h-[2px] flex-1 bg-border/40 rounded-full" />
              <div className="h-2 w-2 rounded-full border-2 border-primary bg-card" />
              <div className="h-[2px] flex-1 bg-border/40 rounded-full" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Direct</p>
          </div>

          {/* Arrival */}
          <div className="flex-1 text-right">
            <p className="text-3xl font-extrabold text-text font-heading tracking-tight">
              {formatTime(arrivesAt)}
            </p>
            <p className="text-base font-bold text-primary mt-1">
              {flight.destination}
            </p>
            <p className="text-xs text-muted font-medium mt-0.5">
              {formatDate(arrivesAt)}
            </p>
          </div>
        </div>

        {/* ─── Seat Classes + Price ─── */}
        <div className="flex flex-col gap-6 border-t border-border/40 pt-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Seat class badges */}
          <div className="flex flex-wrap gap-2">
            {flight.seatClasses.map((sc) => (
              <div
                key={sc.class}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-default ${classColors[sc.class]}`}
              >
                <span className="font-bold uppercase tracking-wider">{classLabels[sc.class]}</span>
                <span className="mx-2 opacity-30">|</span>
                <span className="font-semibold">{sc.available} seats</span>
                <span className="mx-2 opacity-30">|</span>
                <span className="font-bold">{formatPrice(sc.startingPrice)}</span>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-0.5">from</p>
              <p className="text-2xl font-black text-text font-heading tracking-tight">
                {formatPrice(lowestPrice)}
              </p>
              <p className="text-[10px] font-medium text-muted mt-0.5 uppercase tracking-widest">
                per person
              </p>
            </div>
            <Link
              href={`/booking/${flight.id}?passengers=${passengers}`}
              aria-label={`Select flight ${flight.flight_no} to ${flight.destination} starting from ${formatPrice(lowestPrice)}`}
              className="rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white
                         shadow-lg shadow-primary/20 transition-all hover:bg-primary-600 hover:shadow-xl hover:-translate-y-0.5
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                         active:translate-y-0"
            >
              Select
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
