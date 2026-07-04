const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;
require('dotenv').config({ path: '.env.local' });
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});
admin.from('flights').insert({
    flight_no: '6E-138',
    origin: 'BOM',
    destination: 'NBO',
    departs_at: '2026-07-09T05:30',
    arrives_at: '2026-07-09T11:22',
    aircraft_type: 'Unknown Aircraft',
    base_price: 10600,
    source: 'generated',
    external_ref: null,
}).select('*').single().then(res => console.log(res));
