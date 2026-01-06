-- Supabase schema for HinglishLearn
-- Paste into Supabase SQL Editor and run.

-- 1) Catalog tables (public read)
create table if not exists public.modules (
  slug text primary key,
  title text not null,
  description text not null,
  gradient text,
  icon text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If you already ran this schema before, ensure columns exist
alter table public.modules add column if not exists image_url text;

create table if not exists public.units (
  id bigserial primary key,
  module_slug text not null references public.modules(slug) on delete cascade,
  unit_slug text not null,
  title text not null,
  description text,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(module_slug, unit_slug)
);

alter table public.modules enable row level security;
alter table public.units enable row level security;

do $$ begin
  create policy "public read modules" on public.modules
    for select to anon, authenticated
    using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read units" on public.units
    for select to anon, authenticated
    using (true);
exception when duplicate_object then null; end $$;

-- 1b) Site content (public read) - headings/descriptions/etc
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

do $$ begin
  create policy "public read site_content" on public.site_content
    for select to anon, authenticated
    using (true);
exception when duplicate_object then null; end $$;

-- 2) User tables (auth only)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  xp int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If you already ran this schema before, ensure columns exist
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists auth_provider text;
alter table public.profiles add column if not exists phone_number text;


create table if not exists public.xp_events (
  id bigserial primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  event_key text not null,
  delta int not null,
  module_slug text,
  unit_slug text,
  created_at timestamptz not null default now(),
  unique(user_id, event_key)
);

create table if not exists public.unit_progress (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  module_slug text not null,
  unit_slug text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, module_slug, unit_slug)
);

create table if not exists public.module_progress (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  module_slug text not null,
  quiz_passed_at timestamptz,
  primary key (user_id, module_slug)
);

alter table public.profiles enable row level security;
alter table public.xp_events enable row level security;
alter table public.unit_progress enable row level security;
alter table public.module_progress enable row level security;

do $$ begin
  create policy "profiles read own" on public.profiles
    for select to authenticated
    using (id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "profiles insert own" on public.profiles
    for insert to authenticated
    with check (id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "profiles update own" on public.profiles
    for update to authenticated
    using (id = auth.uid())
    with check (id = auth.uid());
exception when duplicate_object then null; end $$;

-- 2b) Auto-create profile for new auth users (Google/email/password/etc)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, auth_provider, phone_number, xp, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_app_meta_data->>'provider', new.raw_app_meta_data->>'providers'),
    new.raw_user_meta_data->>'phone_number',
    0,
    now(),
    now()
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        avatar_url = excluded.avatar_url,
        auth_provider = excluded.auth_provider,
        phone_number = excluded.phone_number,
        updated_at = now();

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end;
exception when duplicate_object then null;
end;
$$;

do $$ begin
  create policy "xp_events insert own" on public.xp_events
    for insert to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "xp_events read own" on public.xp_events
    for select to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "unit_progress upsert own" on public.unit_progress
    for all to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "module_progress upsert own" on public.module_progress
    for all to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

-- 3) Trigger: keep profiles.xp in sync with xp_events
create or replace function public.apply_xp_event()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, xp, updated_at)
  values (new.user_id, new.delta, now())
  on conflict (id)
  do update set xp = public.profiles.xp + new.delta,
               updated_at = now();
  return new;
end;
$$;

-- Ensure trigger exists only once
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_apply_xp_event'
  ) then
    create trigger trg_apply_xp_event
      after insert on public.xp_events
      for each row execute function public.apply_xp_event();
  end if;
end;
$$;

-- 4) Seed catalog data (safe to re-run)
insert into public.modules (slug, title, description, gradient, icon, image_url, sort_order)
values
  (
    'polynomials',
    'Mathematics Class 10',
    'Class 10 Mathematics ko step by step samjhein. Polynomials, linear equations, aur real numbers jaise topics ko Hinglish mein seekhein.',
    'from-blue-500 to-indigo-600',
    '📘',
    'https://www.svgrepo.com/show/505988/book-closed.svg',
    1
  )
on conflict (slug) do update
set title = excluded.title,
    description = excluded.description,
    gradient = excluded.gradient,
    icon = excluded.icon,
    image_url = excluded.image_url,
    sort_order = excluded.sort_order,
    updated_at = now();

-- Seed site content used by Home (safe to re-run)
insert into public.site_content (key, value, updated_at)
values
  (
    'home',
    jsonb_build_object(
      'brandName', 'HinglishLearn',
      'heroTitle', 'Learn School Subjects in Hinglish',
      'heroSubtitle', 'Ab complex concepts ko samajhna hoga easy. Class 10 Mathematics jaise subjects seekho simple Hinglish language mein — step by step.',
      'primaryCtaText', 'Start Learning',
      'secondaryCtaText', 'Sign Up Free',
      'coursesHeading', 'Available Courses',
      'coursesDescription', 'Choose from our collection of courses designed to help you learn in simple Hinglish',
      'footerText', '© 2026 HinglishLearn. Built for Indian learners 🇮🇳'
    ),
    now()
  )
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

insert into public.units (module_slug, unit_slug, title, description, icon, sort_order)
values
  ('polynomials', 'unit-1', 'What is a Polynomial?', 'Polynomial ek mathematical expression hota hai jisme variables aur constants hote hain', '📘', 1),
  ('polynomials', 'unit-2', 'Degree of a Polynomial', 'Polynomial ki degree kaise find karte hain aur uska importance', '📊', 2),
  ('polynomials', 'unit-3', 'Types of Polynomials', 'Different types of polynomials - linear, quadratic, cubic, aur unke examples', '📈', 3)
on conflict (module_slug, unit_slug) do update
set title = excluded.title,
    description = excluded.description,
    icon = excluded.icon,
    sort_order = excluded.sort_order,
    updated_at = now();
