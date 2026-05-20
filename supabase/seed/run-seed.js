/**
 * ─── Seed Utility ───────────────────────────────────────
 * Reusable seed runner that can be executed via:
 *   npx ts-node supabase/seed/run-seed.ts
 *   — or —
 *   node supabase/seed/run-seed.js
 *
 * Uses the service role key to bypass RLS.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually for standalone execution
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found at', envPath);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Require ws for Node.js < 22
let transport;
try {
  transport = require('ws');
} catch {
  // ws not available, will fail if realtime is needed
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  ...(transport ? { realtime: { transport } } : {}),
});

// ─── Route & Flight definitions ─────────────────────────

const ROUTES = [
  { origin: 'DEL', destination: 'BOM', name: 'Delhi → Mumbai' },
  { origin: 'BLR', destination: 'HYD', name: 'Bangalore → Hyderabad' },
  { origin: 'CCU', destination: 'MAA', name: 'Kolkata → Chennai' },
  { origin: 'DEL', destination: 'BLR', name: 'Delhi → Bangalore' },
];

const AIRCRAFT_TYPES = [
  'Boeing 737-800',
  'Airbus A320',
  'Boeing 737 MAX',
  'Airbus A320neo',
  'Boeing 787 Dreamliner',
  'Airbus A321',
];

function generateFlights() {
  const flights = [];
  let flightIdx = 0;

  ROUTES.forEach((route, routeIdx) => {
    // 2 flights per route
    for (let i = 0; i < 2; i++) {
      const dayOffset = 3 + routeIdx * 2 + i * 4; // spread across days
      const hourOffset = 6 + i * 8; // morning and evening
      const durationHours = 1.5 + Math.random() * 1.5; // 1.5 - 3 hours

      const departs = new Date();
      departs.setDate(departs.getDate() + dayOffset);
      departs.setHours(hourOffset, 0, 0, 0);

      const arrives = new Date(departs.getTime() + durationHours * 60 * 60 * 1000);
      const basePrice = 3000 + Math.floor(Math.random() * 5000);

      flights.push({
        flight_no: `SA-${(routeIdx + 1)}0${i + 1}`,
        origin: route.origin,
        destination: route.destination,
        departs_at: departs.toISOString(),
        arrives_at: arrives.toISOString(),
        aircraft_type: AIRCRAFT_TYPES[flightIdx % AIRCRAFT_TYPES.length],
        status: 'scheduled',
        base_price: basePrice,
      });

      flightIdx++;
    }
  });

  return flights;
}

function generateSeats(flightId) {
  const seats = [];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

  for (let row = 1; row <= 30; row++) {
    // First class: rows 1-2, seats A-D only
    const cols = row <= 2 ? columns.slice(0, 4) : columns;

    const seatClass = row <= 2 ? 'first' : row <= 7 ? 'business' : 'economy';
    const extraFee = row <= 2 ? 3000 : row <= 7 ? 1500 : 0;

    cols.forEach((col) => {
      seats.push({
        flight_id: flightId,
        seat_number: `${row}${col}`,
        class: seatClass,
        is_available: true,
        extra_fee: extraFee,
      });
    });
  }

  return seats;
}

// ─── Main seed function ─────────────────────────────────

async function seed() {
  console.log('🌱 Starting seed...\n');

  // 1. Clear existing data
  console.log('🗑️  Clearing existing data...');
  await supabase.from('reschedules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('passengers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('seats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('flights').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Insert flights
  const flights = generateFlights();
  console.log(`✈️  Inserting ${flights.length} flights...`);

  const { data: insertedFlights, error: flightErr } = await supabase
    .from('flights')
    .insert(flights)
    .select('id, flight_no, origin, destination');

  if (flightErr) {
    console.error('❌ Flight insert error:', flightErr.message);
    process.exit(1);
  }

  console.log('   Flights inserted:');
  insertedFlights.forEach((f) => {
    console.log(`   • ${f.flight_no}: ${f.origin} → ${f.destination}`);
  });

  // 3. Insert seats for each flight
  let totalSeats = 0;
  for (const flight of insertedFlights) {
    const seats = generateSeats(flight.id);
    totalSeats += seats.length;

    // Insert in batches of 200
    for (let i = 0; i < seats.length; i += 200) {
      const batch = seats.slice(i, i + 200);
      const { error: seatErr } = await supabase.from('seats').insert(batch);
      if (seatErr) {
        console.error(`❌ Seat insert error for ${flight.flight_no}:`, seatErr.message);
        process.exit(1);
      }
    }
    console.log(`   💺 ${flight.flight_no}: ${seats.length} seats created`);
  }

  console.log(`\n✅ Seed complete! ${insertedFlights.length} flights, ${totalSeats} seats total.\n`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
