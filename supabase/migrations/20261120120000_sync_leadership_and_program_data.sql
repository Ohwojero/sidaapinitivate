-- Apply in Supabase Dashboard > SQL Editor for an existing SIDAAP database.
-- Safe to run more than once.

create table if not exists public.leadership (
  id text primary key,
  name text not null,
  role text not null,
  description text not null,
  image text,
  initials text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.program_activities (
  id text primary key,
  title text not null,
  status text not null default 'past'
    check (status in ('past', 'upcoming', 'ongoing')),
  date text not null,
  category text not null,
  state text not null,
  location text not null,
  description text not null,
  main_image text,
  gallery_images jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  organizer text,
  created_at timestamptz not null default now()
);

create index if not exists program_activities_state_idx
  on public.program_activities (state);
create index if not exists program_activities_status_idx
  on public.program_activities (status);

alter table public.leadership enable row level security;
alter table public.program_activities enable row level security;

grant select, insert, update, delete
  on table public.leadership, public.program_activities
  to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'leadership'
      and policyname = 'Anyone can read leadership'
  ) then
    create policy "Anyone can read leadership"
      on public.leadership for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'leadership'
      and policyname = 'Anyone can insert leadership'
  ) then
    create policy "Anyone can insert leadership"
      on public.leadership for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'leadership'
      and policyname = 'Anyone can update leadership'
  ) then
    create policy "Anyone can update leadership"
      on public.leadership for update using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'leadership'
      and policyname = 'Anyone can delete leadership'
  ) then
    create policy "Anyone can delete leadership"
      on public.leadership for delete using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'program_activities'
      and policyname = 'Anyone can read programs'
  ) then
    create policy "Anyone can read programs"
      on public.program_activities for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'program_activities'
      and policyname = 'Anyone can insert programs'
  ) then
    create policy "Anyone can insert programs"
      on public.program_activities for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'program_activities'
      and policyname = 'Anyone can update programs'
  ) then
    create policy "Anyone can update programs"
      on public.program_activities for update using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'program_activities'
      and policyname = 'Anyone can delete programs'
  ) then
    create policy "Anyone can delete programs"
      on public.program_activities for delete using (true);
  end if;
end
$$;

insert into public.leadership (id, name, role, description, image, initials)
values
  ('leader-friday-chalele', 'Friday Chalele', 'National Executive Director & Trustee', 'Strategic oversight and national community engagement.', '/hero-portrait.jpg', 'FC'),
  ('leader-doris-bode', 'Doris Bode', 'Trustee', 'Counseling coordination and family welfare advocacy.', null, 'DB'),
  ('leader-steve-ahans', 'Steve Ahans', 'Trustee', 'Institutional partnerships and inter-agency liaison.', null, 'SA'),
  ('leader-praise-efe', 'Praise Ohwojero Efe', 'Trustee', 'School educational outreach and youth assemblies.', null, 'PE'),
  ('leader-anthony-donald', 'Anthony Odianosen Donald', 'Trustee', 'Policy research, advocacy and legal compliance.', null, 'AD'),
  ('leader-prosper-ohwojero', 'Prosper Ohwojero', 'Trustee & Sports Director', 'Football academy and youth athletic programmes.', null, 'PO')
on conflict (id) do nothing;

delete from public.program_activities
where id in (
  'prog-exercise-books-fct',
  'prog-football-academy-unveiling',
  'prog-ndlea-joint-march',
  'prog-fct-summit-upcoming',
  'prog-lagos-football-tourney'
);

update public.program_activities
set main_image = null
where main_image like '%photo-1577896851231%';
