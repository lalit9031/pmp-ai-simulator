create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  avatar_url text,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  certification text not null default 'pmp',
  mode text,
  domain text,
  difficulty text not null default 'Mixed',
  score integer not null default 0,
  percentage integer not null default 0,
  answered_count integer not null default 0,
  correct_count integer not null default 0,
  incorrect_count integer not null default 0,
  total_questions integer not null default 0,
  time_left integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  certification text not null default 'pmp',
  question text not null,
  selected_answer integer,
  correct_answer integer not null,
  is_correct boolean not null default false,
  topic text,
  domain text,
  difficulty text,
  created_at timestamptz not null default now()
);

-- Keep existing installations compatible with certification-specific history.
alter table public.exams
  add column if not exists certification text not null default 'pmp';

alter table public.answers
  add column if not exists certification text not null default 'pmp';

create table if not exists public.weak_area_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  domain text,
  difficulty text,
  mistakes integer not null default 0,
  attempts integer not null default 0,
  correct integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, topic, difficulty)
);

-- Tracks paid signups for the first-100 user counter across all visitors.
-- The service_role key inserts and counts rows via API routes.
create table if not exists public.paid_signups (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  plan text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.exams enable row level security;
alter table public.answers enable row level security;
alter table public.weak_area_stats enable row level security;

create policy "Profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are upsertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updateable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Exams are readable by owner"
  on public.exams for select
  using (auth.uid() = user_id);

create policy "Exams are insertable by owner"
  on public.exams for insert
  with check (auth.uid() = user_id);

create policy "Answers are readable by owner"
  on public.answers for select
  using (auth.uid() = user_id);

create policy "Answers are insertable by owner"
  on public.answers for insert
  with check (auth.uid() = user_id);

create policy "Weak areas are readable by owner"
  on public.weak_area_stats for select
  using (auth.uid() = user_id);

create policy "Weak areas are insertable by owner"
  on public.weak_area_stats for insert
  with check (auth.uid() = user_id);

create policy "Weak areas are updateable by owner"
  on public.weak_area_stats for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
