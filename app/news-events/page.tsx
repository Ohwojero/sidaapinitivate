import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  ShieldCheck,
  Users,
  Megaphone,
  CheckCircle2,
  Clock
} from 'lucide-react'

export const metadata = {
  title: 'News & Outreach Events — SIDAAP Nigeria',
  description: 'Latest anti-drug rallies, secondary school outreaches, football academy tournaments, and state chapter updates.',
}

const newsList = [
  {
    id: 'school-exercise-books-campaign',
    category: 'School Outreach',
    title: 'SIDAAP Distributes Thousands of Anti-Drug Exercise Books Across Secondary Schools',
    date: 'October 24, 2026',
    state: 'Abuja (FCT)',
    summary: 'Secondary school students in Abuja and surrounding districts received free branded SIDAAP exercise books carrying daily anti-substance educational messages, promoting academic excellence over substance abuse.',
    readTime: '3 min read',
    featured: true
  },
  {
    id: 'ndlea-joint-community-march',
    category: 'Advocacy & Enforcement',
    title: 'SIDAAP & NDLEA Drug Demand Reduction Officers Lead Nationwide Sensitization Walk',
    date: 'October 12, 2026',
    state: 'Delta / Abuja',
    summary: 'Field coordinators marched side-by-side with NDLEA officials, holding banners and educating market vendors, motorists, and youth on the legal penalties and bodily hazards of Colorado and Tramadol.',
    readTime: '4 min read',
    featured: true
  },
  {
    id: 'football-academy-kit-unveiled',
    category: 'Sports & Youth',
    title: 'SIDAAP Football Academy Ltd Unveils New Kits and Launches Talent Trials',
    date: 'September 28, 2026',
    state: 'National',
    summary: 'Following official CAC incorporation under CAMA 2020 (RC: 9864105), the academy officially debuted its green/gold and royal blue kits under the theme "Developing Today\'s Talent for Tomorrow\'s Leaders."',
    readTime: '2 min read',
    featured: false
  },
  {
    id: 'mkpuru-mmiri-prevention-drive',
    category: 'Community Alert',
    title: 'Special Intervention: Countering the Resurgence of Mkpuru Mmiri (Ice) in Communities',
    date: 'September 15, 2026',
    state: 'Enugu / South East',
    summary: 'SIDAAP field counselors organized grassroots seminars warning families about the rapid neurotoxic damage of methamphetamine and establishing rapid triage referrals to psychiatric hospitals.',
    readTime: '5 min read',
    featured: false
  }
]

const upcomingEvents = [
  {
    title: 'FCT Secondary Schools Anti-Drug Summit & Quiz',
    date: 'November 14, 2026',
    time: '10:00 AM',
    location: 'Wuse Area Council Hall, Abuja',
    tag: 'School Outreach'
  },
  {
    title: 'Lagos State Inter-LGA Anti-Substance Football Tournament',
    date: 'November 28, 2026',
    time: '2:00 PM',
    location: 'Ikeja Sports Complex, Lagos',
    tag: 'Football Academy'
  },
  {
    title: 'Chartered Institute Frontline Prevention Training Seminar',
    date: 'December 05, 2026',
    time: '9:00 AM',
    location: 'Sahzam Plaza Training Suite, Wuse II, Abuja',
    tag: 'Professional Certification'
  }
]

export default function NewsEventsPage() {
  return (
    <div className="bg-[#f5f1e9] min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-[#13231f] text-[#f5f1e9] py-20 px-6 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(201,236,99,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,236,99,.15)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-4">
            <span className="h-1.5 w-8 bg-[#c9ec63]" />
            Field Updates &amp; State Activities
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl">
            News, Events &amp; Campaigns
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#b6c4b9] leading-relaxed">
            Stay informed on our nationwide anti-drug campaigns, school book drives, community sensitization walks, and sports tournaments across Nigeria.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main News Articles */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h2 className="text-2xl font-bold text-stone-900">
                Latest Field Dispatches &amp; News
              </h2>
              <span className="text-xs font-mono uppercase text-stone-500">
                Updated Daily
              </span>
            </div>

            <div className="space-y-6">
              {newsList.map((article) => (
                <article
                  key={article.id}
                  className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
                    <span className="rounded-full bg-[#13231f] text-[#c9ec63] px-3 py-1 font-mono uppercase font-bold text-[10px]">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-stone-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1 text-stone-500">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                      {article.state}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 hover:text-emerald-800 transition-colors">
                    {article.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-stone-500">
                      {article.readTime}
                    </span>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950"
                    >
                      Participate / Support <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Upcoming Events Calendar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-[#13231f] text-white p-6 sm:p-8 shadow-xl border border-white/10">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-4">
                <Calendar className="h-4 w-4" />
                Upcoming Campaigns
              </div>
              <h3 className="text-xl font-bold text-white">Event Calendar</h3>
              <p className="text-xs text-[#b6c4b9] mt-1 mb-6">
                Join SIDAAP at an outreach near you:
              </p>

              <div className="space-y-4">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.title}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-[#c9ec63]/50 transition"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#c9ec63] block font-bold">
                      {evt.tag}
                    </span>
                    <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                    <div className="space-y-1 text-xs text-[#a9b9a8]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#c9ec63]" />
                        <span>{evt.date} &bull; {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#c9ec63]" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] py-3 text-xs font-bold uppercase tracking-wider transition font-mono"
                >
                  Register to Attend
                </Link>
              </div>
            </div>

            {/* Media & Press Contact Card */}
            <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
              <h4 className="font-bold text-stone-900 text-sm">Media &amp; Press Relations</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Journalists, broadcasters, and photojournalists covering national drug awareness or community campaigns can reach our media desk:
              </p>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-1">
                <span className="block font-bold text-stone-800">SIDAAP Press Desk</span>
                <span className="block text-emerald-800 font-mono">smartinitiativedaap@gmail.com</span>
                <span className="block text-stone-600 font-mono">0806 343 0562</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
