'use client'

import { createClient } from '@/lib/supabase/client'

export interface LeadershipMember {
  id: string
  name: string
  role: string
  description: string
  image: string
  initials: string
}

export const INITIAL_LEADERSHIP: LeadershipMember[] = [
  {
    id: 'leader-friday-chalele',
    name: 'Friday Chalele',
    role: 'National Executive Director & Trustee',
    description: 'Strategic oversight and national community engagement.',
    image: '/hero-portrait.jpg',
    initials: 'FC',
  },
  {
    id: 'leader-doris-bode',
    name: 'Doris Bode',
    role: 'Trustee',
    description: 'Counseling coordination and family welfare advocacy.',
    image: '',
    initials: 'DB',
  },
  {
    id: 'leader-steve-ahans',
    name: 'Steve Ahans',
    role: 'Trustee',
    description: 'Institutional partnerships and inter-agency liaison.',
    image: '',
    initials: 'SA',
  },
  {
    id: 'leader-praise-efe',
    name: 'Praise Ohwojero Efe',
    role: 'Trustee',
    description: 'School educational outreach and youth assemblies.',
    image: '',
    initials: 'PE',
  },
  {
    id: 'leader-anthony-donald',
    name: 'Anthony Odianosen Donald',
    role: 'Trustee',
    description: 'Policy research, advocacy and legal compliance.',
    image: '',
    initials: 'AD',
  },
  {
    id: 'leader-prosper-ohwojero',
    name: 'Prosper Ohwojero',
    role: 'Trustee & Sports Director',
    description: 'Football academy and youth athletic programmes.',
    image: '',
    initials: 'PO',
  },
]

const STORAGE_KEY = 'sidaap_leadership'

export function getStoredLeadership(): LeadershipMember[] {
  if (typeof window === 'undefined') return INITIAL_LEADERSHIP
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return INITIAL_LEADERSHIP
}

export function saveStoredLeadership(member: LeadershipMember): LeadershipMember[] {
  const current = getStoredLeadership()
  const existing = current.some((item) => item.id === member.id)
  const updated = existing
    ? current.map((item) => item.id === member.id ? member : item)
    : [member, ...current]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event('sidaap_leadership_updated'))

  const supabase = createClient()
  if (supabase) {
    supabase.from('leadership').upsert({
      id: member.id,
      name: member.name,
      role: member.role,
      description: member.description,
      image: member.image || null,
      initials: member.initials,
    }, { onConflict: 'id' }).then(({ error }: { error: unknown }) => {
      if (error) console.error('[sidaap:leadership] save failed', error)
    })
  }
  return updated
}

export async function fetchStoredLeadership(): Promise<LeadershipMember[]> {
  const fallback = getStoredLeadership()
  const supabase = createClient()
  if (!supabase) return fallback
  try {
    const { data, error } = await supabase
      .from('leadership')
      .select('*')
      .order('created_at', { ascending: true })
    if (error || !data) return fallback
    const leadership = data.map((item: any): LeadershipMember => ({
      id: item.id,
      name: item.name,
      role: item.role,
      description: item.description,
      image: item.image ?? '',
      initials: item.initials,
    }))
    if (leadership.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leadership))
      window.dispatchEvent(new Event('sidaap_leadership_updated'))
      return leadership
    }
  } catch (error) {
    console.error('[sidaap:leadership] fetch failed', error)
  }
  return fallback
}

