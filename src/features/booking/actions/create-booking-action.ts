'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { passengerSchema } from '../schemas/passenger-schema';
import { generatePNR } from '../utils/generate-pnr';

interface BookingActionInput {
  flightId: string;
  seatId: string;
  totalPrice: number;
  fullName: string;
  passportNo: string;
  nationality: string;
  dob: string;
}

export interface BookingActionResult {
  success: boolean;
  error?: string;
  bookingId?: string;
}

/**
 * ─── Create Booking Server Action ───────────────────────
 * Validates input, calls the reserve_seat RPC,
 * and redirects to the confirmation page.
 */
export async function createBookingAction(
  input: BookingActionInput,
): Promise<BookingActionResult> {
  // 1. Validate passenger data
  const validation = passengerSchema.safeParse({
    fullName: input.fullName,
    passportNo: input.passportNo,
    nationality: input.nationality,
    dob: input.dob,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid passenger data',
    };
  }

  // 2. Get authenticated user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to book a flight' };
  }

  // 3. Generate unique PNR (retry on collision)
  let pnrCode = generatePNR();
  let retries = 0;
  while (retries < 5) {
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('pnr_code', pnrCode)
      .single();

    if (!existing) break;
    pnrCode = generatePNR();
    retries++;
  }

  // 4. Call the transactional reserve_seat RPC
  const { data: bookingId, error } = await supabase.rpc('reserve_seat', {
    p_user_id: user.id,
    p_flight_id: input.flightId,
    p_seat_id: input.seatId,
    p_total_price: input.totalPrice,
    p_pnr_code: pnrCode,
    p_full_name: validation.data.fullName,
    p_passport_no: validation.data.passportNo,
    p_nationality: validation.data.nationality,
    p_dob: validation.data.dob,
  });

  if (error) {
    // Parse RPC error messages
    const message = error.message || 'Booking failed';

    if (message.includes('SEAT_TAKEN')) {
      return {
        success: false,
        error:
          'This seat has just been booked by another passenger. Please select a different seat.',
      };
    }
    if (message.includes('DUPLICATE_BOOKING')) {
      return {
        success: false,
        error: 'You already have an active booking on this flight.',
      };
    }
    if (message.includes('FLIGHT_NOT_BOOKABLE')) {
      return {
        success: false,
        error: 'This flight is no longer available for booking.',
      };
    }
    if (message.includes('FLIGHT_DEPARTED')) {
      return {
        success: false,
        error: 'This flight has already departed.',
      };
    }

    console.error('[createBookingAction] RPC error:', error);
    return { success: false, error: message };
  }

  if (!bookingId) {
    return { success: false, error: 'Booking creation failed unexpectedly' };
  }

  // 5. Redirect to confirmation page
  redirect(`/booking/confirmation/${bookingId}`);
}
