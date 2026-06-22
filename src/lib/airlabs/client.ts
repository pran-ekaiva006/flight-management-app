
import { serverEnv } from '@/lib/env';
import { resolveAirportCode } from '@/features/flights/utils/airport-codes';

const AIRLABS_BASE_URL = 'https://airlabs.co/api/v9';

// ─── Flight Schedules Search ───────────────────────────

interface SearchFlightSchedulesParams {
  origin: string;
  destination: string;
}


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

    const res = await fetch(
      `${AIRLABS_BASE_URL}/schedules?${params.toString()}`,
    );

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
