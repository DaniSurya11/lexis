-- Add 'active' and 'cancelled' to the bookings status constraint
-- The original only allows: 'pending', 'accepted', 'rejected', 'completed'
-- We need 'active' for when a live session is in progress

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'accepted', 'rejected', 'active', 'completed', 'cancelled'));
