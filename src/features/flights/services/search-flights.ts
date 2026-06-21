import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type {
  FlightSearchResult,
  FlightSortOption,
  SeatClassSummary,
} from '../types/flight';
import { resolveAirportCode } from '../utils/airport-codes';
import { searchFlightOffers } from '@/lib/amadeus/client';
import {
  normalizeOffer,
  type AmadeusFlightOffer,
} from '@/lib/amadeus/normalize';

interface SearchFlightsParams {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  sort?: FlightSortOption;
}

// ─── In-memory cooldown for Amadeus API calls ──────────
// Key: "ORIGIN|DESTINATION|DATE", Value: epoch ms of last fetch.
// Prevents re-fetching the same route/date within 6 hours.
const AMADEUS_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours
const amadeusCooldownMap = new Map<string, number>();

/** Minimum results from our DB before we bother calling Amadeus */
const AMADEUS_THRESHOLD = 3;

/**
 * ─── Search Flights (Server-Only) ───────────────────────
 * Queries flights matching origin/destination/date and
 * aggregates seat availability per class.
 *
 * When local results are below threshold, supplements with
 * live Amadeus Flight Offers (persisted into our own tables).
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

  // ─── Initial query: existing flights ─────────────────
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

  let allFlights = flights || [];

  // ─── Amadeus fallback: fetch + persist if below threshold ─
  if (allFlights.length < AMADEUS_THRESHOLD) {
    const cooldownKey = `${resolvedOrigin}|${resolvedDestination}|${departureDate}`;
    const lastFetched = amadeusCooldownMap.get(cooldownKey) || 0;
    const now = Date.now();

    if (now - lastFetched > AMADEUS_COOLDOWN_MS) {
      try {
        const offers = await searchFlightOffers({
          origin: resolvedOrigin,
          destination: resolvedDestination,
          departureDate,
          adults: passengers,
        });

        if (offers.length > 0) {
          const insertedAny = await persistAmadeusOffers(
            offers,
            resolvedOrigin,
            resolvedDestination,
          );

          // Mark cooldown regardless of whether we inserted anything,
          // to avoid hammering the API on repeated zero-result routes.
          amadeusCooldownMap.set(cooldownKey, now);

          if (insertedAny) {
            // Re-query to get the full result set with seat aggregation
            const { data: refreshed } = await supabase
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

            if (refreshed) {
              allFlights = refreshed;
            }
          }
        } else {
          // Even empty results count — don't re-call for this combo
          amadeusCooldownMap.set(cooldownKey, now);
        }
      } catch (err) {
        // Non-fatal — Amadeus is a bonus data source
        console.warn('[searchFlights] Amadeus enrichment failed (non-fatal):', err);
      }
    }
  }

  // ─── Transform into FlightSearchResult with seat aggregation ─
  const results: FlightSearchResult[] = allFlights
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

// ─── Persist Amadeus offers into our flights + seats tables ─

/**
 * Normalize, dedup, insert Amadeus offers, and generate seat maps.
 * Returns true if any new flights were actually inserted.
 */
async function persistAmadeusOffers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offers: any[],
  resolvedOrigin: string,
  resolvedDestination: string,
): Promise<boolean> {
  // Use admin client (service role) since flights table has no INSERT RLS policy —
  // flight data is managed server-side, not by end users.
  const admin = createAdminClient();
  let insertedAny = false;

  for (const rawOffer of offers) {
    const normalized = normalizeOffer(rawOffer as AmadeusFlightOffer);
    if (!normalized) continue;

    // Only insert flights matching the searched route
    // (Amadeus may return flights with different IATA codes for the same city)
    if (
      normalized.origin !== resolvedOrigin ||
      normalized.destination !== resolvedDestination
    ) {
      continue;
    }

    // Check if this flight already exists (dedup by flight_no + departs_at)
    const { data: existing } = await admin
      .from('flights')
      .select('id')
      .eq('flight_no', normalized.flight_no)
      .eq('departs_at', normalized.departs_at)
      .limit(1)
      .single();

    if (existing) continue; // Already persisted — skip

    // Insert the new flight
    const { data: inserted, error: insertError } = await admin
      .from('flights')
      .insert({
        flight_no: normalized.flight_no,
        origin: normalized.origin,
        destination: normalized.destination,
        departs_at: normalized.departs_at,
        arrives_at: normalized.arrives_at,
        aircraft_type: normalized.aircraft_type,
        base_price: normalized.base_price,
        source: 'amadeus',
        external_ref: normalized.external_ref,
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      // Could be a unique constraint violation from a race condition — not fatal
      console.warn(
        `[Amadeus] Failed to insert flight ${normalized.flight_no}:`,
        insertError?.message,
      );
      continue;
    }

    // Generate seat map for the newly inserted flight
    const { error: seatMapError } = await admin.rpc('generate_seat_map', {
      p_flight_id: inserted.id,
    });

    if (seatMapError) {
      console.warn(
        `[Amadeus] Failed to generate seat map for flight ${inserted.id}:`,
        seatMapError.message,
      );
    } else {
      insertedAny = true;
    }
  }

  return insertedAny;
}

