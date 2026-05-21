'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface RescheduleResult {
  success: boolean;
  error?: string;
  feeCharged?: number;
  newTotalPrice?: number;
}

/**
 * ─── Fetch Alternative Flights (same route, future) ─────
 */
export async function fetchAlternativeFlights(
  bookingId: string,
): Promise<{
  flights: Array<{
    id: string;
    flight_no: string;
    departs_at: string;
    arrives_at: string;
    base_price: number;
    aircraft_type: string;
    availableSeats: number;
  }>;
  currentFlightId: string;
  origin: string;
  destination: string;
  currentBasePrice: number;
} | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get booking + current flight
  const { data: booking } = await supabase
    .from('bookings')
    .select('flight_id, flights(origin, destination, base_price)')
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single();

  if (!booking) return null;

  const flight = booking.flights as unknown as {
    origin: string;
    destination: string;
    base_price: number;
  };

  // Fetch future flights on same route
  const { data: altFlights } = await supabase
    .from('flights')
    .select('id, flight_no, departs_at, arrives_at, base_price, aircraft_type, seats(id, is_available)')
    .eq('origin', flight.origin)
    .eq('destination', flight.destination)
    .neq('id', booking.flight_id)
    .gt('departs_at', new Date().toISOString())
    .in('status', ['scheduled', 'boarding', 'delayed'])
    .order('departs_at', { ascending: true });

  const flights = (altFlights || []).map((f) => {
    const seats = (f.seats as Array<{ id: string; is_available: boolean }>) || [];
    return {
      id: f.id,
      flight_no: f.flight_no,
      departs_at: f.departs_at,
      arrives_at: f.arrives_at,
      base_price: f.base_price,
      aircraft_type: f.aircraft_type,
      availableSeats: seats.filter((s) => s.is_available).length,
    };
  }).filter((f) => f.availableSeats > 0);

  return {
    flights,
    currentFlightId: booking.flight_id,
    origin: flight.origin,
    destination: flight.destination,
    currentBasePrice: flight.base_price,
  };
}

/**
 * ─── Fetch Available Seats for a Flight ─────────────────
 */
export async function fetchAvailableSeats(flightId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('seats')
    .select('id, seat_number, class, extra_fee')
    .eq('flight_id', flightId)
    .eq('is_available', true)
    .order('seat_number', { ascending: true });

  return data || [];
}

/**
 * ─── Reschedule Booking Server Action ───────────────────
 */
export async function rescheduleBookingAction(
  bookingId: string,
  newFlightId: string,
  newSeatId: string,
): Promise<RescheduleResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const { data, error } = await supabase.rpc('reschedule_booking', {
    p_booking_id: bookingId,
    p_user_id: user.id,
    p_new_flight_id: newFlightId,
    p_new_seat_id: newSeatId,
  });

  if (error) {
    const msg = error.message || 'Reschedule failed';
    if (msg.includes('ROUTE_MISMATCH')) return { success: false, error: 'New flight must be on the same route.' };
    if (msg.includes('SAME_FLIGHT')) return { success: false, error: 'Cannot reschedule to the same flight.' };
    if (msg.includes('SEAT_TAKEN')) return { success: false, error: 'Selected seat is no longer available.' };
    if (msg.includes('INVALID_STATUS')) return { success: false, error: 'Only confirmed bookings can be rescheduled.' };
    if (msg.includes('FLIGHT_DEPARTED')) return { success: false, error: 'New flight has already departed.' };
    console.error('[rescheduleBookingAction] RPC error:', error);
    return { success: false, error: msg };
  }

  const result = data as { fee_charged: number; new_total_price: number } | null;

  revalidatePath('/bookings');
  revalidatePath(`/booking/confirmation/${bookingId}`);

  return {
    success: true,
    feeCharged: result?.fee_charged || 0,
    newTotalPrice: result?.new_total_price || 0,
  };
}
