-- =====================================================
-- Migration: Reschedule Booking RPC
-- Atomically reschedules a booking to a new flight:
--   1. Validates same route
--   2. Frees old seat
--   3. Locks new seat
--   4. Updates booking
--   5. Inserts reschedule record
--   6. Calculates fee
-- =====================================================

CREATE OR REPLACE FUNCTION reschedule_booking(
  p_booking_id    UUID,
  p_user_id       UUID,
  p_new_flight_id UUID,
  p_new_seat_id   UUID
)
RETURNS JSON AS $$
DECLARE
  v_old_flight_id   UUID;
  v_old_seat_id     UUID;
  v_booking_status  booking_status;
  v_old_origin      TEXT;
  v_old_destination TEXT;
  v_new_origin      TEXT;
  v_new_destination TEXT;
  v_old_base_price  NUMERIC;
  v_new_base_price  NUMERIC;
  v_new_extra_fee   NUMERIC;
  v_fee_charged     NUMERIC;
  v_new_total_price NUMERIC;
  v_new_departs_at  TIMESTAMPTZ;
  v_new_seat_avail  BOOLEAN;
  v_new_seat_flight UUID;
  v_reschedule_id   UUID;
BEGIN
  -- ① Lock and validate booking
  PERFORM pg_advisory_xact_lock(hashtext(p_booking_id::TEXT));

  SELECT flight_id, seat_id, status
  INTO v_old_flight_id, v_old_seat_id, v_booking_status
  FROM bookings
  WHERE id = p_booking_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'BOOKING_NOT_FOUND: Booking not found or unauthorized'
      USING ERRCODE = 'P0020';
  END IF;

  IF v_booking_status != 'confirmed' THEN
    RAISE EXCEPTION 'INVALID_STATUS: Only confirmed bookings can be rescheduled (current: %)', v_booking_status
      USING ERRCODE = 'P0021';
  END IF;

  -- ② Validate same route
  SELECT origin, destination, base_price
  INTO v_old_origin, v_old_destination, v_old_base_price
  FROM flights WHERE id = v_old_flight_id;

  SELECT origin, destination, base_price, departs_at
  INTO v_new_origin, v_new_destination, v_new_base_price, v_new_departs_at
  FROM flights WHERE id = p_new_flight_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'FLIGHT_NOT_FOUND: New flight does not exist'
      USING ERRCODE = 'P0022';
  END IF;

  IF v_old_origin != v_new_origin OR v_old_destination != v_new_destination THEN
    RAISE EXCEPTION 'ROUTE_MISMATCH: New flight must be on the same route (% → %)', v_old_origin, v_old_destination
      USING ERRCODE = 'P0023';
  END IF;

  IF v_new_departs_at <= now() THEN
    RAISE EXCEPTION 'FLIGHT_DEPARTED: New flight has already departed'
      USING ERRCODE = 'P0024';
  END IF;

  IF v_old_flight_id = p_new_flight_id THEN
    RAISE EXCEPTION 'SAME_FLIGHT: Cannot reschedule to the same flight'
      USING ERRCODE = 'P0025';
  END IF;

  -- ③ Lock and validate new seat
  PERFORM pg_advisory_xact_lock(hashtext(p_new_seat_id::TEXT));

  SELECT is_available, flight_id, extra_fee
  INTO v_new_seat_avail, v_new_seat_flight, v_new_extra_fee
  FROM seats WHERE id = p_new_seat_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SEAT_NOT_FOUND: New seat does not exist'
      USING ERRCODE = 'P0026';
  END IF;

  IF v_new_seat_flight != p_new_flight_id THEN
    RAISE EXCEPTION 'SEAT_FLIGHT_MISMATCH: Seat does not belong to the new flight'
      USING ERRCODE = 'P0027';
  END IF;

  IF NOT v_new_seat_avail THEN
    RAISE EXCEPTION 'SEAT_TAKEN: New seat is already booked'
      USING ERRCODE = 'P0028';
  END IF;

  -- ④ Calculate fee (charge difference if new flight is more expensive)
  v_fee_charged := GREATEST(0, v_new_base_price - v_old_base_price);
  v_new_total_price := v_new_base_price + v_new_extra_fee;

  -- ⑤ Free old seat
  UPDATE seats SET is_available = true WHERE id = v_old_seat_id;

  -- ⑥ Book new seat
  UPDATE seats SET is_available = false WHERE id = p_new_seat_id;

  -- ⑦ Update booking
  UPDATE bookings
  SET flight_id = p_new_flight_id,
      seat_id = p_new_seat_id,
      total_price = v_new_total_price,
      status = 'rescheduled'
  WHERE id = p_booking_id;

  -- ⑧ Insert reschedule record
  INSERT INTO reschedules (booking_id, old_flight_id, new_flight_id, fee_charged)
  VALUES (p_booking_id, v_old_flight_id, p_new_flight_id, v_fee_charged)
  RETURNING id INTO v_reschedule_id;

  -- Return summary
  RETURN json_build_object(
    'reschedule_id', v_reschedule_id,
    'fee_charged', v_fee_charged,
    'new_total_price', v_new_total_price,
    'booking_id', p_booking_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION reschedule_booking IS
  'Atomically reschedules a booking: validates same route, frees old seat, '
  'locks new seat, updates booking, inserts reschedule record, calculates fee.';
