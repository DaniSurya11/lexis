-- Create reviews table
create table reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  booking_id uuid references bookings(id) on delete cascade not null,
  client_id uuid references profiles(id) on delete cascade not null,
  lawyer_id uuid references lawyers(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text
);

-- Enable RLS
alter table reviews enable row level security;

-- Policies
create policy "Reviews are viewable by everyone" on reviews for select using (true);
create policy "Clients can insert their own reviews" on reviews for insert with check (auth.uid() = client_id);
-- Lawyer rating updates trigger can be skipped if we just calculate it on the fly, 
-- but a trigger is more performant. Let's do a simple trigger:
create or replace function update_lawyer_rating()
returns trigger as $$
begin
  update lawyers
  set rating = (
    select round(avg(rating)::numeric, 1)
    from reviews
    where lawyer_id = new.lawyer_id
  )
  where id = new.lawyer_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger update_lawyer_rating_trigger
after insert or update or delete on reviews
for each row execute function update_lawyer_rating();
