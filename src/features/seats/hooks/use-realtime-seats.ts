'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SeatData } from '../services/fetch-seats';

/**
 * ─── Realtime Seat Subscription Hook ────────────────────
 * Subscribes to INSERT/UPDATE on the seats table for a specific flight.
 * Auto-disables occupied seats and cleans up on unmount.
 */
export function useRealtimeSeats(
  flightId: string,
  onSeatUpdate: (seat: SeatData) => void,
) {
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>['channel']
  > | null>(null);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      const supabase = createClient();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`seats:${flightId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'seats',
          filter: `flight_id=eq.${flightId}`,
        },
        (payload) => {
          const updated = payload.new as SeatData;
          onSeatUpdate(updated);
        },
      )
      .subscribe();

    channelRef.current = channel;

    return cleanup;
  }, [flightId, onSeatUpdate, cleanup]);

  return { cleanup };
}
