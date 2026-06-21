-- ─── Migration: External Flight Source Tracking ────────
-- Adds columns to track where flight data originated and
-- a reusable seat-map generation function.

-- 1. Add source tracking columns
ALTER TABLE flights ADD COLUMN source TEXT NOT NULL DEFAULT 'manual'
  CHECK (source IN ('manual', 'amadeus'));

ALTER TABLE flights ADD COLUMN external_ref TEXT;

-- 2. Unique constraint to prevent duplicate flights for the same
--    flight number + departure time (makes re-searching idempotent)
CREATE UNIQUE INDEX uq_flights_no_departs
  ON flights (flight_no, departs_at);

-- 3. Reusable seat-map generation function
--    Same layout as seed.sql: Row 1 first class, Rows 2-3 business, Rows 4-10 economy.
--    Called by both seed.sql and the Amadeus sync pathway.
CREATE OR REPLACE FUNCTION generate_seat_map(p_flight_id UUID)
RETURNS VOID AS $$
DECLARE
  r INT;
BEGIN
  -- First Class: Row 1, 4 seats (A-D), extra_fee ₹15,000
  INSERT INTO public.seats (flight_id, seat_number, class, extra_fee, is_available) VALUES
    (p_flight_id, '1A', 'first', 15000.00, true),
    (p_flight_id, '1B', 'first', 15000.00, true),
    (p_flight_id, '1C', 'first', 15000.00, true),
    (p_flight_id, '1D', 'first', 15000.00, true);

  -- Business Class: Rows 2-3, 4 seats per row (A-D), extra_fee ₹8,000
  INSERT INTO public.seats (flight_id, seat_number, class, extra_fee, is_available) VALUES
    (p_flight_id, '2A', 'business', 8000.00, true),
    (p_flight_id, '2B', 'business', 8000.00, true),
    (p_flight_id, '2C', 'business', 8000.00, true),
    (p_flight_id, '2D', 'business', 8000.00, true),
    (p_flight_id, '3A', 'business', 8000.00, true),
    (p_flight_id, '3B', 'business', 8000.00, true),
    (p_flight_id, '3C', 'business', 8000.00, true),
    (p_flight_id, '3D', 'business', 8000.00, true);

  -- Economy Class: Rows 4-10, 6 seats per row (A-F), extra_fee ₹0
  FOR r IN 4..10 LOOP
    INSERT INTO public.seats (flight_id, seat_number, class, extra_fee, is_available) VALUES
      (p_flight_id, r || 'A', 'economy', 0.00, true),
      (p_flight_id, r || 'B', 'economy', 0.00, true),
      (p_flight_id, r || 'C', 'economy', 0.00, true),
      (p_flight_id, r || 'D', 'economy', 0.00, true),
      (p_flight_id, r || 'E', 'economy', 0.00, true),
      (p_flight_id, r || 'F', 'economy', 0.00, true);
  END LOOP;
END;
$$ LANGUAGE plpgsql;
