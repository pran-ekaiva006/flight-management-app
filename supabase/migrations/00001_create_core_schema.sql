-- =====================================================
-- Flight Management App — Core Relational Schema
-- Migration: 00001_create_core_schema
-- =====================================================

-- ─── ENUMS ──────────────────────────────────────────────

CREATE TYPE flight_status AS ENUM (
  'scheduled',
  'boarding',
  'departed',
  'arrived',
  'cancelled',
  'delayed'
);

CREATE TYPE seat_class AS ENUM (
  'economy',
  'business',
  'first'
);

CREATE TYPE booking_status AS ENUM (
  'confirmed',
  'rescheduled',
  'cancelled'
);


-- ─── FLIGHTS ────────────────────────────────────────────

CREATE TABLE flights (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_no   TEXT NOT NULL,
  origin      TEXT NOT NULL,
  destination TEXT NOT NULL,
  departs_at  TIMESTAMPTZ NOT NULL,
  arrives_at  TIMESTAMPTZ NOT NULL,
  aircraft_type TEXT NOT NULL DEFAULT 'Boeing 737',
  status      flight_status NOT NULL DEFAULT 'scheduled',
  base_price  NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_flight_times CHECK (arrives_at > departs_at)
);

-- Indexes for search: origin + destination + date
CREATE INDEX idx_flights_route ON flights (origin, destination);
CREATE INDEX idx_flights_departs_at ON flights (departs_at);
CREATE INDEX idx_flights_status ON flights (status);
CREATE INDEX idx_flights_flight_no ON flights (flight_no);


-- ─── SEATS ──────────────────────────────────────────────

CREATE TABLE seats (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id    UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
  seat_number  TEXT NOT NULL,
  class        seat_class NOT NULL DEFAULT 'economy',
  is_available BOOLEAN NOT NULL DEFAULT true,
  extra_fee    NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (extra_fee >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_seat_per_flight UNIQUE (flight_id, seat_number)
);

CREATE INDEX idx_seats_flight_id ON seats (flight_id);
CREATE INDEX idx_seats_available ON seats (flight_id, is_available) WHERE is_available = true;
CREATE INDEX idx_seats_class ON seats (flight_id, class);


-- ─── BOOKINGS ───────────────────────────────────────────

CREATE TABLE bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flight_id   UUID NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
  seat_id     UUID NOT NULL REFERENCES seats(id) ON DELETE RESTRICT,
  status      booking_status NOT NULL DEFAULT 'confirmed',
  booked_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  pnr_code    TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_flight_id ON bookings (flight_id);
CREATE INDEX idx_bookings_pnr ON bookings (pnr_code);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_seat_id ON bookings (seat_id);


-- ─── PASSENGERS ─────────────────────────────────────────

CREATE TABLE passengers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  passport_no TEXT NOT NULL,
  nationality TEXT NOT NULL,
  dob         DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_passengers_booking_id ON passengers (booking_id);


-- ─── RESCHEDULES ────────────────────────────────────────

CREATE TABLE reschedules (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id     UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  old_flight_id  UUID NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
  new_flight_id  UUID NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
  requested_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  fee_charged    NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (fee_charged >= 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reschedules_booking_id ON reschedules (booking_id);


-- ─── UPDATED_AT TRIGGER ────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_flights_updated_at
  BEFORE UPDATE ON flights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_seats_updated_at
  BEFORE UPDATE ON seats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_passengers_updated_at
  BEFORE UPDATE ON passengers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── CANCELLATION GUARD (2-HOUR RULE) ──────────────────
-- DB-level constraint: block cancellations within 2 hours of departure

CREATE OR REPLACE FUNCTION check_cancellation_window()
RETURNS TRIGGER AS $$
DECLARE
  v_departs_at TIMESTAMPTZ;
BEGIN
  -- Only fire when status is being changed to 'cancelled'
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    SELECT departs_at INTO v_departs_at
    FROM flights
    WHERE id = NEW.flight_id;

    IF v_departs_at - now() < INTERVAL '2 hours' THEN
      RAISE EXCEPTION 'Cannot cancel booking within 2 hours of departure (departs at %)', v_departs_at;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_block_late_cancellation
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled')
  EXECUTE FUNCTION check_cancellation_window();


-- ─── RPC: SEAT RESERVATION (RACE-CONDITION SAFE) ───────
-- Atomic seat lock + booking creation to prevent double-booking

CREATE OR REPLACE FUNCTION reserve_seat(
  p_user_id     UUID,
  p_flight_id   UUID,
  p_seat_id     UUID,
  p_total_price NUMERIC,
  p_pnr_code    TEXT,
  p_full_name   TEXT,
  p_passport_no TEXT,
  p_nationality TEXT,
  p_dob         DATE
)
RETURNS UUID AS $$
DECLARE
  v_booking_id UUID;
  v_is_available BOOLEAN;
BEGIN
  -- Lock the seat row to prevent concurrent reservation
  SELECT is_available INTO v_is_available
  FROM seats
  WHERE id = p_seat_id AND flight_id = p_flight_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seat not found for this flight';
  END IF;

  IF NOT v_is_available THEN
    RAISE EXCEPTION 'Seat is already booked';
  END IF;

  -- Mark seat as unavailable
  UPDATE seats
  SET is_available = false
  WHERE id = p_seat_id;

  -- Create the booking
  INSERT INTO bookings (user_id, flight_id, seat_id, total_price, pnr_code)
  VALUES (p_user_id, p_flight_id, p_seat_id, p_total_price, p_pnr_code)
  RETURNING id INTO v_booking_id;

  -- Create the passenger record
  INSERT INTO passengers (booking_id, full_name, passport_no, nationality, dob)
  VALUES (v_booking_id, p_full_name, p_passport_no, p_nationality, p_dob);

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─── RPC: CANCEL BOOKING (ATOMIC) ──────────────────────
-- Cancels booking + frees seat in one transaction

CREATE OR REPLACE FUNCTION cancel_booking(
  p_booking_id UUID,
  p_user_id    UUID
)
RETURNS VOID AS $$
DECLARE
  v_seat_id    UUID;
  v_flight_id  UUID;
  v_departs_at TIMESTAMPTZ;
  v_status     booking_status;
BEGIN
  -- Lock the booking row
  SELECT seat_id, flight_id, status
  INTO v_seat_id, v_flight_id, v_status
  FROM bookings
  WHERE id = p_booking_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or does not belong to this user';
  END IF;

  IF v_status = 'cancelled' THEN
    RAISE EXCEPTION 'Booking is already cancelled';
  END IF;

  -- Check 2-hour rule
  SELECT departs_at INTO v_departs_at
  FROM flights WHERE id = v_flight_id;

  IF v_departs_at - now() < INTERVAL '2 hours' THEN
    RAISE EXCEPTION 'Cannot cancel within 2 hours of departure (departs at %)', v_departs_at;
  END IF;

  -- Cancel the booking (triggers trg_block_late_cancellation as extra guard)
  UPDATE bookings
  SET status = 'cancelled'
  WHERE id = p_booking_id;

  -- Free the seat
  UPDATE seats
  SET is_available = true
  WHERE id = v_seat_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─── ROW LEVEL SECURITY ────────────────────────────────

-- Flights: readable by everyone (public search)
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Flights are viewable by everyone"
  ON flights FOR SELECT
  USING (true);

-- Seats: readable by everyone (seat map display)
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seats are viewable by everyone"
  ON seats FOR SELECT
  USING (true);

-- Bookings: users can only see their own
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Passengers: users can only see passengers for their own bookings
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own passengers"
  ON passengers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = passengers.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert passengers for own bookings"
  ON passengers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = passengers.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Reschedules: users can only see their own
ALTER TABLE reschedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reschedules"
  ON reschedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = reschedules.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own reschedules"
  ON reschedules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = reschedules.booking_id
      AND bookings.user_id = auth.uid()
    )
  );


-- ─── ENABLE REALTIME ON SEATS ──────────────────────────
-- Required for live seat map updates (Task 02)

ALTER PUBLICATION supabase_realtime ADD TABLE seats;
