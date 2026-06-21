import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PageHeader } from '@/components/shared/page-header';
import { fetchSeatsForFlight } from '@/features/seats/services/fetch-seats';
import { BookingClient } from './booking-client';

export const metadata: Metadata = {
  title: 'Select Your Seat',
  description: 'Choose your preferred seat for your flight.',
};

interface BookingPageProps {
  params: { id: string };
  searchParams: { passengers?: string };
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const supabase = await createClient();

  let flight = null;
  let flightId = params.id;

  // Just-in-time persistence for dynamic AirLabs search results
  if (flightId.startsWith('airlabs__')) {
    const parts = flightId.split('__');
    const flight_no = parts[1];
    const origin = parts[2];
    const destination = parts[3];
    const departs_at = parts[4];
    const arrives_at = parts[5];
    const base_price_str = parts[6];
    const external_ref = parts[7];

    if (
      !flight_no ||
      !origin ||
      !destination ||
      !departs_at ||
      !arrives_at ||
      !base_price_str ||
      !external_ref
    ) {
      notFound();
    }

    const base_price = parseFloat(base_price_str) || 5000;

    const admin = createAdminClient();

    // Deduplicate: check if this flight was already persisted
    const { data: existing } = await admin
      .from('flights')
      .select('*')
      .eq('flight_no', flight_no)
      .eq('departs_at', departs_at)
      .maybeSingle();

    if (existing) {
      flight = existing;
      flightId = existing.id;
    } else {
      // Insert flight on the fly
      const { data: inserted, error: insertError } = await admin
        .from('flights')
        .insert({
          flight_no,
          origin,
          destination,
          departs_at,
          arrives_at,
          aircraft_type: 'Unknown Aircraft',
          base_price,
          source: 'airlabs',
          external_ref,
        })
        .select('*')
        .single();

      if (insertError || !inserted) {
        console.error(
          '[BookingPage] Failed to insert flight just-in-time:',
          insertError,
        );
        notFound();
      }

      // Generate seat map for the inserted flight
      const { error: seatMapError } = await admin.rpc('generate_seat_map', {
        p_flight_id: inserted.id,
      });

      if (seatMapError) {
        console.warn(
          '[BookingPage] Failed to generate seat map just-in-time:',
          seatMapError,
        );
      }

      flight = inserted;
      flightId = inserted.id;
    }
  } else {
    // Normal database query for pre-existing flights
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flightId)
      .single();

    if (error || !data) {
      notFound();
    }
    flight = data;
  }

  // Fetch all seats for this flight
  const seats = await fetchSeatsForFlight(flightId);

  const passengers = Number(searchParams.passengers) || 1;

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
      year: 'numeric',
    });

  const durationMinutes = Math.round(
    (arrivesAt.getTime() - departsAt.getTime()) / 60000,
  );
  const durationH = Math.floor(durationMinutes / 60);
  const durationM = durationMinutes % 60;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Select Your Seat"
        description={`${flight.flight_no} · ${flight.origin} → ${flight.destination}`}
      />

      {/* Flight summary card */}
      <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-5 w-5 text-gray-600 dark:text-gray-400"
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
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {flight.flight_no}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {flight.aircraft_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                {formatTime(departsAt)}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {flight.origin}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {durationH}h {durationM}m
              </p>
              <div className="flex items-center gap-1">
                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Direct</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">
                {formatTime(arrivesAt)}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {flight.destination}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(departsAt)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive seat map (client component) */}
      <BookingClient
        flightId={flightId}
        initialSeats={seats}
        basePrice={flight.base_price}
        passengers={passengers}
      />
    </div>
  );
}
