'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Directory = {
  id: string
  name: string
  directory_type: 'state' | 'local' | 'national'
  state_name: string | null
  city: string | null
  description: string | null
  services: string[]
  phone: string | null
  website: string | null
  is_featured: boolean
}

const fallbackDirectories: Directory[] = [
  { id: 'demo-1', name: 'SIDAAP National Secretariat', directory_type: 'national', state_name: null, city: 'Abuja', description: 'National coordination, partnerships, and prevention support.', services: ['Education', 'Partnerships'], phone: '0806 343 0562', website: null, is_featured: true },
  { id: 'demo-2', name: 'Lagos Community Desk', directory_type: 'state', state_name: 'Lagos', city: 'Ikeja', description: 'Local outreach, referrals, and community awareness programming.', services: ['Outreach', 'Referrals'], phone: null, website: null, is_featured: true },
  { id: 'demo-3', name: 'Oyo School Support Network', directory_type: 'local', state_name: 'Oyo', city: 'Ibadan', description: 'School-based prevention and family support coordination.', services: ['Schools', 'Family support'], phone: null, website: null, is_featured: false },
]

export function DirectoryExplorer() {
  const [directories, setDirectories] = useState<Directory[]>(fallbackDirectories)
  const [query, setQuery] = useState('')
  const [state, setState] = useState('All states')
  const [type, setType] = useState('All types')

  useEffect(() => {
    let active = true
    createClient().from('directories').select('id,name,directory_type,state_name,city,description,services,phone,website,is_featured').order('is_featured', { ascending: false }).then((res: any) => {
      const data = res?.data
      if (active && data?.length) setDirectories(data as Directory[])
    })
    return () => { active = false }
  }, [])

  const states = useMemo(() => ['All states', ...Array.from(new Set(directories.map((item) => item.state_name).filter(Boolean) as string[])).sort()], [directories])
  const filtered = directories.filter((item) => {
    const haystack = `${item.name} ${item.city ?? ''} ${item.state_name ?? ''} ${item.description ?? ''}`.toLowerCase()
    return haystack.includes(query.toLowerCase()) && (state === 'All states' || item.state_name === state) && (type === 'All types' || item.directory_type === type)
  })

  return <section id="directory" className="bg-[#13231f] px-6 py-24 text-[#f5f1e9] lg:px-10 lg:py-36">
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div><p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#c9ec63]">05 / Find support</p><h2 className="max-w-2xl text-5xl font-semibold leading-[.95] tracking-[-.06em] sm:text-7xl">A growing network<br /><span className="text-[#c9ec63]">across Nigeria.</span></h2></div>
        <p className="max-w-sm text-sm leading-relaxed text-[#b6c4b9]">Explore state, local, and national points of connection. More locations are added as the movement grows.</p>
      </div>
      <div className="mb-8 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[.06] p-3 md:grid-cols-[1fr_180px_150px]">
        <label className="flex items-center gap-3 rounded-xl bg-white/[.06] px-4"><Search className="h-4 w-4 text-[#c9ec63]" /><span className="sr-only">Search directories</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, city, or state" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#82928a]" /></label>
        <label className="flex items-center gap-2 rounded-xl bg-white/[.06] px-4"><SlidersHorizontal className="h-4 w-4 text-[#c9ec63]" /><span className="sr-only">Filter by state</span><select value={state} onChange={(event) => setState(event.target.value)} className="w-full bg-transparent py-3 text-sm outline-none"><option className="text-[#13231f]">All states</option>{states.slice(1).map((item) => <option key={item} className="text-[#13231f]">{item}</option>)}</select></label>
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by directory type" className="rounded-xl bg-white/[.06] px-4 py-3 text-sm outline-none"><option className="text-[#13231f]">All types</option><option value="national" className="text-[#13231f]">National</option><option value="state" className="text-[#13231f]">State</option><option value="local" className="text-[#13231f]">Local</option></select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <article key={item.id} className="group rounded-[1.75rem] border border-white/10 bg-[#1d3730] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9ec63]/50"><div className="mb-12 flex items-start justify-between"><span className="rounded-full border border-[#c9ec63]/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-[#c9ec63]">{item.directory_type}</span><MapPin className="h-5 w-5 text-[#c9ec63]" /></div><h3 className="text-2xl font-semibold leading-tight">{item.name}</h3><p className="mt-2 text-sm text-[#a9b9a8]">{[item.city, item.state_name].filter(Boolean).join(', ') || 'Nigeria'}</p><p className="mt-6 min-h-12 text-sm leading-relaxed text-[#b6c4b9]">{item.description}</p><div className="mt-6 flex flex-wrap gap-2">{item.services.slice(0, 3).map((service) => <span key={service} className="rounded-full bg-white/[.08] px-2.5 py-1 text-[11px] text-[#d1d9cf]">{service}</span>)}</div><div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-xs"><span className="text-[#a9b9a8]">{item.phone ?? 'Contact via SIDAAP'}</span>{item.website && <a href={item.website} target="_blank" rel="noreferrer" aria-label={`Visit ${item.name} website`}><ArrowUpRight className="h-4 w-4 text-[#c9ec63]" /></a>}</div></article>)}</div>
      {!filtered.length && <p className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-[#b6c4b9]">No directory entries match those filters yet.</p>}
    </div>
  </section>
}
