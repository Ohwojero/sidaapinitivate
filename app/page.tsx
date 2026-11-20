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

  const carouselSlides = useMemo(() => {
    const nationalDirector =
      leadership.find((leader) => {
        const role = leader.role.toLowerCase()
        return role.includes('national executive') || role.includes('national director')
      }) ??
      leadership[0]
    const remainingLeaders = leadership.filter((leader) => leader.id !== nationalDirector?.id)
    const trustees = remainingLeaders.filter((leader) => leader.role.toLowerCase().includes('trustee'))
    const otherNationalLeaders = remainingLeaders.filter(
      (leader) => !leader.role.toLowerCase().includes('trustee'),
    )

    return [
      ...(nationalDirector
        ? [{
            id: `national-${nationalDirector.id}`,
            name: nationalDirector.name,
            role: nationalDirector.role,
            area: 'National leadership',
            image: getCarouselImage(nationalDirector.image),
            initials: nationalDirector.initials,
          }]
        : []),
      ...stateDirectors
        .filter((director) => director.status === 'active')
        .map((director) => ({
          id: `state-${director.id}`,
          name: director.name,
          role: 'State Director',
          area: `${director.state} · ${director.lga} LGA`,
          image: getCarouselImage(director.avatarUrl),
          initials: director.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
        })),
      ...trustees.map((leader) => ({
        id: leader.id,
        name: leader.name,
        role: leader.role,
        area: 'Board of Trustees',
        image: getCarouselImage(leader.image),
        initials: leader.initials,
      })),
      ...otherNationalLeaders.map((leader) => ({
        id: leader.id,
        name: leader.name,
        role: leader.role,
        area: 'National leadership',
        image: getCarouselImage(leader.image),
        initials: leader.initials,
      })),
    ]
  }, [leadership, stateDirectors])

  useEffect(() => {
    if (carouselSlides.length < 2) return
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselSlides.length)
    }, 5500)
    return () => window.clearInterval(timer)
  }, [carouselSlides.length])

  useEffect(() => {
    if (activeSlide >= carouselSlides.length) setActiveSlide(0)
  }, [activeSlide, carouselSlides.length])

  const changeSlide = (direction: -1 | 1) => {
    setActiveSlide((current) =>
      (current + direction + carouselSlides.length) % carouselSlides.length,
    )
  }
  const activeProfile = carouselSlides[activeSlide]

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#18312a]">
      <section className="border-b border-[#18312a]/10">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#18312a]/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]">
              <ShieldCheck className="h-4 w-4 text-[#52720e]" />
              Prevention, treatment and recovery
            </div>

            <h1 className="text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Protect potential.
              <span className="mt-2 block text-[#52720e]">Build safer futures.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#4e625b]">
              SIDAAP helps young people and families prevent drug abuse, find confidential support,
              and access rehabilitation services across Nigeria.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/find-help"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18312a] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#27483f]"
              >
                <MapPin className="h-4 w-4" />
                Find help near you
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#18312a]/20 bg-white px-6 py-4 text-sm font-bold transition hover:border-[#18312a]"
              >
                Explore our work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <a
              href="tel:08063430562"
              className="mt-7 inline-flex items-center gap-3 border-t border-[#18312a]/10 pt-5 text-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9ec63]">
                <Phone className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#61736d]">
                  Confidential helpline
                </span>
                <strong className="mt-0.5 block text-base">0806 343 0562</strong>
              </span>
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#18312a]">
              {activeProfile?.image ? (
                <img
                  key={activeProfile.id}
                  src={activeProfile.image}
                  alt={activeProfile.name}
                  className="h-full w-full object-cover object-top transition-opacity duration-500"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#18312a] to-[#315248]">
                  <span className="flex h-36 w-36 items-center justify-center rounded-full border border-[#c9ec63]/50 bg-[#c9ec63] text-5xl font-black text-[#18312a]">
                    {activeProfile?.initials || 'S'}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#101e1a] via-[#101e1a]/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9ec63]">
                  {activeProfile?.area || 'SIDAAP leadership'}
                </p>
                <h2 className="mt-2 text-2xl font-bold">{activeProfile?.name || 'SIDAAP Nigeria'}</h2>
                <p className="mt-1 text-sm text-white/75">{activeProfile?.role || 'Leadership team'}</p>
              </div>
              {carouselSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => changeSlide(-1)}
                    aria-label="Previous leader"
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur hover:bg-black/60"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeSlide(1)}
                    aria-label="Next leader"
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur hover:bg-black/60"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-2 right-6 flex gap-1.5">
                    {carouselSlides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Show ${slide.name}`}
                        aria-current={index === activeSlide}
                        className={`h-1.5 rounded-full transition-all ${
                          index === activeSlide ? 'w-6 bg-[#c9ec63]' : 'w-1.5 bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#52720e]">How we help</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One clear path, with support at every stage.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-[#18312a]/10 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8efd6]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Prevent</h3>
            <p className="mt-3 leading-7 text-[#64756f]">
              School outreach, awareness workshops and community campaigns that stop drug abuse before it starts.
            </p>
            <Link href="/programs" className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
              View programs <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-2xl border border-[#18312a]/10 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dcebe7]">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Treat</h3>
            <p className="mt-3 leading-7 text-[#64756f]">
              Confidential guidance and referrals to trusted hospitals and rehabilitation centres.
            </p>
            <Link href="/find-help" className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
              Find support <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-2xl border border-[#18312a]/10 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1e8cb]">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Recover</h3>
            <p className="mt-3 leading-7 text-[#64756f]">
              Youth mentorship and football programs that rebuild confidence, purpose and community.
            </p>
            <Link href="/programs" className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
              Join an initiative <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>

      <section className="border-y border-[#18312a]/10 bg-white">
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
                  <div className="h-48 bg-[#18312a]">
                    {director.avatarUrl ? (
                      <img src={director.avatarUrl} alt={director.name} className="h-full w-full object-cover" />
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

      <section className="border-y border-[#18312a]/10 bg-white">
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
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#18312a]/20 bg-white px-5 py-3 text-sm font-bold"
          >
            View credentials
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

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
            className="inline-flex items-center gap-3 rounded-lg bg-[#c9ec63] px-6 py-4 font-bold text-[#18312a] transition hover:bg-white"
          >
            <Phone className="h-5 w-5" />
            Call 0806 343 0562
          </a>
        </div>
      </section>
    </main>
  )
}
