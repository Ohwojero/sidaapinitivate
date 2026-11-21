'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
  Sparkles,
  Building2,
  Users,
} from 'lucide-react'
import { getStoredDirectors, StateDirector } from '@/lib/data/portal-data'
import { fetchDirectors } from '@/lib/supabase/portal'
import {
  fetchStoredLeadership,
  getStoredLeadership,
  LeadershipMember,
} from '@/lib/data/leadership-data'

function getCarouselImage(image: string | null | undefined): string {
  return image && !/images\.unsplash\.com|source\.unsplash\.com/i.test(image) ? image : ''
}

export default function HomePage() {
  const [stateDirectors, setStateDirectors] = useState<StateDirector[]>(getStoredDirectors)
  const [leadership, setLeadership] = useState<LeadershipMember[]>(getStoredLeadership)
  const [activeSlide, setActiveSlide] = useState(0)
  const [selectedPublicBody, setSelectedPublicBody] = useState<string>('All')
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const refresh = () => setStateDirectors(getStoredDirectors())
    const refreshLeadership = () => setLeadership(getStoredLeadership())
    refresh()
    refreshLeadership()
    void fetchDirectors().then(setStateDirectors)
    void fetchStoredLeadership().then(setLeadership)
    window.addEventListener('storage', refresh)
    window.addEventListener('sidaap_leadership_updated', refreshLeadership)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('sidaap_leadership_updated', refreshLeadership)
    }
  }, [])

  // Dynamic slides for the NEW executive carousel:
  // Includes Chairman/Founder, Secretary (Hon Friday Chalele), Executive Directors, and State Directors
  const carouselSlides = useMemo(() => {
    // 1. Founder & Board Chairman
    const chairman = leadership.find((l) => {
      const r = l.role.toLowerCase()
      return r.includes('founder') || r.includes('chairman') || r.includes('country director')
    }) || leadership[0]

    // 2. Board Secretary (Requested by user: "secretary at the top should display on the carosuel too")
    const secretary = leadership.find((l) => {
      const r = l.role.toLowerCase()
      const b = (l.body || '').toLowerCase()
      return (r.includes('secretary') || b.includes('secretary')) && l.id !== chairman?.id
    })

    // 3. Other Executive Directors (Treasurer, Rehabilitation Director, etc.)
    const otherExecutives = leadership.filter((l) => {
      if (l.id === chairman?.id || l.id === secretary?.id) return false
      const r = l.role.toLowerCase()
      const b = (l.body || '').toLowerCase()
      return (
        r.includes('director') ||
        r.includes('treasurer') ||
        r.includes('coordinator') ||
        b.includes('executive')
      )
    })

    const slides: Array<{
      id: string
      name: string
      role: string
      area: string
      category: 'Chairman' | 'Secretary' | 'Executive' | 'State Director'
      image: string
      initials: string
    }> = []

    if (chairman) {
      slides.push({
        id: `chairman-${chairman.id}`,
        name: chairman.name,
        role: chairman.role,
        area: 'Founder & Board Chairman',
        category: 'Chairman',
        image: getCarouselImage(chairman.image),
        initials: chairman.initials || 'BO',
      })
    }

    if (secretary) {
      slides.push({
        id: `secretary-${secretary.id}`,
        name: secretary.name,
        role: secretary.role,
        area: 'Board Secretary & International Welfare',
        category: 'Secretary',
        image: getCarouselImage(secretary.image),
        initials: secretary.initials || 'FC',
      })
    }

    otherExecutives.forEach((exec) => {
      slides.push({
        id: `exec-${exec.id}`,
        name: exec.name,
        role: exec.role,
        area: 'National Executive Directorate',
        category: 'Executive',
        image: getCarouselImage(exec.image),
        initials: exec.initials || 'EX',
      })
    })

    stateDirectors
      .filter((d) => d.status === 'active')
      .forEach((d) => {
        slides.push({
          id: `state-${d.id}`,
          name: d.name,
          role: 'State Director',
          area: `${d.state} State Outreach`,
          category: 'State Director',
          image: getCarouselImage(d.avatarUrl),
          initials: d.name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
        })
      })

    return slides
  }, [leadership, stateDirectors])

  // Autoplay timer
  useEffect(() => {
    if (carouselSlides.length < 2 || isPaused) return
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselSlides.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [carouselSlides.length, isPaused])

  useEffect(() => {
    if (activeSlide >= carouselSlides.length) setActiveSlide(0)
  }, [activeSlide, carouselSlides.length])

  const changeSlide = (direction: -1 | 1) => {
    setActiveSlide((current) =>
      (current + direction + carouselSlides.length) % carouselSlides.length,
    )
  }

  const activeProfile = carouselSlides[activeSlide]

  // Distinct bodies for the statutory governance grid section
  const availablePublicBodies = useMemo(() => {
    const set = new Set<string>()
    leadership.forEach((m) => {
      if (m.body && m.body.trim()) set.add(m.body.trim())
    })
    return Array.from(set)
  }, [leadership])

  const filteredPublicLeadership = useMemo(() => {
    if (selectedPublicBody === 'All') return leadership
    return leadership.filter((m) => (m.body || 'Board of Trustees') === selectedPublicBody)
  }, [leadership, selectedPublicBody])

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#18312a]">
      {/* HERO SECTION WITH NEW EXECUTIVE CAROUSEL */}
      <section className="border-b border-[#18312a]/10 bg-gradient-to-b from-[#f5f3ec] to-[#eceae0]">
        <div className="mx-auto grid min-h-[660px] max-w-7xl items-center gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          {/* Hero Left Column */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#18312a]/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#52720e]" />
              Prevention, treatment and recovery
            </div>

            <h1 className="text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl text-[#18312a]">
              Protect potential.
              <span className="mt-2 block text-[#52720e]">Build safer futures.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#4e625b]">
              SIDAAP helps young people and families prevent drug abuse, find confidential support,
              and access rehabilitation services across Nigeria.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/find-help"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18312a] px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#27483f]"
              >
                <MapPin className="h-4 w-4 text-[#c9ec63]" />
                Find help near you
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#18312a]/20 bg-white px-6 py-4 text-sm font-bold transition hover:border-[#18312a] shadow-sm"
              >
                Explore our work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <a
              href="tel:08063430562"
              className="mt-8 inline-flex items-center gap-3 border-t border-[#18312a]/10 pt-5 text-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c9ec63] text-[#18312a] shadow-sm">
                <Phone className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#61736d]">
                  Confidential helpline
                </span>
                <strong className="mt-0.5 block text-base font-extrabold">0806 343 0562</strong>
              </span>
            </a>
          </div>

          {/* Hero Right Column: BRAND-NEW REDESIGNED CAROUSEL */}
          <div
            className="relative mx-auto w-full max-w-[500px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-2 rounded-[3rem] bg-gradient-to-r from-[#18312a]/30 to-[#c9ec63]/25 blur-2xl opacity-60" />

            {/* Main Carousel Frame */}
            <div className="relative aspect-[3.6/4.8] sm:min-h-[540px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#12241f] via-[#18312a] to-[#25463c] shadow-[0_25px_60px_-15px_rgba(24,49,42,0.45)] ring-1 ring-white/15">
              {/* Top Floating Glass Status Bar */}
              <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between pointer-events-none">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-white shadow-lg text-[11px] font-bold uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-[#c9ec63] animate-pulse" />
                  SIDAAP Leadership
                </span>
                <span className="rounded-full bg-black/50 backdrop-blur-md px-3 py-1 font-mono text-xs font-bold text-[#c9ec63] border border-white/20 shadow-lg">
                  {String(activeSlide + 1).padStart(2, '0')} / {String(carouselSlides.length).padStart(2, '0')}
                </span>
              </div>

              {/* Portrait Image (Framed with full height so faces & hats aren't cropped) */}
              {activeProfile?.image ? (
                <img
                  key={activeProfile.id}
                  src={activeProfile.image}
                  alt={activeProfile.name}
                  loading="eager"
                  decoding="sync"
                  className="h-full w-full object-cover object-top transition-all duration-700 ease-out"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#18312a] to-[#315248]">
                  <span className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-[#c9ec63]/60 bg-[#c9ec63] text-5xl font-black text-[#18312a] shadow-2xl">
                    {activeProfile?.initials || 'S'}
                  </span>
                </div>
              )}

              {/* Deep Gradient Overlays for High-Contrast Text */}
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/75 to-transparent z-10" />
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />

              {/* Bottom Information Card Overlay */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-7 text-white">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#c9ec63]/20 border border-[#c9ec63]/40 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#c9ec63] backdrop-blur-sm shadow-sm mb-2">
                  <Sparkles className="h-3 w-3" />
                  {activeProfile?.area || 'National Leadership'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  {activeProfile?.name || 'SIDAAP Nigeria'}
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-white/85 line-clamp-2">
                  {activeProfile?.role || 'Executive Leadership'}
                </p>
              </div>

              {/* Navigation Controls: Large Modern Frosted Glass Buttons */}
              {carouselSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => changeSlide(-1)}
                    aria-label="Previous leader"
                    className="absolute left-3.5 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white hover:text-[#18312a] hover:scale-110 shadow-xl"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeSlide(1)}
                    aria-label="Next leader"
                    className="absolute right-3.5 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white hover:text-[#18312a] hover:scale-110 shadow-xl"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Autoplay Progress Bar Indicator */}
                  <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-white/20">
                    <div
                      className="h-full bg-[#c9ec63] transition-all duration-300"
                      style={{
                        width: `${((activeSlide + 1) / carouselSlides.length) * 100}%`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">How we help</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One clear path, with support at every stage.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-[#18312a]/10 bg-white p-7 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8efd6]">
              <ShieldCheck className="h-5 w-5 text-[#52720e]" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Prevent</h3>
            <p className="mt-3 leading-7 text-[#64756f]">
              School outreach, awareness workshops and community campaigns that stop drug abuse before it starts.
            </p>
            <Link href="/programs" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#18312a]">
              View programs <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-2xl border border-[#18312a]/10 bg-white p-7 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dcebe7]">
              <HeartHandshake className="h-5 w-5 text-[#18312a]" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Treat</h3>
            <p className="mt-3 leading-7 text-[#64756f]">
              Confidential guidance and referrals to trusted hospitals and rehabilitation centres.
            </p>
            <Link href="/find-help" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#18312a]">
              Find support <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-2xl border border-[#18312a]/10 bg-white p-7 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1e8cb]">
              <Trophy className="h-5 w-5 text-[#856b1d]" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Recover</h3>
            <p className="mt-3 leading-7 text-[#64756f]">
              Youth mentorship and football programs that rebuild confidence, purpose and community.
            </p>
            <Link href="/programs" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#18312a]">
              Join an initiative <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>

      {/* STATUTORY GOVERNANCE & BOARD OF TRUSTEES (CARD GRID - NOT A CAROUSEL) */}
      <section className="border-y border-[#18312a]/10 bg-[#fbfcf9] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#18312a]/10">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#52720e] font-bold">
                <Building2 className="h-4 w-4" />
                Statutory Governance &bull; CAC RN: 8390984
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18312a] sm:text-4xl">
                Board of Trustees &amp; Governing Bodies
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64756f]">
                Duly appointed custodians of SIDAAP&apos;s institutional integrity, national drug-demand reduction policies, and fiduciary stewardship under the Companies and Allied Matters Act.
              </p>
            </div>
            {availablePublicBodies.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#718079]">Filter Body:</span>
                <button
                  type="button"
                  onClick={() => setSelectedPublicBody('All')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    selectedPublicBody === 'All'
                      ? 'bg-[#18312a] text-white shadow'
                      : 'bg-white text-[#18312a] border border-[#18312a]/15 hover:bg-[#18312a]/5'
                  }`}
                >
                  All Bodies
                </button>
                {availablePublicBodies.map((body) => (
                  <button
                    key={body}
                    type="button"
                    onClick={() => setSelectedPublicBody(body)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      selectedPublicBody === body
                        ? 'bg-[#18312a] text-white shadow'
                        : 'bg-white text-[#18312a] border border-[#18312a]/15 hover:bg-[#18312a]/5'
                    }`}
                  >
                    {body}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cards Grid: Shows full portraits cleanly without cropping face/hat */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPublicLeadership.map((leader) => {
              const body = leader.body || 'Board of Trustees'
              return (
                <article
                  key={leader.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#18312a]/10 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-64 sm:h-72 w-full bg-[#18312a] overflow-hidden">
                    {leader.image ? (
                      <img
                        src={leader.image}
                        alt={leader.name}
                        loading="eager"
                        decoding="sync"
                        className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#18312a] to-[#2b4c41]">
                        <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#c9ec63]/60 bg-[#c9ec63] text-2xl font-black text-[#18312a]">
                          {leader.initials || 'TR'}
                        </span>
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50/95 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 backdrop-blur-sm shadow-sm">
                        <Sparkles className="h-2.5 w-2.5" />
                        {body}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-stone-900 leading-snug">{leader.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#52720e]">
                      {leader.role}
                    </p>
                    {leader.description && (
                      <p className="mt-3 text-xs leading-relaxed text-[#718079] line-clamp-3">
                        {leader.description}
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* STATE DIRECTORS SECTION */}
      <section className="border-b border-[#18312a]/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">National coordination</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">State directors</h2>
            </div>
            <Link href="/find-help" className="inline-flex items-center gap-2 text-sm font-bold">
              Find support by state <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stateDirectors
              .filter((director) => director.status === 'active')
              .slice(0, 6)
              .map((director) => (
                <article key={director.id} className="overflow-hidden rounded-2xl border border-[#18312a]/10 bg-[#f7f8f5]">
                  <div className="h-56 bg-[#18312a] overflow-hidden">
                    {director.avatarUrl ? (
                      <img src={director.avatarUrl} alt={director.name} className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c9ec63] text-xl font-black text-[#18312a]">
                          {director.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#52720e]">{director.state} State</p>
                    <h3 className="mt-2 text-lg font-bold">{director.name}</h3>
                    <p className="mt-1 text-sm text-[#718079]">State Director &bull; {director.lga} LGA</p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* OUR NATIONAL MANDATE SECTION */}
      <section className="border-b border-[#18312a]/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">Our national mandate</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Prevention reaches further when communities act together.
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="border-l-2 border-[#c9ec63] pl-5">
                <h3 className="text-lg font-bold">Schools and young people</h3>
                <p className="mt-2 text-sm leading-7 text-[#64756f]">
                  We deliver age-appropriate drug education, establish prevention conversations and provide
                  learning resources that help students make informed choices.
                </p>
              </div>
              <div className="border-l-2 border-[#c9ec63] pl-5">
                <h3 className="text-lg font-bold">Families and individuals</h3>
                <p className="mt-2 text-sm leading-7 text-[#64756f]">
                  We offer a confidential route to counselling, professional assessment and rehabilitation
                  referral without judgment or delay.
                </p>
              </div>
              <div className="border-l-2 border-[#c9ec63] pl-5">
                <h3 className="text-lg font-bold">Communities and institutions</h3>
                <p className="mt-2 text-sm leading-7 text-[#64756f]">
                  We partner with state coordinators, civil society, hospitals and sports organisations to
                  expand prevention and recovery pathways.
                </p>
              </div>
              <div className="border-l-2 border-[#c9ec63] pl-5">
                <h3 className="text-lg font-bold">Youth participation</h3>
                <p className="mt-2 text-sm leading-7 text-[#64756f]">
                  Structured football, mentoring and community activities give young people a positive and
                  measurable alternative to drug-related harm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED ORGANISATION SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 rounded-3xl border border-[#18312a]/10 bg-[#eef1e6] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">Verified organisation</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Registered for transparent, accountable national work.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#64756f]">
              SIDAAP is incorporated under the CAC, holds SCUML anti-money laundering clearance and operates
              through accountable state and local coordination.
            </p>
          </div>
          <Link
            href="/credentials"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#18312a]/20 bg-white px-5 py-3 text-sm font-bold shadow-sm"
          >
            View credentials
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA CALL SECTION */}
      <section className="bg-[#18312a] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-14 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9ec63]">
              You do not have to face this alone
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Speak with someone today.
            </h2>
          </div>
          <a
            href="tel:08063430562"
            className="inline-flex items-center gap-3 rounded-lg bg-[#c9ec63] px-6 py-4 font-bold text-[#18312a] transition hover:bg-white shadow"
          >
            <Phone className="h-5 w-5" />
            Call 0806 343 0562
          </a>
        </div>
      </section>
    </main>
  )
}
