import Link from 'next/link'
import {
  AlertTriangle,
  FileText,
  Download,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Scale,
  Brain,
  HeartCrack,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export const metadata = {
  title: 'Resource Center & Drug Awareness — SIDAAP Nigeria',
  description: 'Evidence-based drug factsheets on Colorado, Mkpuru Mmiri, Tramadol, Codeine. NDLEA legal penalties, parent guides, and downloadable toolkits.',
}

const drugFactsheets = [
  {
    name: 'Colorado / Colo / Weed / Loud',
    streetNames: 'Igbo, Colo, Loud, Arizona, Cana, Skunk',
    forms: 'Dried leaves, synthetic vape liquids, edible gummies/brownies',
    dangers: [
      'Severe cognitive damage, memory loss, and failing examinations',
      'Acute drug-induced psychosis and permanent mental confusion',
      'Loss of academic prospects, university dropout',
      'Immediate NDLEA prosecution and criminal record'
    ],
    severity: 'High Risk / Severe Mental Impact'
  },
  {
    name: 'Mkpuru Mmiri / Crystal Meth / Ice',
    streetNames: 'Ice, Glass, Meth, Crystal, Chalk',
    forms: 'White crystalline shards, smoked via glass pipe or inhaled',
    dangers: [
      'Instant neurotoxic destruction of dopamine pathways in the brain',
      'Violent behavioral changes, paranoia, hallucinations',
      'Severe dental rot ("meth mouth") and extreme physical wasting',
      'Permanent psychosis, stroke, heart failure, and sudden death'
    ],
    severity: 'Critical / Extreme Neurological Hazard'
  },
  {
    name: 'Tramadol / Royal 225',
    streetNames: 'Tram, Trammy, Royal 225, Red Caps',
    forms: 'High-dose non-prescribed synthetic opioid tablets',
    dangers: [
      'Life-threatening epileptic seizures and convulsions',
      'Irreversible kidney and liver damage',
      'Rapid and excruciating physical addiction within weeks',
      'Respiratory arrest and sudden sleep death'
    ],
    severity: 'Lethal / Severe Physical Dependency'
  },
  {
    name: 'Codeine Cough Syrup ("Lean" / "Purple")',
    streetNames: 'Lean, Purple Drank, Syrup, Dirty Sprite',
    forms: 'Sweet pharmaceutical cough syrups mixed with carbonated drinks',
    dangers: [
      'Respiratory depression (breathing stops during sleep)',
      'Severe constipation, kidney stones, and liver poisoning',
      'Addiction masked as casual recreational sipping',
      'Banned strictly by NDLEA & NAFDAC without emergency hospital prescription'
    ],
    severity: 'Banned Substance / Organ Failure'
  },
  {
    name: 'Cocaine / Crack / Snow',
    streetNames: 'Coke, Charlie, Crack, Stones, White Dust',
    forms: 'White fine powder snorted, or crack rocks vaporized/smoked',
    dangers: [
      'Cardiovascular rupture, catastrophic strokes at early age',
      'Devastating psychological withdrawal and severe depression',
      'Financial destruction, violent crime, and societal alienation',
      'NDLEA statutory sentence: 15 to 25 years imprisonment'
    ],
    severity: 'Class A Narcotic / 15-25 Years Jail'
  }
]

const faqs = [
  {
    q: 'What should I do if I suspect my child or student is abusing drugs?',
    a: 'Remain calm and do not react with physical violence or public shame. Talk in private, observe physical signs (red eyes, slurred speech, sudden withdrawal, stolen money), and immediately reach out to our SIDAAP 24/7 Helpline (0806 343 0562) for confidential counseling and a medical triage assessment.'
  },
  {
    q: 'Is drug addiction a criminal offense or a health condition?',
    a: 'While unauthorized drug possession and trafficking carry severe legal penalties under the NDLEA Act, medical and psychiatric consensus clearly recognizes that addiction is a chronic neurobiological illness that requires clinical treatment, detox, therapy, and family support—not merely imprisonment.'
  },
  {
    q: 'Are SIDAAP counseling services and telephone helplines free?',
    a: 'Yes. All initial helpline assessments, advice, parent counseling, and state referral assistance offered directly by SIDAAP are 100% free and strictly confidential.'
  },
  {
    q: 'How can our secondary school receive free anti-drug exercise books?',
    a: 'School principals or student leaders can submit an outreach request through our Contact page or via email at smartinitiativedaap@gmail.com. Our state outreach team will schedule an interactive workshop and supply books for your students.'
  }
]

export default function ResourcesPage() {
  return (
    <div className="bg-[#f5f1e9] min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-[#13231f] text-[#f5f1e9] py-20 px-6 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(201,236,99,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,236,99,.15)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-4">
            <span className="h-1.5 w-8 bg-[#c9ec63]" />
            Evidence-Based Drug Facts &amp; Legal Framework
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl">
            Drug Awareness Resource Center
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#b6c4b9] leading-relaxed">
            Arming parents, educators, youth, and community leaders with clinical knowledge, legal realities, and actionable recovery pathways.
          </p>
        </div>
      </section>

      {/* Nigerian Legal Penalty Warning */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-3xl border border-red-900/30 bg-red-950/10 p-6 sm:p-8 text-red-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-900 text-white shadow-md">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <span className="font-mono text-xs uppercase font-bold text-red-800 tracking-wider">
                Nigerian Legal Penalties &bull; NDLEA Act Section 20(1), (2)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-red-950 mt-1">
                The Statutory Punishment for Drug Offenses in Nigeria
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
                Under Sub-Section 2(b) of the National Drug Law Enforcement Agency (NDLEA) Act of Nigeria, any person convicted of unlawful possession or use of controlled substances shall be sentenced to <strong>15 to 25 years imprisonment</strong>. Anyone found trafficking drugs or dangerous substances is liable to a <strong>death sentence or life imprisonment</strong>.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href="tel:08063430562"
              className="inline-flex items-center gap-2 rounded-xl bg-red-900 text-white px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-red-950 transition shadow-md"
            >
              Get Confidential Help Before It&apos;s Too Late
            </a>
          </div>
        </div>
      </section>

      {/* High-Risk Drug Factsheets */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 font-bold">
            Substance Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Dope Types, Street Names &amp; Clinical Consequences
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real facts from our medical and field research. No drug is safe—one try can destroy destiny.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drugFactsheets.map((drug) => (
            <div
              key={drug.name}
              className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-red-100 text-red-800 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5">
                    {drug.severity}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-stone-900">
                  {drug.name}
                </h3>

                <div className="mt-2 text-xs text-stone-500">
                  <strong>Street Names:</strong> {drug.streetNames}
                </div>
                <div className="mt-1 text-xs text-stone-500">
                  <strong>Common Form:</strong> {drug.forms}
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-stone-800 font-bold block mb-2">
                    Severe Dangers:
                  </span>
                  <ul className="space-y-1.5">
                    {drug.dangers.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-stone-700">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/find-help"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] text-white py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#1d3730] transition"
                >
                  Find Treatment Center
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prevention & Action Guides (From PDF page 4) */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* How to Prevent */}
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6">
              <Brain className="h-6 w-6" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-700 font-bold">
              Personal Resilience
            </span>
            <h3 className="text-2xl font-bold text-stone-900 mt-1">
              How to Prevent Drug Abuse
            </h3>
            <div className="mt-6 space-y-3 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-1" />
                <span><strong>Avoid High-Risk Places:</strong> Stay clear of hangouts and joints where drugs or alcohol are freely available.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-1" />
                <span><strong>Choose Positive Friendships:</strong> Peer pressure is not your boss. Real friends will never ask you to ruin your health or life.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-1" />
                <span><strong>Learn Healthy Stress Coping:</strong> Exercise, play football with SIDAAP Academy, listen to uplifting music, or talk to a mentor.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-1" />
                <span><strong>Set Daily Positive Affirmations:</strong> Remind yourself: <em>&ldquo;I will not be a drug addict. I will study, pray, and become a great leader.&rdquo;</em></span>
              </div>
            </div>
          </div>

          {/* How to Stop if already a victim */}
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
              <HeartCrack className="h-6 w-6" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-amber-700 font-bold">
              Recovery Road
            </span>
            <h3 className="text-2xl font-bold text-stone-900 mt-1">
              For Those Already Struggling (There is No Shame)
            </h3>
            <div className="mt-6 space-y-3 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-1" />
                <span><strong>Admit the Danger:</strong> Tell yourself: &ldquo;This substance is destroying my health and future. I must stop now.&rdquo;</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-1" />
                <span><strong>Cut off Toxic Associates:</strong> Say firmly: &ldquo;I don&apos;t use anymore, please stop asking me.&rdquo; Block drug suppliers.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-1" />
                <span><strong>Seek Medical &amp; Clinical Help:</strong> Withdrawal from opioids, meth, or alcohol requires medical supervision to prevent fatal seizures.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-1" />
                <span><strong>Call SIDAAP Helpline:</strong> Talk to a compassionate counselor who understands and will link you with safe treatment.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        {/* Parallax break before FAQs */}
        <div
          className="mb-12 rounded-3xl overflow-hidden relative py-20 bg-fixed bg-center bg-cover text-white shadow-xl"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1920&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1614]/80 via-[#13231f]/50 to-[#0c1614]/80" />
          <div className="relative z-10 mx-auto max-w-4xl px-8 text-center space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63] font-bold">Knowledge Is Protection · SIDAAP Resources</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Arm Yourself & Your Community with Facts
            </h2>
            <p className="text-sm sm:text-base text-[#d1d9cf] max-w-xl mx-auto leading-relaxed">
              Freely available guides, brochures, and expert answers to the most critical questions about drug abuse, Nigerian law, and recovery pathways.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 font-bold">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Common Questions on Drug Abuse, Laws &amp; Recovery
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-base font-bold text-stone-900 flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
