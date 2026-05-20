-- =====================================================
-- Flight Management App — Seed Data
-- 8 flights across 4 routes with full seat maps
-- =====================================================

-- Clean existing seed data (idempotent)
TRUNCATE reschedules, passengers, bookings, seats, flights CASCADE;


-- ─── INSERT 8 FLIGHTS (4 routes × 2 flights each) ─────

INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
VALUES
  -- Route 1: Delhi → Mumbai
  ('a1000000-0000-0000-0000-000000000001', 'SA-101', 'DEL', 'BOM',
   now() + INTERVAL '3 days' + INTERVAL '6 hours',
   now() + INTERVAL '3 days' + INTERVAL '8 hours 15 minutes',
   'Boeing 737-800', 'scheduled', 4500.00),

  ('a1000000-0000-0000-0000-000000000002', 'SA-102', 'DEL', 'BOM',
   now() + INTERVAL '5 days' + INTERVAL '14 hours',
   now() + INTERVAL '5 days' + INTERVAL '16 hours 20 minutes',
   'Airbus A320', 'scheduled', 5200.00),

  -- Route 2: Bangalore → Hyderabad
  ('a2000000-0000-0000-0000-000000000001', 'SA-201', 'BLR', 'HYD',
   now() + INTERVAL '4 days' + INTERVAL '8 hours',
   now() + INTERVAL '4 days' + INTERVAL '9 hours 15 minutes',
   'Boeing 737-800', 'scheduled', 3200.00),

  ('a2000000-0000-0000-0000-000000000002', 'SA-202', 'BLR', 'HYD',
   now() + INTERVAL '7 days' + INTERVAL '18 hours',
   now() + INTERVAL '7 days' + INTERVAL '19 hours 10 minutes',
   'Airbus A320neo', 'scheduled', 3800.00),

  -- Route 3: Kolkata → Chennai
  ('a3000000-0000-0000-0000-000000000001', 'SA-301', 'CCU', 'MAA',
   now() + INTERVAL '5 days' + INTERVAL '10 hours',
   now() + INTERVAL '5 days' + INTERVAL '12 hours 30 minutes',
   'Boeing 737 MAX', 'scheduled', 5800.00),

  ('a3000000-0000-0000-0000-000000000002', 'SA-302', 'CCU', 'MAA',
   now() + INTERVAL '10 days' + INTERVAL '7 hours',
   now() + INTERVAL '10 days' + INTERVAL '9 hours 25 minutes',
   'Airbus A321', 'scheduled', 6100.00),

  -- Route 4: Delhi → Bangalore
  ('a4000000-0000-0000-0000-000000000001', 'SA-401', 'DEL', 'BLR',
   now() + INTERVAL '6 days' + INTERVAL '5 hours 30 minutes',
   now() + INTERVAL '6 days' + INTERVAL '8 hours 15 minutes',
   'Boeing 787 Dreamliner', 'scheduled', 7200.00),

  ('a4000000-0000-0000-0000-000000000002', 'SA-402', 'DEL', 'BLR',
   now() + INTERVAL '12 days' + INTERVAL '20 hours',
   now() + INTERVAL '12 days' + INTERVAL '22 hours 45 minutes',
   'Airbus A320', 'scheduled', 6800.00);


-- ─── GENERATE SEAT MAPS ────────────────────────────────
-- Layout per aircraft:
--   First Class : Rows 1-2,  seats A-D (2+2)  →  8 seats  → +3000 fee
--   Business    : Rows 3-7,  seats A-F (3+3)  → 30 seats  → +1500 fee
--   Economy     : Rows 8-30, seats A-F (3+3)  → 138 seats → +0 fee
-- Total: 176 seats per flight × 8 flights = 1,408 seats

INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee)
SELECT
  f.id AS flight_id,
  r.row_num || col.letter AS seat_number,
  CASE
    WHEN r.row_num <= 2  THEN 'first'::seat_class
    WHEN r.row_num <= 7  THEN 'business'::seat_class
    ELSE 'economy'::seat_class
  END AS class,
  true AS is_available,
  CASE
    WHEN r.row_num <= 2  THEN 3000.00
    WHEN r.row_num <= 7  THEN 1500.00
    ELSE 0.00
  END AS extra_fee
FROM
  flights f
  CROSS JOIN generate_series(1, 30) AS r(row_num)
  CROSS JOIN (
    VALUES ('A'), ('B'), ('C'), ('D'), ('E'), ('F')
  ) AS col(letter)
WHERE
  -- First class (rows 1-2): only seats A-D
  (r.row_num <= 2 AND col.letter IN ('A', 'B', 'C', 'D'))
  OR
  -- Business + Economy (rows 3-30): all seats A-F
  (r.row_num >= 3);
