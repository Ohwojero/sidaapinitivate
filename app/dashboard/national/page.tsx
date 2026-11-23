'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  INITIAL_STATE_DIRECTORS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_NATIONAL_DIRECTIVES,
  INITIAL_STATE_ACTIVITIES,
  StateDirector,
  StateStaffMember,
  NationalDirective,
  StateActivity,
  getStoredDirectors,
  getStoredStaff,
  getStoredActivities
} from '@/lib/data/portal-data'
import {
  ProgramActivity,
  PROGRAM_CATEGORIES,
  getStoredPrograms,
  fetchStoredPrograms,
  saveStoredProgram,
  deleteStoredProgram,
} from '@/lib/data/programs-data'
import { registerUser } from '@/lib/auth/session'
import {
  fetchDirectors,
  addDirector,
  updateDirector,
  deleteDirector,
  fetchStaff,
  fetchActivities,
  fetchDirectives,
  addDirective
} from '@/lib/supabase/portal'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { compressImageFile } from '@/lib/utils'
import { NIGERIA_STATES } from '@/lib/data/nigeria-data'
import {
  LeadershipMember,
  fetchStoredLeadership,
  getStoredLeadership,
  saveStoredLeadership,
  deleteStoredLeadership,
  DEFAULT_LEADERSHIP_BODIES,
  isNationalExecutiveLeader,
} from '@/lib/data/leadership-data'
import {
  ShieldCheck,
  Building2,
  Users,
  PlusCircle,
  MessageSquare,
  Search,
  CheckCircle2,
  MapPin,
  Megaphone,
  Calendar,
  CalendarDays,
  Activity,
  CheckCheck,
  X,
  FileCheck2,
  UserPlus,
  Send,
  SlidersHorizontal,
  LogOut,
  KeyRound,
  Copy,
  Pencil,
  Trash2,
  AlertTriangle,
  UserRoundCog,
  Upload,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Phone,
  Hash,
  Loader2,
} from 'lucide-react'

export default function NationalDirectorDashboard() {
  const [directors, setDirectors] = useState<StateDirector[]>(INITIAL_STATE_DIRECTORS)
  const [staffList, setStaffList] = useState<StateStaffMember[]>(INITIAL_STAFF_MEMBERS)
  const [directives, setDirectives] = useState<NationalDirective[]>(INITIAL_NATIONAL_DIRECTIVES)
  const [activities, setActivities] = useState<StateActivity[]>(INITIAL_STATE_ACTIVITIES)
  const [programs, setPrograms] = useState<ProgramActivity[]>([])
  
  const [selectedStateFilter, setSelectedStateFilter] = useState('All')
  const [searchMemberQuery, setSearchMemberQuery] = useState('')
  const [noticeMessage, setNoticeMessage] = useState('')

  // National Executive Leaders State
  const [nationalLeaders, setNationalLeaders] = useState<LeadershipMember[]>(getStoredLeadership)
  const [showNationalLeaderModal, setShowNationalLeaderModal] = useState(false)
  const [isEditingNationalLeader, setIsEditingNationalLeader] = useState(false)
  const [isSavingNationalLeader, setIsSavingNationalLeader] = useState(false)
  const [isCompressingNationalPortrait, setIsCompressingNationalPortrait] = useState(false)
  const [nationalLeaderForm, setNationalLeaderForm] = useState<LeadershipMember>({
    id: '',
    name: '',
    role: 'National Executive Director',
    body: 'Executive Directorate',
    description: '',
    image: '',
    initials: '',
    phone: '',
    state: '',
    positionNumber: undefined,
  })

  // Modals for State Directors
  const [showAddDirectorModal, setShowAddDirectorModal] = useState(false)
  const [isCreatingDirector, setIsCreatingDirector] = useState(false)
  const [isCompressingDirectorPhoto, setIsCompressingDirectorPhoto] = useState(false)
  const [directorCreationError, setDirectorCreationError] = useState('')
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [editingDirector, setEditingDirector] = useState<StateDirector | null>(null)
  const [isCompressingEditDirectorPhoto, setIsCompressingEditDirectorPhoto] = useState(false)
  const [deletingDirector, setDeletingDirector] = useState<StateDirector | null>(null)
  const [createdCredentialsNotice, setCreatedCredentialsNotice] = useState<{
    name: string
    email: string
    password: string
    state: string
  } | null>(null)

  // Programs Management State
  const [showProgramModal, setShowProgramModal] = useState(false)
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null)
  const [isSavingProgram, setIsSavingProgram] = useState(false)
  const [isCompressingProgramPhoto, setIsCompressingProgramPhoto] = useState(false)
  const [programFilterTab, setProgramFilterTab] = useState<'all' | 'past' | 'upcoming'>('all')
  const [programSearchQuery, setProgramSearchQuery] = useState('')
  const [programCategoryFilter, setProgramCategoryFilter] = useState('all')

  const mainProgramFileRef = useRef<HTMLInputElement>(null)
  const galleryProgramFileRef = useRef<HTMLInputElement>(null)

  const [programForm, setProgramForm] = useState({
    title: '',
    status: 'past' as 'past' | 'upcoming' | 'ongoing',
    date: new Date().toISOString().split('T')[0],
    category: PROGRAM_CATEGORIES[0],
    state: 'Abuja (FCT)',
    location: '',
    description: '',
    mainImage: '',
    highlights: '',
    organizer: 'National Executive Directorate',
    gallery: [] as string[],
  })

  const notify = (msg: string, duration = 4000) => {
    setNoticeMessage(msg)
    window.setTimeout(() => setNoticeMessage(''), duration)
  }

  // Load persistent data on mount
  useEffect(() => {
    fetchDirectors().then(setDirectors)
    fetchStaff().then(setStaffList)
    fetchActivities().then(setActivities)
    fetchDirectives().then(setDirectives)
    setPrograms(getStoredPrograms())
    fetchStoredPrograms().then(setPrograms)
    fetchStoredLeadership().then(setNationalLeaders)

    const handleProgUpdate = () => {
      setPrograms(getStoredPrograms())
    }
    const handleLeadershipUpdate = () => {
      setNationalLeaders(getStoredLeadership())
    }
    const handleDirectorsUpdate = () => {
      setDirectors(getStoredDirectors())
    }
    window.addEventListener('sidaap_programs_updated', handleProgUpdate)
    window.addEventListener('sidaap_leadership_updated', handleLeadershipUpdate)
    window.addEventListener('sidaap_directors_updated', handleDirectorsUpdate)
    return () => {
      window.removeEventListener('sidaap_programs_updated', handleProgUpdate)
      window.removeEventListener('sidaap_leadership_updated', handleLeadershipUpdate)
      window.removeEventListener('sidaap_directors_updated', handleDirectorsUpdate)
    }
  }, [])

  // Add Director Form State
  const [newDirector, setNewDirector] = useState({
    name: '',
    email: '',
    password: 'sidaap2026',
    phone: '',
    state: 'Katsina',
    lga: '',
    city: '',
    avatarUrl: '',
    position: 'State Director',
    positionNumber: '' as string | number,
  })

  // Broadcast Directive Form State
  const [newDirective, setNewDirective] = useState({
    title: '',
    priority: 'high' as NationalDirective['priority'],
    content: '',
    targetScope: 'All 36 States + Abuja FCT',
    upcomingEventDate: ''
  })

  // Dynamic LGAs for selected director state
  const availableDirectorLgas = NIGERIA_STATES.find(s => s.name === newDirector.state)?.lgas || []
  const nationalExecutiveLeaders = nationalLeaders.filter(isNationalExecutiveLeader)

  // National Leader Handlers
  const openAddNationalLeader = () => {
    setIsEditingNationalLeader(false)
    setNationalLeaderForm({
      id: `leader-${crypto.randomUUID()}`,
      name: '',
      role: 'National Executive Director',
      body: 'Executive Directorate',
      description: '',
      image: '',
      initials: '',
      phone: '',
      state: '',
      positionNumber: undefined,
    })
    setShowNationalLeaderModal(true)
  }

  const openEditNationalLeader = (leader: LeadershipMember) => {
    setIsEditingNationalLeader(true)
    setNationalLeaderForm({ ...leader })
    setShowNationalLeaderModal(true)
  }

  const handleSaveNationalLeader = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingNationalLeader(true)
    try {
      const initials = nationalLeaderForm.name
        .split(/\s+/)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'ND'
      const updated: LeadershipMember = {
        ...nationalLeaderForm,
        initials,
        body: nationalLeaderForm.body || 'Executive Directorate',
      }
      const list = await saveStoredLeadership(updated)
      setNationalLeaders(list)
      setShowNationalLeaderModal(false)
      notify(`National Leader ${updated.name} saved successfully`)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save national leader')
    } finally {
      setIsSavingNationalLeader(false)
    }
  }

  const handleDeleteNationalLeader = async (leader: LeadershipMember) => {
    if (!window.confirm(`Delete ${leader.name}? This will remove them from the National Executive Council.`)) return
    try {
      const list = await deleteStoredLeadership(leader.id)
      setNationalLeaders(list)
      notify(`${leader.name} removed`)
    } catch (err) {
      notify('Could not delete member')
    }
  }

  // Add State Director Handler
  const handleAddDirector = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingDirector(true)
    setDirectorCreationError('')
    const stateSlug = newDirector.state.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const nameSlug = newDirector.name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '')
    const uniqueSuffix = Date.now().toString().slice(-6)
    const generatedEmail = nameSlug
      ? `${nameSlug}.${stateSlug}.${uniqueSuffix}@sidaap.org`
      : `${stateSlug}.director.${uniqueSuffix}@sidaap.org`
    const password = 'sidaap2026'
    const lga = availableDirectorLgas[0] || 'Central LGA'
    const city = `${newDirector.state} Central`
    const created: StateDirector = {
      id: `dir-${Date.now()}`,
      name: newDirector.name,
      email: generatedEmail,
      phone: newDirector.phone,
      state: newDirector.state,
      lga,
      city,
      appointedDate: 'Today',
      status: 'active',
      staffCount: 0,
      facilitiesCount: 0,
      outreachCount: 0,
      avatarUrl: newDirector.avatarUrl || undefined,
      position: newDirector.position.trim() || 'State Director',
      positionNumber: undefined,
    }
    const newUser = {
      id: `user-${created.id}`,
      name: created.name,
      email: created.email,
      password: password,
      role: 'state_director' as const,
      state: created.state,
      lga: created.lga,
      city: created.city,
      title: newDirector.position.trim() || `${created.state} State Director`,
      avatarInitials: created.name.split(' ').map(n => n[0]).join('').slice(0, 2),
      avatarUrl: created.avatarUrl || ''
    }

    try {
      await addDirector(created, newUser)
      setCreatedCredentialsNotice({
        name: created.name,
        email: created.email,
        password,
        state: created.state
      })

      setShowAddDirectorModal(false)
      setNewDirector({
        name: '',
        email: '',
        password: 'sidaap2026',
        phone: '',
        state: 'Katsina',
        lga: '',
        city: '',
        avatarUrl: '',
        position: 'State Director',
        positionNumber: '',
      })
      notify(`State Director appointed for ${created.state}`)
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Unable to save the director account.'
      setDirectorCreationError(`The appointment could not be fully saved. Please try again. ${message}`)
    } finally {
      setIsCreatingDirector(false)
    }
  }

  // Edit Director Handler
  const handleEditDirector = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDirector) return
    setDirectors(prev => prev.map(d => d.id === editingDirector.id ? editingDirector : d))
    await updateDirector(editingDirector)
    setEditingDirector(null)
    notify('Director details updated')
  }

  // Delete Director Handler
  const handleDeleteDirector = () => {
    if (!deletingDirector) return
    setDirectors(prev => prev.filter(d => d.id !== deletingDirector.id))
    deleteDirector(deletingDirector.id, deletingDirector.email)
    setDeletingDirector(null)
    notify('Director removed from records')
  }

  // Broadcast Directive Handler
  const handleBroadcastDirective = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDirective.title.trim() || !newDirective.content.trim()) {
      notify('Please enter a directive title and instructions.')
      return
    }
    setIsBroadcasting(true)
    const createdDir: NationalDirective = {
      id: `dir-${Date.now()}`,
      title: newDirective.title.trim(),
      issuedBy: 'Dr. Friday Chalele (National Trustee / Executive Directorate)',
      date: 'Just now',
      priority: newDirective.priority,
      content: newDirective.content.trim(),
      targetScope: newDirective.targetScope,
      upcomingEventDate: newDirective.upcomingEventDate || undefined
    }
    try {
      setDirectives(prev => [createdDir, ...prev])
      await addDirective(createdDir)
      setShowBroadcastModal(false)
      setNewDirective({ title: '', priority: 'high', content: '', targetScope: 'All 36 States + Abuja FCT', upcomingEventDate: '' })
      notify('National directive broadcasted to all state chapters!')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not broadcast directive.')
    } finally {
      setIsBroadcasting(false)
    }
  }

  // Program Management Handlers
  const openAddProgram = () => {
    setEditingProgramId(null)
    setProgramForm({
      title: '',
      status: 'past',
      date: new Date().toISOString().split('T')[0],
      category: PROGRAM_CATEGORIES[0],
      state: 'Abuja (FCT)',
      location: '',
      description: '',
      mainImage: '',
      highlights: '',
      organizer: 'National Executive Directorate',
      gallery: [],
    })
    setShowProgramModal(true)
  }

  const openEditProgram = (prog: ProgramActivity) => {
    setEditingProgramId(prog.id)
    setProgramForm({
      title: prog.title,
      status: prog.status === 'past' ? 'past' : 'upcoming',
      date: prog.date,
      category: prog.category,
      state: prog.state,
      location: prog.location,
      description: prog.description,
      mainImage: prog.mainImage,
      highlights: (prog.highlights || []).join('\n'),
      organizer: prog.organizer || 'National Executive Directorate',
      gallery: prog.galleryImages || [],
    })
    setShowProgramModal(true)
  }

  const handleMainProgramPhoto = async (file: File) => {
    setIsCompressingProgramPhoto(true)
    try {
      const compressed = await compressImageFile(file, 1280, 960, 0.78)
      setProgramForm(prev => ({ ...prev, mainImage: compressed }))
      notify('Photo optimized for web publishing')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not process photo')
    } finally {
      setIsCompressingProgramPhoto(false)
    }
  }

  const handleGalleryProgramPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsCompressingProgramPhoto(true)
    try {
      const compressedList: string[] = []
      for (const f of Array.from(files)) {
        const c = await compressImageFile(f, 1024, 768, 0.75)
        compressedList.push(c)
      }
      setProgramForm(prev => ({ ...prev, gallery: [...prev.gallery, ...compressedList] }))
      notify(`Added ${compressedList.length} photos`)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not process photos')
    } finally {
      setIsCompressingProgramPhoto(false)
    }
  }

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!programForm.title.trim() || !programForm.description.trim()) {
      notify('Please provide a title and description before publishing.')
      return
    }
    setIsSavingProgram(true)
    const existing = editingProgramId ? programs.find(p => p.id === editingProgramId) : undefined
    const programItem: ProgramActivity = {
      id: editingProgramId || `prog-${Date.now()}`,
      title: programForm.title.trim(),
      status: programForm.status,
      date: programForm.date,
      category: programForm.category,
      state: programForm.state,
      location: programForm.location.trim() || `${programForm.state}, Nigeria`,
      description: programForm.description.trim(),
      mainImage: programForm.mainImage,
      galleryImages: programForm.gallery,
      highlights: programForm.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      organizer: programForm.organizer.trim() || 'National Executive Directorate',
      createdAt: existing?.createdAt || new Date().toISOString(),
    }

    try {
      await saveStoredProgram(programItem)
      setPrograms(prev => {
        const idx = prev.findIndex(p => p.id === programItem.id)
        if (idx >= 0) {
          const cp = [...prev]
          cp[idx] = programItem
          return cp
        }
        return [programItem, ...prev]
      })
      setShowProgramModal(false)
      notify(
        isSupabaseConfigured()
          ? (editingProgramId ? 'Program updated in Supabase database' : 'Program published to Supabase database!')
          : 'Program saved locally on this browser.',
      )
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save program to database.', 10000)
    } finally {
      setIsSavingProgram(false)
    }
  }

  const handleDeleteProgram = async (prog: ProgramActivity) => {
    if (!window.confirm(`Delete program "${prog.title}" from the database?`)) return
    try {
      await deleteStoredProgram(prog.id)
      setPrograms(prev => prev.filter(p => p.id !== prog.id))
      notify('Program removed from database')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete program.')
    }
  }

  // Filtered rosters
  const filteredDirectors = directors.filter((d) =>
    selectedStateFilter === 'All' ? true : d.state === selectedStateFilter
  )

  const filteredStaff = staffList.filter((s) => {
    const matchState = selectedStateFilter === 'All' || s.state === selectedStateFilter
    const matchSearch =
      s.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      s.lga.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchMemberQuery.toLowerCase())
    return matchState && matchSearch
  })

  // Filtered programs
  const filteredPrograms = programs.filter((p) => {
    const matchesTab =
      programFilterTab === 'all'
        ? true
        : programFilterTab === 'past'
        ? p.status === 'past'
        : p.status === 'upcoming' || p.status === 'ongoing'

    const matchesCategory =
      programCategoryFilter === 'all' || p.category === programCategoryFilter

    const q = programSearchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      [p.title, p.state, p.location, p.description].some(v => v.toLowerCase().includes(q))

    return matchesTab && matchesCategory && matchesSearch
  })

  const pastProgramsCount = programs.filter(p => p.status === 'past').length
  const upcomingProgramsCount = programs.filter(p => p.status === 'upcoming' || p.status === 'ongoing').length

  return (
    <div className="bg-[#f5f1e9] min-h-screen pb-20">
      {noticeMessage && (
        <div className="fixed right-5 top-20 z-[70] flex items-center gap-2 rounded-xl border border-[#18312a]/15 bg-white px-5 py-3 text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#52720e]" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* National overview */}
      <div className="border-b border-[#18312a]/10 bg-white px-6 py-7">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">
              National office &bull; Abuja
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#18312a]">
              National oversight
            </h1>
            <p className="mt-1 text-sm text-[#718079]">
              State leadership, LGA teams, programmes and national directives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={openAddNationalLeader}
              className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1f3a33] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <Users className="h-4 w-4 text-[#c9ec63]" />
              Add National Director
            </button>
            <button
              type="button"
              onClick={() => setShowAddDirectorModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#c9ec63] hover:bg-[#bde250] text-[#13231f] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow font-bold"
            >
              <PlusCircle className="h-4 w-4" />
              Appoint State Director
            </button>
            <button
              type="button"
              onClick={openAddProgram}
              className="flex items-center gap-2 rounded-xl bg-white hover:bg-stone-50 text-[#13231f] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition border border-stone-300 shadow-sm"
            >
              <CalendarDays className="h-4 w-4 text-emerald-700" />
              Add Program
            </button>
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 rounded-xl bg-white hover:bg-stone-50 text-[#13231f] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition border border-stone-300 shadow-sm"
            >
              <Megaphone className="h-4 w-4 text-emerald-700" />
              Broadcast Directive
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* National Metrics */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              State Directors
            </span>
            <div className="text-3xl font-black text-stone-900 font-mono mt-1">
              {directors.length} / 37
            </div>
            <p className="text-xs text-stone-500 mt-1">36 States + Abuja FCT</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              Enrolled LGA Staff
            </span>
            <div className="text-3xl font-black text-emerald-800 font-mono mt-1">
              {staffList.length} Active
            </div>
            <p className="text-xs text-stone-500 mt-1">Grassroots coordinators</p>
          </div>

          <a
            href="#national-programs"
            className="group rounded-2xl border border-emerald-300 bg-emerald-50/60 p-5 shadow-sm hover:border-emerald-500 transition block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-emerald-900 font-bold block">
                Published Programs
              </span>
              <CalendarDays className="h-4 w-4 text-emerald-700 group-hover:scale-110 transition" />
            </div>
            <div className="text-3xl font-black text-emerald-950 font-mono mt-1">
              {programs.length} Live
            </div>
            <p className="text-xs text-emerald-800 mt-1 font-medium">
              {upcomingProgramsCount} upcoming &bull; {pastProgramsCount} completed
            </p>
          </a>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              Field Outreaches
            </span>
            <div className="text-3xl font-black text-blue-900 font-mono mt-1">
              {activities.length} Events
            </div>
            <p className="text-xs text-stone-500 mt-1">Reports from state teams</p>
          </div>

          <a
            href="#national-directives"
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:border-purple-300 transition block"
          >
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              Active Directives
            </span>
            <div className="text-3xl font-black text-purple-900 font-mono mt-1">
              {directives.length} Issued
            </div>
            <p className="text-xs text-stone-500 mt-1">Broadcast to all 36 states</p>
          </a>
        </div>

        {/* ── SECTION: NATIONAL PROGRAMMES & PUBLIC INITIATIVES (IN DATABASE) ── */}
        <div id="national-programs" className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-emerald-800">
                Public Database &bull; program_activities
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                National Programmes &amp; Public Initiatives
              </h2>
              <p className="text-xs text-stone-500">
                School campaigns, sports academy activities, and public rallies published directly to the database and website.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/programs"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 hover:border-stone-500 shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Public Page
              </Link>
              <Link
                href="/dashboard/programs"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 hover:border-stone-500 shadow-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Full Manager
              </Link>
              <button
                type="button"
                onClick={openAddProgram}
                className="inline-flex items-center gap-2 rounded-xl bg-[#13231f] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1f3a33] shadow"
              >
                <Plus className="h-4 w-4 text-[#c9ec63]" />
                Add Program
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1">
              {[
                ['all', `All (${programs.length})`],
                ['past', `Completed (${pastProgramsCount})`],
                ['upcoming', `Upcoming (${upcomingProgramsCount})`],
              ].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setProgramFilterTab(val as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    programFilterTab === val
                      ? 'bg-[#18312a] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={programSearchQuery}
                  onChange={(e) => setProgramSearchQuery(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-white pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#18312a] w-48 sm:w-60"
                />
              </div>

              <select
                value={programCategoryFilter}
                onChange={(e) => setProgramCategoryFilter(e.target.value)}
                className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none font-medium focus:border-[#18312a]"
              >
                <option value="all">All Categories</option>
                {PROGRAM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Programs Grid */}
          {filteredPrograms.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-stone-200 p-10 text-center bg-stone-50/50">
              <CalendarDays className="mx-auto h-10 w-10 text-stone-400" />
              <h4 className="mt-3 text-base font-bold text-stone-800">
                {programs.length === 0 ? 'No programs published in the database yet' : 'No programs match your search'}
              </h4>
              <p className="mt-1 text-xs text-stone-500 max-w-md mx-auto">
                {programs.length === 0
                  ? 'Click "Add Program" to create an outreach, sports event, or awareness summit that will be stored in Supabase and displayed publicly.'
                  : 'Try clearing your search query or filter tab to view all programs.'}
              </p>
              {programs.length === 0 && (
                <button
                  type="button"
                  onClick={openAddProgram}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#13231f] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#1f3a33] shadow"
                >
                  <Plus className="h-4 w-4 text-[#c9ec63]" />
                  Add First Program
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="group rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-stone-900 overflow-hidden">
                      {prog.mainImage ? (
                        <img
                          src={prog.mainImage}
                          alt={prog.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-stone-400 bg-stone-100">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-[11px] font-mono">No photo uploaded</span>
                        </div>
                      )}
                      <span
                        className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          prog.status === 'past'
                            ? 'bg-stone-900/90 text-white'
                            : 'bg-[#c9ec63] text-[#13231f]'
                        }`}
                      >
                        {prog.status === 'past' ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                        <span className="font-bold text-emerald-800 uppercase">{prog.category}</span>
                        <span>{prog.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 line-clamp-2">
                        {prog.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {prog.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-1">
                        <MapPin className="h-3 w-3 text-[#52720e] shrink-0" />
                        <span className="truncate">{prog.location || `${prog.state}, Nigeria`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-stone-400 font-mono">
                      State: <strong>{prog.state}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditProgram(prog)}
                        className="rounded-lg border border-stone-200 bg-white p-1.5 text-stone-600 hover:text-stone-900 hover:border-stone-400"
                        title="Edit program"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProgram(prog)}
                        className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                        title="Delete program"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 0: NATIONAL EXECUTIVE DIRECTORS (NATIONAL LEADERSHIP) */}
        <div id="national-directors" className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-emerald-800">
                National Executive Governance &bull; CAC RN: 8390984
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                National Executive Directorate
              </h2>
              <p className="text-xs text-stone-500">
                Manage National Directors and Executive Council officers with statutory position titles, contact numbers, and assigned states.
              </p>
            </div>
            <button
              onClick={openAddNationalLeader}
              className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <Users className="h-4 w-4 text-[#c9ec63]" />
              Add National Director
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nationalExecutiveLeaders.length === 0 ? (
              <div className="col-span-full py-10 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                No national leadership members recorded yet. Click &ldquo;Add National Director&rdquo; above.
              </div>
            ) : (
              nationalExecutiveLeaders.map((leader) => (
                <div key={leader.id} className="rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden flex flex-col justify-between shadow-xs">
                  <div className="p-4 flex items-start gap-3">
                    <div className="h-16 w-16 rounded-xl bg-[#13231f] flex-shrink-0 overflow-hidden border border-stone-200">
                      {leader.image ? (
                        <img src={leader.image} alt={leader.name} className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-bold text-white text-base">
                          {leader.initials}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {leader.positionNumber && (
                          <span className="font-mono text-[10px] font-bold bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                            #{leader.positionNumber}
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {leader.body || 'Executive'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 mt-1 truncate">{leader.name}</h4>
                      <p className="text-xs font-semibold text-emerald-900 leading-tight mt-0.5">{leader.role}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-stone-500">
                        {leader.state && <span>📍 {leader.state}</span>}
                        {leader.phone ? (
                          <a
                            href={`tel:${leader.phone.replace(/[^\d+]/g, '')}`}
                            className="inline-flex items-center gap-1 hover:text-emerald-800"
                          >
                            <Phone className="h-3 w-3" />
                            Phone: {leader.phone}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Phone: Not added
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-white border-t border-stone-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditNationalLeader(leader)}
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1 text-xs font-bold text-stone-700 hover:bg-stone-50"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNationalLeader(leader)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 1: APPOINTED STATE DIRECTORS (NATIONAL ONLY CAN ADD!) */}
        <div id="state-directors" className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-blue-800">
                Statutory State Leadership
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                Appointed State Directors Directory
              </h2>
              <p className="text-xs text-stone-500">
                Only the National Director has constitutional authority to appoint or replace State Directors.
              </p>
            </div>
            <button
              onClick={() => setShowAddDirectorModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <UserPlus className="h-4 w-4 text-[#c9ec63]" />
              Appoint New State Director
            </button>
          </div>

          {/* Filter Bar */}
          <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase font-mono">Filter by State:</span>
              <select
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-stone-50 outline-none focus:border-[#13231f]"
              >
                <option value="All">All 36 States + FCT ({directors.length})</option>
                {NIGERIA_STATES.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-stone-500 font-mono">
              Showing <strong>{filteredDirectors.length}</strong> of {directors.length} directors
            </div>
          </div>

          {/* Directors Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-mono uppercase text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Director</th>
                  <th className="py-3 px-4">Assigned State</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4 text-center">Staff Count</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredDirectors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-stone-500">
                      No state directors have been appointed yet.
                    </td>
                  </tr>
                ) : filteredDirectors.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-4 px-4 font-bold text-stone-900">
                      <div className="flex items-center gap-3">
                        {d.avatarUrl ? (
                          <img src={d.avatarUrl} alt={d.name} className="h-9 w-9 rounded-full object-cover border border-stone-200" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-emerald-800 text-white font-mono font-bold flex items-center justify-center text-xs">
                            {d.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm text-stone-900">{d.name}</div>
                          <div className="text-[11px] font-semibold text-emerald-800">
                            {d.position || 'State Director'} {d.positionNumber ? `• Rank #${d.positionNumber}` : ''}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">Appointed: {d.appointedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-emerald-900">{d.state} State</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      <div>{d.email}</div>
                      <div className="text-stone-400">{d.phone || 'No phone set'}</div>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-stone-800">
                      {d.staffCount} officers
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        d.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${d.status === 'active' ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingDirector({ ...d })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider transition border border-blue-200/60"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingDirector(d)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider transition border border-red-200/60"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: REGISTERED STATE & LGA PERSONNEL */}
        <div id="lga-members" className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-emerald-800">
                Grassroots Field Network
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                Registered State &amp; LGA Personnel
              </h2>
              <p className="text-xs text-stone-500">
                Staff and volunteers enrolled across Nigeria by appointed State Directors.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search staff by name, LGA, or city..."
                value={searchMemberQuery}
                onChange={(e) => setSearchMemberQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f] w-full sm:w-72"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-mono uppercase text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role &amp; Assignment</th>
                  <th className="py-3 px-4">State &amp; LGA</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-stone-500">
                      No registered State &amp; LGA personnel yet.
                    </td>
                  </tr>
                ) : filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-4 px-4 font-bold text-stone-900">
                      <div className="text-sm">{staff.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono">Enrolled: {staff.joinedDate}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-emerald-900">
                      {staff.roleTitle || staff.memberType}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold">{staff.state} State</div>
                      <div className="text-[11px] text-stone-500">{staff.lga} &bull; {staff.city}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      <div>{staff.email}</div>
                      <div className="text-stone-400">{staff.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {staff.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: LIVE OPERATIONS FEED (ALL STATE ACTIVITIES ACROSS NIGERIA) */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-purple-800">
                Live Operations Surveillance
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                Nationwide Field Activities Feed
              </h2>
              <p className="text-xs text-stone-500">
                Real-time reports submitted by State Directors and LGA field teams.
              </p>
            </div>
            <Link
              href="/dashboard/chat?room=room-directors-executive"
              className="flex items-center gap-2 rounded-xl bg-[#00a884] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              <MessageSquare className="h-4 w-4" />
              Discuss in State Channels
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-6">No field activities reported yet.</p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                        {act.category}
                      </span>
                      <span className="font-bold text-stone-800 text-xs">
                        {act.state} State &bull; LGA: {act.lga} ({act.city})
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">&bull; {act.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900">{act.title}</h3>
                    <p className="text-xs text-stone-600 max-w-3xl">{act.notes}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {act.studentsReached !== undefined && (
                      <span className="font-mono text-xs bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                        <strong>{act.studentsReached}</strong> students
                      </span>
                    )}
                    {act.booksDistributed !== undefined && (
                      <span className="font-mono text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                        <strong>{act.booksDistributed}</strong> books
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                      <CheckCheck className="h-3 w-3 text-emerald-600" />
                      {act.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 4: NATIONAL DIRECTIVES & ACTION ITEMS */}
        <div id="national-directives" className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-purple-800">
                Command &amp; Policy Broadcasts
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                National Directives &amp; Action Items
              </h2>
              <p className="text-xs text-stone-500">
                Official operational orders issued to State Directors and chapters across Nigeria.
              </p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <Megaphone className="h-4 w-4 text-[#c9ec63]" />
              Issue New Directive
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {directives.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-6">No active directives issued yet.</p>
            ) : (
              directives.map((dir) => (
                <div
                  key={dir.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                        dir.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : dir.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {dir.priority} priority
                      </span>
                      <span className="text-xs text-stone-500 font-mono">Scope: {dir.targetScope}</span>
                    </div>
                    <span className="text-xs text-stone-400 font-mono">{dir.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{dir.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{dir.content}</p>
                  {dir.upcomingEventDate && (
                    <div className="text-[11px] font-mono text-emerald-800 font-semibold pt-1">
                      Target Execution Date: {dir.upcomingEventDate}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL: ADD / EDIT PROGRAM (DIRECTLY TO SUPABASE) ── */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-800">
                  Public Programs &bull; Database Sync
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {editingProgramId ? 'Edit Program Initiative' : 'Publish New Program to Database'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProgramModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Program Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Nationwide Secondary School Anti-Substance Campaign"
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={programForm.status}
                    onChange={(e) => setProgramForm({ ...programForm, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    <option value="past">Completed / Past</option>
                    <option value="upcoming">Upcoming / Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={programForm.category}
                    onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    {PROGRAM_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={programForm.date}
                    onChange={(e) => setProgramForm({ ...programForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State</label>
                  <select
                    value={programForm.state}
                    onChange={(e) => setProgramForm({ ...programForm, state: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    {NIGERIA_STATES.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Specific Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Government College Auditorium, Lagos"
                    value={programForm.location}
                    onChange={(e) => setProgramForm({ ...programForm, location: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
              </div>

              {/* Main Photo Upload with Canvas Optimization */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-emerald-800" />
                      Main Cover Photo
                    </span>
                    <p className="text-[11px] text-stone-500">Auto-compressed for fast database storage</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => mainProgramFileRef.current?.click()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-stone-300 hover:border-emerald-700 shadow-sm"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Image
                  </button>
                </div>
                <input
                  ref={mainProgramFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleMainProgramPhoto(f)
                  }}
                />
                {programForm.mainImage && (
                  <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-900">
                    <img src={programForm.mainImage} alt="Cover preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setProgramForm(prev => ({ ...prev, mainImage: '' }))}
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Photos */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-stone-700">Additional Gallery Photos (Optional)</span>
                  <button
                    type="button"
                    onClick={() => galleryProgramFileRef.current?.click()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Photos
                  </button>
                </div>
                <input
                  ref={galleryProgramFileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleGalleryProgramPhotos(e.target.files)}
                />
                {programForm.gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {programForm.gallery.map((img, idx) => (
                      <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-900">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProgramForm(prev => ({
                            ...prev,
                            gallery: prev.gallery.filter((_, i) => i !== idx)
                          }))}
                          className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail the objectives, beneficiaries, activities, and community impact..."
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Key Highlights (one per line)</label>
                <textarea
                  rows={3}
                  placeholder={'Over 600 students reached\nDistributed 1,200 anti-drug exercise books\nTrained 15 local teachers'}
                  value={programForm.highlights}
                  onChange={(e) => setProgramForm({ ...programForm, highlights: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Organizing Directorate</label>
                <input
                  type="text"
                  value={programForm.organizer}
                  onChange={(e) => setProgramForm({ ...programForm, organizer: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProgram || isCompressingProgramPhoto}
                  className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow disabled:opacity-50"
                >
                  {isSavingProgram
                    ? 'Publishing to Database...'
                    : isCompressingProgramPhoto
                    ? 'Optimizing Photos...'
                    : (editingProgramId ? 'Save Changes' : 'Publish Program to Database')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit National Leader */}
      {showNationalLeaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-800">
                  Statutory Power &bull; Executive Council
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {isEditingNationalLeader ? 'Edit National Director' : 'Add National Director'}
                </h3>
              </div>
              <button
                onClick={() => setShowNationalLeaderModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNationalLeader} className="mt-4 space-y-3.5 text-xs">
              {/* Photo Upload */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Portrait Photo (Optional)</label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-xl bg-stone-100 border border-stone-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {nationalLeaderForm.image ? (
                      <img src={nationalLeaderForm.image} alt="Preview" className="h-full w-full object-cover object-top" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-stone-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressingNationalPortrait}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setIsCompressingNationalPortrait(true)
                        void compressImageFile(file, 400, 400, 0.72)
                          .then((img) => setNationalLeaderForm(prev => ({ ...prev, image: img })))
                          .catch((err) => notify(err instanceof Error ? err.message : 'Photo processing error'))
                          .finally(() => setIsCompressingNationalPortrait(false))
                      }}
                      className="block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-[#13231f] file:px-2.5 file:py-1 file:text-xs file:font-bold file:text-white hover:file:bg-[#1d3730]"
                    />
                    {nationalLeaderForm.image && (
                      <button
                        type="button"
                        onClick={() => setNationalLeaderForm(prev => ({ ...prev, image: '' }))}
                        className="text-[11px] text-red-600 hover:underline mt-1 block"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name &amp; Titles <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Chief Steven Ahans"
                  value={nationalLeaderForm.name}
                  onChange={(e) => setNationalLeaderForm({ ...nationalLeaderForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              {/* Position / Role */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Position / Role Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Board Vice Chairman and National Director of Ethics and Disciplinary"
                  value={nationalLeaderForm.role}
                  onChange={(e) => setNationalLeaderForm({ ...nationalLeaderForm, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              {/* Phone and State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-stone-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="0803 000 0000"
                    value={nationalLeaderForm.phone || ''}
                    onChange={(e) => setNationalLeaderForm({ ...nationalLeaderForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-stone-500" />
                    State <span className="font-normal text-stone-500">(optional)</span>
                  </label>
                  <select
                    value={nationalLeaderForm.state || ''}
                    onChange={(e) => setNationalLeaderForm({ ...nationalLeaderForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]"
                  >
                    <option value="">-- National / None --</option>
                    {NIGERIA_STATES.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowNationalLeaderModal(false)}
                  className="flex-1 rounded-xl border border-stone-300 py-3 text-xs font-bold uppercase text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingNationalLeader || isCompressingNationalPortrait}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow disabled:opacity-50"
                >
                  {isSavingNationalLeader ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#c9ec63]" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 text-[#c9ec63]" />
                      {isEditingNationalLeader ? 'Save Changes' : 'Appoint National Leader'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Appoint State Director */}
      {showAddDirectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-800">
                  Statutory Power &bull; Executive Directorate
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  Appoint State Director
                </h3>
              </div>
              <button
                onClick={() => setShowAddDirectorModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {directorCreationError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {directorCreationError}
              </div>
            )}

            <form onSubmit={handleAddDirector} className="mt-4 space-y-3.5 text-xs">
              {/* Photo Upload */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Director Portrait (Optional)</label>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-stone-100 border border-stone-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {newDirector.avatarUrl ? (
                      <img src={newDirector.avatarUrl} alt="Preview" className="h-full w-full object-cover object-top" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-stone-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressingDirectorPhoto}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setIsCompressingDirectorPhoto(true)
                        void compressImageFile(file, 400, 400, 0.75)
                          .then((img) => setNewDirector(prev => ({ ...prev, avatarUrl: img })))
                          .catch((err) => notify(err instanceof Error ? err.message : 'Photo processing error'))
                          .finally(() => setIsCompressingDirectorPhoto(false))
                      }}
                      className="block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-[#13231f] file:px-2.5 file:py-1 file:text-xs file:font-bold file:text-white hover:file:bg-[#1d3730]"
                    />
                    {newDirector.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setNewDirector(prev => ({ ...prev, avatarUrl: '' }))}
                        className="text-[11px] text-red-600 hover:underline mt-0.5 block"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name &amp; Title <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Amb EFe Gold Anthony"
                  value={newDirector.name}
                  onChange={(e) => setNewDirector({ ...newDirector, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Position / Role Title <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Delta State Director, or Publicity Secretary and State Director"
                  value={newDirector.position}
                  onChange={(e) => setNewDirector({ ...newDirector, position: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input
                  required
                  type="tel"
                  placeholder="0803 000 0000"
                  value={newDirector.phone}
                  onChange={(e) => setNewDirector({ ...newDirector, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Assigned Nigerian State <span className="text-red-500">*</span></label>
                <select
                  value={newDirector.state}
                  onChange={(e) => {
                    const stateName = e.target.value
                    const st = NIGERIA_STATES.find(s => s.name === stateName)
                    setNewDirector({
                      ...newDirector,
                      state: stateName,
                      lga: st?.lgas[0] || '',
                      city: `${stateName} Central`
                    })
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                >
                  {NIGERIA_STATES.map((s) => (
                    <option key={s.name} value={s.name} className="text-stone-900 bg-white">{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreatingDirector || isCompressingDirectorPhoto}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4 text-[#c9ec63]" />
                  {isCreatingDirector ? 'Saving Appointment...' : 'Issue Appointment & Authorize Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Created Credentials Notice */}
      {createdCredentialsNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">Appointment Saved</h3>
                <p className="text-xs text-stone-500">Provide these portal login details to the new State Director.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs font-mono">
              <div><strong>Name:</strong> {createdCredentialsNotice.name}</div>
              <div><strong>State:</strong> {createdCredentialsNotice.state}</div>
              <div><strong>Email:</strong> {createdCredentialsNotice.email}</div>
              <div><strong>Password:</strong> {createdCredentialsNotice.password}</div>
            </div>

            <button
              onClick={() => setCreatedCredentialsNotice(null)}
              className="w-full rounded-xl bg-[#13231f] text-white py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#1d3730] transition shadow"
            >
              Done &amp; Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Modal: Edit State Director */}
      {editingDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">Edit State Director Record</h3>
              <button onClick={() => setEditingDirector(null)} className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleEditDirector} className="mt-4 space-y-3.5 text-xs">
              {/* Photo Upload */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Director Portrait (Optional)</label>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-stone-100 border border-stone-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {editingDirector.avatarUrl ? (
                      <img src={editingDirector.avatarUrl} alt="Preview" className="h-full w-full object-cover object-top" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-stone-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressingEditDirectorPhoto}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setIsCompressingEditDirectorPhoto(true)
                        void compressImageFile(file, 400, 400, 0.75)
                          .then((img) => setEditingDirector(prev => prev ? { ...prev, avatarUrl: img } : prev))
                          .catch((err) => notify(err instanceof Error ? err.message : 'Photo processing error'))
                          .finally(() => setIsCompressingEditDirectorPhoto(false))
                      }}
                      className="block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-[#13231f] file:px-2.5 file:py-1 file:text-xs file:font-bold file:text-white hover:file:bg-[#1d3730]"
                    />
                    {editingDirector.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingDirector(prev => prev ? { ...prev, avatarUrl: undefined } : prev)}
                        className="text-[11px] text-red-600 hover:underline mt-0.5 block"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Director Name</label>
                <input
                  required
                  type="text"
                  value={editingDirector.name}
                  onChange={(e) => setEditingDirector({ ...editingDirector, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Position / Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. State Director"
                    value={editingDirector.position || ''}
                    onChange={(e) => setEditingDirector({ ...editingDirector, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                    <Hash className="h-3 w-3 text-stone-500" />
                    Rank No.
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 1, 2..."
                    value={editingDirector.positionNumber ?? ''}
                    onChange={(e) => setEditingDirector({
                      ...editingDirector,
                      positionNumber: e.target.value ? Number(e.target.value) : undefined
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingDirector.phone}
                    onChange={(e) => setEditingDirector({ ...editingDirector, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={editingDirector.status}
                    onChange={(e) => setEditingDirector({ ...editingDirector, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="vacant">Vacant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Assigned State</label>
                <select
                  value={editingDirector.state}
                  onChange={(e) => setEditingDirector({ ...editingDirector, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                >
                  {NIGERIA_STATES.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setEditingDirector(null)} className="flex-1 rounded-xl border border-stone-300 text-stone-700 py-3 text-xs font-bold uppercase tracking-wider hover:bg-stone-50">Cancel</button>
                <button type="submit" disabled={isCompressingEditDirectorPhoto} className="flex-1 rounded-xl bg-[#13231f] text-white py-3 text-xs font-bold uppercase tracking-wider shadow">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Director Confirmation */}
      {deletingDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Remove State Director?</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to remove <strong>{deletingDirector.name}</strong> as director for <strong>{deletingDirector.state}</strong>?
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeletingDirector(null)} className="flex-1 rounded-xl border border-stone-300 text-stone-700 py-2.5 text-xs font-bold uppercase">Cancel</button>
              <button onClick={handleDeleteDirector} className="flex-1 rounded-xl bg-red-600 text-white py-2.5 text-xs font-bold uppercase shadow">Remove Director</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Broadcast Directive */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-800">
                  National Directive Broadcast
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  Broadcast to All 36 States &amp; Members
                </h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastDirective} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Directive Order / Broadcast Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Mandatory Q4 School Outreach Reporting Order"
                  value={newDirective.title}
                  onChange={(e) => setNewDirective({ ...newDirective, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Directives are internal policy orders for State Directors. To publish public website programs, use &ldquo;Add Program&rdquo; instead.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Priority Level</label>
                  <select
                    value={newDirective.priority}
                    onChange={(e) => setNewDirective({ ...newDirective, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Action</option>
                    <option value="standard">Standard Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Target Execution Date</label>
                  <input
                    type="date"
                    value={newDirective.upcomingEventDate}
                    onChange={(e) => setNewDirective({ ...newDirective, upcomingEventDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Directive Instructions *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed instructions to State Directors and LGA coordinators..."
                  value={newDirective.content}
                  onChange={(e) => setNewDirective({ ...newDirective, content: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow disabled:opacity-50"
                >
                  <Megaphone className="h-4 w-4 text-[#c9ec63]" />
                  {isBroadcasting ? 'Broadcasting Directive...' : 'Broadcast Immediately'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
