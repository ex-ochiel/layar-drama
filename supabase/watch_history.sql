-- WATCH HISTORY Table
create table public.watch_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  drama_id uuid references public.dramas(id) on delete cascade not null,
  drama_title text not null,
  drama_thumbnail text,
  last_episode integer not null default 1,
  total_episodes integer,
  last_watched timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, drama_id)
);

-- Enable RLS
alter table public.watch_history enable row level security;

create policy "Users can view their own watch history."
  on public.watch_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert into their own watch history."
  on public.watch_history for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own watch history."
  on public.watch_history for update
  using ( auth.uid() = user_id );

create policy "Users can delete from their own watch history."
  on public.watch_history for delete
  using ( auth.uid() = user_id );
