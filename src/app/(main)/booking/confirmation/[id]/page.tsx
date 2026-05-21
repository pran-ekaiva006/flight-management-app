import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { getAirportName } from '@/features/flights/utils/airport-codes';

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your flight booking has been confirmed.',
};

interface ConfirmationPageProps {
  params: { id: string };
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const supabase = await createClient();

  // Fetch booking with related data
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      flights (*),
      seats (seat_number, class, extra_fee),
      passengers (full_name, nationality, dob)
    `,
    )
    .eq('id', params.id)
    .single();

  if (error || !booking) {
    notFound();
  }

  const flight = booking.flights as {
    flight_no: string;
    origin: string;
    destination: string;
    departs_at: string;
    arrives_at: string;
    aircraft_type: string;
    base_price: number;
  };

  const seat = booking.seats as {
    seat_number: string;
    class: string;
    extra_fee: number;
  };

  const passenger = Array.isArray(booking.passengers)
    ? (booking.passengers[0] as {
        full_name: string;
        nationality: string;
        dob: string;
      })
    : null;

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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const classLabels: Record<string, string> = {
    first: 'First Class',
    business: 'Business Class',
    economy: 'Economy Class',
  };

  const statusColors: Record<string, string> = {
    confirmed:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900',
    cancelled:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900',
    rescheduled:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900',
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 print:max-w-none">
      <PageHeader
        title="Booking Confirmed"
        description="Your flight has been booked successfully!"
      />

      {/* ─── Confirmation Card ─── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Success banner */}
        <div className="bg-emerald-50 px-6 py-4 dark:bg-emerald-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg
                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Booking Confirmed!
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Your PNR code is below. Save it for reference.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* PNR + Status */}
          <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-6 dark:border-gray-800 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                PNR CODE
              </p>
              <p className="mt-1 font-mono text-3xl font-black tracking-wider text-gray-900 dark:text-white">
                {booking.pnr_code}
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusColors[booking.status] || ''}`}
            >
              {booking.status}
            </span>
          </div>

          {/* Flight Details */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Flight Details
            </h3>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(departsAt)}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {flight.origin} · {getAirportName(flight.origin)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {flight.flight_no}
                  </p>
                  <div className="my-1 flex items-center gap-1">
                    <div className="h-px w-10 bg-gray-300 dark:bg-gray-600" />
                    <svg
                      className="h-4 w-4 text-gray-400"
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
                    <div className="h-px w-10 bg-gray-300 dark:bg-gray-600" />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {flight.aircraft_type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(arrivesAt)}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {flight.destination} · {getAirportName(flight.destination)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                {formatDate(departsAt)}
              </p>
            </div>
          </div>

          {/* Passenger + Seat */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Passenger */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <h4 className="mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500">
                PASSENGER
              </h4>
              <p className="font-medium text-gray-900 dark:text-white">
                {passenger?.full_name || '—'}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {passenger?.nationality || '—'}
              </p>
              {passenger?.dob && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  DOB:{' '}
                  {new Date(passenger.dob).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* Seat */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <h4 className="mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500">
                SEAT
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {seat.seat_number}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {classLabels[seat.class] || seat.class}
              </p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <h4 className="mb-3 text-xs font-semibold text-gray-400 dark:text-gray-500">
              PRICE BREAKDOWN
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Base fare
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(flight.base_price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Seat surcharge ({seat.seat_number})
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(seat.extra_fee)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPrice(booking.total_price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row print:hidden">
            <a
              href="/bookings"
              className="flex-1 rounded-xl bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white
                         shadow-sm transition-all hover:bg-gray-800 hover:shadow-md
                         dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              View My Bookings
            </a>
            <button
              type="button"
              onClick={() => {}}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold
                         text-gray-700 shadow-sm transition-all hover:bg-gray-50
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Print Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
