'use client'

import { createClient } from '@/lib/supabase/client'

export interface ProgramActivity {
  id: string
  title: string
  status: 'past' | 'upcoming' | 'ongoing'
  date: string
  category: string
  state: string
  location: string
  description: string
  mainImage: string
  galleryImages?: string[]
  highlights?: string[]
  organizer?: string
  createdAt: string
}

export const PROGRAM_CATEGORIES = [
  'School Outreach',
  'Youth Sports & Academy',
  'Community Rally',
  'Rehabilitation & Clinical Care',
  'Workshop & Training',
  'National Summit',
  'Grassroots Awareness',
]

const STORAGE_KEY = 'sidaap_programs_activities_v1'
const DEFAULT_SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80'
const REMOVED_SAMPLE_PROGRAM_IDS = new Set([
  'prog-exercise-books-fct',
  'prog-football-academy-unveiling',
  'prog-ndlea-joint-march',
  'prog-fct-summit-upcoming',
  'prog-lagos-football-tourney',
])

export function getStoredPrograms(): ProgramActivity[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const programs = (parsed as unknown[])
      .filter(
        (program): program is ProgramActivity =>
          Boolean(program) &&
          program !== null &&
          typeof program === 'object' &&
          'id' in program &&
          typeof (program as any).id === 'string' &&
          !REMOVED_SAMPLE_PROGRAM_IDS.has((program as any).id),
      )
      .map((program) => ({
        ...program,
        mainImage: program.mainImage === DEFAULT_SAMPLE_IMAGE ? '' : program.mainImage ?? '',
      }))
    return programs
  } catch {
    return []
  }
}

export async function saveStoredProgram(program: ProgramActivity): Promise<ProgramActivity[]> {
  let savedToDatabase = false
  let lastError: Error | null = null

  // 1. Try server-side API endpoint first (immune to client-side adblockers and cookie issues)
  try {
    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program),
    })
    if (res.ok) {
      savedToDatabase = true
    } else {
      const errData = await res.json().catch(() => ({}))
      console.warn('[sidaap:programs] /api/programs returned error, falling back to direct client:', errData)
    }
  } catch (apiErr) {
    console.warn('[sidaap:programs] /api/programs fetch failed, falling back to direct client:', apiErr)
  }

  // 2. Direct Supabase fallback if API route did not complete
  if (!savedToDatabase) {
    const supabase = createClient()
    if (supabase) {
      const { error } = await supabase.from('program_activities').upsert(
        {
          id: program.id,
          title: program.title,
          status: program.status,
          date: program.date,
          category: program.category,
          state: program.state,
          location: program.location,
          description: program.description,
          main_image: program.mainImage || null,
          gallery_images: program.galleryImages ?? [],
          highlights: program.highlights ?? [],
          organizer: program.organizer ?? null,
          created_at: program.createdAt,
        },
        { onConflict: 'id' },
      )
      if (error) {
        console.error('[sidaap:programs] save failed in Supabase direct client', error)
        lastError = new Error(`Database save failed (${error.code || 'ERR'}): ${error.message}`)
      } else {
        savedToDatabase = true
      }
    }
  }

  if (lastError && !savedToDatabase) {
    throw lastError
  }

  // 3. Update local cache and notify listeners
  if (typeof window !== 'undefined') {
    const current = getStoredPrograms()
    const index = current.findIndex((p) => p.id === program.id)
    let updated: ProgramActivity[]

    if (index >= 0) {
      updated = [...current]
      updated[index] = program
    } else {
      updated = [program, ...current]
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn('[sidaap:programs] localStorage quota exceeded, skipping local cache write', e)
    }
    window.dispatchEvent(new Event('sidaap_programs_updated'))
    return updated
  }
  return [program]
}

export async function deleteStoredProgram(id: string): Promise<ProgramActivity[]> {
  // 1. Try server-side API first
  try {
    const res = await fetch(`/api/programs?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`)
    }
  } catch (apiErr) {
    console.warn('[sidaap:programs] /api/programs delete failed, falling back to direct client:', apiErr)
    const supabase = createClient()
    if (supabase) {
      const { error } = await supabase.from('program_activities').delete().eq('id', id)
      if (error) {
        console.error('[sidaap:programs] delete failed', error)
        throw new Error(`Database deletion failed (${error.code || 'ERR'}): ${error.message}`)
      }
    }
  }

  if (typeof window !== 'undefined') {
    const current = getStoredPrograms()
    const updated = current.filter((p) => p.id !== id)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn('[sidaap:programs] localStorage update failed on delete', e)
    }
    window.dispatchEvent(new Event('sidaap_programs_updated'))
    return updated
  }
  return []
}

export async function fetchStoredPrograms(): Promise<ProgramActivity[]> {
  const fallback = getStoredPrograms()

  // 1. Try server-side API endpoint first
  try {
    const res = await fetch('/api/programs', { cache: 'no-store' })
    if (res.ok) {
      const body = await res.json()
      if (body && Array.isArray(body.programs)) {
        const programs: ProgramActivity[] = body.programs
          .filter((item: any) => !REMOVED_SAMPLE_PROGRAM_IDS.has(item.id))
          .map((item: any): ProgramActivity => ({
            id: item.id,
            title: item.title,
            status: item.status,
            date: item.date,
            category: item.category,
            state: item.state,
            location: item.location,
            description: item.description,
            mainImage: item.main_image === DEFAULT_SAMPLE_IMAGE ? '' : item.main_image ?? '',
            galleryImages: item.gallery_images ?? [],
            highlights: item.highlights ?? [],
            organizer: item.organizer ?? undefined,
            createdAt: item.created_at,
          }))

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(programs))
          } catch (e) {
            console.warn('[sidaap:programs] localStorage write skipped in fetch', e)
          }
          window.dispatchEvent(new Event('sidaap_programs_updated'))
        }
        return programs
      }
    }
  } catch (apiErr) {
    console.warn('[sidaap:programs] /api/programs fetch failed, falling back to direct client:', apiErr)
  }

  // 2. Direct Supabase fallback
  const supabase = createClient()
  if (!supabase) return fallback
  try {
    const { data, error } = await supabase
      .from('program_activities')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[sidaap:programs] fetch failed from Supabase', error)
      return fallback
    }
    if (!data) return fallback

    const programs: ProgramActivity[] = data
      .filter((item: any) => !REMOVED_SAMPLE_PROGRAM_IDS.has(item.id))
      .map((item: any): ProgramActivity => ({
        id: item.id,
        title: item.title,
        status: item.status,
        date: item.date,
        category: item.category,
        state: item.state,
        location: item.location,
        description: item.description,
        mainImage: item.main_image === DEFAULT_SAMPLE_IMAGE ? '' : item.main_image ?? '',
        galleryImages: item.gallery_images ?? [],
        highlights: item.highlights ?? [],
        organizer: item.organizer ?? undefined,
        createdAt: item.created_at,
      }))

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(programs))
      } catch (e) {
        console.warn('[sidaap:programs] localStorage write skipped in fetch', e)
      }
      window.dispatchEvent(new Event('sidaap_programs_updated'))
    }
    return programs
  } catch (error) {
    console.error('[sidaap:programs] fetch error', error)
  }
  return fallback
}
