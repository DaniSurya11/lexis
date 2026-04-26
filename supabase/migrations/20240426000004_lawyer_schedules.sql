-- Create lawyer_schedules table
create table lawyer_schedules (
  id uuid default gen_random_uuid() primary key,
  lawyer_id uuid references lawyers(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Sunday, 1=Monday...
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table lawyer_schedules enable row level security;

-- Policies
-- Anyone can view lawyer schedules (for the checkout page)
create policy "Schedules are viewable by everyone" on lawyer_schedules for select using (true);

-- Lawyers can insert, update, delete their own schedules
create policy "Lawyers can insert their own schedules" on lawyer_schedules for insert with check (
  lawyer_id in (
    select id from lawyers where id = lawyer_id
  )
);
-- Wait, auth.uid() matches profiles.id. lawyer_id is lawyers.id, which happens to be the same as profiles.id in this schema.
-- Let's confirm: in 20240425000000_initial_schema.sql, `lawyers.id` references `profiles.id`. 
-- So `lawyer_id` = `auth.uid()`.
drop policy if exists "Lawyers can insert their own schedules" on lawyer_schedules;
create policy "Lawyers can insert their own schedules" on lawyer_schedules for insert with check (lawyer_id = auth.uid());
create policy "Lawyers can update their own schedules" on lawyer_schedules for update using (lawyer_id = auth.uid());
create policy "Lawyers can delete their own schedules" on lawyer_schedules for delete using (lawyer_id = auth.uid());

-- Unique constraint so a lawyer can't have duplicate days, or at least they can, but simpler if unique per day
alter table lawyer_schedules add constraint unique_lawyer_day unique (lawyer_id, day_of_week);

-- Enable realtime for lawyer_schedules
ALTER PUBLICATION supabase_realtime ADD TABLE lawyer_schedules;
