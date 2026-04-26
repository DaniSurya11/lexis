-- Create notifications table
create table notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  link_url text
);

-- Enable RLS
alter table notifications enable row level security;

-- Policies: Users can view their own notifications
create policy "Users can view their own notifications" on notifications for select using (auth.uid() = user_id);

-- Policies: Users can update (mark as read) their own notifications
create policy "Users can update their own notifications" on notifications for update using (auth.uid() = user_id);

-- Policies: Anyone can insert (to allow the app to send notifications to others)
-- Wait, it's better if only authenticated users can insert notifications
create policy "Authenticated users can create notifications" on notifications for insert with check (auth.role() = 'authenticated');
