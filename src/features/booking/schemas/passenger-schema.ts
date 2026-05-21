import { z } from 'zod';

/**
 * ─── Passenger Details Schema ───────────────────────────
 * Validates passenger form input with accessible error messages.
 */
export const passengerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be under 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Full name can only contain letters, spaces, hyphens, and apostrophes',
    ),

  passportNo: z
    .string()
    .min(5, 'Passport number must be at least 5 characters')
    .max(20, 'Passport number must be under 20 characters')
    .regex(
      /^[A-Z0-9]+$/i,
      'Passport number can only contain letters and numbers',
    ),

  nationality: z
    .string()
    .min(2, 'Nationality is required')
    .max(50, 'Nationality must be under 50 characters'),

  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      (val) => {
        const date = new Date(val);
        const now = new Date();
        return date < now;
      },
      { message: 'Date of birth must be in the past' },
    )
    .refine(
      (val) => {
        const date = new Date(val);
        const minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 120);
        return date > minAge;
      },
      { message: 'Please enter a valid date of birth' },
    ),
});

export type PassengerInput = z.infer<typeof passengerSchema>;
