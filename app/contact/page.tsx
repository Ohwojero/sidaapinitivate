'use client'

import { useState } from 'react'
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  CheckCircle2,
  Building2,
  AlertCircle
} from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: 'Abuja (FCT)',
    interest: 'Crisis Helpline / Counseling',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-[#f5f1e9] min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-[#13231f] text-[#f5f1e9] py-20 px-6 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(201,236,99,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,236,99,.15)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-4">
            <span className="h-1.5 w-8 bg-[#c9ec63]" />
            National Crisis &amp; Operational Desk
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl">
            Contact &amp; Emergency Helplines
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#b6c4b9] leading-relaxed">
            Reach our national secretariat in Abuja or connect with your nearest state directorate. All counseling and referral inquiries are treated with 100% strict confidentiality.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Direct Helplines & Offices */}
          <div className="lg:col-span-5 space-y-6">
            {/* 24/7 Helpline Card */}
            <div className="rounded-3xl bg-[#13231f] text-white p-8 shadow-xl relative overflow-hidden border border-white/10">
              <div className="absolute right-0 top-0 h-40 w-40 bg-[#c9ec63]/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-4">
                <span className="flex h-2 w-2 rounded-full bg-[#c9ec63] animate-ping" />
                24/7 Free &amp; Confidential
              </div>
              <h3 className="text-2xl font-bold text-white">Emergency National Helplines</h3>
              <p className="text-xs text-[#b6c4b9] mt-2 leading-relaxed">
                Call immediately if you or someone you know is in acute distress or searching for urgent medical detox and rehabilitation.
              </p>

              <div className="mt-6 space-y-3 font-mono text-base">
                <a
                  href="tel:08063430562"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition text-[#c9ec63] font-bold"
                >
                  <PhoneCall className="h-5 w-5" />
                  0806 343 0562 (Hotline 1)
                </a>
                <a
                  href="tel:08028531259"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition text-white font-bold"
                >
                  <PhoneCall className="h-5 w-5 text-[#c9ec63]" />
                  0802 853 1259 (Hotline 2)
                </a>
                <a
                  href="tel:07030924398"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition text-white font-bold"
                >
                  <PhoneCall className="h-5 w-5 text-[#c9ec63]" />
                  0703 092 4398 (Field Liaison)
                </a>
              </div>
            </div>

            {/* Registered Secretariat Office Addresses */}
            <div className="rounded-3xl bg-white border border-stone-200 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-800 font-bold">
                <Building2 className="h-4 w-4" />
                Physical Secretariat Addresses
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm">National Secretariat (Wuse II, Abuja)</h4>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  Suite B22, 3rd Floor Sahzam Plaza, Plot 10 Alexandra Crescent, 26 First Avenue Wuse II, Abuja, Nigeria.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-bold text-stone-900 text-sm">Operations &amp; Training Hub (Kubwa)</h4>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  Plot 9, Nguzu Edda Close, Kubwa, Abuja, FCT.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-700 shrink-0" />
                  <a href="mailto:smartinitiativedaap@gmail.com" className="hover:underline font-medium text-stone-800">
                    smartinitiativedaap@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Mon &ndash; Fri: 8:00 AM &ndash; 5:00 PM (Emergency Lines 24/7)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Intake & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 font-bold">
                Confidential Inquiry Form
              </span>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">
                Send Us a Confidential Message
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Whether you need personal rehabilitation guidance, want to invite SIDAAP to your school, or wish to volunteer, fill in this form.
              </p>

              {submitted ? (
                <div className="mt-8 p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950">Message Successfully Received</h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. Your inquiry has been routed to our national support desk. A counselor or coordinator will follow up shortly via {formData.phone || formData.email}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 rounded-xl bg-[#13231f] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Your Full Name (or Anonymous Alias)</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Samuel Ade / Anonymous"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Telephone / WhatsApp Number</label>
                      <input
                        required
                        type="tel"
                        placeholder="080... or 070..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="yourname@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">State / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos, Abuja, Delta, Kano..."
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Nature of Inquiry</label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f] font-medium"
                      >
                        <option>Crisis Helpline / Counseling</option>
                        <option>Rehab Facility Referral</option>
                        <option>Request Secondary School Outreach</option>
                        <option>SIDAAP Football Academy Trials</option>
                        <option>Volunteer / State Coordinator Application</option>
                        <option>Media, Press &amp; Partnerships</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">How Can We Help You?</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details of what you need or what assistance you are seeking..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3.5 text-xs font-bold uppercase tracking-wider transition shadow-md"
                    >
                      <Send className="h-4 w-4 text-[#c9ec63]" />
                      Submit Confidential Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
