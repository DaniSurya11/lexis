-- 1. Berikan izin agar pengacara bisa mengubah status booking (Terima/Tolak)
CREATE POLICY "Users can update their own bookings" ON bookings 
FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- 2. Buat tabel sessions jika belum ada (dibutuhkan saat klik Mulai Sesi)
CREATE TABLE IF NOT EXISTS sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('active', 'completed')) DEFAULT 'active',
  started_at timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone
);

-- 3. Nyalakan keamanan untuk tabel sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 4. Berikan izin agar pengacara & klien bisa membaca dan membuat sesi
CREATE POLICY "Users can view their sessions" ON sessions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = sessions.booking_id
    AND (bookings.client_id = auth.uid() OR bookings.lawyer_id = auth.uid())
  )
);

CREATE POLICY "Lawyers can insert sessions" ON sessions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = sessions.booking_id
    AND bookings.lawyer_id = auth.uid()
  )
);

CREATE POLICY "Lawyers can update sessions" ON sessions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = sessions.booking_id
    AND bookings.lawyer_id = auth.uid()
  )
);
