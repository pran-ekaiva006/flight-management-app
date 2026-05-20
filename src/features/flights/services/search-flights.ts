import { createClient } from '@/lib/supabase/server';
import type {
  FlightSearchResult,
  FlightSortOption,
  SeatClassSummary,
} from '../types/flight';
import { resolveAirportCode } from '../utils/airport-codes';

interface SearchFlightsParams {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  sort?: FlightSortOption;
}

/**
 * ─── Search Flights (Server-Only) ───────────────────────
 * Queries flights matching origin/destination/date and
 * aggregates seat availability per class.
 */
export async function searchFlights({
  origin,
  destination,
  departureDate,
  passengers,
  sort = 'price_asc',
}: SearchFlightsParams): Promise<FlightSearchResult[]> {
  const supabase = await createClient();

  // Resolve city names to IATA codes (e.g., "delhi" → "DEL")
  const resolvedOrigin = resolveAirportCode(origin);
  const resolvedDestination = resolveAirportCode(destination);

  // Build date range for the departure day
  const dayStart = `${departureDate}T00:00:00`;
  const dayEnd = `${departureDate}T23:59:59`;

  // Fetch flights matching route + date with their seats
  const { data: flights, error } = await supabase
    .from('flights')
    .select(
      `
      *,
      seats (
        id,
        class,
        is_available,
        extra_fee
      )
    `,
    )
    .ilike('origin', resolvedOrigin)
    .ilike('destination', resolvedDestination)
    .gte('departs_at', dayStart)
    .lte('departs_at', dayEnd)
    .in('status', ['scheduled', 'boarding', 'delayed']);

  if (error) {
    console.error('[searchFlights] Supabase error:', error);
    return [];
  }

  if (!flights || flights.length === 0) {
    return [];
  }

  // Transform into FlightSearchResult with seat aggregation
  const results: FlightSearchResult[] = flights
    .map((flight) => {
      const seats =
        (flight.seats as Array<{
          id: string;
          class: 'economy' | 'business' | 'first';
          is_available: boolean;
          extra_fee: number;
        }>) || [];

      // Aggregate seats by class
      const classMap = new Map<string, { available: number; minFee: number }>();

      for (const seat of seats) {
        const existing = classMap.get(seat.class);
        if (existing) {
          if (seat.is_available) existing.available++;
          existing.minFee = Math.min(existing.minFee, seat.extra_fee);
        } else {
          classMap.set(seat.class, {
            available: seat.is_available ? 1 : 0,
            minFee: seat.extra_fee,
          });
        }
      }

      const seatClasses: SeatClassSummary[] = Array.from(classMap.entries())
        .map(([seatClass, info]) => ({
          class: seatClass as SeatClassSummary['class'],
          available: info.available,
          startingPrice: flight.base_price + info.minFee,
        }))
        // Sort: economy → business → first
        .sort((a, b) => {
          const order = { economy: 0, business: 1, first: 2 };
          return order[a.class] - order[b.class];
        });

      const totalAvailableSeats = seatClasses.reduce(
        (sum, sc) => sum + sc.available,
        0,
      );

      // Calculate duration in minutes
      const departsAt = new Date(flight.departs_at);
      const arrivesAt = new Date(flight.arrives_at);
      const durationMinutes = Math.round(
        (arrivesAt.getTime() - departsAt.getTime()) / 60000,
      );

      // Remove the nested seats from the result to keep it clean
      const { seats: _seats, ...flightData } = flight;

      return {
        ...flightData,
        durationMinutes,
        seatClasses,
        totalAvailableSeats,
      } as FlightSearchResult;
    })
    // Filter out flights without enough available seats
    .filter((f) => f.totalAvailableSeats >= passengers);

  // Sort results
  results.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.base_price - b.base_price;
      case 'price_desc':
        return b.base_price - a.base_price;
      case 'duration_asc':
        return a.durationMinutes - b.durationMinutes;
      case 'departure_asc':
        return (
          new Date(a.departs_at).getTime() - new Date(b.departs_at).getTime()
        );
      case 'departure_desc':
        return (
          new Date(b.departs_at).getTime() - new Date(a.departs_at).getTime()
        );
      default:
        return 0;
    }
  });

  return results;
}
