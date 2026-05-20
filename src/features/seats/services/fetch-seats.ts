import { createClient } from '@/lib/supabase/server';

export interface SeatData {
  id: string;
  flight_id: string;
  seat_number: string;
  class: 'economy' | 'business' | 'first';
  is_available: boolean;
  extra_fee: number;
}

/**
 * ─── Fetch Seats for a Flight (Server) ──────────────────
 * Returns all seats grouped and sorted by row/column.
 */
export async function fetchSeatsForFlight(
  flightId: string,
): Promise<SeatData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('seats')
    .select('id, flight_id, seat_number, class, is_available, extra_fee')
    .eq('flight_id', flightId)
    .order('seat_number', { ascending: true });

  if (error) {
    console.error('[fetchSeatsForFlight] Error:', error);
    return [];
  }

  return (data as SeatData[]) || [];
}

// Re-export shared utility
export { parseSeatNumber } from '../utils/parse-seat';
