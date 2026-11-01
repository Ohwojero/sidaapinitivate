'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  INITIAL_NATIONAL_DIRECTIVES,
  NationalDirective,
  StateActivity,
  getStoredActivities
} from '@/lib/data/portal-data'
import { getStoredUser, AuthUser } from '@/lib/auth/session'
import { addActivity, fetchDirectives } from '@/lib/supabase/portal'
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Megaphone,
  Calendar,
  Send,
  MessageSquare,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react'

export default function MemberDashboard() {
  const [directives, setDirectives] = useState<NationalDirective[]>(INITIAL_NATIONAL_DIRECTIVES)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

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
    fetchDirectives().then(dirs => {
      if (dirs.length > 0) setDirectives(dirs)
    })
  }, [])

  const memberName = currentUser?.name || 'Blessing Okon'
  const memberState = currentUser?.state || 'Lagos'
  const memberLga = currentUser?.lga || 'Ikeja'
  const memberRole = currentUser?.title || 'School Outreach Counselor & Liaison'

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Save to shared activity log
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
      {/* Member Header */}
      <div className="bg-[#13231f] text-white px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-300 font-bold">
                Field Officer &bull; Local Government Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Field Operations &bull; {memberName}
            </h1>
            <p className="text-xs text-[#b6c4b9]">
              {memberRole} &bull; <strong>{memberLga} LGA, {memberState} State</strong> &bull; Duly commissioned under SIDAAP Nigeria Directorate.
            </p>
          </div>

          <Link
            href={`/dashboard/chat?state=${encodeURIComponent(memberState)}`}
            className="flex items-center gap-2 rounded-xl bg-[#00a884] hover:bg-[#029071] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat in {memberState} Team Channel</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Digital Credential Pass & Directives */}
          <div className="lg:col-span-6 space-y-8">
            {/* Digital Volunteer Pass Card */}
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
                    <h3 className="font-mono text-sm font-bold tracking-wider">
                      SIDAAP FIELD CREDENTIAL PASS
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-white/50">CAC RN: 8390984</span>
              </div>

              <div className="mt-6 flex gap-5 items-center">
                <div className="h-24 w-24 rounded-2xl bg-white/10 border-2 border-[#c9ec63] flex flex-col items-center justify-center text-[#c9ec63] shrink-0 font-bold font-mono text-xs">
                  <span>PHOTO</span>
                  <span className="text-[9px] text-white/50">VERIFIED</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Blessing Okon</h4>
                  <p className="text-xs font-mono text-[#c9ec63] uppercase">Accredited Counselor &bull; Ikeja LGA</p>
                  <p className="text-xs text-[#b6c4b9] mt-1.5">Lagos State Chapter &bull; ID: SIDAAP/VOL/2026/0491</p>
                  <div className="mt-3 inline-block rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-0.5 text-[10px] font-mono uppercase font-bold border border-emerald-400/30">
                    Active Good Standing &bull; 2026/2027
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#a9b9a8]">
                <span>Appointed by: Lagos State Directorate</span>
                <span>Jurisdiction: Ikeja &amp; Maryland</span>
              </div>
            </div>

            {/* National Directives for this member */}
            <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-emerald-700" />
                <span className="font-mono text-xs uppercase font-bold text-emerald-800">
                  National Directives from Abuja HQ
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Action Items from National Secretariat
              </h3>
              <p className="text-xs text-stone-500">
                Direct instructions from the National Executive for all local field members.
              </p>

              <div className="space-y-3">
                {directives.map((dir) => (
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
          </div>

          {/* Right Column: Field Outreach Logger */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
              <span className="font-mono text-xs uppercase font-bold text-purple-800">
                Field Activity Dispatch
              </span>
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
                      onChange={(e) => setReport({ ...report, schoolVenue: e.target.value })}
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
                        onChange={(e) => setReport({ ...report, city: e.target.value })}
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
                        onChange={(e) => setReport({ ...report, studentsReached: e.target.value })}
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
                        onChange={(e) => setReport({ ...report, booksDistributed: e.target.value })}
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
                      onChange={(e) => setReport({ ...report, notes: e.target.value })}
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
      </div>
    </div>
  )
}
