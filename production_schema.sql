-- Combined Production Schema for Lexis Premium
-- Copy and paste this into Supabase Cloud SQL Editor

-- 1. Tables
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  city text,
  phone text,
  role text CHECK (role IN ('client', 'lawyer')) DEFAULT 'client'
);

CREATE TABLE public.lawyers (
  id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  specialization text,
  price_per_hour numeric,
  rating numeric DEFAULT 0,
  bio text,
  is_available boolean DEFAULT true
);

CREATE TABLE public.bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  client_id uuid REFERENCES public.profiles(id) NOT NULL,
  lawyer_id uuid REFERENCES public.lawyers(id) NOT NULL,
  topic text,
  status text CHECK (status IN ('pending', 'accepted', 'rejected', 'active', 'completed', 'cancelled')) DEFAULT 'pending',
  scheduled_at timestamp with time zone
);

CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  content text NOT NULL
);

CREATE TABLE public.sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('active', 'finished')) DEFAULT 'active',
  started_at timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone
);

CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  link_url text
);

CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lawyer_id uuid REFERENCES public.lawyers(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text
);

CREATE TABLE public.lawyer_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lawyer_id uuid REFERENCES public.lawyers(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_lawyer_day UNIQUE (lawyer_id, day_of_week)
);

-- 2. Functions & Triggers
CREATE OR REPLACE FUNCTION update_lawyer_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE public.lawyers
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.reviews
    WHERE lawyer_id = NEW.lawyer_id
  )
  WHERE id = NEW.lawyer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_lawyer_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_lawyer_rating();

-- 3. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_schedules ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lawyers are viewable by everyone" ON public.lawyers FOR SELECT USING (true);

CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = client_id OR auth.uid() = lawyer_id);
CREATE POLICY "Clients can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can view messages for their bookings" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = messages.booking_id AND (bookings.client_id = auth.uid() OR bookings.lawyer_id = auth.uid()))
);
CREATE POLICY "Users can send messages to their bookings" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = messages.booking_id AND (bookings.client_id = auth.uid() OR bookings.lawyer_id = auth.uid()))
);

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Clients can insert their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Schedules are viewable by everyone" ON public.lawyer_schedules FOR SELECT USING (true);
CREATE POLICY "Lawyers can manage their own schedules" ON public.lawyer_schedules FOR ALL USING (lawyer_id = auth.uid());

-- 4. Realtime Configuration
-- Note: You may need to enable these manually in the Supabase Dashboard > Database > Replication
-- but running these SQL commands is a good first step.
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lawyer_schedules;
