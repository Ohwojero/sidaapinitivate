import Link from 'next/link'
import {
  GraduationCap,
  Trophy,
  Users2,
  HeartHandshake,
  Award,
  Megaphone,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react'

export const metadata = {
  title: 'Programs & Initiatives — SIDAAP Nigeria',
  description: 'School awareness campaigns, SIDAAP Football Academy Ltd, community rallies, counseling support, and professional training.',
}

const programsList = [
  {
    id: 'school-awareness',
    category: 'Education & Schools',
    title: 'Secondary School Outreach & Exercise Book Campaign',
    tagline: 'Educating young minds before experimentation starts.',
    icon: GraduationCap,
    description: 'Direct interactive workshops held in secondary schools across Nigerian states. We educate students on the real physiological dangers of synthetic substances like Colorado, Mkpuru Mmiri, and Tramadol. To reinforce the message every day in the classroom, SIDAAP manufactures and distributes free branded anti-drug exercise books directly to students.',
    highlights: [
      'Interactive student Q&A assemblies with real-life survivor testimonials',
      'Free distribution of custom anti-drug 60-leaves exercise books',
      'Formation of school-based peer Drug-Free Clubs',
      'Training teachers to identify early behavioral warning signs'
    ],
    badge: 'Flagship Initiative'
  },
  {
    id: 'football-academy',
    category: 'Youth Empowerment & Sports',
    title: 'SIDAAP Football Academy Ltd (RC: 9864105)',
    tagline: 'Developing today’s athletic talent for tomorrow’s leaders.',
    icon: Trophy,
    description: 'Incorporated under CAMA 2020 as an official athletic development subsidiary, the SIDAAP Football Academy provides structured training, discipline, character education, and scouting opportunities for talented youth in vulnerable communities. By channeling energy, focus, and passion into professional sport, we keep vulnerable boys and girls off the streets.',
    highlights: [
      'Professional coaching staff, official team kits, and training camps',
      'Zero-tolerance drug testing and mandatory health education',
      'Scouting showcases, regional tournament competitions, and mentorship',
      'Led by Trustee & Sports Director Prosper Ohwojero (#7 SIDAAP Kit)'
    ],
    badge: 'CAC Incorporated'
  },
  {
    id: 'community-rallies',
    category: 'Grassroots Advocacy',
    title: 'Community & Market Sensitization Marches',
    tagline: 'Mobilising streets, motor parks, and local markets.',
    icon: Megaphone,
    description: 'Grassroots street walks and market rallies conducted in partnership with NDLEA field officers, state police commands, and community youth associations. We distribute flyers, display awareness placards in indigenous languages, and engage transport unions, market women, and street leaders.',
    highlights: [
      'Multi-stakeholder anti-drug street processions with audio broadcast trucks',
      'Distribution of localized flyers breaking down legal penalties and dangers',
      'Direct engagement with motor park unions (NURTW) and market executives',
      'Establishment of local neighborhood alert monitors'
    ],
    badge: 'Community Mobilisation'
  },
  {
    id: 'counseling-rehab',
    category: 'Clinical Care & Recovery',
    title: 'Counseling & Rehabilitation Support Network',
    tagline: 'A compassionate, non-punitive path to full recovery.',
    icon: HeartHandshake,
    description: 'Through our 24/7 helplines and state desks, SIDAAP provides confidential telephone crisis support, family counseling, and direct referral pathways to accredited psychiatric and rehabilitation centers across Nigeria. We believe addiction is a medical sickness, not a moral failure.',
    highlights: [
      '24/7 confidential helplines (0806 343 0562 & 0802 853 1259)',
      'Free telephone triage and assessment by trained counselors',
      'Warm handover and admission support to verified partner rehab centers',
      'Post-detoxification aftercare monitoring and family support groups'
    ],
    badge: 'Confidential Service'
  },
  {
    id: 'training-institute',
    category: 'Professional Capacity',
    title: 'Chartered Institute of Drug Prevention & Crime Reduction',
    tagline: 'Building certified frontline prevention leaders.',
    icon: Award,
    description: 'Trademark accepted under Class 41 (NG/TM/O/2026/472454), this specialized institute delivers structured curricula for youth leaders, teachers, faith leaders, and NGO field officers on modern evidence-based substance abuse prevention and crime mitigation.',
    highlights: [
      'Accredited certification courses in substance abuse prevention counseling',
      'Workshops on community crime mitigation and youth behavioral de-escalation',
      'Annual national drug demand reduction summits',
      'Research and policy publications on Nigerian drug prevalence trends'
    ],
    badge: 'Trademark Accepted'
  }
]

export default function ProgramsPage() {
  return (
    <div className="bg-[#f5f1e9] min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-[#13231f] text-[#f5f1e9] py-20 px-6 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(201,236,99,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,236,99,.15)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-4">
            <span className="h-1.5 w-8 bg-[#c9ec63]" />
            Action On The Ground
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl">
            Our Programs &amp; Initiatives
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#b6c4b9] leading-relaxed">
            From secondary school classrooms and sports football academies to market street marches and clinical triage, explore how SIDAAP intervenes at every stage of the prevention lifecycle.
          </p>
        </div>
      </section>

      {/* Programs List */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 space-y-12">

        {/* Parallax Break before programs */}
        <div
          className="rounded-3xl overflow-hidden relative py-20 bg-fixed bg-center bg-cover text-white shadow-xl"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1543357480-c60d40a4ecca?auto=format&fit=crop&w=1920&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1614]/80 via-[#13231f]/50 to-[#0c1614]/80" />
          <div className="relative z-10 mx-auto max-w-4xl px-8 text-center space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63] font-bold">SIDAAP In Action · Nationwide</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Seven Pillars of Drug Abuse Prevention
            </h2>
            <p className="text-sm sm:text-base text-[#d1d9cf] max-w-xl mx-auto leading-relaxed">
              Targeted, evidence-based interventions covering schools, communities, sports, counseling, training, and law-enforcement collaboration across all 36 Nigerian states.
            </p>
          </div>
        </div>

        {programsList.map((prog, index) => {
          const Icon = prog.icon
          const isEven = index % 2 === 1

          return (
            <div
              key={prog.id}
              className={`rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 shadow-sm flex flex-col ${
                isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } gap-10 items-stretch justify-between`}
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="rounded-full bg-[#13231f] text-[#c9ec63] px-3 py-1 text-[11px] font-mono uppercase tracking-wider font-bold">
                      {prog.badge}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      {prog.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                    {prog.title}
                  </h3>

                  <p className="mt-2 text-sm font-serif italic text-emerald-800">
                    &ldquo;{prog.tagline}&rdquo;
                  </p>

                  <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="mt-6 space-y-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-stone-800 font-bold block mb-1">
                      Key Outcomes &amp; Activities:
                    </span>
                    {prog.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-xs text-stone-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition"
                  >
                    Bring to Your Community <ArrowRight className="h-3.5 w-3.5 text-[#c9ec63]" />
                  </Link>
                  <Link
                    href="/credentials"
                    className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 underline"
                  >
                    View Official Registrations
                  </Link>
                </div>
              </div>

              {/* Visual Card / Highlights */}
              <div className="lg:w-80 rounded-2xl bg-gradient-to-br from-[#13231f] to-[#1c3831] p-8 text-white flex flex-col justify-between shadow-md">
                <div>
                  <div className="h-14 w-14 rounded-2xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63]">
                    National Movement
                  </span>
                  <h4 className="text-xl font-bold mt-1 text-white">SIDAAP Nigeria</h4>
                  <p className="text-xs text-[#b6c4b9] mt-3 leading-relaxed">
                    Active in Nigerian secondary schools, sports leagues, and communities. Dedicated to protecting potential and saving youth destinies.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <span className="text-[11px] font-mono text-[#c9ec63] block font-bold">Free Helpline:</span>
                  <span className="text-sm font-mono font-bold text-white">0806 343 0562</span>
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
