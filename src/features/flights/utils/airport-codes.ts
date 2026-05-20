/**
 * ─── Airport Code Mappings ──────────────────────────────
 * Maps common city names to IATA codes for flexible search.
 * Used by the search service to resolve user-friendly input.
 */

const CITY_TO_IATA: Record<string, string> = {
  // India
  delhi: 'DEL',
  'new delhi': 'DEL',
  mumbai: 'BOM',
  bombay: 'BOM',
  bangalore: 'BLR',
  bengaluru: 'BLR',
  hyderabad: 'HYD',
  kolkata: 'CCU',
  calcutta: 'CCU',
  chennai: 'MAA',
  madras: 'MAA',
  // IATA codes (passthrough)
  del: 'DEL',
  bom: 'BOM',
  blr: 'BLR',
  hyd: 'HYD',
  ccu: 'CCU',
  maa: 'MAA',
};

/**
 * Resolve a user-typed location to its IATA code.
 * Falls back to the original input (uppercased) if no mapping found.
 */
export function resolveAirportCode(input: string): string {
  const normalized = input.trim().toLowerCase();
  return CITY_TO_IATA[normalized] || input.toUpperCase();
}

/**
 * Get display name for an IATA code.
 */
const IATA_TO_CITY: Record<string, string> = {
  DEL: 'Delhi',
  BOM: 'Mumbai',
  BLR: 'Bangalore',
  HYD: 'Hyderabad',
  CCU: 'Kolkata',
  MAA: 'Chennai',
};

export function getAirportName(code: string): string {
  return IATA_TO_CITY[code.toUpperCase()] || code;
}
