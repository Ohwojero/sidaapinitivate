'use client'

import { createClient } from '@/lib/supabase/client'

export interface LeadershipMember {
  id: string
  name: string
  role: string
  body?: string // 'Board of Trustees' | 'Advisory Council' | 'Patrons & Elders' | etc.
  description: string
  image: string
  initials: string
}

export const DEFAULT_LEADERSHIP_BODIES = [
  'Board of Trustees',
  'Advisory Council',
  'Patrons & Elders',
  'Executive Directorate',
] as const

export const INITIAL_LEADERSHIP: LeadershipMember[] = [
  {
    id: 'leader-friday-chalele',
    name: 'Friday Chalele',
    role: 'National Executive Director & Trustee',
    body: 'Board of Trustees',
    description: 'Strategic oversight and national community engagement.',
    image: '/hero-portrait.jpg',
    initials: 'FC',
  },
  {
    id: 'leader-doris-bode',
    name: 'Doris Bode',
    role: 'Trustee',
    body: 'Board of Trustees',
    description: 'Counseling coordination and family welfare advocacy.',
    image: '',
    initials: 'DB',
  },
  {
    id: 'leader-steve-ahans',
    name: 'Steve Ahans',
    role: 'Trustee',
    body: 'Board of Trustees',
    description: 'Institutional partnerships and inter-agency liaison.',
    image: '',
    initials: 'SA',
  },
  {
    id: 'leader-praise-efe',
    name: 'Praise Ohwojero Efe',
    role: 'Trustee',
    body: 'Board of Trustees',
    description: 'School educational outreach and youth assemblies.',
    image: '',
    initials: 'PE',
  },
  {
    id: 'leader-anthony-donald',
    name: 'Anthony Odianosen Donald',
    role: 'Trustee',
    body: 'Board of Trustees',
    description: 'Policy research, advocacy and legal compliance.',
    image: '',
    initials: 'AD',
  },
  {
    id: 'leader-prosper-ohwojero',
    name: 'Prosper Ohwojero',
    role: 'Trustee & Sports Director',
    body: 'Board of Trustees',
    description: 'Football academy and youth athletic programmes.',
    image: '',
    initials: 'PO',
  },
]

const STORAGE_KEY = 'sidaap_leadership'

// In-memory cache to keep full image data across client navigation without stripping
let memoryLeadershipCache: LeadershipMember[] | null = null

function withoutEmbeddedImages(members: LeadershipMember[]): LeadershipMember[] {
  return members.map((member) => ({
    ...member,
    image: member.image.startsWith('data:') ? '' : member.image,
  }))
}

export function getStoredLeadership(): LeadershipMember[] {
  if (memoryLeadershipCache && memoryLeadershipCache.length > 0) {
    return memoryLeadershipCache
  }
  if (typeof window === 'undefined') return INITIAL_LEADERSHIP
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const list = parsed.map((m: any) => ({
        ...m,
        body: m.body || 'Board of Trustees',
      }))
      if (list.length > 0) {
        memoryLeadershipCache = list
        return list
      }
    }
  } catch {}
  return INITIAL_LEADERSHIP
}

function safelyCacheToLocalStorage(members: LeadershipMember[]) {
  if (typeof window === 'undefined') return
  try {
    // First try saving full payload with images
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
  } catch {
    // If full payload exceeds localStorage limit (e.g. 5MB due to huge images), fallback to stripped
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutEmbeddedImages(members)))
    } catch {}
  }
}

export async function saveStoredLeadership(member: LeadershipMember): Promise<LeadershipMember[]> {
  const body = (member.body || '').trim() || 'Board of Trustees'
  const memberWithBody: LeadershipMember = {
    ...member,
    body,
  }

  const current = getStoredLeadership()
  const existing = current.some((item) => item.id === member.id)
  const updated = existing
    ? current.map((item) => item.id === member.id ? memberWithBody : item)
    : [memberWithBody, ...current]

  memoryLeadershipCache = updated

  const supabase = createClient()
  if (supabase) {
    // 1. Try upserting directly with the body column
    let { error } = await supabase.from('leadership').upsert({
      id: memberWithBody.id,
      name: memberWithBody.name,
      role: memberWithBody.role,
      body: memberWithBody.body,
      description: memberWithBody.description || '',
      image: memberWithBody.image || null,
      initials: memberWithBody.initials,
    }, { onConflict: 'id' })

    // 2. If the 'body' column does not exist yet in the database schema, fallback to embedding body metadata in description
    if (error && (error.message?.includes('body') || (error as any).code === 'PGRST204')) {
      const embeddedDescription = memberWithBody.body && memberWithBody.body !== 'Board of Trustees'
        ? `<!--body:${memberWithBody.body}-->${memberWithBody.description || ''}`
        : memberWithBody.description || ''

      const fallbackRes = await supabase.from('leadership').upsert({
        id: memberWithBody.id,
        name: memberWithBody.name,
        role: memberWithBody.role,
        description: embeddedDescription,
        image: memberWithBody.image || null,
        initials: memberWithBody.initials,
      }, { onConflict: 'id' })
      error = fallbackRes.error
    }

    if (error) {
      console.error('[sidaap:leadership] save failed', error)
      throw new Error(`The member was saved on this device, but Supabase rejected the database update: ${error.message}`)
    }
  }

  safelyCacheToLocalStorage(updated)
  window.dispatchEvent(new Event('sidaap_leadership_updated'))
  return updated
}

export async function deleteStoredLeadership(id: string): Promise<LeadershipMember[]> {
  const supabase = createClient()
  if (supabase) {
    const { error } = await supabase.from('leadership').delete().eq('id', id)
    if (error) {
      console.error('[sidaap:leadership] delete failed', error)
      throw new Error('Could not delete this member from the database.')
    }
  }

  const updated = getStoredLeadership().filter((member) => member.id !== id)
  memoryLeadershipCache = updated
  safelyCacheToLocalStorage(updated)
  window.dispatchEvent(new Event('sidaap_leadership_updated'))
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
    if (error) {
      console.error('[sidaap:leadership] fetch failed', error)
      return fallback
    }
    if (!data) return fallback
    const leadership = data.map((item: any): LeadershipMember => {
      let body = item.body
      let description = item.description || ''
      if (!body) {
        const bodyMatch = description.match(/<!--body:(.*?)-->/) || description.match(/^\[Body:\s*(.*?)\]/)
        if (bodyMatch) {
          body = bodyMatch[1].trim()
          description = description.replace(/<!--body:.*?-->/, '').replace(/^\[Body:\s*.*?\]\s*/, '').trim()
        } else {
          body = 'Board of Trustees'
        }
      }
      return {
        id: item.id,
        name: item.name,
        role: item.role,
        body: body || 'Board of Trustees',
        description,
        image: item.image ?? '',
        initials: item.initials || item.name.split(/\s+/).map((p: string) => p[0]).join('').slice(0, 2).toUpperCase(),
      }
    })
    if (leadership.length > 0) {
      memoryLeadershipCache = leadership
      safelyCacheToLocalStorage(leadership)
      window.dispatchEvent(new Event('sidaap_leadership_updated'))
      return leadership
    }
  } catch (error) {
    console.error('[sidaap:leadership] fetch failed', error)
  }
  return fallback
}
