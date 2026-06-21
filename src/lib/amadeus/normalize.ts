/**
 * ─── Amadeus Offer Normalizer ──────────────────────────
 * Transforms raw Amadeus Flight Offer objects into a shape
 * that can be directly inserted into our `flights` table.
 *
 * Rules:
 * - Only handles one-way, non-stop itineraries (segments.length === 1).
 * - Returns null for any offer missing required fields.
 * - Skips connecting flights — SkyBooker's UI has no concept of them.
 */

// ─── Types for the raw Amadeus API response ────────────

export interface AmadeusSegment {
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  carrierCode: string;
  number: string;
  aircraft?: { code: string };
}

export interface AmadeusItinerary {
  segments: AmadeusSegment[];
}

export interface AmadeusFlightOffer {
  id: string;
  itineraries: AmadeusItinerary[];
  price: { total: string; currency?: string };
}

// ─── Normalized output shape ───────────────────────────

export interface NormalizedFlight {
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  arrives_at: string;
  aircraft_type: string;
  base_price: number;
  external_ref: string;
}

// ─── Aircraft code → friendly name lookup ──────────────

const AIRCRAFT_CODES: Record<string, string> = {
  '319': 'Airbus A319',
  '320': 'Airbus A320',
  '321': 'Airbus A321',
  '32N': 'Airbus A320neo',
  '32Q': 'Airbus A321neo',
  '330': 'Airbus A330',
  '332': 'Airbus A330-200',
  '333': 'Airbus A330-300',
  '338': 'Airbus A330-800neo',
  '339': 'Airbus A330-900neo',
  '340': 'Airbus A340',
  '350': 'Airbus A350',
  '359': 'Airbus A350-900',
  '380': 'Airbus A380',
  '738': 'Boeing 737-800',
  '73H': 'Boeing 737-800',
  '739': 'Boeing 737-900',
  '7M8': 'Boeing 737 MAX 8',
  '7M9': 'Boeing 737 MAX 9',
  '744': 'Boeing 747-400',
  '748': 'Boeing 747-8',
  '767': 'Boeing 767',
  '772': 'Boeing 777-200',
  '773': 'Boeing 777-300',
  '77W': 'Boeing 777-300ER',
  '788': 'Boeing 787-8',
  '789': 'Boeing 787-9',
  '78X': 'Boeing 787-10',
  E90: 'Embraer E190',
  E95: 'Embraer E195',
  AT7: 'ATR 72',
  DH4: 'Dash 8-Q400',
};

function resolveAircraftName(code?: string): string {
  if (!code) return 'Unknown Aircraft';
  return AIRCRAFT_CODES[code] || code;
}

// ─── Normalizer ────────────────────────────────────────

/**
 * Normalize a single Amadeus flight offer into our schema.
 * Returns null if the offer is unusable (missing fields, connecting flight, etc.).
 */
export function normalizeOffer(
  offer: AmadeusFlightOffer,
): NormalizedFlight | null {
  try {
    // Must have at least one itinerary
    const itinerary = offer.itineraries?.[0];
    if (!itinerary?.segments?.length) return null;

    // Skip connecting flights (multi-segment) — out of scope for SkyBooker
    if (itinerary.segments.length > 1) return null;

    const segment = itinerary.segments[0];
    if (!segment) return null;
    const carrierCode = segment.carrierCode;
    const flightNumber = segment.number;
    const originCode = segment.departure?.iataCode;
    const destinationCode = segment.arrival?.iataCode;
    const departsAt = segment.departure?.at;
    const arrivesAt = segment.arrival?.at;
    const priceTotal = offer.price?.total;

    // Validate all required fields are present
    if (
      !carrierCode ||
      !flightNumber ||
      !originCode ||
      !destinationCode ||
      !departsAt ||
      !arrivesAt ||
      !priceTotal
    ) {
      return null;
    }

    const basePrice = parseFloat(priceTotal);
    if (isNaN(basePrice) || basePrice <= 0) return null;

    return {
      flight_no: `${carrierCode}-${flightNumber}`,
      origin: originCode,
      destination: destinationCode,
      departs_at: departsAt,
      arrives_at: arrivesAt,
      aircraft_type: resolveAircraftName(segment.aircraft?.code),
      base_price: basePrice,
      external_ref: offer.id,
    };
  } catch {
    // If anything unexpected happens, skip this offer
    return null;
  }
}
