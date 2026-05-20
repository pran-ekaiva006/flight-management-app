'use server';

import { redirect } from 'next/navigation';
import { flightSearchSchema } from '../schemas/flight-search-schema';

export type SearchActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * ─── Search Flights Server Action ───────────────────────
 * Validates the search form and redirects with query params.
 * This keeps URL state in sync so results are bookmarkable/shareable.
 */
export async function searchFlightsAction(
  _prevState: SearchActionResult,
  formData: FormData,
): Promise<SearchActionResult> {
  const raw = {
    origin: (formData.get('origin') as string) || '',
    destination: (formData.get('destination') as string) || '',
    departureDate: (formData.get('departureDate') as string) || '',
    passengers: Number(formData.get('passengers')) || 0,
  };

  const parsed = flightSearchSchema.safeParse(raw);

  if (!parsed.success) {
    // Build a flat field-error map for per-field display
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      error: parsed.error.issues[0]?.message || 'Invalid search input',
      fieldErrors,
    };
  }

  // Build search URL with validated params
  const params = new URLSearchParams({
    origin: parsed.data.origin,
    destination: parsed.data.destination,
    departureDate: parsed.data.departureDate,
    passengers: String(parsed.data.passengers),
  });

  redirect(`/search?${params.toString()}`);
}
