/**
 * ─── AirLabs Schedule Normalizer ───────────────────────
 * Transforms raw AirLabs /schedules response objects into a
 * shape that can be directly inserted into our `flights` table.
 *
 * Rules:
 * - Returns null for any schedule missing required fields.
 * - Skips cancelled flights.
 * - Generates deterministic mock pricing (AirLabs has no pricing data).
 */

// ─── Types for the raw AirLabs API response ────────────

export interface AirLabsSchedule {
  airline_iata?: string;
  flight_iata?: string;
  flight_number?: string;
  dep_iata?: string;
  arr_iata?: string;
  dep_time?: string; // "2024-07-14 19:53" (airport local time)
  arr_time?: string; // "2024-07-14 22:52" (airport local time)
  dep_time_utc?: string;
  arr_time_utc?: string;
  duration?: number; // minutes
  status?: string; // "scheduled", "active", "landed", "cancelled"
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


function hashCode(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0; // force 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Generate a deterministic mock base price in INR.
 *
 * Factors:
 * - Duration: ₹2,500–₹4,000 per hour of flight
 * - Time-of-day: peak hours (06–10, 17–21) = 1.15×, off-peak = 0.90×
 * - Variation: hash-based jitter ±15% so different flights feel different
 *
 * @param flightIata  e.g. "AI302" — used as seed for determinism
 * @param durationMin flight duration in minutes
 * @param depTime     departure time string (to extract hour)
 * @returns base_price in INR (whole number)
 */
function generateMockPrice(
  flightIata: string,
  durationMin: number,
  depTime: string,
): number {
  // Fallback duration if missing
  const duration = durationMin > 0 ? durationMin : 120;

  // Base rate: ₹3,250/hr average
  const hours = duration / 60;
  const baseAmount = hours * 3250;

  // Time-of-day multiplier
  const hourMatch = depTime.match(/(\d{2}):\d{2}/);
  const hour = hourMatch?.[1] ? parseInt(hourMatch[1], 10) : 12;
  const isPeak = (hour >= 6 && hour <= 10) || (hour >= 17 && hour <= 21);
  const timeMultiplier = isPeak ? 1.15 : 0.9;

  // Hash-based variation: ±15%
  const hash = hashCode(flightIata);
  const variation = 0.85 + (hash % 3000) / 10000; // 0.85 – 1.15

  const price = Math.round(baseAmount * timeMultiplier * variation);

  // Clamp to reasonable range: ₹2,000 – ₹50,000
  return Math.max(2000, Math.min(50000, price));
}


export function normalizeSchedule(
  schedule: AirLabsSchedule,
  targetDate?: string,
): NormalizedFlight | null {
  try {
    // Skip cancelled flights
    if (schedule.status === 'cancelled') return null;

    const airlineIata = schedule.airline_iata;
    const flightNumber = schedule.flight_number;
    const flightIata = schedule.flight_iata;
    const originCode = schedule.dep_iata;
    const destinationCode = schedule.arr_iata;
    const depTime = schedule.dep_time;
    const arrTime = schedule.arr_time;

    // Validate all required fields are present
    if (
      !airlineIata ||
      !flightNumber ||
      !flightIata ||
      !originCode ||
      !destinationCode ||
      !depTime ||
      !arrTime
    ) {
      return null;
    }

    // Convert AirLabs time format "2024-07-14 19:53" → ISO 8601
    // AirLabs dep_time/arr_time are in airport local time
    let departsAt = depTime.replace(' ', 'T');
    let arrivesAt = arrTime.replace(' ', 'T');

    // Transpose flight to searched departureDate if targetDate is provided
    if (targetDate) {
      try {
        const depTimePart = depTime.split(' ')[1] || '00:00';
        const arrTimePart = arrTime.split(' ')[1] || '00:00';

        const rawDepDateStr = depTime.split(' ')[0];
        const rawArrDateStr = arrTime.split(' ')[0];

        let dayDiff = 0;
        if (rawDepDateStr && rawArrDateStr) {
          const rawDepDate = new Date(`${rawDepDateStr}T00:00:00Z`);
          const rawArrDate = new Date(`${rawArrDateStr}T00:00:00Z`);
          dayDiff = Math.round(
            (rawArrDate.getTime() - rawDepDate.getTime()) /
            (24 * 60 * 60 * 1000),
          );
          if (isNaN(dayDiff)) dayDiff = 0;
        }

        departsAt = `${targetDate}T${depTimePart}`;

        const targetDepDate = new Date(`${targetDate}T00:00:00Z`);
        const targetArrDate = new Date(
          targetDepDate.getTime() + dayDiff * 24 * 60 * 60 * 1000,
        );
        const targetArrDateStr = targetArrDate.toISOString().split('T')[0];
        arrivesAt = `${targetArrDateStr}T${arrTimePart}`;
      } catch (err) {
        console.warn(
          '[AirLabs Normalizer] Failed to adjust schedule date:',
          err,
        );
      }
    }

    // Calculate duration from timestamps if not provided
    let duration = schedule.duration ?? 0;
    if (duration <= 0) {
      const depMs = new Date(departsAt).getTime();
      const arrMs = new Date(arrivesAt).getTime();
      if (arrMs > depMs) {
        duration = Math.round((arrMs - depMs) / 60000);
      }
    }

    // Generate deterministic mock price
    const basePrice = generateMockPrice(flightIata, duration, depTime);

    return {
      flight_no: `${airlineIata}-${flightNumber}`,
      origin: originCode,
      destination: destinationCode,
      departs_at: departsAt,
      arrives_at: arrivesAt,
      aircraft_type: 'Unknown Aircraft', // Not available on AirLabs free tier
      base_price: basePrice,
      external_ref: flightIata,
    };
  } catch {
    // If anything unexpected happens, skip this schedule
    return null;
  }
}
