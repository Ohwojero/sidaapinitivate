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

export const INITIAL_PROGRAMS: ProgramActivity[] = [
  {
    id: 'prog-exercise-books-fct',
    title: 'Secondary School Anti-Drug Outreach & Exercise Books Campaign',
    status: 'past',
    date: '2026-10-24',
    category: 'School Outreach',
    state: 'Abuja (FCT)',
    location: 'Government Secondary School, Garki, Area 10, Abuja',
    description: 'Direct interactive workshop educating students on the physiological dangers of synthetic substances like Colorado and Tramadol. SIDAAP manufactured and freely distributed over 2,500 branded 60-leaves anti-substance exercise books to students.',
    mainImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Distributed 2,500+ free educational exercise books',
      'Over 600 students attended the interactive assembly',
      'Established student-led Drug-Free Peer Club',
      'Trained 24 secondary school guidance counselors'
    ],
    organizer: 'National Youth & Schools Directorate',
    createdAt: '2026-10-25T10:00:00Z'
  },
  {
    id: 'prog-football-academy-unveiling',
    title: 'SIDAAP Football Academy Ltd Kit Unveiling & Youth Talent Trials',
    status: 'past',
    date: '2026-09-28',
    category: 'Youth Sports & Academy',
    state: 'Delta',
    location: 'Township Stadium, Warri, Delta State',
    description: 'Following incorporation under CAMA 2020 (RC: 9864105), SIDAAP Football Academy officially debuted its competition kits and hosted open trials for under-17 and under-20 athletes to promote sports as a healthy alternative to drug culture.',
    mainImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Unveiled official green/gold and royal blue kits',
      'Enrolled 45 youth athletes into structured sports academy',
      'Conducted mandatory health and substance wellness screening',
      'Keynote address by Sports Director Prosper Ohwojero'
    ],
    organizer: 'SIDAAP Football Academy Ltd',
    createdAt: '2026-09-29T14:00:00Z'
  },
  {
    id: 'prog-ndlea-joint-march',
    title: 'Joint NDLEA & SIDAAP Grassroots Market Sensitization March',
    status: 'past',
    date: '2026-09-12',
    category: 'Community Rally',
    state: 'Lagos',
    location: 'Oshodi Transport Interchange & Market Environs, Lagos',
    description: 'A large-scale street procession and market sensitization drive conducted in partnership with NDLEA field officers, road transport unions, and community leaders to warn transport workers and youth against illicit drug peddling.',
    mainImage: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Partnered with NDLEA Lagos State Command officers',
      'Distributed 5,000 informative flyers in English, Yoruba, and Pidgin',
      'Addressed 4 major bus terminal unions and market executives',
      'Established community drug report whistleblower channel'
    ],
    organizer: 'Lagos State Directorate',
    createdAt: '2026-09-13T09:00:00Z'
  },
  {
    id: 'prog-fct-summit-upcoming',
    title: 'FCT Secondary Schools Anti-Substance Summit & Inter-School Debate',
    status: 'upcoming',
    date: '2026-11-28',
    category: 'School Outreach',
    state: 'Abuja (FCT)',
    location: 'International Conference Centre, Central Area, Abuja',
    description: 'National gathering of over 40 secondary schools across the Federal Capital Territory for inter-school debates, poetry recitations, survivor keynote addresses, and the official roll-out of the Phase 2 Exercise Book campaign.',
    mainImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Delegates from 40 secondary schools across all 6 Area Councils',
      'Cash prizes and scholarship kits for debate champions',
      'Keynote by Dr. (Mrs) Ngozi Amadi & National Executive Director',
      'Accredited educational certificates for participating teachers'
    ],
    organizer: 'National Secretariat & FCT Directorate',
    createdAt: '2026-10-15T11:00:00Z'
  },
  {
    id: 'prog-lagos-football-tourney',
    title: 'Lagos State Inter-LGA Anti-Drug Youth Football Championship',
    status: 'upcoming',
    date: '2026-12-12',
    category: 'Youth Sports & Academy',
    state: 'Lagos',
    location: 'Teslim Balogun Stadium, Surulere, Lagos',
    description: 'A 3-day knockout grassroots football festival uniting youth from Ikeja, Surulere, Badagry, Ikorodu, and Lagos Island under the banner "Say No To Colorado, Yes To The Pitch."',
    mainImage: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      '16 local government teams competing for the SIDAAP Governor Trophy',
      'Scouting talent by certified domestic and international scouts',
      'Free medical checks and addiction counseling booth on-site',
      'Open to the public with free spectator entry'
    ],
    organizer: 'SIDAAP Football Academy & Lagos State Directorate',
    createdAt: '2026-10-18T16:00:00Z'
  }
]

const STORAGE_KEY = 'sidaap_programs_activities_v1'

export function getStoredPrograms(): ProgramActivity[] {
  if (typeof window === 'undefined') return INITIAL_PROGRAMS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROGRAMS))
      return INITIAL_PROGRAMS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROGRAMS
  } catch {
    return INITIAL_PROGRAMS
  }
}

export function saveStoredProgram(program: ProgramActivity): ProgramActivity[] {
  if (typeof window === 'undefined') return INITIAL_PROGRAMS
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
    supabase.from('program_activities').upsert({
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
    }, { onConflict: 'id' }).then(({ error }: { error: unknown }) => {
      if (error) console.error('[sidaap:programs] save failed', error)
    })
  }
  return updated
}

export function deleteStoredProgram(id: string): ProgramActivity[] {
  if (typeof window === 'undefined') return INITIAL_PROGRAMS
  const current = getStoredPrograms()
  const updated = current.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event('sidaap_programs_updated'))
  const supabase = createClient()
  if (supabase) {
    supabase.from('program_activities').delete().eq('id', id).then(({ error }: { error: unknown }) => {
      if (error) console.error('[sidaap:programs] delete failed', error)
    })
  }
  return updated
}

export function resetProgramsToDefault(): ProgramActivity[] {
  if (typeof window === 'undefined') return INITIAL_PROGRAMS
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROGRAMS))
  window.dispatchEvent(new Event('sidaap_programs_updated'))
  return INITIAL_PROGRAMS
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
    if (error || !data) return fallback
    if (data.length > 0) {
      const programs: ProgramActivity[] = data.map((item: any) => ({
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
    }
  } catch (error) {
    console.error('[sidaap:programs] fetch failed', error)
  }
  return fallback
}
