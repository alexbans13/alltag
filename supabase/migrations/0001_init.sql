-- Journal + language learning app: core schema for v1.
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  text text not null,
  target_language text not null default 'de',
  level text not null,
  created_at timestamptz not null default now()
);

create index if not exists entries_user_id_created_at_idx
  on public.entries (user_id, created_at desc);

alter table public.entries enable row level security;

create policy "Users can view their own entries"
  on public.entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on public.entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on public.entries for delete
  using (auth.uid() = user_id);

-- Self-reported CEFR level per target language (e.g. "B1 German").
create table if not exists public.user_language_levels (
  user_id uuid not null references auth.users (id) on delete cascade,
  language text not null,
  level text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, language)
);

alter table public.user_language_levels enable row level security;

create policy "Users can view their own language levels"
  on public.user_language_levels for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own language levels"
  on public.user_language_levels for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own language levels"
  on public.user_language_levels for update
  using (auth.uid() = user_id);
