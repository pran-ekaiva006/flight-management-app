/**
 * ─── Airport Code Mappings ──────────────────────────────
 * Maps common city names to IATA codes for flexible search.
 * Used by the search service to resolve user-friendly input.
 */

const CITY_TO_IATA: Record<string, string> = {
  // ─── India (Domestic) ──────────────────────────────────
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
  goa: 'GOI',
  jaipur: 'JAI',
  ahmedabad: 'AMD',
  pune: 'PNQ',
  lucknow: 'LKO',
  kochi: 'COK',
  cochin: 'COK',
  guwahati: 'GAU',
  varanasi: 'VNS',
  amritsar: 'ATQ',
  chandigarh: 'IXC',
  patna: 'PAT',
  indore: 'IDR',
  nagpur: 'NAG',
  bhubaneswar: 'BBI',
  thiruvananthapuram: 'TRV',
  trivandrum: 'TRV',
  srinagar: 'SXR',
  // ─── Southeast Asia ────────────────────────────────────
  singapore: 'SIN',
  bangkok: 'BKK',
  'kuala lumpur': 'KUL',
  bali: 'DPS',
  denpasar: 'DPS',
  jakarta: 'CGK',
  'ho chi minh': 'SGN',
  hanoi: 'HAN',
  manila: 'MNL',
  phuket: 'HKT',
  // ─── Middle East ───────────────────────────────────────
  dubai: 'DXB',
  'abu dhabi': 'AUH',
  doha: 'DOH',
  muscat: 'MCT',
  riyadh: 'RUH',
  jeddah: 'JED',
  // ─── East Asia ─────────────────────────────────────────
  tokyo: 'NRT',
  osaka: 'KIX',
  'hong kong': 'HKG',
  seoul: 'ICN',
  shanghai: 'PVG',
  beijing: 'PEK',
  taipei: 'TPE',
  // ─── South Asia ────────────────────────────────────────
  kathmandu: 'KTM',
  colombo: 'CMB',
  dhaka: 'DAC',
  male: 'MLE',
  maldives: 'MLE',
  // ─── Europe ────────────────────────────────────────────
  london: 'LHR',
  paris: 'CDG',
  frankfurt: 'FRA',
  amsterdam: 'AMS',
  zurich: 'ZRH',
  rome: 'FCO',
  istanbul: 'IST',
  moscow: 'SVO',
  // ─── Americas ──────────────────────────────────────────
  'new york': 'JFK',
  'los angeles': 'LAX',
  'san francisco': 'SFO',
  chicago: 'ORD',
  toronto: 'YYZ',
  // ─── Oceania ───────────────────────────────────────────
  sydney: 'SYD',
  melbourne: 'MEL',
  // ─── Africa ────────────────────────────────────────────
  nairobi: 'NBO',
  'cape town': 'CPT',
  // ─── IATA codes (passthrough for direct code entry) ────
  del: 'DEL', bom: 'BOM', blr: 'BLR', hyd: 'HYD', ccu: 'CCU', maa: 'MAA',
  goi: 'GOI', jai: 'JAI', amd: 'AMD', pnq: 'PNQ', lko: 'LKO', cok: 'COK',
  gau: 'GAU', vns: 'VNS', atq: 'ATQ', ixc: 'IXC', pat: 'PAT', idr: 'IDR',
  nag: 'NAG', bbi: 'BBI', trv: 'TRV', sxr: 'SXR',
  sin: 'SIN', bkk: 'BKK', kul: 'KUL', dps: 'DPS', cgk: 'CGK', sgn: 'SGN',
  han: 'HAN', mnl: 'MNL', hkt: 'HKT',
  dxb: 'DXB', auh: 'AUH', doh: 'DOH', mct: 'MCT', ruh: 'RUH', jed: 'JED',
  nrt: 'NRT', kix: 'KIX', hkg: 'HKG', icn: 'ICN', pvg: 'PVG', pek: 'PEK', tpe: 'TPE',
  ktm: 'KTM', cmb: 'CMB', dac: 'DAC', mle: 'MLE',
  lhr: 'LHR', cdg: 'CDG', fra: 'FRA', ams: 'AMS', zrh: 'ZRH', fco: 'FCO',
  ist: 'IST', svo: 'SVO',
  jfk: 'JFK', lax: 'LAX', sfo: 'SFO', ord: 'ORD', yyz: 'YYZ',
  syd: 'SYD', mel: 'MEL',
  nbo: 'NBO', cpt: 'CPT',
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
  // India
  DEL: 'Delhi', BOM: 'Mumbai', BLR: 'Bangalore', HYD: 'Hyderabad',
  CCU: 'Kolkata', MAA: 'Chennai', GOI: 'Goa', JAI: 'Jaipur',
  AMD: 'Ahmedabad', PNQ: 'Pune', LKO: 'Lucknow', COK: 'Kochi',
  GAU: 'Guwahati', VNS: 'Varanasi', ATQ: 'Amritsar', IXC: 'Chandigarh',
  PAT: 'Patna', IDR: 'Indore', NAG: 'Nagpur', BBI: 'Bhubaneswar',
  TRV: 'Thiruvananthapuram', SXR: 'Srinagar',
  // Southeast Asia
  SIN: 'Singapore', BKK: 'Bangkok', KUL: 'Kuala Lumpur', DPS: 'Bali',
  CGK: 'Jakarta', SGN: 'Ho Chi Minh City', HAN: 'Hanoi', MNL: 'Manila',
  HKT: 'Phuket',
  // Middle East
  DXB: 'Dubai', AUH: 'Abu Dhabi', DOH: 'Doha', MCT: 'Muscat',
  RUH: 'Riyadh', JED: 'Jeddah',
  // East Asia
  NRT: 'Tokyo', KIX: 'Osaka', HKG: 'Hong Kong', ICN: 'Seoul',
  PVG: 'Shanghai', PEK: 'Beijing', TPE: 'Taipei',
  // South Asia
  KTM: 'Kathmandu', CMB: 'Colombo', DAC: 'Dhaka', MLE: 'Maldives',
  // Europe
  LHR: 'London', CDG: 'Paris', FRA: 'Frankfurt', AMS: 'Amsterdam',
  ZRH: 'Zurich', FCO: 'Rome', IST: 'Istanbul', SVO: 'Moscow',
  // Americas
  JFK: 'New York', LAX: 'Los Angeles', SFO: 'San Francisco',
  ORD: 'Chicago', YYZ: 'Toronto',
  // Oceania
  SYD: 'Sydney', MEL: 'Melbourne',
  // Africa
  NBO: 'Nairobi', CPT: 'Cape Town',
};

export function getAirportName(code: string): string {
  return IATA_TO_CITY[code.toUpperCase()] || code;
}

/**
 * ─── Route Definitions ─────────────────────────────────
 * Pre-defined routes with approximate flight distances (km).
 * Used by the flight generator for realistic pricing and durations.
 */
export interface RouteDefinition {
  origin: string;
  destination: string;
  distanceKm: number;
  region: 'domestic' | 'south-asia' | 'southeast-asia' | 'middle-east' | 'east-asia' | 'europe' | 'americas' | 'oceania' | 'africa';
}

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  // ─── Domestic India (Major Trunk Routes) ───────────────
  { origin: 'DEL', destination: 'BOM', distanceKm: 1150, region: 'domestic' },
  { origin: 'DEL', destination: 'BLR', distanceKm: 1740, region: 'domestic' },
  { origin: 'DEL', destination: 'HYD', distanceKm: 1260, region: 'domestic' },
  { origin: 'DEL', destination: 'CCU', distanceKm: 1300, region: 'domestic' },
  { origin: 'DEL', destination: 'MAA', distanceKm: 1760, region: 'domestic' },
  { origin: 'DEL', destination: 'GOI', distanceKm: 1200, region: 'domestic' },
  { origin: 'DEL', destination: 'JAI', distanceKm: 260, region: 'domestic' },
  { origin: 'DEL', destination: 'LKO', distanceKm: 420, region: 'domestic' },
  { origin: 'DEL', destination: 'AMD', distanceKm: 780, region: 'domestic' },
  { origin: 'DEL', destination: 'PNQ', distanceKm: 1180, region: 'domestic' },
  { origin: 'DEL', destination: 'COK', distanceKm: 2060, region: 'domestic' },
  { origin: 'DEL', destination: 'GAU', distanceKm: 1500, region: 'domestic' },
  { origin: 'DEL', destination: 'VNS', distanceKm: 650, region: 'domestic' },
  { origin: 'DEL', destination: 'ATQ', distanceKm: 400, region: 'domestic' },
  { origin: 'DEL', destination: 'SXR', distanceKm: 640, region: 'domestic' },
  { origin: 'DEL', destination: 'PAT', distanceKm: 900, region: 'domestic' },
  { origin: 'DEL', destination: 'IDR', distanceKm: 680, region: 'domestic' },
  { origin: 'DEL', destination: 'NAG', distanceKm: 860, region: 'domestic' },
  { origin: 'BOM', destination: 'BLR', distanceKm: 840, region: 'domestic' },
  { origin: 'BOM', destination: 'DEL', distanceKm: 1150, region: 'domestic' },
  { origin: 'BOM', destination: 'HYD', distanceKm: 620, region: 'domestic' },
  { origin: 'BOM', destination: 'CCU', distanceKm: 1660, region: 'domestic' },
  { origin: 'BOM', destination: 'MAA', distanceKm: 1030, region: 'domestic' },
  { origin: 'BOM', destination: 'GOI', distanceKm: 440, region: 'domestic' },
  { origin: 'BOM', destination: 'PNQ', distanceKm: 120, region: 'domestic' },
  { origin: 'BOM', destination: 'COK', distanceKm: 1070, region: 'domestic' },
  { origin: 'BLR', destination: 'DEL', distanceKm: 1740, region: 'domestic' },
  { origin: 'BLR', destination: 'BOM', distanceKm: 840, region: 'domestic' },
  { origin: 'BLR', destination: 'HYD', distanceKm: 500, region: 'domestic' },
  { origin: 'BLR', destination: 'CCU', distanceKm: 1560, region: 'domestic' },
  { origin: 'BLR', destination: 'MAA', distanceKm: 290, region: 'domestic' },
  { origin: 'BLR', destination: 'COK', distanceKm: 350, region: 'domestic' },
  { origin: 'HYD', destination: 'DEL', distanceKm: 1260, region: 'domestic' },
  { origin: 'HYD', destination: 'BOM', distanceKm: 620, region: 'domestic' },
  { origin: 'HYD', destination: 'BLR', distanceKm: 500, region: 'domestic' },
  { origin: 'HYD', destination: 'CCU', distanceKm: 1190, region: 'domestic' },
  { origin: 'CCU', destination: 'DEL', distanceKm: 1300, region: 'domestic' },
  { origin: 'CCU', destination: 'BOM', distanceKm: 1660, region: 'domestic' },
  { origin: 'CCU', destination: 'BLR', distanceKm: 1560, region: 'domestic' },
  { origin: 'MAA', destination: 'DEL', distanceKm: 1760, region: 'domestic' },
  { origin: 'MAA', destination: 'BOM', distanceKm: 1030, region: 'domestic' },

  // ─── International: South Asia ─────────────────────────
  { origin: 'DEL', destination: 'KTM', distanceKm: 800, region: 'south-asia' },
  { origin: 'DEL', destination: 'CMB', distanceKm: 2500, region: 'south-asia' },
  { origin: 'DEL', destination: 'DAC', distanceKm: 1500, region: 'south-asia' },
  { origin: 'DEL', destination: 'MLE', distanceKm: 2900, region: 'south-asia' },
  { origin: 'BOM', destination: 'CMB', distanceKm: 1500, region: 'south-asia' },
  { origin: 'BOM', destination: 'MLE', distanceKm: 1900, region: 'south-asia' },
  { origin: 'CCU', destination: 'DAC', distanceKm: 250, region: 'south-asia' },
  { origin: 'CCU', destination: 'KTM', distanceKm: 500, region: 'south-asia' },
  { origin: 'MAA', destination: 'CMB', distanceKm: 600, region: 'south-asia' },
  { origin: 'COK', destination: 'MLE', distanceKm: 700, region: 'south-asia' },

  // ─── International: Southeast Asia ─────────────────────
  { origin: 'DEL', destination: 'SIN', distanceKm: 4150, region: 'southeast-asia' },
  { origin: 'DEL', destination: 'BKK', distanceKm: 2900, region: 'southeast-asia' },
  { origin: 'DEL', destination: 'KUL', distanceKm: 4100, region: 'southeast-asia' },
  { origin: 'DEL', destination: 'DPS', distanceKm: 5100, region: 'southeast-asia' },
  { origin: 'DEL', destination: 'HKT', distanceKm: 3300, region: 'southeast-asia' },
  { origin: 'BOM', destination: 'SIN', distanceKm: 3900, region: 'southeast-asia' },
  { origin: 'BOM', destination: 'BKK', distanceKm: 3200, region: 'southeast-asia' },
  { origin: 'BLR', destination: 'SIN', distanceKm: 3000, region: 'southeast-asia' },
  { origin: 'BLR', destination: 'BKK', distanceKm: 2900, region: 'southeast-asia' },
  { origin: 'CCU', destination: 'BKK', distanceKm: 2300, region: 'southeast-asia' },
  { origin: 'CCU', destination: 'SIN', distanceKm: 3100, region: 'southeast-asia' },
  { origin: 'MAA', destination: 'SIN', distanceKm: 2600, region: 'southeast-asia' },
  { origin: 'MAA', destination: 'KUL', distanceKm: 2700, region: 'southeast-asia' },
  { origin: 'COK', destination: 'SIN', distanceKm: 2900, region: 'southeast-asia' },

  // ─── International: Middle East ────────────────────────
  { origin: 'DEL', destination: 'DXB', distanceKm: 2200, region: 'middle-east' },
  { origin: 'DEL', destination: 'AUH', distanceKm: 2300, region: 'middle-east' },
  { origin: 'DEL', destination: 'DOH', distanceKm: 2700, region: 'middle-east' },
  { origin: 'DEL', destination: 'RUH', distanceKm: 3200, region: 'middle-east' },
  { origin: 'DEL', destination: 'JED', distanceKm: 3500, region: 'middle-east' },
  { origin: 'BOM', destination: 'DXB', distanceKm: 1950, region: 'middle-east' },
  { origin: 'BOM', destination: 'AUH', distanceKm: 2050, region: 'middle-east' },
  { origin: 'BOM', destination: 'DOH', distanceKm: 2500, region: 'middle-east' },
  { origin: 'HYD', destination: 'DXB', distanceKm: 2500, region: 'middle-east' },
  { origin: 'BLR', destination: 'DXB', distanceKm: 2700, region: 'middle-east' },
  { origin: 'CCU', destination: 'DXB', distanceKm: 3500, region: 'middle-east' },
  { origin: 'MAA', destination: 'DXB', distanceKm: 2800, region: 'middle-east' },
  { origin: 'COK', destination: 'DXB', distanceKm: 2700, region: 'middle-east' },
  { origin: 'COK', destination: 'DOH', distanceKm: 3100, region: 'middle-east' },

  // ─── International: East Asia ──────────────────────────
  { origin: 'DEL', destination: 'HKG', distanceKm: 3750, region: 'east-asia' },
  { origin: 'DEL', destination: 'NRT', distanceKm: 5850, region: 'east-asia' },
  { origin: 'DEL', destination: 'ICN', distanceKm: 4600, region: 'east-asia' },
  { origin: 'DEL', destination: 'PVG', distanceKm: 4350, region: 'east-asia' },
  { origin: 'BOM', destination: 'HKG', distanceKm: 4600, region: 'east-asia' },
  { origin: 'BOM', destination: 'NRT', distanceKm: 6700, region: 'east-asia' },
  { origin: 'BLR', destination: 'HKG', distanceKm: 4100, region: 'east-asia' },

  // ─── International: Europe ─────────────────────────────
  { origin: 'DEL', destination: 'LHR', distanceKm: 6700, region: 'europe' },
  { origin: 'DEL', destination: 'CDG', distanceKm: 6600, region: 'europe' },
  { origin: 'DEL', destination: 'FRA', distanceKm: 6100, region: 'europe' },
  { origin: 'DEL', destination: 'AMS', distanceKm: 6500, region: 'europe' },
  { origin: 'DEL', destination: 'IST', distanceKm: 4500, region: 'europe' },
  { origin: 'BOM', destination: 'LHR', distanceKm: 7200, region: 'europe' },
  { origin: 'BOM', destination: 'CDG', distanceKm: 7000, region: 'europe' },
  { origin: 'BOM', destination: 'FRA', distanceKm: 6600, region: 'europe' },
  { origin: 'BLR', destination: 'LHR', distanceKm: 8000, region: 'europe' },

  // ─── International: Americas ───────────────────────────
  { origin: 'DEL', destination: 'JFK', distanceKm: 11800, region: 'americas' },
  { origin: 'DEL', destination: 'SFO', distanceKm: 12400, region: 'americas' },
  { origin: 'DEL', destination: 'ORD', distanceKm: 12100, region: 'americas' },
  { origin: 'DEL', destination: 'YYZ', distanceKm: 11500, region: 'americas' },
  { origin: 'BOM', destination: 'JFK', distanceKm: 12550, region: 'americas' },
  { origin: 'BOM', destination: 'LAX', distanceKm: 14000, region: 'americas' },

  // ─── International: Oceania ────────────────────────────
  { origin: 'DEL', destination: 'SYD', distanceKm: 10200, region: 'oceania' },
  { origin: 'DEL', destination: 'MEL', distanceKm: 10400, region: 'oceania' },
  { origin: 'BOM', destination: 'SYD', distanceKm: 10000, region: 'oceania' },

  // ─── International: Africa ─────────────────────────────
  { origin: 'DEL', destination: 'NBO', distanceKm: 5300, region: 'africa' },
  { origin: 'BOM', destination: 'NBO', distanceKm: 4400, region: 'africa' },
];

/** Get all unique airport codes used in routes. */
export function getAllAirportCodes(): string[] {
  const codes = new Set<string>();
  for (const route of ROUTE_DEFINITIONS) {
    codes.add(route.origin);
    codes.add(route.destination);
  }
  return Array.from(codes).sort();
}

/** Get all unique routes. */
export function getAllRoutes(): RouteDefinition[] {
  return ROUTE_DEFINITIONS;
}

/** Get routes from a specific origin. */
export function getRoutesFromOrigin(origin: string): RouteDefinition[] {
  const code = resolveAirportCode(origin);
  return ROUTE_DEFINITIONS.filter((r) => r.origin === code);
}

/** Get the region label for display. */
export function getRegionLabel(region: RouteDefinition['region']): string {
  const labels: Record<RouteDefinition['region'], string> = {
    domestic: 'Domestic India',
    'south-asia': 'South Asia',
    'southeast-asia': 'Southeast Asia',
    'middle-east': 'Middle East',
    'east-asia': 'East Asia',
    europe: 'Europe',
    americas: 'Americas',
    oceania: 'Oceania',
    africa: 'Africa',
  };
  return labels[region] || region;
}
