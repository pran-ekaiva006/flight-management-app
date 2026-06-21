-- ─── Migration: Rename external flight source from amadeus → airlabs ──
-- Updates the CHECK constraint on flights.source to allow 'airlabs'
-- and migrates any existing amadeus-sourced rows.

-- 1. Drop the old check constraint
ALTER TABLE flights DROP CONSTRAINT IF EXISTS flights_source_check;

-- 2. Add the new check constraint allowing 'airlabs'
ALTER TABLE flights ADD CONSTRAINT flights_source_check
  CHECK (source IN ('manual', 'airlabs'));

-- 3. Migrate any existing amadeus-sourced rows (idempotent)
UPDATE flights SET source = 'airlabs' WHERE source = 'amadeus';
