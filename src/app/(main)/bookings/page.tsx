import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { getAirportName } from '@/features/flights/utils/airport-codes';
import Link from 'next/link';
import { CancelBookingButton } from '@/features/booking/components/cancel-booking-button';

export const metadata: Metadata = {
  title: 'My Bookings',
  description: 'View and manage your flight bookings.',
};

// ─── Loading Skeleton ──────────────────────────────────
function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-200/60 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="space-y-2 text-right">
              <div className="ml-auto h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="ml-auto h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Bookings List (Server) ────────────────────────────
async function BookingsList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select(
      `
      id,
      pnr_code,
      status,
      total_price,
      booked_at,
      flights (
        flight_no,
        origin,
        destination,
        departs_at,
        arrives_at
      ),
      seats (
        seat_number,
        class
      )
    `,
    )
    .eq('user_id', user.id)
    .order('booked_at', { ascending: false });

  if (!bookings || bookings.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
            />
          </svg>
        }
        title="No bookings yet"
        description="Search for flights and book your first trip to see it here."
        action={
          <Link
            href="/search"
            className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            Search Flights
          </Link>
        }
      />
    );
  }

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: string }
  > = {
    confirmed: {
      label: 'Confirmed',
      color:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900',
      icon: '✓',
    },
    rescheduled: {
      label: 'Rescheduled',
      color:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900',
      icon: '↻',
    },
    cancelled: {
      label: 'Cancelled',
      color:
        'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900',
      icon: '✕',
    },
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Total Bookings
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {bookings.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-400 dark:text-gray-500">Active</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-400 dark:text-gray-500">Cancelled</p>
          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
            {bookings.filter((b) => b.status === 'cancelled').length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Total Spent
          </p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {formatPrice(
              bookings
                .filter((b) => b.status !== 'cancelled')
                .reduce((sum, b) => sum + Number(b.total_price), 0),
            )}
          </p>
        </div>
      </div>

      {/* Booking Cards */}
      {bookings.map((booking) => {
        const flight = booking.flights as unknown as {
          flight_no: string;
          origin: string;
          destination: string;
          departs_at: string;
          arrives_at: string;
        } | null;

        const seat = booking.seats as unknown as {
          seat_number: string;
          class: string;
        } | null;

        const status = statusConfig[booking.status] || statusConfig.confirmed;
        const departsAt = flight ? new Date(flight.departs_at) : null;
        const isFuture = departsAt ? departsAt > new Date() : false;
        const canCancel =
          booking.status === 'confirmed' &&
          isFuture &&
          departsAt &&
          departsAt.getTime() - Date.now() > 2 * 60 * 60 * 1000;

        return (
          <div
            key={booking.id}
            className={`rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-900 ${
              booking.status === 'cancelled'
                ? 'border-gray-200/40 opacity-60 dark:border-gray-800/40'
                : 'border-gray-200/60 dark:border-gray-800'
            }`}
          >
            <div className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left — route + info */}
                <div className="flex items-start gap-4">
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {flight
                          ? `${getAirportName(flight.origin)} → ${getAirportName(flight.destination)}`
                          : 'Unknown Route'}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status?.color}`}
                      >
                        {status?.icon} {status?.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      {flight?.flight_no} · PNR:{' '}
                      <span className="font-mono font-bold">
                        {booking.pnr_code}
                      </span>
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      {departsAt && (
                        <span>
                          {departsAt.toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {seat && (
                        <span>
                          Seat {seat.seat_number} ({seat.class})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right — price + actions */}
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(Number(booking.total_price))}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Booked{' '}
                      {new Date(booking.booked_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/booking/confirmation/${booking.id}`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      View
                    </a>
                    {canCancel && (
                      <CancelBookingButton bookingId={booking.id} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────
export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bookings"
        description="View and manage all your flight bookings"
      />
      <Suspense fallback={<BookingsSkeleton />}>
        <BookingsList />
      </Suspense>
    </div>
  );
}
