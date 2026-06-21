import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { getAirportName } from '@/features/flights/utils/airport-codes';
import Link from 'next/link';
import { CancelBookingButton } from '@/features/booking/components/cancel-booking-button';
import { RescheduleButton } from '@/features/booking/components/reschedule-button';
import { Plane, Calendar, CreditCard, TicketX, CheckCircle2, RotateCcw, XCircle, ChevronRight, Hash } from 'lucide-react';

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
          className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-surface animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-64 rounded-md bg-surface animate-pulse" />
              <div className="h-3 w-40 rounded-md bg-surface/60 animate-pulse" />
            </div>
            <div className="space-y-3 text-right">
              <div className="ml-auto h-6 w-24 rounded-md bg-surface animate-pulse" />
              <div className="ml-auto h-3 w-20 rounded-md bg-surface/60 animate-pulse" />
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
        icon={<TicketX className="h-8 w-8" />}
        title="No active bookings"
        description="Search for flights and book your first trip to see it here. Your upcoming adventures await!"
        action={
          <Link
            href="/search"
            className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-600 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-xl"
          >
            Search Flights
          </Link>
        }
      />
    );
  }

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    confirmed: {
      label: 'Confirmed',
      color:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    rescheduled: {
      label: 'Rescheduled',
      color:
        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: <RotateCcw className="h-3 w-3" />,
    },
    cancelled: {
      label: 'Cancelled',
      color:
        'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="space-y-8">
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: <Plane className="h-5 w-5 text-primary" /> },
          { label: 'Active', value: bookings.filter((b) => b.status === 'confirmed').length, icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" /> },
          { label: 'Cancelled', value: bookings.filter((b) => b.status === 'cancelled').length, icon: <XCircle className="h-5 w-5 text-red-500" /> },
          { label: 'Total Spent', value: formatPrice(bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + Number(b.total_price), 0)), icon: <CreditCard className="h-5 w-5 text-accent" /> },
        ].map((stat, idx) => (
          <div key={idx} className="card-3d rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface/50 border border-border/40">
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-muted uppercase tracking-widest">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-black text-text font-heading">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
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

          const status = statusConfig[booking.status] || statusConfig['confirmed']!;
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
              className={`card-3d group relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl ${
                booking.status === 'cancelled'
                  ? 'border-border/30 opacity-60 hover:opacity-80'
                  : 'border-border/40 hover:border-primary/30'
              }`}
            >
              {booking.status !== 'cancelled' && (
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />
              )}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left — route + info */}
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border/40 shadow-inner">
                      <Plane className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-bold text-text font-heading">
                          {flight
                            ? `${getAirportName(flight.origin)} → ${getAirportName(flight.destination)}`
                            : 'Unknown Route'}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${status.color}`}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-muted">
                        <p className="flex items-center gap-1.5 bg-surface/50 px-2.5 py-1 rounded-lg border border-border/30">
                          <Plane className="h-3.5 w-3.5" />
                          {flight?.flight_no}
                        </p>
                        <p className="flex items-center gap-1.5 bg-surface/50 px-2.5 py-1 rounded-lg border border-border/30">
                          <Hash className="h-3.5 w-3.5" />
                          PNR: <span className="font-bold text-text">{booking.pnr_code}</span>
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-text">
                        {departsAt && (
                          <span className="flex items-center gap-2 border-r border-border/40 pr-4">
                            <Calendar className="h-4 w-4 text-primary" />
                            {departsAt.toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        {seat && (
                          <span className="flex items-center gap-2">
                            <span className="text-muted font-medium text-xs uppercase tracking-widest">Seat</span>
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">{seat.seat_number}</span>
                            <span className="text-muted text-xs capitalize ml-1">({seat.class})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right — price + actions */}
                  <div className="flex items-center gap-6 sm:flex-col sm:items-end justify-between border-t border-border/40 pt-4 sm:border-0 sm:pt-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Total</p>
                      <p className="text-2xl font-black text-text font-heading tracking-tight">
                        {formatPrice(Number(booking.total_price))}
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-muted uppercase tracking-wider">
                        Booked{' '}
                        {new Date(booking.booked_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/booking/confirmation/${booking.id}`}
                        className="group/btn flex items-center gap-1 rounded-xl border border-border/60 bg-surface/50 px-4 py-2 text-xs font-bold text-text transition-all hover:bg-surface hover:border-primary/40 hover:text-primary shadow-sm"
                      >
                        Details
                        <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                      {canCancel && (
                        <RescheduleButton bookingId={booking.id} />
                      )}
                      {canCancel && (
                        <CancelBookingButton
                          bookingId={booking.id}
                          pnrCode={booking.pnr_code}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────
export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="My Bookings"
        description="View and manage all your upcoming and past flight itineraries."
      />
      <Suspense fallback={<BookingsSkeleton />}>
        <BookingsList />
      </Suspense>
    </div>
  );
}
