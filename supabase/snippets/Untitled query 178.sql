create table lawyer_schedules (
  id uuid default gen_random_uuid() primary key,
  lawyer_id uuid references lawyers(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);
alter table lawyer_schedules enable row level security;
create policy "Schedules are viewable by everyone" on lawyer_schedules for select using (true);
create policy "Lawyers can insert their own schedules" on lawyer_schedules for insert with check (lawyer_id = auth.uid());
create policy "Lawyers can update their own schedules" on lawyer_schedules for update using (lawyer_id = auth.uid());
create policy "Lawyers can delete their own schedules" on lawyer_schedules for delete using (lawyer_id = auth.uid());
alter table lawyer_schedules add constraint unique_lawyer_day unique (lawyer_id, day_of_week);
ALTER PUBLICATION supabase_realtime ADD TABLE lawyer_schedules;