/**
 * ─── Built-in Flight Generator ─────────────────────────
 * Deterministically generates realistic daily flights for any route + date.
 * Ensures flights are always available regardless of external API status.
 *
 * All generated data is hash-based and deterministic:
 * the same route + date + slot always produces the same flight.
 */

import type { FlightSearchResult, SeatClassSummary } from '../types/flight';
import { ROUTE_DEFINITIONS, getAirportName } from '../utils/airport-codes';

// ─── Airline Pool ──────────────────────────────────────

interface AirlineInfo {
  code: string;
  name: string;
  type: 'domestic' | 'international';
}

const AIRLINES: AirlineInfo[] = [
  // Indian domestic / full-service
  { code: 'AI', name: 'Air India', type: 'domestic' },
  { code: '6E', name: 'IndiGo', type: 'domestic' },
  { code: 'SG', name: 'SpiceJet', type: 'domestic' },
  { code: 'UK', name: 'Vistara', type: 'domestic' },
  { code: 'G8', name: 'Go First', type: 'domestic' },
  { code: 'QP', name: 'Akasa Air', type: 'domestic' },
  { code: 'I5', name: 'AirAsia India', type: 'domestic' },
  // International carriers
  { code: 'EK', name: 'Emirates', type: 'international' },
  { code: 'SQ', name: 'Singapore Airlines', type: 'international' },
  { code: 'QR', name: 'Qatar Airways', type: 'international' },
  { code: 'EY', name: 'Etihad Airways', type: 'international' },
  { code: 'TG', name: 'Thai Airways', type: 'international' },
  { code: 'MH', name: 'Malaysia Airlines', type: 'international' },
  { code: 'CX', name: 'Cathay Pacific', type: 'international' },
  { code: 'BA', name: 'British Airways', type: 'international' },
  { code: 'LH', name: 'Lufthansa', type: 'international' },
  { code: 'AF', name: 'Air France', type: 'international' },
  { code: 'TK', name: 'Turkish Airlines', type: 'international' },
  { code: 'NH', name: 'ANA', type: 'international' },
  { code: 'KE', name: 'Korean Air', type: 'international' },
  { code: 'QF', name: 'Qantas', type: 'international' },
];

const AIRCRAFT_TYPES = [
  'Boeing 737-800',
  'Boeing 737 MAX 8',
  'Boeing 777-300ER',
  'Boeing 787-9 Dreamliner',
  'Airbus A320neo',
  'Airbus A321neo',
  'Airbus A330-300',
  'Airbus A350-900',
  'Airbus A380-800',
  'ATR 72-600',
];

// ─── Departure Slots (local times) ────────────────────

const DEPARTURE_SLOTS = [
  '05:30', '06:00', '06:45', '07:15', '08:00', '08:30',
  '09:15', '10:00', '10:45', '11:30', '12:15', '13:00',
  '14:00', '14:45', '15:30', '16:15', '17:00', '17:45',
  '18:30', '19:15', '20:00', '21:00', '21:45', '22:30',
  '23:15',
];

// ─── Deterministic Hash ────────────────────────────────

function hashStr(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Seeded PRNG (linear congruential generator).
 * Returns a function that yields successive pseudo-random values in [0,1).
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) | 0;
    return (Math.abs(state) % 100000) / 100000;
  };
}

// ─── Price Generation ──────────────────────────────────

function generatePrice(
  distanceKm: number,
  isDomestic: boolean,
  departureHour: number,
  rng: () => number,
): number {
  // Base rate per km (INR)
  const ratePerKm = isDomestic ? 3.2 : 2.8;
  let price = distanceKm * ratePerKm;

  // Minimum price floor
  price = Math.max(price, isDomestic ? 2500 : 8000);

  // Peak hour surcharge (6-10am, 5-9pm)
  const isPeak =
    (departureHour >= 6 && departureHour <= 10) ||
    (departureHour >= 17 && departureHour <= 21);
  if (isPeak) price *= 1.15;

  // Random variation ±20%
  const variation = 0.8 + rng() * 0.4;
  price *= variation;

  // Round to nearest 50
  return Math.round(price / 50) * 50;
}

// ─── Duration Calculation ──────────────────────────────

function calculateDuration(distanceKm: number): number {
  // Average speed: ~800 km/h for jets, plus ~30 min for taxi/takeoff/landing
  const flyingMinutes = (distanceKm / 800) * 60;
  const overheadMinutes = 30;
  return Math.round(flyingMinutes + overheadMinutes);
}

// ─── Main Generator ───────────────────────────────────

/**
 * Generate deterministic daily flights for a given route and date.
 *
 * @param origin      IATA code (e.g., "DEL")
 * @param destination IATA code (e.g., "CCU")
 * @param date        ISO date string (e.g., "2026-08-01")
 * @returns Array of FlightSearchResult with deterministic data
 */
export function generateDailyFlights(
  origin: string,
  destination: string,
  date: string,
): FlightSearchResult[] {
  // Find route definition for distance
  const routeDef = ROUTE_DEFINITIONS.find(
    (r) => r.origin === origin && r.destination === destination,
  );

  // If no pre-defined route, estimate distance
  const distanceKm = routeDef?.distanceKm ?? 1500;
  const isDomestic = routeDef?.region === 'domestic';

  // Determine how many flights to generate based on route type
  const seed = hashStr(`${origin}|${destination}|${date}`);
  const rng = seededRandom(seed);

  let flightCount: number;
  if (isDomestic && distanceKm < 500) {
    flightCount = 6 + Math.floor(rng() * 5); // 6–10 for short domestic
  } else if (isDomestic) {
    flightCount = 5 + Math.floor(rng() * 4); // 5–8 for long domestic
  } else if (distanceKm < 4000) {
    flightCount = 4 + Math.floor(rng() * 3); // 4–6 for short international
  } else {
    flightCount = 2 + Math.floor(rng() * 3); // 2–4 for long-haul
  }

  // Pick airlines appropriate for the route
  const eligibleAirlines = isDomestic
    ? AIRLINES.filter((a) => a.type === 'domestic')
    : [...AIRLINES]; // International routes can use any airline

  const durationMinutes = calculateDuration(distanceKm);

  const results: FlightSearchResult[] = [];

  // Select departure slots spread throughout the day
  const selectedSlots: string[] = [];
  const slotStep = Math.max(1, Math.floor(DEPARTURE_SLOTS.length / flightCount));
  for (let i = 0; i < flightCount; i++) {
    const baseIdx = (i * slotStep + Math.floor(rng() * 2)) % DEPARTURE_SLOTS.length;
    selectedSlots.push(DEPARTURE_SLOTS[baseIdx]!);
  }
  // Sort chronologically
  selectedSlots.sort();

  for (let i = 0; i < flightCount; i++) {
    const slotSeed = hashStr(`${origin}|${destination}|${date}|${i}`);
    const slotRng = seededRandom(slotSeed);

    // Pick airline
    const airline = eligibleAirlines[Math.floor(slotRng() * eligibleAirlines.length)]!;

    // Generate flight number (deterministic)
    const flightNum = 100 + (slotSeed % 900);
    const flightNo = `${airline.code}-${flightNum}`;

    // Departure time
    const depTime = selectedSlots[i]!;
    const depHour = parseInt(depTime.split(':')[0] ?? '0', 10);

    // Calculate arrival time
    const depMinutes = depHour * 60 + parseInt(depTime.split(':')[1] ?? '0', 10);
    // Add slight variation to duration (±10%)
    const actualDuration = Math.round(durationMinutes * (0.9 + slotRng() * 0.2));
    const arrMinutes = depMinutes + actualDuration;
    const arrDays = Math.floor(arrMinutes / (24 * 60));
    const arrMins = arrMinutes % (24 * 60);
    const arrHour = Math.floor(arrMins / 60);
    const arrMin = arrMins % 60;

    // Build arrival date
    const depDate = new Date(`${date}T00:00:00Z`);
    const arrDate = new Date(depDate.getTime() + arrDays * 24 * 60 * 60 * 1000);
    const arrDateStr = arrDate.toISOString().split('T')[0]!;
    const arrTime = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;

    const departsAt = `${date}T${depTime}`;
    const arrivesAt = `${arrDateStr}T${arrTime}`;

    // Price
    const basePrice = generatePrice(distanceKm, isDomestic, depHour, slotRng);

    // Aircraft
    let aircraft: string;
    if (distanceKm > 5000) {
      // Long-haul: wide-body
      const wideBodies = AIRCRAFT_TYPES.filter((a) => a.includes('777') || a.includes('787') || a.includes('A330') || a.includes('A350') || a.includes('A380'));
      aircraft = wideBodies[Math.floor(slotRng() * wideBodies.length)] ?? 'Boeing 777-300ER';
    } else if (distanceKm < 600) {
      // Short-haul: narrow-body or turboprop
      const shortHaul = AIRCRAFT_TYPES.filter((a) => a.includes('737') || a.includes('A320') || a.includes('A321') || a.includes('ATR'));
      aircraft = shortHaul[Math.floor(slotRng() * shortHaul.length)] ?? 'Airbus A320neo';
    } else {
      const midRange = AIRCRAFT_TYPES.filter((a) => !a.includes('A380') && !a.includes('ATR'));
      aircraft = midRange[Math.floor(slotRng() * midRange.length)] ?? 'Boeing 737-800';
    }

    // Seat class availability
    const economySeats = 120 + Math.floor(slotRng() * 60);
    const businessSeats = isDomestic ? 0 : 12 + Math.floor(slotRng() * 12);
    const firstSeats = distanceKm > 5000 ? 4 + Math.floor(slotRng() * 4) : 0;

    const seatClasses: SeatClassSummary[] = [
      { class: 'economy', available: economySeats, startingPrice: basePrice },
    ];
    if (businessSeats > 0) {
      seatClasses.push({
        class: 'business',
        available: businessSeats,
        startingPrice: basePrice + Math.round(basePrice * 1.5),
      });
    }
    if (firstSeats > 0) {
      seatClasses.push({
        class: 'first',
        available: firstSeats,
        startingPrice: basePrice + Math.round(basePrice * 3.5),
      });
    }

    const totalAvailableSeats = seatClasses.reduce((sum, sc) => sum + sc.available, 0);

    // Build deterministic temp ID
    const tempId = `generated__${flightNo}__${origin}__${destination}__${departsAt}__${arrivesAt}__${basePrice}`;

    results.push({
      id: tempId,
      flight_no: flightNo,
      origin,
      destination,
      departs_at: departsAt,
      arrives_at: arrivesAt,
      aircraft_type: aircraft,
      status: 'scheduled',
      base_price: basePrice,
      source: 'generated',
      external_ref: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      durationMinutes: actualDuration,
      seatClasses,
      totalAvailableSeats,
    } as FlightSearchResult);
  }

  return results;
}
