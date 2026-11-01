-- ═══════════════════════════════════════════════════════════════════════════════
-- SIDAAP NIGERIA — Full Supabase Production Schema (All 7 Tables)
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════════


-- ── 1. USERS ─────────────────────────────────────────────────────────────────
-- Portal login accounts for all roles: national_director, state_director, member
create table if not exists public.users (
  id               text primary key,
  name             text not null,
  email            text not null unique,
  password         text not null default 'sidaap2026',
  role             text not null default 'member'
                     check (role in ('national_director','state_director','member')),
  state            text,
  lga              text,
  city             text,
  title            text,
  phone            text,
  avatar_initials  text not null default 'XX',
  avatar_url       text,
  created_at       timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);
create index if not exists users_role_idx  on public.users (role);


-- ── 2. STATE DIRECTORS ───────────────────────────────────────────────────────
-- Appointed by the National Director. One per state (36 states + FCT).
create table if not exists public.state_directors (
  id                text primary key,
  name              text not null,
  email             text not null unique,
  phone             text,
  state             text not null,
  lga               text,
  city              text,
  appointed_date    text not null default 'Today',
  status            text not null default 'active'
                      check (status in ('active','suspended','vacant')),
  staff_count       integer not null default 0,
  facilities_count  integer not null default 0,
  outreach_count    integer not null default 0,
  avatar_url        text,
  created_at        timestamptz not null default now()
);

create index if not exists state_directors_state_idx on public.state_directors (state);


-- ── 3. STATE STAFF ───────────────────────────────────────────────────────────
-- Local LGA members/staff enrolled by State Directors.
create table if not exists public.state_staff (
  id                  text primary key,
  name                text not null,
  email               text not null unique,
  phone               text,
  state               text not null,
  lga                 text not null,
  city                text,
  role_title          text not null default 'Field Officer'
                        check (role_title in ('Field Officer','School Liaison','Youth Coach','Counselor','Volunteer')),
  joined_date         text not null default 'Today',
  assigned_director   text not null,
  status              text not null default 'active'
                        check (status in ('active','pending')),
  avatar_url          text,
  created_at          timestamptz not null default now()
);

create index if not exists state_staff_state_idx on public.state_staff (state);
create index if not exists state_staff_lga_idx   on public.state_staff (lga);


-- ── 4. STATE ACTIVITIES ──────────────────────────────────────────────────────
-- Field outreach reports submitted by State Directors and Members.
create table if not exists public.state_activities (
  id                  text primary key default gen_random_uuid()::text,
  title               text not null,
  state               text not null,
  lga                 text not null,
  city                text,
  category            text not null default 'School Outreach'
                        check (category in ('School Outreach','Community March','Football Tournament','Rehab Intake')),
  date                text not null default 'Today',
  reported_by         text not null,
  students_reached    integer default 0,
  books_distributed   integer default 0,
  status              text not null default 'Approved by State'
                        check (status in ('Approved by State','Verified Nationally')),
  notes               text,
  created_at          timestamptz not null default now()
);

create index if not exists state_activities_state_idx      on public.state_activities (state);
create index if not exists state_activities_created_at_idx on public.state_activities (created_at desc);


-- ── 5. NATIONAL DIRECTIVES ───────────────────────────────────────────────────
-- Broadcast directives issued by the National Director to all state chapters.
create table if not exists public.national_directives (
  id                  text primary key default gen_random_uuid()::text,
  title               text not null,
  issued_by           text not null,
  priority            text not null default 'standard'
                        check (priority in ('high','urgent','standard')),
  content             text not null,
  target_scope        text not null default 'All 36 States + Abuja FCT',
  upcoming_event_date text,
  created_at          timestamptz not null default now()
);

create index if not exists national_directives_created_at_idx on public.national_directives (created_at desc);


-- ── 6. CHAT ROOMS ────────────────────────────────────────────────────────────
create table if not exists public.chat_rooms (
  id           text primary key,
  name         text not null,
  type         text not null default 'state_group'
                 check (type in ('broadcast','state_group','direct')),
  description  text,
  state        text,
  avatar_text  text not null default 'CH',
  avatar_color text not null default 'bg-emerald-800',
  created_at   timestamptz not null default now()
);


-- ── 7. CHAT MESSAGES ─────────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id           text primary key default gen_random_uuid()::text,
  room_id      text not null references public.chat_rooms(id) on delete cascade,
  sender_id    text not null,
  sender_name  text not null,
  sender_role  text not null default 'SIDAAP Officer',
  sender_state text,
  text         text not null,
  status       text not null default 'sent'
                 check (status in ('sent','delivered','read')),
  created_at   timestamptz not null default now()
);

create index if not exists chat_messages_room_id_idx on public.chat_messages (room_id, created_at);


-- ── ENABLE REALTIME ──────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'chat_rooms'
  ) then
    alter publication supabase_realtime add table public.chat_rooms;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'state_activities'
  ) then
    alter publication supabase_realtime add table public.state_activities;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'national_directives'
  ) then
    alter publication supabase_realtime add table public.national_directives;
  end if;
end $$;


-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────────

alter table public.users               enable row level security;
alter table public.state_directors     enable row level security;
alter table public.state_staff         enable row level security;
alter table public.state_activities    enable row level security;
alter table public.national_directives enable row level security;
alter table public.chat_rooms          enable row level security;
alter table public.chat_messages       enable row level security;

-- users
create policy "Anyone can read users"        on public.users for select using (true);
create policy "Anyone can insert users"      on public.users for insert with check (true);
create policy "Anyone can update users"      on public.users for update using (true);

-- state_directors
create policy "Anyone can read directors"    on public.state_directors for select using (true);
create policy "Anyone can insert directors"  on public.state_directors for insert with check (true);
create policy "Anyone can update directors"  on public.state_directors for update using (true);

-- state_staff
create policy "Anyone can read staff"        on public.state_staff for select using (true);
create policy "Anyone can insert staff"      on public.state_staff for insert with check (true);
create policy "Anyone can update staff"      on public.state_staff for update using (true);

-- state_activities
create policy "Anyone can read activities"   on public.state_activities for select using (true);
create policy "Anyone can insert activities" on public.state_activities for insert with check (true);
create policy "Anyone can update activities" on public.state_activities for update using (true);

-- national_directives
create policy "Anyone can read directives"   on public.national_directives for select using (true);
create policy "Anyone can insert directives" on public.national_directives for insert with check (true);

-- chat_rooms
create policy "Anyone can read rooms"        on public.chat_rooms for select using (true);
create policy "Anyone can insert rooms"      on public.chat_rooms for insert with check (true);

-- chat_messages
create policy "Anyone can read messages"     on public.chat_messages for select using (true);
create policy "Anyone can insert messages"   on public.chat_messages for insert with check (true);
create policy "Anyone can update messages"   on public.chat_messages for update using (true);


-- ── SEED: OFFICIAL CHAT ROOMS ────────────────────────────────────────────────
insert into public.chat_rooms (id, name, type, description, state, avatar_text, avatar_color)
values
  ('room-public-inquiries',    '🌐 Live Public Crisis & Citizen Help Desk',  'broadcast',   'Incoming live messages & WhatsApp inquiries from citizens, parents, and youth on the public website', null,      'SOS', 'bg-[#c9ec63] text-[#13231f]'),
  ('room-directors-executive', '🏛️ National Directors Executive Forum',       'broadcast',   'Private coordination channel for National Trustees, Executive Director, and all 36 State Directors',  null,      'NAT', 'bg-[#13231f]'),
  ('room-national-broadcast',  '📢 National Directives & Announcements',     'broadcast',   'Official policy broadcasts from the National Secretariat to all state chapters',                        null,      'HQ',  'bg-emerald-800'),
  ('room-lagos-chapter',       '📍 Lagos State Operations & Volunteers',      'state_group', 'Lagos State Directorate, LGA representatives, school liaison and volunteer team',                       'Lagos',   'LAG', 'bg-amber-800'),
  ('room-delta-chapter',       '📍 Delta State Operations & Volunteers',      'state_group', 'Delta State Directorate, LGA representatives, school liaison and volunteer team',                       'Delta',   'DLT', 'bg-emerald-900'),
  ('room-rivers-chapter',      '📍 Rivers State Operations & Volunteers',     'state_group', 'Rivers State Directorate, LGA representatives, school liaison and volunteer team',                      'Rivers',  'RIV', 'bg-teal-800'),
  ('room-abuja-chapter',       '📍 FCT Abuja Operations & Volunteers',        'state_group', 'FCT Abuja Directorate, LGA representatives, school liaison and volunteer team',                         'Abuja',   'ABJ', 'bg-slate-700'),
  ('room-football-academy',    '⚽ SIDAAP Football Academy Technical Staff',  'state_group', 'Coaches, trainers, kit coordinators, and talent scouts (CAC RC: 9864105)',                              null,      'SFA', 'bg-[#13231f]')
on conflict (id) do nothing;


-- ── SEED: NATIONAL DIRECTOR USER ACCOUNT ─────────────────────────────────────
insert into public.users (id, name, email, password, role, state, lga, city, title, phone, avatar_initials, avatar_url)
values
  ('user-nat-01',        'Dr. Friday Chalele',       'chalele@sidaap.org',              'sidaap2026', 'national_director', 'Abuja (FCT)', 'Municipal Area Council (AMAC)', 'Wuse II, Abuja',   'National Executive Trustee & Director',    '0806 343 0562', 'FC', '/hero-portrait.jpg'),
  ('user-state-lagos',   'Engr. Babatunde Sanusi',   'lagos.dir@sidaap.org',            'sidaap2026', 'state_director',    'Lagos',       'Ikeja',                        'Ikeja Central',    'Lagos State Director',                     '0802 853 1259', 'BS', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80'),
  ('user-state-delta',   'Prosper Ohwojero',         'prosper@sidaap.org',              'sidaap2026', 'state_director',    'Delta',       'Warri South',                  'Warri Urban',      'Delta State Director & Sports Director',    '0703 092 4398', 'PO', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80'),
  ('user-state-kano',    'Mallam Ibrahim Danbatta',  'kano.dir@sidaap.org',             'sidaap2026', 'state_director',    'Kano',        'Kano Municipal',               'Kano Central',     'Kano State Director',                      '0803 111 2233', 'ID', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'),
  ('user-state-rivers',  'Dr. (Mrs) Ngozi Amadi',    'rivers.dir@sidaap.org',           'sidaap2026', 'state_director',    'Rivers',      'Port Harcourt',                'Port Harcourt',    'Rivers State Director',                    '0804 555 7788', 'NA', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80'),
  ('user-state-oyo',     'Chief Oladimeji Adeleke',  'oyo.dir@sidaap.org',              'sidaap2026', 'state_director',    'Oyo',         'Ibadan North',                 'Ibadan',           'Oyo State Director',                       '0805 444 3322', 'OA', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80'),
  ('user-member-ikeja',  'Blessing Okon',            'blessing.lagos@sidaap.org',       'sidaap2026', 'member',            'Lagos',       'Ikeja',                        'Ikeja & Maryland', 'School Outreach Counselor & Liaison',       '0802 222 0002', 'BO', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80'),
  ('user-member-alimosho','Ayomide Balogun',         'ayomide.alimosho@sidaap.org',     'sidaap2026', 'member',            'Lagos',       'Alimosho',                     'Egbeda / Igando',  'Field Officer',                             '0802 333 4444', 'AB', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80'),
  ('user-member-amac',   'Praise Ohwojero Efe',      'praise.efe@sidaap.org',           'sidaap2026', 'member',            'Abuja (FCT)', 'Municipal Area Council (AMAC)', 'Wuse & Garki',     'School Liaison',                            '0806 111 0001', 'PE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'),
  ('user-member-warri',  'Coach Emeka Uba',          'emeka.sports@sidaap.org',         'sidaap2026', 'member',            'Delta',       'Warri South',                  'Warri',            'Youth Coach (Football Academy)',             '0803 333 0003', 'EU', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80')
on conflict (id) do nothing;


-- ── SEED: NATIONAL DIRECTIVES ────────────────────────────────────────────────
insert into public.national_directives (id, title, issued_by, priority, content, target_scope, upcoming_event_date)
values
  (
    'dir-nat-01',
    'Nationwide Q4 Secondary School Exercise Books Dispatch',
    'Dr. Friday Chalele (National Trustee / Executive Directorate)',
    'high',
    'All 36 State Directors and LGA School Liaisons are instructed to complete distribution of the new SIDAAP branded anti-drug exercise books to public secondary schools. Ensure photo reports are submitted via the portal before the 15th of next month.',
    'All 36 States + Abuja FCT',
    'November 15, 2026'
  ),
  (
    'dir-nat-02',
    'Joint NDLEA Sensitization Marches Against Synthetic Opioids & Meth',
    'National Secretariat (Abuja Headquarters)',
    'urgent',
    'Each State Director must coordinate directly with the NDLEA State Command (Drug Demand Reduction Unit) to conduct localized community rallies in high-risk motor parks and markets against Colorado (Colo) and Mkpuru Mmiri.',
    'All State Chapters',
    'November 22, 2026'
  ),
  (
    'dir-nat-03',
    'SIDAAP Football Academy U-17 State Scouting Showcase',
    'Prosper Ohwojero (Trustee & Sports Director)',
    'standard',
    'Following CAC registration (RC: 9864105), youth coaches across Lagos, Delta, Rivers, and Abuja chapters are to host free trials for talented vulnerable youth. Kits will be delivered from the national warehouse.',
    'Sports Academy Coordinators',
    'December 02, 2026'
  )
on conflict (id) do nothing;
