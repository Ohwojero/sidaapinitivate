'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  INITIAL_STAFF_MEMBERS,
  INITIAL_NATIONAL_DIRECTIVES,
  INITIAL_STATE_ACTIVITIES,
  StateStaffMember,
  NationalDirective,
  StateActivity,
  getStoredStaff,
  getStoredActivities
} from '@/lib/data/portal-data'
import { getStoredUser, registerUser } from '@/lib/auth/session'
import { fetchStaff, addStaffMember, updateStaffMember, deleteStaffMember, fetchActivities, addActivity, fetchDirectives } from '@/lib/supabase/portal'
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
  UserPlus,
  Send,
  Lock,
  KeyRound,
  Pencil,
  Trash2,
  AlertTriangle
} from 'lucide-react'

export default function StateDirectorDashboard() {
  // Scoped State (dynamically set from logged-in user or defaults)
  const [activeState, setActiveState] = useState<string>('Lagos')
  const [directorName, setDirectorName] = useState<string>('Engr. Babatunde Sanusi')
  const [directorLga, setDirectorLga] = useState<string>('Ikeja')
  const [directorCity, setDirectorCity] = useState<string>('Ikeja Central')

  const [staffList, setStaffList] = useState<StateStaffMember[]>(INITIAL_STAFF_MEMBERS)
  const [directives, setDirectives] = useState<NationalDirective[]>(INITIAL_NATIONAL_DIRECTIVES)
  const [activities, setActivities] = useState<StateActivity[]>(INITIAL_STATE_ACTIVITIES)

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [showLogActivityModal, setShowLogActivityModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StateStaffMember | null>(null)
  const [deletingStaff, setDeletingStaff] = useState<StateStaffMember | null>(null)
  const [lastStaffCredentials, setLastStaffCredentials] = useState<{
    name: string
    email: string
    password: string
    state: string
    lga: string
    roleTitle: string
  } | null>(null)

  // Sync state director session and persistent data on mount
  useEffect(() => {
    const user = getStoredUser()
    if (user && (user.role === 'state_director' || user.role === 'national_director')) {
      setActiveState(user.state || 'Lagos')
      setDirectorName(user.name)
      setDirectorLga(user.lga || 'Central')
      setDirectorCity(user.city || `${user.state} HQ`)
    }
    fetchStaff().then(setStaffList)
    fetchActivities().then(setActivities)
    fetchDirectives().then(dirs => { if (dirs.length > 0) setDirectives(dirs) })
  }, [])

  // Add Staff / Local Member Form State
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: 'sidaap2026',
    phone: '',
    lga: '',
    city: '',
    roleTitle: 'Field Officer' as StateStaffMember['roleTitle']
  })

  // Log Field Activity Form State
  const [newActivity, setNewActivity] = useState({
    title: '',
    lga: '',
    city: '',
    category: 'School Outreach' as StateActivity['category'],
    studentsReached: 300,
    booksDistributed: 250,
    notes: ''
  })

  // State LGAs
  const currentLgas = useMemo(() => {
    const stateObj = NIGERIA_STATES.find(s => s.name === activeState)
    return stateObj ? stateObj.lgas : []
  }, [activeState])

  // Filtered to this state
  const stateStaff = staffList.filter(s => s.state === activeState)
  const stateActivities = activities.filter(a => a.state === activeState)

  // Edit Staff Handler
  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStaff) return
    setStaffList(prev => prev.map(s => s.id === editingStaff.id ? editingStaff : s))
    updateStaffMember(editingStaff)
    setEditingStaff(null)
  }

  // Delete Staff Handler
  const handleDeleteStaff = () => {
    if (!deletingStaff) return
    setStaffList(prev => prev.filter(s => s.id !== deletingStaff.id))
    deleteStaffMember(deletingStaff.id, deletingStaff.email)
    setDeletingStaff(null)
  }

  // Add Staff Member Handler
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    const password = newStaff.password || 'sidaap2026'
    const created: StateStaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      state: activeState,
      lga: newStaff.lga || currentLgas[0] || 'Central LGA',
      city: newStaff.city || `${activeState} Urban`,
      roleTitle: newStaff.roleTitle,
      joinedDate: 'Today',
      assignedDirector: `${directorName} (${activeState} State Director)`,
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
    }
    setStaffList(prev => [created, ...prev])

    const newUser = {
      id: `user-${created.id}`,
      name: created.name,
      email: created.email,
      password: password,
      role: 'member' as const,
      state: activeState,
      lga: created.lga,
      city: created.city,
      title: created.roleTitle,
      avatarInitials: created.name.split(' ').map(n => n[0]).join('').slice(0, 2),
      avatarUrl: created.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
    }
    addStaffMember(created, newUser)

    setLastStaffCredentials({
      name: created.name,
      email: created.email,
      password: password,
      state: activeState,
      lga: created.lga,
      roleTitle: created.roleTitle
    })

    setShowAddStaffModal(false)
    setNewStaff({ name: '', email: '', password: 'sidaap2026', phone: '', lga: '', city: '', roleTitle: 'Field Officer' })
  }

  // Log Activity Handler
  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault()
    const created: StateActivity = {
      id: `act-${Date.now()}`,
      title: newActivity.title,
      state: activeState,
      lga: newActivity.lga || currentLgas[0] || 'Central LGA',
      city: newActivity.city || `${activeState} Area`,
      category: newActivity.category,
      date: 'Today',
      reportedBy: `${activeState} Directorate (${directorName})`,
      studentsReached: Number(newActivity.studentsReached) || 0,
      booksDistributed: Number(newActivity.booksDistributed) || 0,
      status: 'Approved by State',
      notes: newActivity.notes
    }
    setActivities(prev => [created, ...prev])
    addActivity(created)
    setShowLogActivityModal(false)
    setNewActivity({ title: '', lga: '', city: '', category: 'School Outreach', studentsReached: 300, booksDistributed: 250, notes: '' })
  }

  return (
    <div className="bg-[#f5f1e9] min-h-screen pb-20">
      {/* State Header Banner */}
      <div className="bg-[#13231f] text-white px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-amber-300 font-bold">
                State Directorate Authority &bull; {activeState} State Command
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              {activeState} State Operations &amp; LGA Council
            </h1>
            <p className="text-xs text-[#b6c4b9]">
              State Director: <strong>{directorName}</strong> &bull; Secretariat: {directorLga} LGA ({directorCity}) &bull; Reporting to National HQ, Abuja.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogActivityModal(true)}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition border border-white/15"
            >
              <Activity className="h-4 w-4 text-[#c9ec63]" />
              Log Field Activity
            </button>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <UserPlus className="h-4 w-4" />
              Add Local LGA Member
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* State Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              Active State Staff &amp; Members
            </span>
            <div className="text-3xl font-black text-stone-900 font-mono mt-1">
              {stateStaff.length} Officers
            </div>
            <p className="text-xs text-stone-500 mt-1">Across {activeState} LGAs</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              State Field Outreaches
            </span>
            <div className="text-3xl font-black text-emerald-800 font-mono mt-1">
              {stateActivities.length} Events
            </div>
            <p className="text-xs text-stone-500 mt-1">Transmitted to National HQ</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              State LGAs Covered
            </span>
            <div className="text-3xl font-black text-amber-800 font-mono mt-1">
              {currentLgas.length} LGAs
            </div>
            <p className="text-xs text-stone-500 mt-1">Local Council jurisdictions</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">
              National Directives Received
            </span>
            <div className="text-3xl font-black text-purple-900 font-mono mt-1">
              {directives.length} Directives
            </div>
            <p className="text-xs text-stone-500 mt-1">Issued by National Secretariat</p>
          </div>
        </div>

        {/* SECTION 1: WHAT NATIONAL DIRECTOR SAYS (NATIONAL DIRECTIVES RECEIVED) */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-emerald-700" />
                <span className="font-mono text-xs uppercase font-bold text-emerald-800">
                  National Secretariat Directives
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                Directives &amp; Activities from National Headquarters
              </h2>
              <p className="text-xs text-stone-500">
                Official instructions from National Executive Trustees. As State Director, lead your LGAs to execute these directives.
              </p>
            </div>

            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-800 hover:text-emerald-950 underline"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Discuss with National Executive
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {directives.map((dir) => (
              <div
                key={dir.id}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                      {dir.priority} Priority
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">{dir.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 leading-snug">{dir.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{dir.content}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] space-y-1">
                  <div className="text-stone-500">
                    <strong className="text-stone-700">Issued by:</strong> {dir.issuedBy}
                  </div>
                  {dir.upcomingEventDate && (
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-mono">
                      <Calendar className="h-3 w-3" />
                      <span>Execute By: {dir.upcomingEventDate}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: STATE ROSTER (STATE DIRECTOR ADDS LOCAL MEMBERS!) */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-amber-800">
                {activeState} State Roster
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                Local Staff &amp; LGA Council Members
              </h2>
              <p className="text-xs text-stone-500">
                Onboard local coordinators across {activeState}&apos;s {currentLgas.length} LGAs. Transmits immediately to the National Director.
              </p>
            </div>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <UserPlus className="h-4 w-4 text-[#c9ec63]" />
              Enrol Local LGA Member
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-[11px] font-mono uppercase text-stone-500 border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Local Government (LGA)</th>
                  <th className="py-3 px-4">City / Area</th>
                  <th className="py-3 px-4">Role Designation</th>
                  <th className="py-3 px-4">Telephone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stateStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-4 px-4 font-bold text-stone-900">
                      <div className="flex items-center gap-2.5">
                        {staff.avatarUrl ? (
                          <img src={staff.avatarUrl} alt={staff.name} className="h-9 w-9 rounded-xl object-cover ring-1 ring-stone-200 shrink-0" />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#c9ec63] to-[#8c9d39] text-[#13231f] flex items-center justify-center font-black text-sm shrink-0">
                            {staff.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-stone-900">{staff.name}</div>
                          <span className="text-[10px] text-stone-400 block font-mono">Enrolled: {staff.joinedDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-stone-800">
                      {staff.lga} LGA
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
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/chat?state=${encodeURIComponent(staff.state || activeState)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#c9ec63] text-emerald-800 hover:text-[#13231f] text-[11px] font-bold uppercase tracking-wider transition border border-emerald-200/60 shadow-sm"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Chat</span>
                        </Link>
                        <button
                          onClick={() => setEditingStaff({ ...staff })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider transition border border-blue-200/60"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingStaff(staff)}
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

        {/* SECTION 3: STATE OUTREACHES (SUBMITTED TO NATIONAL) */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-purple-800">
                {activeState} Operations Log
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                State Field Activities &amp; School Visits
              </h2>
              <p className="text-xs text-stone-500">
                Logged outreaches in {activeState} transmitted directly to National Headquarters.
              </p>
            </div>

            <button
              onClick={() => setShowLogActivityModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
            >
              <PlusCircle className="h-4 w-4 text-[#c9ec63]" />
              Log New Outreach
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {stateActivities.map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                      {act.category}
                    </span>
                    <span className="font-bold text-stone-800 text-xs">
                      LGA: {act.lga} &bull; {act.city}
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

      {/* Modal: Edit Staff Member */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-amber-800">Edit Staff Member</span>
                <h3 className="text-lg font-bold text-stone-900">Update Member Record</h3>
              </div>
              <button onClick={() => setEditingStaff(null)} className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleEditStaff} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <input required type="text" value={editingStaff.name}
                  onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone</label>
                  <input type="tel" value={editingStaff.phone}
                    onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City / Area</label>
                  <input type="text" value={editingStaff.city}
                    onChange={e => setEditingStaff({ ...editingStaff, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">LGA</label>
                  <select value={editingStaff.lga}
                    onChange={e => setEditingStaff({ ...editingStaff, lga: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]">
                    {currentLgas.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Role</label>
                  <select value={editingStaff.roleTitle}
                    onChange={e => setEditingStaff({ ...editingStaff, roleTitle: e.target.value as StateStaffMember['roleTitle'] })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]">
                    <option value="Field Officer">Field Officer</option>
                    <option value="School Liaison">School Liaison</option>
                    <option value="Youth Coach">Youth Coach</option>
                    <option value="Counselor">Counselor</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email</label>
                  <input required type="email" value={editingStaff.email}
                    onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]" />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select value={editingStaff.status}
                    onChange={e => setEditingStaff({ ...editingStaff, status: e.target.value as StateStaffMember['status'] })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setEditingStaff(null)}
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

      {/* Modal: Delete Staff Confirmation */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 text-center">
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Remove Staff Member?</h3>
            <p className="text-xs text-stone-600 mt-2">
              You are about to permanently remove <strong>{deletingStaff.name}</strong> ({deletingStaff.roleTitle}, {deletingStaff.lga} LGA). Their portal login will also be revoked.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeletingStaff(null)}
                className="flex-1 rounded-xl border border-stone-300 text-stone-700 py-3 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition">
                Cancel
              </button>
              <button onClick={handleDeleteStaff}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow">
                Yes, Remove Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Local Member */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-amber-800">
                  {activeState} State Council
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  Enrol Local LGA Staff or Volunteer
                </h3>
              </div>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Legal Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Okafor"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State</label>
                  <input
                    disabled
                    type="text"
                    value={activeState}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-100 text-stone-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Select LGA ({activeState})</label>
                  <select
                    required
                    value={newStaff.lga}
                    onChange={(e) => setNewStaff({ ...newStaff, lga: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    <option value="" className="text-stone-500 bg-white">Select LGA</option>
                    {currentLgas.map((lga) => (
                      <option key={lga} value={lga} className="text-stone-900 bg-white">{lga}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City / Town / Area</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Surulere, Maryland"
                    value={newStaff.city}
                    onChange={(e) => setNewStaff({ ...newStaff, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Role Designation</label>
                  <select
                    value={newStaff.roleTitle}
                    onChange={(e) => setNewStaff({ ...newStaff, roleTitle: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    <option value="Field Officer" className="text-stone-900 bg-white">Field Officer</option>
                    <option value="School Liaison" className="text-stone-900 bg-white">School Outreach Liaison</option>
                    <option value="Youth Coach" className="text-stone-900 bg-white">Youth Coach (Football Academy)</option>
                    <option value="Counselor" className="text-stone-900 bg-white">Counselor</option>
                    <option value="Volunteer" className="text-stone-900 bg-white">Volunteer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Telephone</label>
                  <input
                    required
                    type="tel"
                    placeholder="080..."
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Official Email</label>
                  <input
                    required
                    type="email"
                    placeholder="member@sidaap.org"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Member Portal Login Password
                  <span className="text-[10px] font-normal text-stone-500 ml-1.5">(Default: sidaap2026)</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <input
                    required
                    type="text"
                    placeholder="sidaap2026"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  The enrolled member can use this email and password to log in at the portal.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  <UserPlus className="h-4 w-4 text-[#c9ec63]" />
                  Enrol Member &amp; Transmit to National HQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Staff Member Credentials Generated */}
      {lastStaffCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>

            <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Member Enrolment Successful
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-1">
              Field Officer Commissioned!
            </h3>
            <p className="text-xs text-stone-600 mt-2">
              <strong>{lastStaffCredentials.name}</strong> ({lastStaffCredentials.roleTitle}) has been added to <strong>{lastStaffCredentials.lga} LGA, {lastStaffCredentials.state} State</strong>. Share their login credentials:
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2.5">
              <div>
                <span className="block text-[10px] font-mono uppercase text-stone-400 font-bold">Portal Login URL</span>
                <span className="text-xs font-mono font-bold text-stone-900">/portal/login</span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="block text-[10px] font-mono uppercase text-stone-400 font-bold">Authorized Email</span>
                <span className="text-xs font-mono font-bold text-emerald-800">{lastStaffCredentials.email}</span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="block text-[10px] font-mono uppercase text-stone-400 font-bold">Password / Passcode</span>
                <span className="text-xs font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block">{lastStaffCredentials.password}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setLastStaffCredentials(null)}
                className="w-full rounded-xl bg-[#13231f] text-white py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#1d3730] transition shadow"
              >
                Close &amp; Return to State Council
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log Activity */}
      {showLogActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 shadow-2xl p-6 sm:p-8 border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-purple-800">
                  {activeState} State Operations
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  Log Field Outreach Report
                </h3>
              </div>
              <button
                onClick={() => setShowLogActivityModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogActivity} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Event Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ikeja Senior High School Workshop & Exercise Books Giveaway"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    <option value="School Outreach" className="text-stone-900 bg-white">Secondary School Outreach</option>
                    <option value="Community March" className="text-stone-900 bg-white">NDLEA Sensitization Walk</option>
                    <option value="Football Tournament" className="text-stone-900 bg-white">Football Academy Trials</option>
                    <option value="Rehab Intake" className="text-stone-900 bg-white">Rehab / Counseling Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">LGA ({activeState})</label>
                  <select
                    required
                    value={newActivity.lga}
                    onChange={(e) => setNewActivity({ ...newActivity, lga: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white font-medium outline-none focus:border-[#13231f]"
                  >
                    <option value="" className="text-stone-500 bg-white">Select LGA</option>
                    {currentLgas.map((lga) => (
                      <option key={lga} value={lga} className="text-stone-900 bg-white">{lga}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City / Town</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ikeja"
                    value={newActivity.city}
                    onChange={(e) => setNewActivity({ ...newActivity, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Students Reached</label>
                  <input
                    type="number"
                    value={newActivity.studentsReached}
                    onChange={(e) => setNewActivity({ ...newActivity, studentsReached: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Books Handed Out</label>
                  <input
                    type="number"
                    value={newActivity.booksDistributed}
                    onChange={(e) => setNewActivity({ ...newActivity, booksDistributed: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white outline-none focus:border-[#13231f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Report Notes</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail results, interaction with school administration, and key findings..."
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  <Send className="h-4 w-4 text-[#c9ec63]" />
                  Transmit Report to National Command
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
