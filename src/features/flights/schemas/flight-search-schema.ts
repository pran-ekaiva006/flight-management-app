import { z } from 'zod';

/**
 * ─── Flight Search Schema ──────────────────────────────
 * Validates the flight search form input before querying.
 */
export const flightSearchSchema = z.object({
  origin: z
    .string()
    .min(2, 'Origin must be at least 2 characters')
    .max(100, 'Origin must be under 100 characters')
    .trim(),
  destination: z
    .string()
    .min(2, 'Destination must be at least 2 characters')
    .max(100, 'Destination must be under 100 characters')
    .trim(),
  departureDate: z
    .string()
    .min(1, 'Please select a departure date')
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: 'Departure date cannot be in the past' },
    ),
  passengers: z
    .number({ message: 'Please enter a valid number of passengers' })
    .int('Passenger count must be a whole number')
    .min(1, 'At least 1 passenger is required')
    .max(9, 'Maximum 9 passengers allowed'),
});

export type FlightSearchFormData = z.infer<typeof flightSearchSchema>;
