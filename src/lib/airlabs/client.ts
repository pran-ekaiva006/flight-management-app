/**
 * ─── AirLabs API Client (Server-Only) ──────────────────
 * Thin wrapper around the AirLabs Schedules API.
 * Uses plain fetch — no new npm dependencies.
 *
 * Auth: Single API key passed as a query parameter.
 * No OAuth2 token dance required.
 *
 * IMPORTANT: The human operator must create a free account at
 * https://airlabs.co, copy their API key, and paste it into
 * .env.local as AIRLABS_API_KEY.
 * That account-creation step cannot be automated from code.
 */

import { serverEnv } from '@/lib/env';
import { resolveAirportCode } from '@/features/flights/utils/airport-codes';

const AIRLABS_BASE_URL = 'https://airlabs.co/api/v9';

// ─── Flight Schedules Search ───────────────────────────

interface SearchFlightSchedulesParams {
  origin: string;
  destination: string;
}

/**
 * Search for upcoming flight schedules via the AirLabs API.
 * Filters by departure and arrival IATA codes.
 *
 * The AirLabs /schedules endpoint returns flights up to ~10 hours
 * ahead, reflecting the real-time departure board.
 *
 * On ANY failure (network, 4xx/5xx, malformed response), logs a
 * warning and returns an empty array — this integration must NEVER
 * throw and break the search page.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function searchFlightSchedules({
  origin,
  destination,
}: SearchFlightSchedulesParams): Promise<any[]> {
  try {
    // Resolve city names → IATA codes using the shared helper
    const originCode = resolveAirportCode(origin);
    const destinationCode = resolveAirportCode(destination);

    const params = new URLSearchParams({
      api_key: serverEnv.AIRLABS_API_KEY,
      dep_iata: originCode,
      arr_iata: destinationCode,
      limit: '10', // limit results to conserve free-tier quota
    });

    const res = await fetch(`${AIRLABS_BASE_URL}/schedules?${params.toString()}`);

    if (!res.ok) {
      console.warn(
        `[AirLabs] Schedule search failed: ${res.status} ${res.statusText}`,
      );
      return [];
    }

    const data = await res.json();
    return Array.isArray(data.response) ? data.response : [];
  } catch (err) {
    console.warn('[AirLabs] Schedule search error (non-fatal):', err);
    return [];
  }
}
