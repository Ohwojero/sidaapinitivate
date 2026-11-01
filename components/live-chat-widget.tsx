'use client'

import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  X,
  Send,
  PhoneCall,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Check,
  CheckCheck
} from 'lucide-react'
import { ChatMessage, getStoredChatMessages } from '@/lib/data/portal-data'
import { sendChatMessage } from '@/lib/supabase/chat'
import { NIGERIA_STATES } from '@/lib/data/nigeria-data'

const V_ID_KEY    = 'sidaap_visitor_id'
const V_PHONE_KEY = 'sidaap_visitor_phone'
const V_STATE_KEY = 'sidaap_visitor_state'
const V_SEEN_KEY  = 'sidaap_visitor_last_seen'

function getOrCreateId(phone: string): string {
  let id = localStorage.getItem(V_ID_KEY)
  if (!id) {
    id = `visitor-${phone}-${Date.now()}`
    localStorage.setItem(V_ID_KEY, id)
  }
  return id
}

function getRoomId(state: string) {
  const slug = state.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return `room-public-${slug}`
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen]           = useState(false)
  const [activeTab, setActiveTab]     = useState<'chat' | 'whatsapp'>('chat')
  const [registered, setRegistered]   = useState(false)
  const [phone, setPhone]             = useState('')
  const [state, setState]             = useState('Lagos')
  const [inputMsg, setInputMsg]       = useState('')
  const [messages, setMessages]       = useState<ChatMessage[]>([])
  const [unread, setUnread]           = useState(0)
  const [whatsappTopic, setWhatsappTopic] = useState('Rehab Referral')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isSendingRef   = useRef(false)
  const myIdRef        = useRef<string>('')

  // On mount — restore saved visitor
  useEffect(() => {
    const savedPhone = localStorage.getItem(V_PHONE_KEY)
    const savedState = localStorage.getItem(V_STATE_KEY)
    if (savedPhone && savedState) {
      setPhone(savedPhone)
      setState(savedState)
      myIdRef.current = getOrCreateId(savedPhone)
      setRegistered(true)
    }
  }, [])

  const roomId = getRoomId(state)

  const loadMessages = () => {
    if (isSendingRef.current) return
    const all  = getStoredChatMessages()
    const msgs = (all[roomId] || []).map(m => ({
      ...m,
      isMe: m.senderId === myIdRef.current
    }))
    setMessages(msgs)

    if (!isOpen) {
      const seen       = parseInt(localStorage.getItem(V_SEEN_KEY) || '0', 10)
      const staffCount = msgs.filter(m => !m.isMe).length
      setUnread(Math.max(0, staffCount - seen))
    }
  }

  useEffect(() => {
    if (!registered) return
    loadMessages()
    window.addEventListener('sidaap_chat_updated', loadMessages)
    window.addEventListener('storage', loadMessages)
    return () => {
      window.removeEventListener('sidaap_chat_updated', loadMessages)
      window.removeEventListener('storage', loadMessages)
    }
  }, [registered, roomId])

  // Mark as seen when opened
  useEffect(() => {
    if (isOpen && registered) {
      const staffCount = messages.filter(m => !m.isMe).length
      localStorage.setItem(V_SEEN_KEY, String(staffCount))
      setUnread(0)
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [messages])

  // Register visitor
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    localStorage.setItem(V_PHONE_KEY, phone.trim())
    localStorage.setItem(V_STATE_KEY, state)
    myIdRef.current = getOrCreateId(phone.trim())
    setRegistered(true)
  }

  // Send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMsg.trim()) return

    const now        = new Date()
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const newMsg: ChatMessage = {
      id:         `visitor-${Date.now()}`,
      roomId,
      senderId:   myIdRef.current,
      senderName: `${phone} (${state})`,
      senderRole: 'Public Visitor',
      text:       inputMsg.trim(),
      timestamp:  timeString,
      isMe:       true,
      status:     'sent'
    }

    isSendingRef.current = true
    sendChatMessage(roomId, newMsg)
    setMessages(prev => [...prev, newMsg])
    setInputMsg('')
    // After short delay mark as delivered (double tick)
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
      isSendingRef.current = false
    }, 1000)
  }

  // WhatsApp
  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    const now        = new Date()
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    sendChatMessage(roomId, {
      id:         `wa-${Date.now()}`,
      roomId,
      senderId:   'wa-inquiry',
      senderName: `${phone || 'Visitor'} (${state}) [WhatsApp]`,
      senderRole: 'WhatsApp Lead',
      text:       `Inquiry: ${whatsappTopic}. WhatsApp initiated to 0806 343 0562.`,
      timestamp:  timeString
    })
    const text = `Hello SIDAAP Nigeria, I am ${phone || 'a visitor'} from ${state}. Inquiry: ${whatsappTopic}.`
    window.open(`https://wa.me/2348063430562?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">

      {/* ── Floating Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2.5 rounded-full bg-[#13231f] hover:bg-[#1a332d] text-white pl-4 pr-5 py-3 shadow-2xl border border-[#c9ec63]/40 transition-all hover:scale-105 group"
        >
          {unread > 0 && (
            <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-bounce">
              {unread}
            </span>
          )}
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
              {unread > 0 ? `${unread} new repl${unread === 1 ? 'y' : 'ies'} from SIDAAP` : 'Chat on Web or WhatsApp • 24/7'}
            </span>
          </div>
        </button>
      )}

      {/* ── Chat Modal ── */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[390px] h-[600px] max-h-[85vh] rounded-3xl bg-[#0e1a17] text-white border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

          {/* Header */}
          <div className="bg-[#13231f] p-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-black shrink-0 shadow">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">SIDAAP Support Desk</h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-[#a9b9a8] font-mono">
                  {registered ? `${phone} • ${state}` : 'Online • 36 States + FCT'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {registered && (
                <button
                  onClick={() => {
                    localStorage.removeItem(V_ID_KEY)
                    localStorage.removeItem(V_PHONE_KEY)
                    localStorage.removeItem(V_STATE_KEY)
                    localStorage.removeItem(V_SEEN_KEY)
                    setRegistered(false)
                    setPhone('')
                    setState('Lagos')
                    setMessages([])
                  }}
                  className="text-[10px] text-white/40 hover:text-white/70 font-mono transition"
                  title="Switch account"
                >
                  change
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 bg-[#13231f]/60 p-1.5 border-b border-white/10 text-xs font-mono font-bold shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-[#c9ec63] text-[#13231f]' : 'text-[#a9b9a8] hover:text-white'}`}
            >
              <MessageSquare className="h-3.5 w-3.5" /><span>Live Web Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-2 ${activeTab === 'whatsapp' ? 'bg-[#00a884] text-white' : 'text-[#a9b9a8] hover:text-white'}`}
            >
              <PhoneCall className="h-3.5 w-3.5" /><span>WhatsApp Desk</span>
            </button>
          </div>

          {/* ── TAB 1: CHAT ── */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {!registered ? (
                /* Registration Form */
                <form onSubmit={handleRegister} className="flex-1 p-5 flex flex-col justify-center gap-5">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-[11px] text-[#b6c4b9] leading-relaxed">
                    <span className="font-bold text-[#c9ec63] block mb-1">🛡️ SIDAAP Statutory Help Desk</span>
                    Enter your phone number and state to start chatting with your State Director directly.
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="e.g. 08012345678"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63] placeholder:text-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1.5">
                        Your State
                      </label>
                      <select
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63]"
                      >
                        {NIGERIA_STATES.map(s => (
                          <option key={s.name} value={s.name} className="bg-stone-900 text-white">{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] font-bold uppercase tracking-wider text-xs transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Start Chat</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                /* Chat Feed */
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-[11px] text-[#b6c4b9] leading-relaxed">
                      <span className="font-bold text-[#c9ec63] block mb-0.5">🛡️ {state} State Desk</span>
                      {messages.length > 0 ? 'Welcome back! Your conversation continues below.' : 'Your message goes directly to the SIDAAP State Director for your state.'}
                    </div>

                    {messages.map(m => (
                      <div key={m.id} className={`flex w-full ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                          m.isMe
                            ? 'bg-[#005c4b] text-white rounded-tr-none border border-[#00a884]/20'
                            : 'bg-[#1e2f2b] text-white rounded-tl-none border border-white/10'
                        }`}>
                          {!m.isMe && (
                            <div className="text-[10px] font-bold text-[#c9ec63] mb-1 truncate">{m.senderName}</div>
                          )}
                          <p className="break-words whitespace-pre-wrap">{m.text}</p>
                          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-40 font-mono">
                            <span>{m.timestamp}</span>
                            {m.isMe && (
                              m.status === 'delivered' || m.status === 'read'
                                ? <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                                : <Check className="h-3.5 w-3.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSend} className="p-3 bg-[#13231f] border-t border-white/10 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={inputMsg}
                      onChange={e => setInputMsg(e.target.value)}
                      className="flex-1 bg-[#182c27] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63] placeholder:text-white/40"
                    />
                    <button type="submit" className="h-10 w-10 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] flex items-center justify-center shrink-0 transition">
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: WHATSAPP ── */}
          {activeTab === 'whatsapp' && (
            <form onSubmit={handleWhatsApp} className="flex-1 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#00a884]/15 border border-[#00a884]/30 p-3.5 text-xs text-emerald-200">
                  <span className="font-bold text-white flex items-center gap-1.5 mb-1">
                    <PhoneCall className="h-4 w-4 text-[#00a884]" />
                    Official WhatsApp: 0806 343 0562
                  </span>
                  <p className="text-[11px] text-emerald-100/80">Connect directly to SIDAAP counselors. Your inquiry is logged in our portal.</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d1d9cf] mb-1">Topic</label>
                  <select
                    value={whatsappTopic}
                    onChange={e => setWhatsappTopic(e.target.value)}
                    className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                  >
                    <option value="Medical Rehab & Detox Referral">Medical Rehab &amp; Detox Referral</option>
                    <option value="Confidential Crisis Counseling">Confidential Crisis Counseling</option>
                    <option value="Secondary School Outreach & Exercise Books">Secondary School Outreach &amp; Books</option>
                    <option value="SIDAAP Football Academy Enrolment">SIDAAP Football Academy Enrolment</option>
                    <option value="Volunteer / Partnership with State Desk">Volunteer / Partnership</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full mt-4 py-3.5 rounded-xl bg-[#00a884] hover:bg-[#02be96] text-white font-bold uppercase tracking-wider text-xs transition shadow-xl flex items-center justify-center gap-2">
                <span>Launch WhatsApp</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="p-2.5 bg-[#0c1614] border-t border-white/10 text-[10px] text-[#a9b9a8] font-mono text-center shrink-0">
            SIDAAP Nigeria &bull; CAC RN: 8390984 &bull; SCUML Certified
          </div>
        </div>
      )}
    </div>
  )
}
