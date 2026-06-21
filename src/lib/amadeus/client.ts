/**
 * ─── Amadeus API Client (Server-Only) ──────────────────
 * Thin wrapper around the Amadeus Flight Offers Search API.
 * Uses plain fetch — no new npm dependencies.
 *
 * IMPORTANT: The human operator must create a free account at
 * https://developers.amadeus.com, register an app, and paste
 * the real client_id and client_secret into .env.local.
 * That account-creation step cannot be automated from code.
 */

import { serverEnv } from '@/lib/env';
import { resolveAirportCode } from '@/features/flights/utils/airport-codes';

// ─── In-memory token cache ──────────────────────────────
let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

/**
 * Fetch a short-lived OAuth2 access token from Amadeus.
 * Caches in memory and re-fetches only once actually expired.
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 30s safety margin)
  if (cachedToken && Date.now() < tokenExpiresAt - 30_000) {
    return cachedToken;
  }

  const baseUrl = serverEnv.AMADEUS_API_BASE_URL;
  const res = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: serverEnv.AMADEUS_CLIENT_ID,
      client_secret: serverEnv.AMADEUS_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    throw new Error(`Amadeus token request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token as string;
  // expires_in is in seconds
  tokenExpiresAt = Date.now() + (data.expires_in as number) * 1000;

  return cachedToken;
}

// ─── Flight Offers Search ──────────────────────────────

interface SearchFlightOffersParams {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  adults?: number;
}

/**
 * Search for flight offers via the Amadeus API.
 * Resolves city names to IATA codes using the existing helper.
 *
 * On ANY failure (network, 4xx/5xx, malformed response), logs a
 * warning and returns an empty array — this integration must NEVER
 * throw and break the search page.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function searchFlightOffers({
  origin,
  destination,
  departureDate,
  adults = 1,
}: SearchFlightOffersParams): Promise<any[]> {
  try {
    const token = await getAccessToken();
    const baseUrl = serverEnv.AMADEUS_API_BASE_URL;

    // Resolve city names → IATA codes using the shared helper
    const originCode = resolveAirportCode(origin);
    const destinationCode = resolveAirportCode(destination);

    const params = new URLSearchParams({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate,
      adults: String(adults),
      nonStop: 'true', // prefer non-stop; SkyBooker has no concept of connections
      max: '10', // limit results to conserve free-tier quota
    });

    const res = await fetch(
      `${baseUrl}/v2/shopping/flight-offers?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) {
      console.warn(
        `[Amadeus] Flight search failed: ${res.status} ${res.statusText}`,
      );
      return [];
    }

    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    console.warn('[Amadeus] Flight search error (non-fatal):', err);
    return [];
  }
}
