import Link from 'next/link'
import {
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  ExternalLink,
  Award,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#13231f] text-[#d1d9cf]">
      {/* Top Banner / Call to Action */}
      <div className="border-b border-white/10 bg-[#13231f] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#c9ec63]/15 border border-[#c9ec63]/30 px-3.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#c9ec63] font-bold">
              <span className="h-2 w-2 rounded-full bg-[#c9ec63] animate-pulse" />
              <span>24/7 National Emergency Hotline &bull; Confidential &amp; Toll-Free</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Need Immediate Confidential Assistance?
            </h3>
            <p className="text-xs sm:text-sm text-[#b6c4b9] max-w-2xl">
              Trained crisis responders and clinical counselors are on standby across all 36 States + FCT for medical detox, counseling, and direct rehab admissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:08063430562"
              className="flex items-center gap-2 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg"
            >
              <PhoneCall className="h-4 w-4 shrink-0" />
              <span>0806 343 0562</span>
            </a>
            <a
              href="tel:08028531259"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider transition"
            >
              <PhoneCall className="h-4 w-4 shrink-0 text-[#c9ec63]" />
              <span>0802 853 1259</span>
            </a>
            <Link
              href="/find-help"
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:border-[#c9ec63] hover:text-[#c9ec63] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition"
            >
              <MapPin className="h-4 w-4 shrink-0 text-[#c9ec63]" />
              <span>State Directory</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9ec63] text-[#13231f] font-black">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="font-mono text-xl font-bold tracking-widest text-white">
                SIDAAP
              </span>
            </div>
            <p className="mt-4 text-xs font-mono uppercase tracking-widest text-[#c9ec63]">
              Smart Initiative for Drug Abuse Awareness & Prevention
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#9fb0a2] max-w-sm">
              &ldquo;Breaking the Chains: Prevention, Treatment and Recovery for All!&rdquo; Dedicated to stopping drug abuse initiation, expanding rehabilitation pathways, and empowering youth through sports and education.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-xs text-[#b6c4b9]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#c9ec63] shrink-0 mt-0.5" />
                <span>Suite B22, 3rd Floor Sahzam Plaza, Plot 10 Alexandra Crescent, 26 First Avenue Wuse II, Abuja, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="h-4 w-4 text-[#c9ec63] shrink-0" />
                <span>0806 343 0562 &bull; 0802 853 1259 &bull; 0703 092 4398</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#c9ec63] shrink-0" />
                <a href="mailto:smartinitiativedaap@gmail.com" className="hover:text-white underline">
                  smartinitiativedaap@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#c9ec63] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#c9ec63] transition-colors">
                  About SIDAAP & Trustees
                </Link>
              </li>
              <li>
                <Link href="/find-help" className="hover:text-[#c9ec63] transition-colors">
                  Find Help in Your State
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-[#c9ec63] transition-colors">
                  Programs & Football Academy
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#c9ec63] transition-colors">
                  Drug Awareness Resource Center
                </Link>
              </li>
              <li>
                <Link href="/credentials" className="hover:text-[#c9ec63] transition-colors">
                  Verified Legal Credentials
                </Link>
              </li>
              <li>
                <Link href="/news-events" className="hover:text-[#c9ec63] transition-colors">
                  News & State Outreaches
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c9ec63] transition-colors">
                  Contact & Helplines
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs & Initiatives */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Core Initiatives
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs font-medium text-[#9fb0a2]">
              <li>Secondary School Outreaches</li>
              <li>Free Educational Exercise Books</li>
              <li>SIDAAP Football Academy Ltd</li>
              <li>Grassroots Community Rallies</li>
              <li>NDLEA Drug Demand Reduction</li>
              <li>Chartered Institute Training</li>
              <li>Residential Rehab Referrals</li>
              <li>Anti-Meth (Mkpuru Mmiri) Drive</li>
            </ul>
          </div>

          {/* Institutional Trust & Legal */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Official Registration
            </h4>
            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="font-mono text-[10px] uppercase text-[#c9ec63] block font-bold">
                  CAC Incorporation (NGO)
                </span>
                <span className="font-bold text-white">RN: 8390984</span>
                <p className="text-[11px] text-[#9fb0a2] mt-0.5">Companies & Allied Matters Act</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="font-mono text-[10px] uppercase text-[#c9ec63] block font-bold">
                  SCUML Anti-Money Laundering
                </span>
                <span className="font-bold text-white">RN: SC 151423666</span>
                <p className="text-[11px] text-[#9fb0a2] mt-0.5">Section 17(2)(a) AML Act 2022</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="font-mono text-[10px] uppercase text-[#c9ec63] block font-bold">
                  Football Academy Subsidiary
                </span>
                <span className="font-bold text-white">RC: 9864105</span>
                <p className="text-[11px] text-[#9fb0a2] mt-0.5">SIDAAP Football Academy Ltd</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#82928a]">
          <p>
            &copy; {new Date().getFullYear()} SIDAAP — Smart Initiative for Drug Abuse Awareness and Prevention. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/credentials" className="hover:text-white underline">
              View Legal Certificates
            </Link>
            <Link href="/contact" className="hover:text-white underline">
              Emergency Directory
            </Link>
            <Link href="/dashboard" className="text-[#c9ec63] hover:underline font-bold">
              Staff & Director Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
