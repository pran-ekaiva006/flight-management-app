require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('No env vars found');
  process.exit(1);
}

// polyfill fetch and WebSocket if needed
const admin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function test() {
  const { data, error } = await admin.from('flights').insert({
    flight_no: '6E-138',
    origin: 'BOM',
    destination: 'NBO',
    departs_at: '2026-07-09T05:30',
    arrives_at: '2026-07-09T11:22',
    aircraft_type: 'Unknown Aircraft',
    base_price: 10600,
    source: 'generated',
    external_ref: null,
  }).select('*').single();
  console.log('Insert Error:', error);
  console.log('Inserted Data:', data);
}

test();
