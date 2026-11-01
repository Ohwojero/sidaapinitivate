'use client'

import { useState, useEffect } from 'react'
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
import { registerUser } from '@/lib/auth/session'
import { fetchDirectors, addDirector, updateDirector, deleteDirector, fetchStaff, fetchActivities, addDirective } from '@/lib/supabase/portal'
import { NIGERIA_STATES } from '@/lib/data/nigeria-data'
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
  AlertTriangle
} from 'lucide-react'

export default function NationalDirectorDashboard() {
  const [directors, setDirectors] = useState<StateDirector[]>(INITIAL_STATE_DIRECTORS)
  const [staffList, setStaffList] = useState<StateStaffMember[]>(INITIAL_STAFF_MEMBERS)
  const [directives, setDirectives] = useState<NationalDirective[]>(INITIAL_NATIONAL_DIRECTIVES)
  const [activities, setActivities] = useState<StateActivity[]>(INITIAL_STATE_ACTIVITIES)
  
  const [selectedStateFilter, setSelectedStateFilter] = useState('All')
  const [searchMemberQuery, setSearchMemberQuery] = useState('')

  // Modals
  const [showAddDirectorModal, setShowAddDirectorModal] = useState(false)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [editingDirector, setEditingDirector] = useState<StateDirector | null>(null)
  const [deletingDirector, setDeletingDirector] = useState<StateDirector | null>(null)
  const [createdCredentialsNotice, setCreatedCredentialsNotice] = useState<{
    name: string
    email: string
    password: string
    state: string
  } | null>(null)

  // Load persistent directors and staff on mount
  useEffect(() => {
    fetchDirectors().then(setDirectors)
    fetchStaff().then(setStaffList)
    fetchActivities().then(setActivities)
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
    avatarUrl: ''
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

  // Add State Director Handler
  const handleAddDirector = (e: React.FormEvent) => {
    e.preventDefault()
    const password = newDirector.password || 'sidaap2026'
    const created: StateDirector = {
      id: `dir-${Date.now()}`,
      name: newDirector.name,
      email: newDirector.email,
      phone: newDirector.phone,
      state: newDirector.state,
      lga: newDirector.lga || availableDirectorLgas[0] || 'Central LGA',
      city: newDirector.city || `${newDirector.state} Central`,
      appointedDate: 'Today',
      status: 'active',
      staffCount: 0,
      facilitiesCount: 0,
      outreachCount: 0,
      avatarUrl: newDirector.avatarUrl || undefined
    }
    setDirectors(prev => [created, ...prev])

    const newUser = {
      id: `user-${created.id}`,
      name: created.name,
      email: created.email,
      password: password,
      role: 'state_director' as const,
      state: created.state,
      lga: created.lga,
      city: created.city,
      title: `${created.state} State Director`,
      avatarInitials: created.name.split(' ').map(n => n[0]).join('').slice(0, 2),
      avatarUrl: created.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80'
    }
    addDirector(created, newUser)

    // Show credential notification
    setCreatedCredentialsNotice({
      name: created.name,
      email: created.email,
      password: password,
      state: created.state
    })

    setShowAddDirectorModal(false)
    setNewDirector({ name: '', email: '', password: 'sidaap2026', phone: '', state: 'Katsina', lga: '', city: '', avatarUrl: '' })
  }

  // Edit Director Handler
  const handleEditDirector = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDirector) return
    setDirectors(prev => prev.map(d => d.id === editingDirector.id ? editingDirector : d))
    updateDirector(editingDirector)
    setEditingDirector(null)
  }

  // Delete Director Handler
  const handleDeleteDirector = () => {
    if (!deletingDirector) return
    setDirectors(prev => prev.filter(d => d.id !== deletingDirector.id))
    deleteDirector(deletingDirector.id, deletingDirector.email)
    setDeletingDirector(null)
  }

  // Broadcast Directive Handler
  const handleBroadcastDirective = (e: React.FormEvent) => {
    e.preventDefault()
    const createdDir: NationalDirective = {
      id: `dir-${Date.now()}`,
      title: newDirective.title,
      issuedBy: 'Dr. Friday Chalele (National Trustee / Executive Directorate)',
      date: 'Just now',
      priority: newDirective.priority,
      content: newDirective.content,
      targetScope: newDirective.targetScope,
      upcomingEventDate: newDirective.upcomingEventDate || undefined
    }
    setDirectives(prev => [createdDir, ...prev])
    addDirective(createdDir)
    setShowBroadcastModal(false)
    setNewDirective({ title: '', priority: 'high', content: '', targetScope: 'All 36 States + Abuja FCT', upcomingEventDate: '' })
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

  return (
    <div className="bg-[#f5f1e9] min-h-screen pb-20">
      {/* National Banner */}
      <div className="bg-[#13231f] text-white px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c9ec63] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63] font-bold">
                National Executive Directorate &bull; Abuja HQ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              National Affairs &amp; State Oversight Command
            </h1>
            <p className="text-xs text-[#b6c4b9]">
              Logged in as <strong>Dr. Friday Chalele (National Trustee)</strong> &bull; Full administrative jurisdiction over 36 States + FCT.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition border border-white/15"
            >
              <Megaphone className="h-4 w-4 text-[#c9ec63]" />
              Broadcast Directive
            </button>
            <button
              onClick={() => setShowAddDirectorModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <PlusCircle className="h-4 w-4" />
              Appoint State Director
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* National Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              State Directors Appointed
            </span>
            <div className="text-3xl font-black text-stone-900 font-mono mt-1">
              {directors.length} / 37
            </div>
            <p className="text-xs text-stone-500 mt-1">36 States + Abuja FCT</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              Total Enrolled LGA Staff
            </span>
            <div className="text-3xl font-black text-emerald-800 font-mono mt-1">
              {staffList.length} Active
            </div>
            <p className="text-xs text-stone-500 mt-1">Added by State Directors</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              National Field Outreaches
            </span>
            <div className="text-3xl font-black text-blue-900 font-mono mt-1">
              {activities.length} Events
            </div>
            <p className="text-xs text-stone-500 mt-1">Live from all Nigerian states</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              Active National Directives
            </span>
            <div className="text-3xl font-black text-purple-900 font-mono mt-1">
              {directives.length} Issued
            </div>
            <p className="text-xs text-stone-500 mt-1">Broadcast to all state chapters</p>
          </div>
        </div>

        {/* SECTION 1: APPOINTED STATE DIRECTORS (NATIONAL ONLY CAN ADD!) */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-blue-800">
                Statutory State Leadership
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                Appointed State Directors Directory
              </h2>
              <p className="text-xs text-stone-500">
                You have exclusive statutory authority to commission and assign State Directors across Nigeria.
              </p>
            </div>

            <button
              onClick={() => setShowAddDirectorModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <PlusCircle className="h-4 w-4 text-[#c9ec63]" />
              Appoint New State Director
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-[11px] font-mono uppercase text-stone-500 border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">State &bull; LGA Headquarters</th>
                  <th className="py-3 px-4">State Director</th>
                  <th className="py-3 px-4">Official Contact</th>
                  <th className="py-3 px-4">Local Members &bull; Staff</th>
                  <th className="py-3 px-4">Outreaches</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDirectors.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-4 px-4 font-bold text-stone-900">
                      <div className="flex items-center gap-1.5 text-emerald-800">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{d.state}</span>
                      </div>
                      <span className="text-[11px] font-normal text-stone-500 block pl-5">
                        {d.lga} &bull; {d.city}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        {d.avatarUrl ? (
                          <img src={d.avatarUrl} alt={d.name} className="h-9 w-9 rounded-xl object-cover ring-1 ring-stone-200 shrink-0" />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#c9ec63] to-[#8c9d39] text-[#13231f] flex items-center justify-center font-black text-sm shrink-0">
                            {d.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-stone-900">{d.name}</div>
                          <span className="text-[10px] text-stone-400 font-mono">Appointed: {d.appointedDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      <div>{d.phone}</div>
                      <div className="text-stone-400">{d.email}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-stone-800">
                      {d.staffCount} local officers
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-stone-800">
                      {d.outreachCount} events
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/chat?state=${encodeURIComponent(d.state)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#c9ec63] text-emerald-800 hover:text-[#13231f] text-[11px] font-bold uppercase tracking-wider transition border border-emerald-200/60 shadow-sm"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Chat</span>
                        </Link>
                        <button
                          onClick={() => setEditingDirector({ ...d })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider transition border border-blue-200/60"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingDirector(d)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider transition border border-red-200/60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: MASTER LOCAL STAFF & MEMBERS REGISTRY (NATIONAL SEES ALL!) */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-amber-800">
                National Register of 774 LGAs
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                All Local Staff &amp; Members Across States
              </h2>
              <p className="text-xs text-stone-500">
                Whenever any State Director adds a staff member or local volunteer, they appear here instantly.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter by name, LGA, or city..."
                  value={searchMemberQuery}
                  onChange={(e) => setSearchMemberQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <select
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white outline-none"
              >
                <option value="All" className="text-stone-900 bg-white">All States (36 + FCT)</option>
                {NIGERIA_STATES.map((s) => (
                  <option key={s.code} value={s.name} className="text-stone-900 bg-white">{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-[11px] font-mono uppercase text-stone-500 border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">State &bull; LGA</th>
                  <th className="py-3 px-4">City / Town</th>
                  <th className="py-3 px-4">Role Title</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Reporting State Director</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-4 px-4 font-bold text-stone-900">
                      {staff.name}
                      <span className="text-[10px] text-stone-400 block font-mono">Enrolled: {staff.joinedDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-stone-800">{staff.state}</span>
                      <span className="text-stone-500 block text-[11px]">LGA: <strong>{staff.lga}</strong></span>
                    </td>
                    <td className="py-4 px-4 font-medium text-stone-700">
                      {staff.city}
                    </td>
                    <td className="py-4 px-4">
                      <span className="rounded-lg bg-stone-100 text-stone-800 px-2.5 py-1 text-[11px] font-bold">
                        {staff.roleTitle}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      {staff.phone}
                    </td>
                    <td className="py-4 px-4 text-stone-700">
                      {staff.assignedDirector}
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
            {activities.map((act) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Appoint State Director */}
      {showAddDirectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-blue-800">
                  National Executive Directorate
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  Appoint &amp; Commission State Director
                </h3>
              </div>
              <button
                onClick={() => setShowAddDirectorModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDirector} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">State Assignment</label>
                <select
                  required
                  value={newDirector.state}
                  onChange={(e) => setNewDirector({ ...newDirector, state: e.target.value, lga: '' })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                >
                  {NIGERIA_STATES.map((s) => (
                    <option key={s.code} value={s.name} className="text-stone-900 bg-white">{s.name} ({s.zone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Profile Photo</label>
                <div className="flex items-center gap-3">
                  {newDirector.avatarUrl ? (
                    <img src={newDirector.avatarUrl} alt="preview" className="h-14 w-14 rounded-xl object-cover ring-1 ring-stone-200 shrink-0" />
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-400 text-xs shrink-0">Photo</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = ev => setNewDirector(prev => ({ ...prev, avatarUrl: ev.target?.result as string }))
                      reader.readAsDataURL(file)
                    }}
                    className="text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Director Full Legal Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Aliyu Usman"
                  value={newDirector.name}
                  onChange={(e) => setNewDirector({ ...newDirector, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State Secretariat LGA</label>
                  <select
                    value={newDirector.lga}
                    onChange={(e) => setNewDirector({ ...newDirector, lga: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    <option value="" className="text-stone-500 bg-white">Select Headquarters LGA</option>
                    {availableDirectorLgas.map((lga) => (
                      <option key={lga} value={lga} className="text-stone-900 bg-white">{lga}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City / Town</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Katsina Central"
                    value={newDirector.city}
                    onChange={(e) => setNewDirector({ ...newDirector, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Official Telephone</label>
                  <input
                    required
                    type="tel"
                    placeholder="080..."
                    value={newDirector.phone}
                    onChange={(e) => setNewDirector({ ...newDirector, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Official Email</label>
                  <input
                    required
                    type="email"
                    placeholder="state.dir@sidaap.org"
                    value={newDirector.email}
                    onChange={(e) => setNewDirector({ ...newDirector, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Director Portal Login Password
                  <span className="text-[10px] font-normal text-stone-500 ml-1.5">(Default: sidaap2026)</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <input
                    required
                    type="text"
                    placeholder="sidaap2026"
                    value={newDirector.password}
                    onChange={(e) => setNewDirector({ ...newDirector, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  The appointed State Director will use this email and password to log in at the portal.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  <ShieldCheck className="h-4 w-4 text-[#c9ec63]" />
                  Issue Statutory Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Appointment Credentials Generated */}
      {createdCredentialsNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>

            <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Statutory Commission Successful
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-1">
              State Director Appointed!
            </h3>
            <p className="text-xs text-stone-600 mt-2">
              <strong>{createdCredentialsNotice.name}</strong> has been commissioned for <strong>{createdCredentialsNotice.state} State</strong>. Share the login credentials below:
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2.5">
              <div>
                <span className="block text-[10px] font-mono uppercase text-stone-400 font-bold">Portal Login URL</span>
                <span className="text-xs font-mono font-bold text-stone-900">/portal/login</span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="block text-[10px] font-mono uppercase text-stone-400 font-bold">Authorized Email</span>
                <span className="text-xs font-mono font-bold text-emerald-800">{createdCredentialsNotice.email}</span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="block text-[10px] font-mono uppercase text-stone-400 font-bold">Password / Passcode</span>
                <span className="text-xs font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block">{createdCredentialsNotice.password}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setCreatedCredentialsNotice(null)}
                className="w-full rounded-xl bg-[#13231f] text-white py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#1d3730] transition shadow"
              >
                Close &amp; Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Director */}
      {editingDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-blue-800">Edit State Director</span>
                <h3 className="text-lg font-bold text-stone-900">Update Director Record</h3>
              </div>
              <button onClick={() => setEditingDirector(null)} className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleEditDirector} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Profile Photo</label>
                <div className="flex items-center gap-3">
                  {editingDirector.avatarUrl ? (
                    <img src={editingDirector.avatarUrl} alt="preview" className="h-14 w-14 rounded-xl object-cover ring-1 ring-stone-200 shrink-0" />
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-400 text-xs shrink-0">Photo</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = ev => setEditingDirector(prev => prev ? { ...prev, avatarUrl: ev.target?.result as string } : prev)
                      reader.readAsDataURL(file)
                    }}
                    className="text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <input required type="text" value={editingDirector.name}
                  onChange={e => setEditingDirector({ ...editingDirector, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone</label>
                  <input type="tel" value={editingDirector.phone}
                    onChange={e => setEditingDirector({ ...editingDirector, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City / Town</label>
                  <input type="text" value={editingDirector.city}
                    onChange={e => setEditingDirector({ ...editingDirector, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">LGA</label>
                  <input type="text" value={editingDirector.lga}
                    onChange={e => setEditingDirector({ ...editingDirector, lga: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select value={editingDirector.status}
                    onChange={e => setEditingDirector({ ...editingDirector, status: e.target.value as StateDirector['status'] })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]">
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="vacant">Vacant</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Email</label>
                <input required type="email" value={editingDirector.email}
                  onChange={e => setEditingDirector({ ...editingDirector, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setEditingDirector(null)}
                  className="flex-1 rounded-xl border border-stone-300 text-stone-700 py-3 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow">
                  <Pencil className="h-4 w-4 text-[#c9ec63]" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Director Confirmation */}
      {deletingDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 text-center">
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Remove State Director?</h3>
            <p className="text-xs text-stone-600 mt-2">
              You are about to permanently remove <strong>{deletingDirector.name}</strong> ({deletingDirector.state} State) from the portal. Their login access will also be revoked.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeletingDirector(null)}
                className="flex-1 rounded-xl border border-stone-300 text-stone-700 py-3 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition">
                Cancel
              </button>
              <button onClick={handleDeleteDirector}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow">
                Yes, Remove Director
              </button>
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
                <label className="block font-bold text-stone-700 mb-1">Directive / Activity Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Q4 Secondary School Drug Awareness Summit"
                  value={newDirective.title}
                  onChange={(e) => setNewDirective({ ...newDirective, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Priority Level</label>
                  <select
                    value={newDirective.priority}
                    onChange={(e) => setNewDirective({ ...newDirective, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    <option value="high" className="text-stone-900 bg-white">High Priority</option>
                    <option value="urgent" className="text-stone-900 bg-white">Urgent Action</option>
                    <option value="standard" className="text-stone-900 bg-white">Standard Notice</option>
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
                <label className="block font-bold text-stone-700 mb-1">Directive Instructions</label>
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
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  <Megaphone className="h-4 w-4 text-[#c9ec63]" />
                  Broadcast Immediately
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
