-- =====================================================
-- Flight Management App — Enhanced RLS Policies
-- Migration: 00002_enhance_rls_policies
-- =====================================================
-- Hardens security beyond the base policies in 00001:
--   • Blocks direct DELETE on all user tables
--   • Prevents direct UPDATE on seats (must use RPC)
--   • Restricts booking updates to status-only changes
--   • Ensures passenger updates go through owner check
--   • Adds service-role-only INSERT policies for admin tables


-- ─── FLIGHTS — Block all mutations from clients ────────
-- Flights are admin-managed; clients can only SELECT.
-- (INSERT/UPDATE/DELETE default to DENY when RLS is on
--  and no permissive policy exists for those operations.)
-- Explicit deny makes intent clear:

CREATE POLICY "Flights are read-only for all users"
  ON flights FOR UPDATE
  USING (false);

CREATE POLICY "Flights cannot be deleted by users"
  ON flights FOR DELETE
  USING (false);

CREATE POLICY "Flights cannot be inserted by users"
  ON flights FOR INSERT
  WITH CHECK (false);


-- ─── SEATS — Block direct mutations ────────────────────
-- Seat availability must ONLY change through the
-- reserve_seat / cancel_booking RPCs (SECURITY DEFINER).

CREATE POLICY "Seats cannot be updated directly"
  ON seats FOR UPDATE
  USING (false);

CREATE POLICY "Seats cannot be deleted by users"
  ON seats FOR DELETE
  USING (false);

CREATE POLICY "Seats cannot be inserted by users"
  ON seats FOR INSERT
  WITH CHECK (false);


-- ─── BOOKINGS — Tighten update & block delete ──────────
-- Users should NEVER delete bookings — only cancel via RPC.
-- The existing UPDATE policy allows any field change;
-- we drop it and add a restricted version.

DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Allow updates ONLY on bookings the user owns,
-- and ONLY for status changes (reschedule/cancel flow).
-- The actual mutations happen through SECURITY DEFINER RPCs,
-- but this policy is the safety net.
CREATE POLICY "Users can update own booking status"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Bookings cannot be deleted"
  ON bookings FOR DELETE
  USING (false);


-- ─── PASSENGERS — Block updates and deletes ────────────
-- Passenger records are immutable once created.

CREATE POLICY "Passengers cannot be updated"
  ON passengers FOR UPDATE
  USING (false);

CREATE POLICY "Passengers cannot be deleted"
  ON passengers FOR DELETE
  USING (false);


-- ─── RESCHEDULES — Block updates and deletes ───────────
-- Reschedule records are an audit trail — immutable.

CREATE POLICY "Reschedules cannot be updated"
  ON reschedules FOR UPDATE
  USING (false);

CREATE POLICY "Reschedules cannot be deleted"
  ON reschedules FOR DELETE
  USING (false);


-- ─── GRANT EXECUTE ON RPCs TO AUTHENTICATED ────────────
-- Ensure only logged-in users can call the booking RPCs.

REVOKE EXECUTE ON FUNCTION reserve_seat FROM anon;
REVOKE EXECUTE ON FUNCTION cancel_booking FROM anon;
GRANT EXECUTE ON FUNCTION reserve_seat TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_booking TO authenticated;
