-- ─── SEED.SQL ───────────────────────────────────────────────
-- This script seeds the database with a test user, initial flights, and seat maps.

-- 1. Create a test user in auth.users
-- Note: password is 'password123'
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
VALUES (
  'd4a5266f-124d-45df-b210-955fb6216ef3', 
  '00000000-0000-0000-0000-000000000000', 
  'test@example.com', 
  crypt('password123', gen_salt('bf')), 
  now(), 
  '{"provider":"email","providers":["email"]}', 
  '{"full_name":"Test User"}', 
  now(), 
  now(), 
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'd4a5266f-124d-45df-b210-955fb6216ef3',
  format('{"sub":"%s","email":"%s"}', 'd4a5266f-124d-45df-b210-955fb6216ef3', 'test@example.com')::jsonb,
  'email',
  now(),
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- 2. Create sample flights
DO $$
DECLARE
  f1_id UUID := gen_random_uuid();
  f2_id UUID := gen_random_uuid();
  f3_id UUID := gen_random_uuid();
  f4_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO public.flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
  VALUES 
    (f1_id, 'SA-101', 'DEL', 'BOM', now() + interval '2 days', now() + interval '2 days 2 hours', 'Boeing 737', 'scheduled', 4500.00),
    (f2_id, 'SA-102', 'BOM', 'DEL', now() + interval '3 days', now() + interval '3 days 2 hours', 'Boeing 737', 'scheduled', 4200.00),
    (f3_id, 'SA-201', 'BLR', 'DEL', now() + interval '4 days', now() + interval '4 days 2.5 hours', 'Airbus A320', 'scheduled', 5500.00),
    (f4_id, 'SA-202', 'DEL', 'BLR', now() + interval '5 days', now() + interval '5 days 2.5 hours', 'Airbus A320', 'scheduled', 5000.00);

  -- 3. Create seats for flights (abbreviated seat map for seed, realistic maps generated via script in prod)
  FOR flight_record IN SELECT id FROM public.flights WHERE id IN (f1_id, f2_id, f3_id, f4_id) LOOP
    -- First Class (Row 1)
    INSERT INTO public.seats (flight_id, seat_number, class, extra_fee, is_available) VALUES
      (flight_record.id, '1A', 'first', 15000.00, true),
      (flight_record.id, '1B', 'first', 15000.00, true),
      (flight_record.id, '1C', 'first', 15000.00, true),
      (flight_record.id, '1D', 'first', 15000.00, true);
      
    -- Business Class (Rows 2-3)
    INSERT INTO public.seats (flight_id, seat_number, class, extra_fee, is_available) VALUES
      (flight_record.id, '2A', 'business', 8000.00, true),
      (flight_record.id, '2B', 'business', 8000.00, true),
      (flight_record.id, '2C', 'business', 8000.00, true),
      (flight_record.id, '2D', 'business', 8000.00, true),
      (flight_record.id, '3A', 'business', 8000.00, true),
      (flight_record.id, '3B', 'business', 8000.00, true),
      (flight_record.id, '3C', 'business', 8000.00, true),
      (flight_record.id, '3D', 'business', 8000.00, true);

    -- Economy Class (Rows 4-10)
    FOR r IN 4..10 LOOP
      INSERT INTO public.seats (flight_id, seat_number, class, extra_fee, is_available) VALUES
        (flight_record.id, r || 'A', 'economy', 0.00, true),
        (flight_record.id, r || 'B', 'economy', 0.00, true),
        (flight_record.id, r || 'C', 'economy', 0.00, true),
        (flight_record.id, r || 'D', 'economy', 0.00, true),
        (flight_record.id, r || 'E', 'economy', 0.00, true),
        (flight_record.id, r || 'F', 'economy', 0.00, true);
    END LOOP;
  END LOOP;
END $$;
