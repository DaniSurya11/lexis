-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  city text,
  role text check (role in ('client', 'lawyer')) default 'client'
);

-- Create a table for lawyers
create table lawyers (
  id uuid references profiles(id) on delete cascade not null primary key,
  specialization text,
  price_per_hour numeric,
  rating numeric default 0,
  bio text,
  is_available boolean default true
);

-- Create a table for bookings
create table bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  client_id uuid references profiles(id) not null,
  lawyer_id uuid references lawyers(id) not null,
  topic text,
  status text check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
  scheduled_at timestamp with time zone
);

-- Create a table for chat messages
create table messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  booking_id uuid references bookings(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content text not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table lawyers enable row level security;
alter table bookings enable row level security;
alter table messages enable row level security;

-- Profiles: Users can view all profiles, but only update their own
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Lawyers: Everyone can view lawyers
create policy "Lawyers are viewable by everyone" on lawyers for select using (true);

-- Bookings: Users can view their own bookings
create policy "Users can view their own bookings" on bookings for select using (auth.uid() = client_id or auth.uid() = lawyer_id);
create policy "Clients can create bookings" on bookings for insert with check (auth.uid() = client_id);

-- Messages: Users can view messages for their bookings
create policy "Users can view messages for their bookings" on messages for select using (
  exists (
    select 1 from bookings
    where bookings.id = messages.booking_id
    and (bookings.client_id = auth.uid() or bookings.lawyer_id = auth.uid())
  )
);
create policy "Users can send messages to their bookings" on messages for insert with check (
  exists (
    select 1 from bookings
    where bookings.id = messages.booking_id
    and (bookings.client_id = auth.uid() or bookings.lawyer_id = auth.uid())
  )
);
