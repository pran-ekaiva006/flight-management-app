'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CancelBookingResult {
  success: boolean;
  error?: string;
}

/**
 * ─── Cancel Booking Server Action ───────────────────────
 * Calls the atomic cancel_booking RPC which:
 *   1. Validates ownership
 *   2. Checks booking isn't already cancelled/rescheduled
 *   3. Enforces the 2-hour departure window
 *   4. Sets booking status to 'cancelled'
 *   5. Frees the seat atomically
 */
export async function cancelBookingAction(
  bookingId: string,
): Promise<CancelBookingResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const { error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
    p_user_id: user.id,
  });

  if (error) {
    const msg = error.message || 'Cancellation failed';

    if (msg.includes('BOOKING_NOT_FOUND')) {
      return {
        success: false,
        error: 'Booking not found or does not belong to you.',
      };
    }
    if (msg.includes('ALREADY_CANCELLED')) {
      return {
        success: false,
        error: 'This booking has already been cancelled.',
      };
    }
    if (msg.includes('BOOKING_RESCHEDULED')) {
      return {
        success: false,
        error:
          'Cannot cancel a rescheduled booking. Cancel the new booking instead.',
      };
    }
    if (msg.includes('TOO_LATE')) {
      return {
        success: false,
        error: 'Cannot cancel within 2 hours of departure.',
      };
    }

    console.error('[cancelBookingAction] RPC error:', error);
    return { success: false, error: msg };
  }

  // Revalidate bookings page and confirmation page
  revalidatePath('/bookings');
  revalidatePath(`/booking/confirmation/${bookingId}`);

  return { success: true };
}
