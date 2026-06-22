import { createClient } from '@/lib/supabase/server';

import type {
  FlightSearchResult,
  FlightSortOption,
  SeatClassSummary,
} from '../types/flight';
import { resolveAirportCode } from '../utils/airport-codes';
import { searchFlightSchedules } from '@/lib/airlabs/client';
import {
  normalizeSchedule,
  type AirLabsSchedule,
} from '@/lib/airlabs/normalize';

interface SearchFlightsParams {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  sort?: FlightSortOption;
}

// ─── In-memory cooldown for AirLabs API calls ──────────
// Key: "ORIGIN|DESTINATION|DATE", Value: epoch ms of last fetch.
// Prevents re-fetching the same route/date within 5 minutes.
const EXTERNAL_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const externalCooldownMap = new Map<string, number>();

/**
 * ─── Search Flights (Server-Only) ───────────────────────
 * Queries flights matching origin/destination/date.
 * Always supplements database flights with live results from the AirLabs API
 * (using temporary dynamic IDs) so the database is not populated during search.
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

  // 1. Initial query: existing flights in the DB
  const { data: dbFlights, error } = await supabase
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

  const resultsMap = new Map<string, FlightSearchResult>();

  // Process database flights and group them
  const dbFlightsList = dbFlights || [];
  for (const flight of dbFlightsList) {
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
      .sort((a, b) => {
        const order = { economy: 0, business: 1, first: 2 };
        return order[a.class] - order[b.class];
      });

    const totalAvailableSeats = seatClasses.reduce(
      (sum, sc) => sum + sc.available,
      0,
    );

    const departsAt = new Date(flight.departs_at);
    const arrivesAt = new Date(flight.arrives_at);
    const durationMinutes = Math.round(
      (arrivesAt.getTime() - departsAt.getTime()) / 60000,
    );

    const { seats: _seats, ...flightData } = flight;
    const key = `${flight.flight_no}|${flight.departs_at}`;

    resultsMap.set(key, {
      ...flightData,
      durationMinutes,
      seatClasses,
      totalAvailableSeats,
    } as FlightSearchResult);
  }

  // 2. Fetch live flight options from AirLabs Schedules API (without persisting them to DB)
  const cooldownKey = `${resolvedOrigin}|${resolvedDestination}|${departureDate}`;
  const lastFetched = externalCooldownMap.get(cooldownKey) || 0;
  const now = Date.now();

  let apiSchedules: any[] = [];
  if (now - lastFetched > EXTERNAL_COOLDOWN_MS) {
    try {
      const schedules = await searchFlightSchedules({
        origin: resolvedOrigin,
        destination: resolvedDestination,
      });
      apiSchedules = schedules;
      externalCooldownMap.set(cooldownKey, now);
    } catch (err) {
      console.warn(
        '[searchFlights] AirLabs schedule fetch failed (non-fatal):',
        err,
      );
    }
  }

  // Merge and normalize AirLabs schedules
  for (const rawSchedule of apiSchedules) {
    const normalized = normalizeSchedule(
      rawSchedule as AirLabsSchedule,
      departureDate,
    );
    if (!normalized) continue;

    // Only include flights matching the searched route
    if (
      normalized.origin !== resolvedOrigin ||
      normalized.destination !== resolvedDestination
    ) {
      continue;
    }

    const key = `${normalized.flight_no}|${normalized.departs_at}`;

    // If already exists in DB results, skip to respect real database seat maps & bookings
    if (resultsMap.has(key)) {
      continue;
    }

    // Construct custom dynamic result with temporary dynamic ID
    const tempId = `airlabs__${normalized.flight_no}__${normalized.origin}__${normalized.destination}__${normalized.departs_at}__${normalized.arrives_at}__${normalized.base_price}__${normalized.external_ref}`;

    const seatClasses: SeatClassSummary[] = [
      { class: 'economy', available: 42, startingPrice: normalized.base_price },
      {
        class: 'business',
        available: 8,
        startingPrice: normalized.base_price + 8000,
      },
      {
        class: 'first',
        available: 4,
        startingPrice: normalized.base_price + 15000,
      },
    ];

    const departsAt = new Date(normalized.departs_at);
    const arrivesAt = new Date(normalized.arrives_at);
    const durationMinutes = Math.round(
      (arrivesAt.getTime() - departsAt.getTime()) / 60000,
    );

    resultsMap.set(key, {
      id: tempId,
      flight_no: normalized.flight_no,
      origin: normalized.origin,
      destination: normalized.destination,
      departs_at: normalized.departs_at,
      arrives_at: normalized.arrives_at,
      aircraft_type: normalized.aircraft_type,
      status: 'scheduled',
      base_price: normalized.base_price,
      source: 'airlabs',
      external_ref: normalized.external_ref,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      durationMinutes,
      seatClasses,
      totalAvailableSeats: 54,
    } as FlightSearchResult);
  }

  // 3. Convert mapped values, filter by passenger count, and sort
  const results = Array.from(resultsMap.values()).filter(
    (f) => f.totalAvailableSeats >= passengers,
  );

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
