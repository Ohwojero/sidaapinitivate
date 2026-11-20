'use client'

import { useEffect, useState } from 'react'
import { Pencil, X } from 'lucide-react'
import {
  getStoredLeadership,
  LeadershipMember,
  saveStoredLeadership,
} from '@/lib/data/leadership-data'

export default function BoardOfTrusteesPage() {
  const [leadership, setLeadership] = useState<LeadershipMember[]>(getStoredLeadership)
  const [editingLeader, setEditingLeader] = useState<LeadershipMember | null>(null)

  useEffect(() => {
    const refresh = () => setLeadership(getStoredLeadership())
    refresh()
    window.addEventListener('sidaap_leadership_updated', refresh)
    return () => window.removeEventListener('sidaap_leadership_updated', refresh)
  }, [])

  const saveLeader = (event: React.FormEvent) => {
    event.preventDefault()
    if (!editingLeader) return
    const updated = {
      ...editingLeader,
      initials: editingLeader.name
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    }
    setLeadership(saveStoredLeadership(updated))
    setEditingLeader(null)
  }

  return (
    <div className="min-h-full bg-[#f4f6f3] p-4 text-[#18312a] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#18312a]/10 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">National governance</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Board of Trustees</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718079]">
            Manage trustee names, roles, biographies and public portraits.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((leader) => (
            <article key={leader.id} className="overflow-hidden rounded-xl border border-[#18312a]/10 bg-white">
              <div className="h-44 bg-[#18312a]">
                {leader.image ? (
                  <img src={leader.image} alt={leader.name} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c9ec63] text-xl font-black">
                      {leader.initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold">{leader.name}</h2>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#52720e]">{leader.role}</p>
                <p className="mt-3 min-h-12 text-sm leading-6 text-[#718079]">{leader.description}</p>
                <button
                  type="button"
                  onClick={() => setEditingLeader({ ...leader })}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-[#18312a]/15 px-3 py-2 text-xs font-bold hover:border-[#18312a]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit profile
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {editingLeader && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#18312a]/10 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#52720e]">Trustee profile</p>
                <h2 className="mt-1 text-lg font-bold">Edit {editingLeader.name}</h2>
              </div>
              <button type="button" onClick={() => setEditingLeader(null)} className="rounded-lg p-2 hover:bg-[#18312a]/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={saveLeader} className="space-y-4 p-5">
              <div className="flex items-center gap-4">
                {editingLeader.image ? (
                  <img src={editingLeader.image} alt={editingLeader.name} className="h-20 w-20 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-[#c9ec63] text-xl font-black">
                    {editingLeader.initials}
                  </span>
                )}
                <label className="text-xs font-bold">
                  Portrait
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = () => {
                        if (typeof reader.result === 'string') setEditingLeader({ ...editingLeader, image: reader.result })
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="mt-2 block text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-[#18312a]/5 file:px-3 file:py-2 file:font-bold"
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-xs font-bold">
                Full name
                <input required value={editingLeader.name} onChange={(event) => setEditingLeader({ ...editingLeader, name: event.target.value })} className="rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal" />
              </label>
              <label className="grid gap-1.5 text-xs font-bold">
                Position or role
                <input required value={editingLeader.role} onChange={(event) => setEditingLeader({ ...editingLeader, role: event.target.value })} className="rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal" />
              </label>
              <label className="grid gap-1.5 text-xs font-bold">
                Brief description
                <textarea required rows={3} value={editingLeader.description} onChange={(event) => setEditingLeader({ ...editingLeader, description: event.target.value })} className="resize-none rounded-lg border border-[#18312a]/15 px-3 py-2.5 font-normal" />
              </label>
              <div className="flex justify-end gap-2 border-t border-[#18312a]/10 pt-4">
                <button type="button" onClick={() => setEditingLeader(null)} className="rounded-lg px-4 py-2.5 text-xs font-bold text-[#718079]">Cancel</button>
                <button type="submit" className="rounded-lg bg-[#18312a] px-5 py-2.5 text-xs font-bold text-white">Save profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
