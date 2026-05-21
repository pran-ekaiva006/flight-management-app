
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
  v_booking_id    UUID;
  v_is_available  BOOLEAN;
  v_flight_status flight_status;
  v_departs_at    TIMESTAMPTZ;
  v_seat_flight   UUID;
  v_existing      UUID;
BEGIN
  -- ① Advisory lock: serialize all reservations for this seat
  --    Prevents race conditions even before row-level locking
  PERFORM pg_advisory_xact_lock(hashtext(p_seat_id::TEXT));

  -- ② Validate flight exists and is bookable
  SELECT status, departs_at
  INTO v_flight_status, v_departs_at
  FROM flights
  WHERE id = p_flight_id
  FOR SHARE;  -- shared lock (reads only)

  IF NOT FOUND THEN
    RAISE EXCEPTION 'FLIGHT_NOT_FOUND: Flight does not exist'
      USING ERRCODE = 'P0001';
  END IF;

  IF v_flight_status NOT IN ('scheduled', 'boarding', 'delayed') THEN
    RAISE EXCEPTION 'FLIGHT_NOT_BOOKABLE: Flight status is "%" — cannot book', v_flight_status
      USING ERRCODE = 'P0002';
  END IF;

  IF v_departs_at <= now() THEN
    RAISE EXCEPTION 'FLIGHT_DEPARTED: Flight has already departed'
      USING ERRCODE = 'P0003';
  END IF;

  -- ③ Check for duplicate booking (same user + same flight with active status)
  SELECT id INTO v_existing
  FROM bookings
  WHERE user_id = p_user_id
    AND flight_id = p_flight_id
    AND status = 'confirmed';

  IF FOUND THEN
    RAISE EXCEPTION 'DUPLICATE_BOOKING: You already have an active booking on this flight (booking %)', v_existing
      USING ERRCODE = 'P0004';
  END IF;

  -- ④ Lock seat row and validate availability + flight ownership
  SELECT is_available, flight_id
  INTO v_is_available, v_seat_flight
  FROM seats
  WHERE id = p_seat_id
  FOR UPDATE;  -- exclusive row lock

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SEAT_NOT_FOUND: Seat does not exist'
      USING ERRCODE = 'P0005';
  END IF;

  IF v_seat_flight != p_flight_id THEN
    RAISE EXCEPTION 'SEAT_FLIGHT_MISMATCH: Seat does not belong to the specified flight'
      USING ERRCODE = 'P0006';
  END IF;

  IF NOT v_is_available THEN
    RAISE EXCEPTION 'SEAT_TAKEN: This seat has already been booked by another passenger'
      USING ERRCODE = 'P0007';
  END IF;

  -- ⑤ Mark seat as unavailable
  UPDATE seats
  SET is_available = false
  WHERE id = p_seat_id;

  -- ⑥ Create the booking record
  INSERT INTO bookings (user_id, flight_id, seat_id, total_price, pnr_code)
  VALUES (p_user_id, p_flight_id, p_seat_id, p_total_price, p_pnr_code)
  RETURNING id INTO v_booking_id;

  -- ⑦ Create the passenger record
  INSERT INTO passengers (booking_id, full_name, passport_no, nationality, dob)
  VALUES (v_booking_id, p_full_name, p_passport_no, p_nationality, p_dob);

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─── ENHANCED CANCEL_BOOKING ───────────────────────────
-- Improvements over v1:
--   1. Advisory lock on booking_id
--   2. Validates rescheduled bookings cannot be cancelled directly
--   3. More descriptive error messages

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
  -- ① Advisory lock on booking
  PERFORM pg_advisory_xact_lock(hashtext(p_booking_id::TEXT));

  -- ② Lock the booking row
  SELECT seat_id, flight_id, status
  INTO v_seat_id, v_flight_id, v_status
  FROM bookings
  WHERE id = p_booking_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'BOOKING_NOT_FOUND: Booking not found or does not belong to this user'
      USING ERRCODE = 'P0010';
  END IF;

  IF v_status = 'cancelled' THEN
    RAISE EXCEPTION 'ALREADY_CANCELLED: This booking has already been cancelled'
      USING ERRCODE = 'P0011';
  END IF;

  IF v_status = 'rescheduled' THEN
    RAISE EXCEPTION 'BOOKING_RESCHEDULED: Cannot cancel a rescheduled booking — cancel the new booking instead'
      USING ERRCODE = 'P0012';
  END IF;

  -- ③ Check 2-hour departure window
  SELECT departs_at INTO v_departs_at
  FROM flights WHERE id = v_flight_id;

  IF v_departs_at - now() < INTERVAL '2 hours' THEN
    RAISE EXCEPTION 'TOO_LATE: Cannot cancel within 2 hours of departure (departs at %)', v_departs_at
      USING ERRCODE = 'P0013';
  END IF;

  -- ④ Cancel the booking
  UPDATE bookings
  SET status = 'cancelled'
  WHERE id = p_booking_id;

  -- ⑤ Free the seat
  UPDATE seats
  SET is_available = true
  WHERE id = v_seat_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─── COMMENT DOCUMENTATION ─────────────────────────────

COMMENT ON FUNCTION reserve_seat IS
  'Atomically reserves a seat: validates flight bookability, prevents double-booking, '
  'locks the seat with advisory + row locks, creates booking + passenger records. '
  'Returns the new booking UUID. Raises coded exceptions on failure.';

COMMENT ON FUNCTION cancel_booking IS
  'Atomically cancels a booking: validates ownership, checks 2-hour window, '
  'updates booking status and frees the seat. Uses advisory + row locks.';
