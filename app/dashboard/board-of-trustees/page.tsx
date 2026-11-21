'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2, X, Users, ShieldCheck, Sparkles, Loader2 } from 'lucide-react'
import {
  getStoredLeadership,
  fetchStoredLeadership,
  LeadershipMember,
  deleteStoredLeadership,
  saveStoredLeadership,
  DEFAULT_LEADERSHIP_BODIES,
} from '@/lib/data/leadership-data'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { compressImageFile } from '@/lib/utils'

export default function BoardOfTrusteesPage() {
  const [leadership, setLeadership] = useState<LeadershipMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingLeader, setEditingLeader] = useState<LeadershipMember | null>(null)
  const [isAddingLeader, setIsAddingLeader] = useState(false)
  const [selectedBodyFilter, setSelectedBodyFilter] = useState<string>('All')
  const [customBodyInput, setCustomBodyInput] = useState('')
  const [isCustomBody, setIsCustomBody] = useState(false)
  const [deletingLeaderId, setDeletingLeaderId] = useState<string | null>(null)
  const [isCompressingPortrait, setIsCompressingPortrait] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let isMounted = true

    // Check if stored leadership already has images loaded
    const initial = getStoredLeadership()
    const hasImages = initial.some((m) => !!m.image)

    if (hasImages) {
      setLeadership(initial)
      setIsLoading(false)
    }

    // Fetch latest directly from Supabase to ensure fresh portraits are loaded straight
    fetchStoredLeadership()
      .then((data) => {
        if (!isMounted) return
        if (data && data.length > 0) {
          setLeadership(data)
        } else if (!hasImages) {
          setLeadership(initial)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch leadership:', err)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    const refresh = () => {
      const refreshed = getStoredLeadership()
      setLeadership(refreshed)
      setIsLoading(false)
    }
    window.addEventListener('sidaap_leadership_updated', refresh)
    return () => {
      isMounted = false
      window.removeEventListener('sidaap_leadership_updated', refresh)
    }
  }, [])

  // Collect all distinct bodies present in the data + defaults
  const availableBodies = useMemo(() => {
    const set = new Set<string>(DEFAULT_LEADERSHIP_BODIES)
    leadership.forEach((m) => {
      if (m.body && m.body.trim()) set.add(m.body.trim())
    })
    return Array.from(set)
  }, [leadership])

  // Filtered members by body
  const filteredLeadership = useMemo(() => {
    if (selectedBodyFilter === 'All') return leadership
    return leadership.filter((m) => (m.body || 'Board of Trustees') === selectedBodyFilter)
  }, [leadership, selectedBodyFilter])

  const saveLeader = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editingLeader) return

    setIsSaving(true)
    const effectiveBody = isCustomBody
      ? customBodyInput.trim() || 'Board of Trustees'
      : (editingLeader.body || 'Board of Trustees').trim()

    const updated: LeadershipMember = {
      ...editingLeader,
      body: effectiveBody,
      initials: editingLeader.name
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'TR',
    }

    try {
      const result = await saveStoredLeadership(updated)
      setLeadership(result)
      setEditingLeader(null)
      setIsAddingLeader(false)
      setIsCustomBody(false)
      setCustomBodyInput('')
      setNotice(
        isSupabaseConfigured()
          ? `Member saved to ${effectiveBody} and synchronized with Supabase.`
          : 'Member saved on this device. Configure Supabase to sync across devices.',
      )
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save member.')
    } finally {
      setIsSaving(false)
    }
  }

  const addLeader = () => {
    setIsAddingLeader(true)
    setIsCustomBody(false)
    setCustomBodyInput('')
    setEditingLeader({
      id: `leader-${crypto.randomUUID()}`,
      name: '',
      role: 'Trustee',
      body: selectedBodyFilter !== 'All' ? selectedBodyFilter : 'Board of Trustees',
      description: '',
      image: '',
      initials: '',
    })
  }

  const startEditLeader = (leader: LeadershipMember) => {
    const body = leader.body || 'Board of Trustees'
    const isStandard = (DEFAULT_LEADERSHIP_BODIES as readonly string[]).includes(body)
    setIsAddingLeader(false)
    if (!isStandard && body) {
      setIsCustomBody(true)
      setCustomBodyInput(body)
    } else {
      setIsCustomBody(false)
      setCustomBodyInput('')
    }
    setEditingLeader({ ...leader, body })
  }

  const deleteLeader = async (leader: LeadershipMember) => {
    const bodyLabel = leader.body || 'Board of Trustees'
    if (!window.confirm(`Delete ${leader.name} from ${bodyLabel}? This cannot be undone.`)) return
    setDeletingLeaderId(leader.id)
    try {
      const result = await deleteStoredLeadership(leader.id)
      setLeadership(result)
      setNotice(
        isSupabaseConfigured()
          ? 'Member removed from Supabase and governance directory.'
          : 'Member removed from this device.',
      )
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not delete member.')
    } finally {
      setDeletingLeaderId(null)
    }
  }

  const getBodyBadgeStyle = (body?: string) => {
    const b = (body || 'Board of Trustees').toLowerCase()
    if (b.includes('trustee')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300'
    }
    if (b.includes('advisory')) {
      return 'bg-blue-50 text-blue-800 border-blue-300'
    }
    if (b.includes('patron') || b.includes('elder')) {
      return 'bg-amber-50 text-amber-800 border-amber-300'
    }
    if (b.includes('executive') || b.includes('directorate')) {
      return 'bg-purple-50 text-purple-800 border-purple-300'
    }
    return 'bg-stone-100 text-stone-800 border-stone-300'
  }

  return (
    <div className="min-h-full bg-[#f4f6f3] p-4 text-[#18312a] sm:p-6 lg:p-8">
      {notice && (
        <div
          role="status"
          className="fixed right-5 top-20 z-[70] max-w-md rounded-xl border border-[#18312a]/20 bg-white px-4 py-3 text-xs font-semibold shadow-2xl transition animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between gap-3">
            <span>{notice}</span>
            <button
              onClick={() => setNotice('')}
              className="text-stone-400 hover:text-stone-700"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-[#18312a]/10 pb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-[#52720e]/10 px-2.5 text-[11px] font-bold uppercase tracking-wider text-[#52720e]">
              <ShieldCheck className="h-3.5 w-3.5" />
              National Governance &bull; CAC RN: 8390984
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Board of Trustees &amp; Governance Bodies</h1>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-[#718079]">
              Manage statutory Trustees and designated leadership bodies (Advisory Council, Patrons, Executive Directorate). Each member is visually identified by their governance body.
            </p>
            <button
              type="button"
              onClick={addLeader}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18312a] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#27483f]"
            >
              <Plus className="h-4 w-4 text-[#c9ec63]" />
              Add Leadership Member
            </button>
          </div>
        </div>

        {/* Filter Tabs by Governance Body */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#18312a]/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#718079] mr-1">Body Filter:</span>
            <button
              type="button"
              onClick={() => setSelectedBodyFilter('All')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                selectedBodyFilter === 'All'
                  ? 'bg-[#18312a] text-white shadow'
                  : 'bg-white text-[#18312a] border border-[#18312a]/15 hover:bg-[#18312a]/5'
              }`}
            >
              All Bodies ({leadership.length})
            </button>
            {availableBodies.map((body) => {
              const count = leadership.filter((m) => (m.body || 'Board of Trustees') === body).length
              return (
                <button
                  key={body}
                  type="button"
                  onClick={() => setSelectedBodyFilter(body)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    selectedBodyFilter === body
                      ? 'bg-[#18312a] text-white shadow'
                      : 'bg-white text-[#18312a] border border-[#18312a]/15 hover:bg-[#18312a]/5'
                  }`}
                >
                  {body} ({count})
                </button>
              )
            })}
          </div>

          <div className="text-xs font-mono text-[#718079]">
            Showing <strong>{filteredLeadership.length}</strong> of {leadership.length} members
          </div>
        </div>

        {/* Loading State Skeleton (Prevents Initials from Flashing Before Images Load) */}
        {isLoading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-2xl border border-[#18312a]/10 bg-white shadow-sm animate-pulse"
              >
                <div className="h-48 w-full bg-[#18312a]/20" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-stone-200 rounded" />
                  <div className="h-3 w-1/2 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-100 rounded" />
                  <div className="h-8 w-1/3 bg-stone-200 rounded pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLeadership.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[#18312a]/20 bg-white p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-stone-300" />
            <h3 className="mt-4 text-base font-bold">No members found in {selectedBodyFilter}</h3>
            <p className="mt-1 text-xs text-[#718079]">
              Add appointed members to this body using the button above.
            </p>
            <button
              onClick={addLeader}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#18312a] px-4 py-2 text-xs font-bold text-white"
            >
              <Plus className="h-3.5 w-3.5 text-[#c9ec63]" />
              Add Member Now
            </button>
          </div>
        ) : (
          /* Members Grid - NOT a Carousel, Shows Image Straight */
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLeadership.map((leader) => {
              const body = leader.body || 'Board of Trustees'
              return (
                <article
                  key={leader.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#18312a]/10 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Portrait Area: Shows image straight */}
                  <div className="relative h-48 w-full bg-[#18312a] overflow-hidden">
                    {leader.image ? (
                      <img
                        src={leader.image}
                        alt={leader.name}
                        loading="eager"
                        decoding="sync"
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#18312a] to-[#2b4c41]">
                        <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#c9ec63]/60 bg-[#c9ec63] text-2xl font-black text-[#18312a] shadow-inner">
                          {leader.initials || 'TR'}
                        </span>
                      </div>
                    )}
                    {/* Body Badge overlay */}
                    <div className="absolute left-3 top-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide backdrop-blur-sm shadow-sm ${getBodyBadgeStyle(
                          body,
                        )}`}
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {body}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-stone-900 leading-snug">{leader.name}</h2>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#52720e]">
                        {leader.role}
                      </p>
                      {leader.description ? (
                        <p className="mt-3 text-xs leading-relaxed text-[#718079]">
                          {leader.description}
                        </p>
                      ) : (
                        <p className="mt-3 text-xs italic text-stone-400">
                          No biography recorded.
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                      <button
                        type="button"
                        onClick={() => startEditLeader(leader)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#18312a]/15 px-3 py-1.5 text-xs font-bold text-stone-800 transition hover:bg-stone-50"
                      >
                        <Pencil className="h-3.5 w-3.5 text-stone-500" />
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLeader(leader)}
                        disabled={deletingLeaderId === leader.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingLeaderId === leader.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Leadership Member Modal (Sticky Footer so Buttons are NEVER Hidden) */}
      {editingLeader && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[88vh] my-auto overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header: Fixed at top */}
            <div className="flex-shrink-0 flex items-center justify-between border-b border-[#18312a]/10 bg-[#18312a] px-6 py-4 text-white">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#c9ec63]">
                  Statutory Leadership Directory
                </p>
                <h2 className="text-base sm:text-lg font-bold">
                  {isAddingLeader ? 'Add Leadership / Board Member' : `Edit ${editingLeader.name}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingLeader(null)
                  setIsAddingLeader(false)
                }}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Modal Form Body */}
            <form
              id="leader-modal-form"
              onSubmit={saveLeader}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4"
            >
              {/* Portrait Photo Upload with Compression */}
              <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
                {editingLeader.image ? (
                  <img
                    src={editingLeader.image}
                    alt={editingLeader.name}
                    className="h-14 w-14 rounded-xl object-cover border border-stone-300"
                  />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#c9ec63] text-base font-black text-[#18312a]">
                    {editingLeader.initials || 'TR'}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-bold text-stone-800">
                    Portrait Photo
                  </label>
                  <p className="text-[11px] text-stone-500 mb-1">
                    Auto-compressed to web quality for instant loading
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isCompressingPortrait}
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      setIsCompressingPortrait(true)
                      void compressImageFile(file, 400, 400, 0.72)
                        .then((image) => {
                          if (image.length > 300_000) {
                            throw new Error('This portrait is still too large after compression. Please choose a smaller image.')
                          }
                          setEditingLeader((current) => current ? { ...current, image } : current)
                          setNotice('Portrait compressed and ready to save.')
                        })
                        .catch((error) => {
                          setNotice(error instanceof Error ? error.message : 'Could not process portrait.')
                        })
                        .finally(() => {
                          setIsCompressingPortrait(false)
                        })
                    }}
                    className="block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-[#18312a] file:px-2.5 file:py-1 file:text-xs file:font-bold file:text-white hover:file:bg-[#27483f]"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  placeholder="e.g. Bishop Prof Ohwojero Prosper PhD, DD"
                  value={editingLeader.name}
                  onChange={(event) =>
                    setEditingLeader({ ...editingLeader, name: event.target.value })
                  }
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs outline-none focus:border-[#18312a]"
                />
              </div>

              {/* Position / Role */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  Position / Role Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  placeholder="e.g. Board Secretary, Trustee & Director, etc."
                  value={editingLeader.role}
                  onChange={(event) =>
                    setEditingLeader({ ...editingLeader, role: event.target.value })
                  }
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs outline-none focus:border-[#18312a]"
                />
              </div>

              {/* GOVERNANCE BODY SELECTION */}
              <div className="space-y-1.5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                <label className="block text-xs font-bold text-emerald-950">
                  Leadership / Governance Body <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-emerald-800">
                  Select which body this member belongs to (Board of Trustees, Advisory Council, etc.)
                </p>
                <select
                  value={isCustomBody ? '__custom__' : (editingLeader.body || 'Board of Trustees')}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === '__custom__') {
                      setIsCustomBody(true)
                    } else {
                      setIsCustomBody(false)
                      setEditingLeader({ ...editingLeader, body: val })
                    }
                  }}
                  className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-stone-900 outline-none focus:border-emerald-600"
                >
                  <option value="Board of Trustees">Board of Trustees</option>
                  <option value="Advisory Council">Advisory Council</option>
                  <option value="Patrons & Elders">Patrons & Elders</option>
                  <option value="Executive Directorate">Executive Directorate</option>
                  {/* Any custom bodies already in use */}
                  {availableBodies
                    .filter((b) => !(DEFAULT_LEADERSHIP_BODIES as readonly string[]).includes(b))
                    .map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  <option value="__custom__">+ Add Other Body (Specify Custom)...</option>
                </select>

                {isCustomBody && (
                  <div className="mt-2 space-y-1">
                    <label className="block text-[11px] font-bold text-emerald-900">
                      Specify New Body Name:
                    </label>
                    <input
                      required
                      placeholder="e.g. Founding Members, Advisory Council, etc."
                      value={customBodyInput}
                      onChange={(e) => {
                        setCustomBodyInput(e.target.value)
                        setEditingLeader({ ...editingLeader, body: e.target.value })
                      }}
                      className="w-full rounded-xl border border-emerald-400 bg-white px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Description / Biography */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  Brief Biography / Portfolio <span className="font-normal text-stone-500">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of portfolio, qualifications, and mandate..."
                  value={editingLeader.description}
                  onChange={(event) =>
                    setEditingLeader({ ...editingLeader, description: event.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-stone-300 px-3 py-2 text-xs outline-none focus:border-[#18312a]"
                />
              </div>
            </form>

            {/* Modal Footer: ALWAYS VISIBLE AND STICKY AT BOTTOM */}
            <div className="flex-shrink-0 border-t border-stone-200 bg-stone-50 px-5 sm:px-6 py-3.5 flex items-center justify-end gap-3 sticky bottom-0 z-10 rounded-b-2xl shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setEditingLeader(null)
                  setIsAddingLeader(false)
                }}
                className="rounded-xl px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="leader-modal-form"
                disabled={isCompressingPortrait || isSaving}
                className="rounded-xl bg-[#18312a] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#27483f] disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
              >
                {isCompressingPortrait ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Compressing Portrait...
                  </>
                ) : isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : isAddingLeader ? (
                  'Appoint Member'
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
