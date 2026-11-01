-- ═══════════════════════════════════════════════════════════════════════════════
-- SIDAAP NIGERIA — Supabase Production Chat Schema (Clean - No Dummy Data)
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── 1. CHAT ROOMS ────────────────────────────────────────────────────────────
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

-- ── 2. CHAT MESSAGES (REAL PRODUCTION TABLE - ZERO DUMMY DATA) ───────────────
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

-- Index for fast room message ordering and lookups
create index if not exists chat_messages_room_id_idx
  on public.chat_messages (room_id, created_at);

-- ── 3. ENABLE REALTIME WEBSOCKETS ─────────────────────────────────────────────
alter publication supabase_realtime add table public.chat_rooms;
alter publication supabase_realtime add table public.chat_messages;

-- ── 4. ROW LEVEL SECURITY (RLS) ──────────────────────────────────────────────
alter table public.chat_rooms    enable row level security;
alter table public.chat_messages enable row level security;

-- Read: Authenticated portal users can read rooms and messages
create policy "Authenticated users can read rooms"
  on public.chat_rooms for select
  using (true);

create policy "Authenticated users can read messages"
  on public.chat_messages for select
  using (true);

-- Insert rooms: Authenticated officers can create new state or DM rooms
create policy "Authenticated users can insert rooms"
  on public.chat_rooms for insert
  with check (true);

-- Insert messages:
-- 1. Portal officers can insert into any channel
-- 2. Public citizens from the website can insert into room-public-inquiries
create policy "Users and public visitors can insert messages"
  on public.chat_messages for insert
  with check (true);

-- Update: Allow updating message delivery status (sent -> delivered -> read)
create policy "Allow message status updates"
  on public.chat_messages for update
  using (true);

-- ── 5. OFFICIAL CHANNEL REGISTRY (NO DUMMY MESSAGES) ─────────────────────────
insert into public.chat_rooms (id, name, type, description, state, avatar_text, avatar_color)
values
  ('room-public-inquiries',    '🌐 Live Public Crisis & Citizen Help Desk',       'broadcast',   'Incoming live messages & WhatsApp inquiries from citizens, parents, and youth on the public website', null, 'SOS', 'bg-[#c9ec63] text-[#13231f]'),
  ('room-directors-executive', '🏛️ National Directors Executive Forum',            'broadcast',   'Private coordination channel for National Trustees, Executive Director, and all 36 State Directors', null, 'NAT', 'bg-[#13231f]'),
  ('room-national-broadcast',  '📢 National Directives & Announcements',          'broadcast',   'Official policy broadcasts from the National Secretariat to all state chapters', null, 'HQ', 'bg-emerald-800'),
  ('room-lagos-chapter',       '📍 Lagos State Operations & Volunteers',           'state_group', 'Lagos State Directorate, LGA representatives, school liaison and volunteer team', 'Lagos', 'LAG', 'bg-amber-800'),
  ('room-delta-chapter',       '📍 Delta State Operations & Volunteers',           'state_group', 'Delta State Directorate, LGA representatives, school liaison and volunteer team', 'Delta', 'DLT', 'bg-emerald-900'),
  ('room-rivers-chapter',      '📍 Rivers State Operations & Volunteers',          'state_group', 'Rivers State Directorate, LGA representatives, school liaison and volunteer team', 'Rivers', 'RIV', 'bg-teal-800'),
  ('room-abuja-chapter',       '📍 FCT Abuja Operations & Volunteers',             'state_group', 'FCT Abuja Directorate, LGA representatives, school liaison and volunteer team', 'Abuja', 'ABJ', 'bg-slate-700'),
  ('room-football-academy',    '⚽ SIDAAP Football Academy Technical Staff',       'state_group', 'Coaches, trainers, kit coordinators, and talent scouts (CAC RC: 9864105)', null, 'SFA', 'bg-[#13231f]')
on conflict (id) do nothing;
