'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getStoredLeadership, LeadershipMember } from '@/lib/data/leadership-data'
import {
  ShieldCheck,
  HeartHandshake,
  Users,
  Target,
  Eye,
  Award,
  Building2,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export default function AboutPage() {
  const [leaders, setLeaders] = useState<LeadershipMember[]>(getStoredLeadership)

  useEffect(() => {
    const refresh = () => setLeaders(getStoredLeadership())
    refresh()
    window.addEventListener('sidaap_leadership_updated', refresh)
    return () => window.removeEventListener('sidaap_leadership_updated', refresh)
  }, [])

  return (
    <div className="bg-[#f5f1e9] min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-[#13231f] text-[#f5f1e9] py-20 px-6 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(201,236,99,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,236,99,.15)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-4">
            <span className="h-1.5 w-8 bg-[#c9ec63]" />
            National Civic-Health Movement
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl">
            About SIDAAP Nigeria
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#b6c4b9] leading-relaxed">
            Smart Initiative for Drug Abuse Awareness and Prevention is a registered national non-governmental organization dedicated to breaking the chains of substance dependency across Nigerian schools, families, and communities.
          </p>

          <div className="mt-8 inline-block rounded-2xl bg-white/10 px-6 py-4 border border-white/15">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63] block font-bold">
              Our Shared National Slogan
            </span>
            <p className="font-serif text-xl sm:text-2xl text-white italic mt-1">
              &ldquo;Breaking the Chains: Prevention, Treatment and Recovery for All!&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Core Aims, Vision, Mission, Objectives */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* AIMS */}
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6">
                <Target className="h-6 w-6" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                01 / Mandate
              </span>
              <h3 className="text-2xl font-bold text-stone-900 mt-2">Our Aims</h3>
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                To prevent and treat drug abuse through education, rehabilitation, and community-driven development initiatives. We foster a supportive environment promoting physical and mental well-being leading to a substance-free lifestyle.
              </p>
            </div>
          </div>

          {/* VISION */}
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-6">
                <Eye className="h-6 w-6" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-700">
                02 / Future
              </span>
              <h3 className="text-2xl font-bold text-stone-900 mt-2">Our Vision</h3>
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                To create a society where individuals, youths, and families are empowered to make healthy choices, totally free from the negative impact and destructive grip of substance abuse.
              </p>
            </div>
          </div>

          {/* OBJECTIVES */}
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-700">
                03 / Focus
              </span>
              <h3 className="text-2xl font-bold text-stone-900 mt-2">Objectives</h3>
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                To aggressively prevent the initial experimentation of drugs and stop the progression into full clinical addiction among youths who have already initiated use.
              </p>
            </div>
          </div>

          {/* MISSION */}
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-6">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-purple-700">
                04 / Execution
              </span>
              <h3 className="text-2xl font-bold text-stone-900 mt-2">Our Mission</h3>
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                To deliver factual drug education, suppress illicit supply by collaborating with NDLEA, NAFDAC, and police agencies, and coordinate multi-stakeholder anti-drug coalitions nationwide.
              </p>
            </div>
          </div>
        </div>

        {/* Parallax Break — Community & Hope */}
        <div
          className="mt-16 rounded-3xl overflow-hidden relative py-20 bg-fixed bg-center bg-cover text-white shadow-xl"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1614]/80 via-[#13231f]/50 to-[#0c1614]/80" />
          <div className="relative z-10 mx-auto max-w-4xl px-8 text-center space-y-5">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63] font-bold">Our Guiding Principle</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              &ldquo;Prevention Is Cheaper Than Cure — Education Is Our First Drug Policy&rdquo;
            </h2>
            <p className="text-sm sm:text-base text-[#d1d9cf] max-w-2xl mx-auto leading-relaxed">
              From classrooms in Benin City to football pitches in Abuja, SIDAAP&apos;s boots-on-the-ground approach is transforming Nigerian communities one awareness session at a time.
            </p>
          </div>
        </div>

        {/* Board of Trustees Section */}
        <div className="mt-16 rounded-3xl bg-[#13231f] text-white p-8 sm:p-14 relative overflow-hidden">
          <div className="relative z-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63]">
              Statutory Governance &bull; CAC RN: 8390984
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-white">
              Board of Trustees &amp; Executive Leadership
            </h2>
            <p className="mt-3 text-sm text-[#b6c4b9] max-w-2xl leading-relaxed">
              Duly appointed under the Companies and Allied Matters Act 2020 to steward the organisation’s mission, legal compliance, and national expansion.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((leader) => (
                <article key={leader.name} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07]">
                  <div className="relative h-52 bg-[#0c1614]">
                    {leader.image ? (
                      <img src={leader.image} alt={leader.name} className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#c9ec63]/50 bg-[#c9ec63] text-2xl font-black text-[#13231f]">
                          {leader.initials}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c1614] to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white">{leader.name}</h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#c9ec63]">
                      {leader.role}
                    </p>
                    <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-[#b6c4b9]">
                      {leader.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Partnerships Section */}
        <div className="mt-16 rounded-3xl bg-white border border-stone-200 p-8 sm:p-12">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-700 font-bold">
              Multi-Stakeholder Collaboration
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Working Alongside National Law Enforcement &amp; Health Institutions
            </h2>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              Drug abuse cannot be combatted in isolation. SIDAAP collaborates directly with federal security agencies, academic boards, and medical associations:
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">NDLEA</h4>
              <p className="text-xs font-mono text-stone-500 uppercase mt-0.5">Drug Demand Reduction Unit</p>
              <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                Joint street sensitizations, school outreach permissions, and verified referral to public addiction triage services.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">Secondary Schools Boards</h4>
              <p className="text-xs font-mono text-stone-500 uppercase mt-0.5">Youth Sensitization</p>
              <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                Free distribution of anti-drug branded exercise books and establishment of peer-led Drug-Free Student Clubs.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">Sports Federations</h4>
              <p className="text-xs font-mono text-stone-500 uppercase mt-0.5">SIDAAP Football Academy</p>
              <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                Providing structured athletic training, tournaments, and mentorship to keep young men and women off the streets.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/credentials"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 underline"
            >
              Review all verified CAC, SCUML and Trademark documentation &rarr;
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#13231f] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#1d3730] transition"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
