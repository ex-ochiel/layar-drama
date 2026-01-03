-- Create a table for public profiles (optional, but good practice usually linked to auth.users)
create table public.profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- DRAMAS Table
create table public.dramas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null unique, -- endpoint in mock data
  thumbnail text,
  rating numeric,
  year integer,
  status text, -- 'ongoing', 'completed'
  country text,
  description text,
  genres text[] -- Array of strings for genres
);

-- Enable RLS
alter table public.dramas enable row level security;

-- Policies for Dramas
create policy "Dramas are viewable by everyone."
  on public.dramas for select
  using ( true );

-- ACTORS Table
create table public.actors (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text not null unique,
  photo text,
  birth_date text, -- Keeping as text for flexibility based on mock data, or could be date
  birth_place text,
  biography text
);

-- Enable RLS
alter table public.actors enable row level security;

-- Policies for Actors
create policy "Actors are viewable by everyone."
  on public.actors for select
  using ( true );

-- JOIN TABLE: Drama <-> Actors
create table public.drama_actors (
  drama_id uuid references public.dramas(id) on delete cascade NOT NULL,
  actor_id uuid references public.actors(id) on delete cascade NOT NULL,
  primary key (drama_id, actor_id)
);

-- Enable RLS
alter table public.drama_actors enable row level security;

create policy "Drama Actors links are viewable by everyone."
  on public.drama_actors for select
  using ( true );


-- WATCHLIST (User-specific)
create table public.watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  drama_id uuid references public.dramas(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, drama_id)
);

-- Enable RLS
alter table public.watchlist enable row level security;

create policy "Users can view their own watchlist."
  on public.watchlist for select
  using ( auth.uid() = user_id );

create policy "Users can insert into their own watchlist."
  on public.watchlist for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete from their own watchlist."
  on public.watchlist for delete
  using ( auth.uid() = user_id );


-- REVIEWS (User-specific)
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  drama_id uuid references public.dramas(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 10),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone."
  on public.reviews for select
  using ( true );

create policy "Users can insert their own reviews."
  on public.reviews for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own reviews."
  on public.reviews for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own reviews."
  on public.reviews for delete
  using ( auth.uid() = user_id );
