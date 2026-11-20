'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  deleteStoredProgram,
  getStoredPrograms,
  fetchStoredPrograms,
  saveStoredProgram,
  ProgramActivity,
} from '@/lib/data/programs-data'
import { NIGERIA_STATES } from '@/lib/data/nigeria-data'
import { AuthUser, getStoredUser } from '@/lib/auth/session'
import { isSupabaseConfigured } from '@/lib/supabase/client'

const CATEGORIES = [
  'School Outreach',
  'Youth Sports & Academy',
  'Community Rally',
  'Rehabilitation & Clinical Care',
  'Workshop & Training',
  'National Summit',
  'Grassroots Awareness',
]

export default function AdminProgramsPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [programs, setPrograms] = useState<ProgramActivity[]>([])
  const [tab, setTab] = useState<'all' | 'past' | 'upcoming'>('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<'past' | 'upcoming'>('past')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [programCategory, setProgramCategory] = useState(CATEGORIES[0])
  const [programState, setProgramState] = useState('Abuja (FCT)')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [highlights, setHighlights] = useState('')
  const [organizer, setOrganizer] = useState('')
  const [gallery, setGallery] = useState<string[]>([])
  const isStateDirector = currentUser?.role === 'state_director'
  const managedState = isStateDirector ? currentUser.state : programState

  const mainFileRef = useRef<HTMLInputElement>(null)
  const galleryFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const user = getStoredUser()
    setCurrentUser(user)
    setPrograms(getStoredPrograms())
    fetchStoredPrograms().then(setPrograms)
    const refresh = () => setPrograms(getStoredPrograms())
    window.addEventListener('sidaap_programs_updated', refresh)
    return () => window.removeEventListener('sidaap_programs_updated', refresh)
  }, [])

  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3500)
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setStatus('past')
    setDate(new Date().toISOString().split('T')[0])
    setProgramCategory(CATEGORIES[0])
    setProgramState(currentUser?.role === 'state_director' ? currentUser.state : 'Abuja (FCT)')
    setLocation('')
    setDescription('')
    setMainImage('')
    setHighlights('')
    setOrganizer(currentUser?.name ? `${currentUser.name} (${currentUser.title || 'Director'})` : 'SIDAAP Directorate')
    setGallery([])
  }

  const openCreate = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (program: ProgramActivity) => {
    if (isStateDirector && program.state !== currentUser.state) {
      notify(`You can only edit programs for ${currentUser.state}`)
      return
    }
    setEditingId(program.id)
    setTitle(program.title)
    setStatus(program.status === 'past' ? 'past' : 'upcoming')
    setDate(program.date)
    setProgramCategory(program.category)
    setProgramState(program.state)
    setLocation(program.location)
    setDescription(program.description)
    setMainImage(program.mainImage)
    setHighlights((program.highlights || []).join('\n'))
    setOrganizer(program.organizer || '')
    setGallery(program.galleryImages || [])
    setModalOpen(true)
  }

  const readImage = (file: File, limitMb: number, onResult: (value: string) => void) => {
    if (file.size > limitMb * 1024 * 1024) {
      notify(`Please use an image under ${limitMb}MB`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onResult(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const saveProgram = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !description.trim()) {
      notify('Add a title and description before publishing')
      return
    }

    if (isStateDirector && programState !== currentUser.state) {
      notify(`Publish this program under ${currentUser.state}`)
      setProgramState(currentUser.state)
      return
    }

    const existing = editingId ? programs.find((item) => item.id === editingId) : undefined
    const program: ProgramActivity = {
      id: editingId || `prog-${Date.now()}`,
      title: title.trim(),
      status,
      date,
      category: programCategory,
      state: programState,
      location: location.trim() || `${programState}, Nigeria`,
      description: description.trim(),
      mainImage:
        mainImage ||
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      galleryImages: gallery,
      highlights: highlights
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      organizer: organizer.trim() || 'SIDAAP Directorate',
      createdAt: existing?.createdAt || new Date().toISOString(),
    }

    try {
      await saveStoredProgram(program)
      setModalOpen(false)
      notify(
        isSupabaseConfigured()
          ? (editingId ? 'Program updated in the database' : 'Program published to the database')
          : 'Program saved on this device only. Configure Supabase to sync it across devices.',
      )
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not save this program to the database.')
    }
  }

  const removeProgram = async (program: ProgramActivity) => {
    if (!window.confirm(`Delete "${program.title}"?`)) return
    try {
      await deleteStoredProgram(program.id)
      notify(
        isSupabaseConfigured()
          ? 'Program deleted from the database'
          : 'Program deleted on this device only. Configure Supabase to sync it across devices.',
      )
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not delete this program from the database.')
    }
  }

  const toggleStatus = async (program: ProgramActivity) => {
    try {
      await saveStoredProgram({
        ...program,
        status: program.status === 'past' ? 'upcoming' : 'past',
      })
      notify(
        isSupabaseConfigured()
          ? 'Program status updated in the database'
          : 'Program status updated on this device only. Configure Supabase to sync it across devices.',
      )
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not update this program in the database.')
    }
  }

  const managedPrograms = isStateDirector
    ? programs.filter((program) => program.state === currentUser.state)
    : programs

  const filtered = managedPrograms.filter((program) => {
    const matchesTab =
      tab === 'all'
        ? true
        : tab === 'past'
          ? program.status === 'past'
          : program.status === 'upcoming' || program.status === 'ongoing'
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      [program.title, program.state, program.location, program.description]
        .some((value) => value.toLowerCase().includes(query))
    const matchesCategory = category === 'all' || program.category === category
    return matchesTab && matchesSearch && matchesCategory
  })

  const pastCount = managedPrograms.filter((program) => program.status === 'past').length
  const upcomingCount = managedPrograms.filter(
    (program) => program.status === 'upcoming' || program.status === 'ongoing',
  ).length
  const stateCount = new Set(managedPrograms.map((program) => program.state)).size
  const summaryCards: Array<[string, number, LucideIcon]> = [
    ['Total', managedPrograms.length, CalendarDays],
    ['Completed', pastCount, CheckCircle2],
    ['Upcoming', upcomingCount, Clock],
    ['States', stateCount, MapPin],
  ]

  return (
    <div className="min-h-full bg-[#f4f6f3] p-4 text-[#18312a] sm:p-6 lg:p-8">
      {notice && (
        <div className="fixed right-5 top-20 z-[70] flex items-center gap-2 rounded-lg border border-[#18312a]/15 bg-white px-4 py-3 text-sm font-semibold shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-[#52720e]" />
          {notice}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-[#18312a]/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">Content manager</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Programs and activities</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718079]">
              Publish completed work and upcoming initiatives for the public website.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/programs"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-[#18312a]/15 bg-white px-4 py-3 text-sm font-semibold hover:border-[#18312a]"
            >
              <ExternalLink className="h-4 w-4" />
              View public page
            </Link>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-[#18312a] px-4 py-3 text-sm font-bold text-white hover:bg-[#27483f]"
            >
              <Plus className="h-4 w-4" />
              Add program
            </button>
          </div>
        </div>

        <div className="grid gap-3 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(([label, value, Icon]) => (
            <div key={label} className="rounded-xl border border-[#18312a]/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#718079]">{label}</span>
                <Icon className="h-4 w-4 text-[#52720e]" />
              </div>
              <p className="mt-3 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-[#18312a]/10 bg-white p-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-1">
            {[
              ['all', `All ${managedPrograms.length}`],
              ['past', `Completed ${pastCount}`],
              ['upcoming', `Upcoming ${upcomingCount}`],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value as typeof tab)}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${
                  tab === value ? 'bg-[#18312a] text-white' : 'text-[#718079] hover:bg-[#18312a]/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718079]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search programs"
                className="w-full rounded-lg border border-[#18312a]/15 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#18312a] sm:w-64"
              />
            </div>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-[#18312a]/15 px-3 py-2 text-sm outline-none"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#18312a]/20 bg-white p-14 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-[#718079]" />
            <h2 className="mt-4 font-bold">No programs found</h2>
            <p className="mt-1 text-sm text-[#718079]">Try another filter or add a new program.</p>
            <button type="button" onClick={openCreate} className="mt-5 rounded-lg bg-[#18312a] px-4 py-2.5 text-sm font-bold text-white">
              Add program
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((program) => (
              <article key={program.id} className="overflow-hidden rounded-xl border border-[#18312a]/10 bg-white">
                <div className="relative h-44 bg-[#18312a]/10">
                  <img src={program.mainImage} alt={program.title} className="h-full w-full object-cover" />
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                    program.status === 'past' ? 'bg-white text-[#18312a]' : 'bg-[#c9ec63] text-[#18312a]'
                  }`}>
                    {program.status === 'past' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#52720e]">{program.category}</p>
                  <h2 className="mt-2 line-clamp-2 text-lg font-bold">{program.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#718079]">{program.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-[#18312a]/10 pt-4 text-xs text-[#718079]">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{program.state}</span>
                    <span>{program.date}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button type="button" onClick={() => toggleStatus(program)} className="text-xs font-bold text-[#52720e]">
                      {program.status === 'past' ? 'Mark upcoming' : 'Mark completed'}
                    </button>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(program)} aria-label="Edit program" className="rounded-lg p-2 hover:bg-[#18312a]/5">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => removeProgram(program)} aria-label="Delete program" className="rounded-lg p-2 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 sm:p-6">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white text-[#18312a] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#18312a]/10 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#52720e]">Program details</p>
                <h2 className="mt-1 text-lg font-bold">{editingId ? 'Edit program' : 'Add new program'}</h2>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg p-2 hover:bg-[#18312a]/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveProgram} className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => setStatus('past')} className={`rounded-lg border p-3 text-left ${status === 'past' ? 'border-[#18312a] bg-[#eef1e6]' : 'border-[#18312a]/15'}`}>
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="mt-2 block text-sm font-bold">Completed</span>
                  </button>
                  <button type="button" onClick={() => setStatus('upcoming')} className={`rounded-lg border p-3 text-left ${status === 'upcoming' ? 'border-[#18312a] bg-[#eef1e6]' : 'border-[#18312a]/15'}`}>
                    <Clock className="h-4 w-4" />
                    <span className="mt-2 block text-sm font-bold">Upcoming</span>
                  </button>
                </div>

                <label className="grid gap-1.5 text-sm font-bold">
                  Program title
                  <input required value={title} onChange={(event) => setTitle(event.target.value)} className="rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal outline-none focus:border-[#18312a]" />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-bold">
                    Category
                    <select value={programCategory} onChange={(event) => setProgramCategory(event.target.value)} className="rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal">
                      {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold">
                    Date
                    <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal" />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-bold">
                    State
                    {isStateDirector ? (
                      <input value={currentUser.state} readOnly className="rounded-lg border border-[#18312a]/15 bg-[#eef1e6] px-3 py-2.5 font-normal" />
                    ) : (
                      <select value={programState} onChange={(event) => setProgramState(event.target.value)} className="rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal">
                        {NIGERIA_STATES.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                      </select>
                    )}
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold">
                    Venue or address
                    <input value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal" />
                  </label>
                </div>

                <div className="rounded-lg border border-[#18312a]/10 bg-[#f7f8f5] p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold"><ImageIcon className="h-4 w-4" />Main image</span>
                    <button type="button" onClick={() => mainFileRef.current?.click()} className="flex items-center gap-1 text-xs font-bold text-[#52720e]">
                      <Upload className="h-3.5 w-3.5" />Upload
                    </button>
                  </div>
                  <input ref={mainFileRef} type="file" accept="image/*" className="hidden" onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) readImage(file, 5, setMainImage)
                  }} />
                  {mainImage && <img src={mainImage} alt="Program preview" className="mt-3 h-36 w-full rounded-lg object-cover" />}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Additional gallery</span>
                    <button type="button" onClick={() => galleryFileRef.current?.click()} className="flex items-center gap-1 text-xs font-bold text-[#52720e]">
                      <Plus className="h-3.5 w-3.5" />Add photos
                    </button>
                  </div>
                  <input ref={galleryFileRef} type="file" multiple accept="image/*" className="hidden" onChange={(event) => {
                    Array.from(event.target.files || []).forEach((file) => readImage(file, 4, (value) => setGallery((items) => [...items, value])))
                  }} />
                  {gallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {gallery.map((image, index) => (
                        <div key={`${image.slice(0, 30)}-${index}`} className="relative h-20 overflow-hidden rounded-lg">
                          <img src={image} alt="" className="h-full w-full object-cover" />
                          <button type="button" onClick={() => setGallery((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-1 top-1 rounded-full bg-white p-1">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label className="grid gap-1.5 text-sm font-bold">
                  Description
                  <textarea required rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="resize-none rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal outline-none focus:border-[#18312a]" />
                </label>

                <label className="grid gap-1.5 text-sm font-bold">
                  Key highlights (one per line)
                  <textarea rows={3} value={highlights} onChange={(event) => setHighlights(event.target.value)} placeholder={'500 students reached\n1,000 exercise books distributed'} className="resize-none rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal outline-none focus:border-[#18312a]" />
                </label>

                <label className="grid gap-1.5 text-sm font-bold">
                  Organizing directorate
                  <input value={organizer} onChange={(event) => setOrganizer(event.target.value)} className="rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal" />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#18312a]/10 pt-5">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-bold text-[#718079]">Cancel</button>
                <button type="submit" className="rounded-lg bg-[#18312a] px-5 py-2.5 text-sm font-bold text-white">
                  {editingId ? 'Save changes' : 'Publish program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
