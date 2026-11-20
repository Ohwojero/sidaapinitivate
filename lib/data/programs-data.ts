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

const STORAGE_KEY = 'sidaap_programs_activities_v1'
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
    const programs = parsed.filter(
      (program): program is ProgramActivity =>
        Boolean(program) &&
        typeof program === 'object' &&
        'id' in program &&
        typeof program.id === 'string' &&
        !REMOVED_SAMPLE_PROGRAM_IDS.has(program.id),
    )
    if (programs.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(programs))
    }
    return programs
  } catch {
    return []
  }
}

export async function saveStoredProgram(program: ProgramActivity): Promise<ProgramActivity[]> {
  if (typeof window === 'undefined') return []
  const current = getStoredPrograms()
  const index = current.findIndex(p => p.id === program.id)
  let updated: ProgramActivity[]

  if (index >= 0) {
    updated = [...current]
    updated[index] = program
  } else {
    updated = [program, ...current]
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event('sidaap_programs_updated'))

  const supabase = createClient()
  if (supabase) {
    const { error } = await supabase.from('program_activities').upsert({
      id: program.id,
      title: program.title,
      status: program.status,
      date: program.date,
      category: program.category,
      state: program.state,
      location: program.location,
      description: program.description,
      main_image: program.mainImage,
      gallery_images: program.galleryImages ?? [],
      highlights: program.highlights ?? [],
      organizer: program.organizer ?? null,
      created_at: program.createdAt,
    }, { onConflict: 'id' })
    if (error) {
      console.error('[sidaap:programs] save failed', error)
      throw new Error('The program was saved on this device, but Supabase rejected the database update.')
    }
  }
  return updated
}

export async function deleteStoredProgram(id: string): Promise<ProgramActivity[]> {
  if (typeof window === 'undefined') return []
  const current = getStoredPrograms()
  const updated = current.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event('sidaap_programs_updated'))
  const supabase = createClient()
  if (supabase) {
    const { error } = await supabase.from('program_activities').delete().eq('id', id)
    if (error) {
      console.error('[sidaap:programs] delete failed', error)
      throw new Error('The program was removed on this device, but Supabase rejected the database deletion.')
    }
  }
  return updated
}

export async function fetchStoredPrograms(): Promise<ProgramActivity[]> {
  const fallback = getStoredPrograms()
  const supabase = createClient()
  if (!supabase) return fallback
  try {
    const { data, error } = await supabase
      .from('program_activities')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[sidaap:programs] fetch failed', error)
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
        mainImage: item.main_image,
        galleryImages: item.gallery_images ?? [],
        highlights: item.highlights ?? [],
        organizer: item.organizer ?? undefined,
        createdAt: item.created_at,
      }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs))
    window.dispatchEvent(new Event('sidaap_programs_updated'))
    return programs
  } catch (error) {
    console.error('[sidaap:programs] fetch failed', error)
  }
  return fallback
}
