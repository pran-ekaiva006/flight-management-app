import type { Tables } from '@/types/database.types';

/**
 * ─── Flight Search Types ────────────────────────────────
 */

/** Raw flight row from Supabase */
export type Flight = Tables<'flights'>;

/** Seat availability summary per class */
export interface SeatClassSummary {
  class: 'economy' | 'business' | 'first';
  available: number;
  startingPrice: number; // base_price + extra_fee
}

/** Flight with aggregated seat info for search results */
export interface FlightSearchResult extends Flight {
  durationMinutes: number;
  seatClasses: SeatClassSummary[];
  totalAvailableSeats: number;
}

/** Sorting options for flight results */
export type FlightSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'duration_asc'
  | 'departure_asc'
  | 'departure_desc';

export const SORT_LABELS: Record<FlightSortOption, string> = {
  price_asc: 'Price: Low → High',
  price_desc: 'Price: High → Low',
  duration_asc: 'Shortest Duration',
  departure_asc: 'Earliest Departure',
  departure_desc: 'Latest Departure',
};
