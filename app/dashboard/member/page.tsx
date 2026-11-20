'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  INITIAL_STAFF_MEMBERS,
  INITIAL_NATIONAL_DIRECTIVES,
  INITIAL_STATE_ACTIVITIES,
  StateStaffMember,
  NationalDirective,
  StateActivity
} from '@/lib/data/portal-data'
import { getStoredUser, AuthUser } from '@/lib/auth/session'
import { fetchStaff, addActivity, fetchDirectives } from '@/lib/supabase/portal'
import { NIGERIA_STATES } from '@/lib/data/nigeria-data'
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Megaphone,
  Send,
  MessageSquare,
  Users,
  Search,
  Activity,
  UserCheck
} from 'lucide-react'

export default function MemberDashboard() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [staffList, setStaffList] = useState<StateStaffMember[]>(INITIAL_STAFF_MEMBERS)
  const [directives, setDirectives] = useState<NationalDirective[]>(INITIAL_NATIONAL_DIRECTIVES)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStateFilter, setSelectedStateFilter] = useState('All')

  // Active tab: 'directory' | 'workspace' — workspace only shown to actual members
  const [activeTab, setActiveTab] = useState<'directory' | 'workspace'>('directory')

  const [report, setReport] = useState({
    schoolVenue: '',
    lga: '',
    city: '',
    studentsReached: '',
    booksDistributed: '',
    notes: ''
  })

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      setCurrentUser(user)
      setReport(prev => ({
        ...prev,
        lga: user.lga || 'Central',
        city: user.city || `${user.state} Area`
      }))
    }
    fetchStaff().then(data => {
      if (data.length > 0) setStaffList(data)
    })
    fetchDirectives().then(dirs => {
      if (dirs.length > 0) setDirectives(dirs)
    })
  }, [])

  const memberName = currentUser?.name || 'Guest'
  const memberState = currentUser?.state || 'Lagos'
  const memberLga = currentUser?.lga || 'Ikeja'
  const memberRole = currentUser?.title || 'Field Officer'
  const isMember = currentUser?.role === 'member'

  // Filtered staff directory
  const filteredStaff = staffList.filter(s => {
    const matchState = selectedStateFilter === 'All' || s.state === selectedStateFilter
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || (
      s.name.toLowerCase().includes(q) ||
      s.lga.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      s.roleTitle.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
    )
    return matchState && matchSearch
  })

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault()
    const newAct: StateActivity = {
      id: `act-mem-${Date.now()}`,
      title: `${report.schoolVenue} Drug Awareness Outreach`,
      state: memberState,
      lga: memberLga,
      city: report.city || `${memberLga} Area`,
      category: 'School Outreach',
      date: 'Just now',
      reportedBy: `${memberName} (${memberRole})`,
      studentsReached: Number(report.studentsReached) || 0,
      booksDistributed: Number(report.booksDistributed) || 0,
      status: 'Approved by State',
      notes: report.notes
    }
    addActivity(newAct)
    setSubmittedSuccess(true)
    setTimeout(() => {
      setSubmittedSuccess(false)
      setReport({ schoolVenue: '', lga: memberLga, city: `${memberLga} Area`, studentsReached: '', booksDistributed: '', notes: '' })
    }, 4000)
  }

  return (
    <div className="bg-[#f5f1e9] min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-[#18312a]/10 bg-white px-6 py-7">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">
              {memberLga} LGA &bull; {memberState} state
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#18312a]">
              Field workspace
            </h1>
            <p className="mt-1 text-sm text-[#718079]">
              {memberName} &bull; {memberRole}
            </p>
          </div>
          <Link
            href="/dashboard/chat"
            className="flex items-center gap-2 rounded-xl bg-[#00a884] hover:bg-[#029071] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Live Chat</span>
          </Link>
        </div>
      </div>

      {/* Tabs — only show Field Workspace tab if the viewer is an actual member */}
      {isMember && (
        <div className="bg-white border-b border-stone-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-1 pt-3">
            {[
              { key: 'directory', label: 'Staff Directory', icon: <Users className="h-3.5 w-3.5" /> },
              { key: 'workspace', label: 'My Field Workspace', icon: <Activity className="h-3.5 w-3.5" /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                  activeTab === tab.key
                    ? 'border-[#13231f] text-[#13231f]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── STAFF DIRECTORY TAB ── */}
        {(activeTab === 'directory' || !isMember) && (
          <>
            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">Total Enrolled</span>
                <div className="text-3xl font-black text-stone-900 font-mono mt-1">{staffList.length}</div>
                <p className="text-xs text-stone-500 mt-1">Members &amp; Staff nationwide</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">Active</span>
                <div className="text-3xl font-black text-emerald-800 font-mono mt-1">
                  {staffList.filter(s => s.status === 'active').length}
                </div>
                <p className="text-xs text-stone-500 mt-1">Currently active</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">States Covered</span>
                <div className="text-3xl font-black text-blue-900 font-mono mt-1">
                  {new Set(staffList.map(s => s.state)).size}
                </div>
                <p className="text-xs text-stone-500 mt-1">Across Nigeria</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-mono uppercase text-stone-500 font-bold block">LGAs Covered</span>
                <div className="text-3xl font-black text-purple-900 font-mono mt-1">
                  {new Set(staffList.map(s => s.lga)).size}
                </div>
                <p className="text-xs text-stone-500 mt-1">Local governments</p>
              </div>
            </div>

            {/* Filter + Search bar */}
            <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
                <div>
                  <span className="font-mono text-xs uppercase font-bold text-amber-800">National LGA Registry</span>
                  <h2 className="text-2xl font-bold text-stone-900 mt-1">All Local Members &amp; Staff</h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Enrolled by State Directors — read-only national view.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search name, LGA, role..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                    />
                  </div>
                  <select
                    value={selectedStateFilter}
                    onChange={e => setSelectedStateFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white outline-none"
                  >
                    <option value="All">All States</option>
                    {NIGERIA_STATES.map(s => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-[11px] font-mono uppercase text-stone-500 border-y border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Member / Staff</th>
                      <th className="py-3 px-4">State &bull; LGA</th>
                      <th className="py-3 px-4">City / Town</th>
                      <th className="py-3 px-4">Role Title</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Reporting Director</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredStaff.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400 font-mono text-xs">
                          <UserCheck className="h-8 w-8 mx-auto mb-2 text-stone-300" />
                          No members found{searchQuery ? ` for "${searchQuery}"` : ''}.
                        </td>
                      </tr>
                    ) : (
                      filteredStaff.map(staff => (
                        <tr key={staff.id} className="hover:bg-stone-50/70 transition">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              {staff.avatarUrl ? (
                                <img src={staff.avatarUrl} alt={staff.name} className="h-8 w-8 rounded-xl object-cover ring-1 ring-stone-200 shrink-0" />
                              ) : (
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 flex items-center justify-center font-black text-xs shrink-0">
                                  {staff.name[0]}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-stone-900">{staff.name}</div>
                                <span className="text-[10px] text-stone-400 font-mono">Enrolled: {staff.joinedDate}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-stone-800">{staff.state}</span>
                            <span className="text-stone-500 block text-[11px]">LGA: <strong>{staff.lga}</strong></span>
                          </td>
                          <td className="py-4 px-4 font-medium text-stone-700">{staff.city}</td>
                          <td className="py-4 px-4">
                            <span className="rounded-lg bg-blue-50 text-blue-800 border border-blue-100 px-2.5 py-1 text-[11px] font-bold">
                              {staff.roleTitle}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-[11px]">{staff.phone}</td>
                          <td className="py-4 px-4 text-stone-700 text-[11px]">{staff.assignedDirector}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              {staff.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* National Directives — visible to all */}
            <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-emerald-700" />
                <span className="font-mono text-xs uppercase font-bold text-emerald-800">
                  National Directives from Abuja HQ
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">Action Items from National Secretariat</h3>
              <p className="text-xs text-stone-500">Direct instructions for all local field members nationwide.</p>
              <div className="space-y-3">
                {directives.map(dir => (
                  <div key={dir.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900">{dir.title}</span>
                      <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold">{dir.priority}</span>
                    </div>
                    <p className="text-stone-600 mt-1">{dir.content}</p>
                    {dir.upcomingEventDate && (
                      <span className="text-[10px] font-mono text-stone-500 block mt-2">
                        Execution Deadline: {dir.upcomingEventDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── FIELD WORKSPACE TAB — only for actual members ── */}
        {activeTab === 'workspace' && isMember && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Credential Pass */}
            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-3xl bg-gradient-to-br from-[#13231f] to-[#1c3831] text-white p-6 sm:p-8 shadow-xl border border-white/15 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-bold">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#c9ec63] block">
                        Federal Republic of Nigeria
                      </span>
                      <h3 className="font-mono text-sm font-bold tracking-wider">SIDAAP FIELD CREDENTIAL PASS</h3>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-white/50">CAC RN: 8390984</span>
                </div>
                <div className="mt-6 flex gap-5 items-center">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={memberName} className="h-24 w-24 rounded-2xl object-cover ring-2 ring-[#c9ec63] shrink-0" />
                  ) : (
                    <div className="h-24 w-24 rounded-2xl bg-white/10 border-2 border-[#c9ec63] flex flex-col items-center justify-center text-[#c9ec63] shrink-0 font-bold font-mono text-xs">
                      <span>{currentUser?.avatarInitials || 'ID'}</span>
                      <span className="text-[9px] text-white/50">VERIFIED</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-white">{memberName}</h4>
                    <p className="text-xs font-mono text-[#c9ec63] uppercase">{memberRole} &bull; {memberLga} LGA</p>
                    <p className="text-xs text-[#b6c4b9] mt-1.5">{memberState} State Chapter &bull; Active 2026/2027</p>
                    <div className="mt-3 inline-block rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-0.5 text-[10px] font-mono uppercase font-bold border border-emerald-400/30">
                      Active Good Standing &bull; 2026/2027
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#a9b9a8]">
                  <span>Appointed by: {memberState} State Directorate</span>
                  <span>Jurisdiction: {memberLga}</span>
                </div>
              </div>
            </div>

            {/* Right: Field Outreach Logger */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
                <span className="font-mono text-xs uppercase font-bold text-purple-800">Field Activity Dispatch</span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                  Log School Outreach in {memberLga} LGA ({memberState})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Record your school visits and exercise books distributed. Submits immediately to your State Director.
                </p>

                {submittedSuccess ? (
                  <div className="my-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-bold text-emerald-950">Outreach Dispatch Submitted!</h4>
                    <p className="text-xs text-emerald-800">
                      Your report has been logged and forwarded to your {memberState} State Directorate and National Headquarters.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDispatch} className="mt-6 space-y-3 text-xs text-stone-900">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">School / Community Venue</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Government Secondary School"
                        value={report.schoolVenue}
                        onChange={e => setReport({ ...report, schoolVenue: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Local Government (LGA)</label>
                        <input
                          disabled
                          type="text"
                          value={`${memberLga} LGA (${memberState} State)`}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-100 text-stone-800 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">City / Neighborhood</label>
                        <input
                          type="text"
                          value={report.city}
                          onChange={e => setReport({ ...report, city: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Students Reached</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 500"
                          value={report.studentsReached}
                          onChange={e => setReport({ ...report, studentsReached: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Exercise Books Distributed</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 350"
                          value={report.booksDistributed}
                          onChange={e => setReport({ ...report, booksDistributed: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Field Summary &amp; Principal Feedback</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Note key questions students asked regarding synthetic weed (Colorado) and response from school counselors..."
                        value={report.notes}
                        onChange={e => setReport({ ...report, notes: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 outline-none focus:border-[#13231f]"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow"
                      >
                        <Send className="h-4 w-4 text-[#c9ec63]" />
                        Submit Dispatch to State Director
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
