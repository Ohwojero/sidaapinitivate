'use client'

import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  X,
  Send,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react'
import {
  ChatMessage,
  getStoredChatMessages
} from '@/lib/data/portal-data'
import { sendChatMessage } from '@/lib/supabase/chat'
import { NIGERIA_STATES } from '@/lib/data/nigeria-data'

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'whatsapp'>('chat')
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorState, setVisitorState] = useState('Lagos State')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [whatsappTopic, setWhatsappTopic] = useState('Rehab Referral')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat messages
  const loadMessages = () => {
    const all = getStoredChatMessages()
    const inquiryMessages = all['room-public-inquiries'] || []
    setMessages(inquiryMessages)
  }

  useEffect(() => {
    loadMessages()
    const handleUpdate = () => loadMessages()
    window.addEventListener('sidaap_chat_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('sidaap_chat_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    setHasStartedChat(true)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const timeString = `${hours}:${minutes}`

    const displayName = visitorName.trim() || 'Anonymous Citizen'
    const newMsg: ChatMessage = {
      id: `visitor-${Date.now()}`,
      roomId: 'room-public-inquiries',
      senderId: `visitor-${visitorPhone || 'anon'}`,
      senderName: `${displayName} (${visitorState})`,
      senderRole: 'Public Visitor',
      text: inputMessage.trim(),
      timestamp: timeString,
      isMe: true
    }

    sendChatMessage('room-public-inquiries', newMsg)
    setInputMessage('')
  }

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault()
    const displayName = visitorName.trim() || 'Visitor'
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const timeString = `${hours}:${minutes}`

    // Log the WhatsApp click into the SIDAAP Dashboard so staff have a record
    const logMsg: ChatMessage = {
      id: `wa-${Date.now()}`,
      roomId: 'room-public-inquiries',
      senderId: `wa-inquiry`,
      senderName: `${displayName} (${visitorState}) [WhatsApp Connect]`,
      senderRole: 'WhatsApp Lead',
      text: `Inquiry regarding: ${whatsappTopic}. Direct WhatsApp session initiated to 0806 343 0562.`,
      timestamp: timeString
    }
    sendChatMessage('room-public-inquiries', logMsg)

    // Formatted WhatsApp URL
    const prefillText = `Hello SIDAAP Nigeria, my name is ${displayName} from ${visitorState}. I am reaching out regarding: ${whatsappTopic}.`
    const url = `https://wa.me/2348063430562?text=${encodeURIComponent(prefillText)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* FLOATING TRIGGER BUTTON (When closed) */}
      {/* ------------------------------------------------------------- */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-[#13231f] hover:bg-[#1a332d] text-white pl-4 pr-5 py-3 shadow-2xl border border-[#c9ec63]/40 transition-all hover:scale-105 group"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#c9ec63] text-[#13231f] font-black shrink-0">
            <MessageSquare className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#13231f] animate-ping" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#13231f]" />
          </div>
          <div className="text-left">
            <span className="block text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-[#c9ec63] transition-colors">
              Live Crisis &amp; Support Desk
            </span>
            <span className="block text-[10px] text-[#a9b9a8] font-mono">
              Chat on Web or WhatsApp &bull; 24/7
            </span>
          </div>
        </button>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE CHAT MODAL (When opened) */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[390px] h-[580px] max-h-[85vh] rounded-3xl bg-[#0e1a17] text-white border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#13231f] p-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-black shrink-0 shadow">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    SIDAAP Support Desk
                  </h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-[#a9b9a8] font-mono">
                  Online &bull; 36 States + FCT Directorate
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition"
              title="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-[#13231f]/60 p-1.5 border-b border-white/10 text-xs font-mono font-bold shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-[#c9ec63] text-[#13231f]'
                  : 'text-[#a9b9a8] hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Live Web Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'whatsapp'
                  ? 'bg-[#00a884] text-white'
                  : 'text-[#a9b9a8] hover:text-white'
              }`}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>WhatsApp Desk</span>
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: LIVE ON-WEBSITE CHAT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {!hasStartedChat ? (
                // Quick Intake Form to direct case properly
                <form
                  onSubmit={handleStartChat}
                  className="flex-1 p-5 flex flex-col justify-between overflow-y-auto"
                >
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 text-xs text-[#b6c4b9] space-y-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-[#c9ec63]" />
                        100% Confidential Statutory Care
                      </span>
                      <p className="text-[11px] leading-relaxed">
                        Chat directly with SIDAAP National and State Directors. You can remain anonymous or provide contact details for follow-up.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1">
                        Your Name or Anonymous Alias
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Concerned Parent or Anonymous"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1">
                        Which State Are You In?
                      </label>
                      <select
                        value={visitorState}
                        onChange={(e) => setVisitorState(e.target.value)}
                        className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63]"
                      >
                        {NIGERIA_STATES.map((s) => (
                          <option key={s.name} value={s.name} className="bg-stone-900 text-white">
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 080... (for SMS or callback)"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] font-bold uppercase tracking-wider text-xs transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Start Confidential Chat</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                // Chat Feed & Input
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Welcome System Message */}
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-[11px] text-[#b6c4b9] leading-relaxed">
                      <span className="font-bold text-[#c9ec63] block mb-0.5">
                        🛡️ SIDAAP Statutory Help Desk Active
                      </span>
                      Welcome! Our National and State teams are online. Describe your situation below — whether you need medical rehab assistance, school campaigns, or Football Academy details.
                    </div>

                    {messages.map((m) => {
                      const isVisitor = m.senderRole === 'Public Visitor' || m.senderRole === 'Citizen Inquiry'
                      const isMe = m.isMe || isVisitor
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isMe
                                ? 'bg-[#c9ec63] text-[#13231f] rounded-br-none font-medium'
                                : 'bg-[#182c27] text-white border border-white/10 rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1 text-[10px] opacity-75 font-mono">
                              <span className="font-bold truncate">{m.senderName}</span>
                              <span>{m.timestamp}</span>
                            </div>
                            <p>{m.text}</p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Field */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 bg-[#13231f] border-t border-white/10 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Type your message to SIDAAP directors..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 bg-[#182c27] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63] placeholder:text-white/40"
                    />
                    <button
                      type="submit"
                      className="h-10 w-10 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] flex items-center justify-center shrink-0 transition"
                      title="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: WHATSAPP DIRECT DESK */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'whatsapp' && (
            <form
              onSubmit={handleWhatsAppRedirect}
              className="flex-1 p-5 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#00a884]/15 border border-[#00a884]/30 p-3.5 text-xs text-emerald-200 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <PhoneCall className="h-4 w-4 text-[#00a884]" />
                    Official WhatsApp Helpline: 0806 343 0562
                  </span>
                  <p className="text-[11px] leading-relaxed text-emerald-100/80">
                    Connect directly to SIDAAP counselors and National HQ on WhatsApp. Your inquiry is also logged in our statutory portal for fast tracking.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1">
                    Your Name or Alias
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Joy or Anonymous"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1">
                    Your State Location
                  </label>
                  <select
                    value={visitorState}
                    onChange={(e) => setVisitorState(e.target.value)}
                    className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                  >
                    {NIGERIA_STATES.map((s) => (
                      <option key={s.name} value={s.name} className="bg-stone-900 text-white">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1">
                    Topic of Inquiry
                  </label>
                  <select
                    value={whatsappTopic}
                    onChange={(e) => setWhatsappTopic(e.target.value)}
                    className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                  >
                    <option value="Medical Rehab & Detox Referral">Medical Rehab &amp; Detox Referral</option>
                    <option value="Confidential Crisis Counseling">Confidential Crisis Counseling</option>
                    <option value="Secondary School Outreach & Exercise Books">Secondary School Outreach &amp; Books</option>
                    <option value="SIDAAP Football Academy Enrolment">SIDAAP Football Academy Enrolment</option>
                    <option value="Volunteer / Partnership with State Desk">Volunteer / Partnership with State Desk</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 rounded-xl bg-[#00a884] hover:bg-[#02be96] text-white font-bold uppercase tracking-wider text-xs transition shadow-xl flex items-center justify-center gap-2"
              >
                <span>Launch WhatsApp Conversation</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="p-2.5 bg-[#0c1614] border-t border-white/10 text-[10px] text-[#a9b9a8] font-mono text-center shrink-0">
            SIDAAP Nigeria &bull; CAC RN: 8390984 &bull; SCUML Certified
          </div>
        </div>
      )}
    </div>
  )
}
