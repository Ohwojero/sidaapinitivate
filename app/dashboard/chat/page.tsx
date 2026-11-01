'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ChatRoom,
  ChatMessage
} from '@/lib/data/portal-data'
import {
  fetchChatRooms,
  upsertChatRoom,
  fetchChatMessages,
  sendChatMessage,
  updateMessageDelivery,
  subscribeToMessages,
  subscribeToAllMessages,
  broadcastUserTyping,
  subscribeToTyping
} from '@/lib/supabase/chat'
import { getStoredUser, AuthUser } from '@/lib/auth/session'
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ShieldCheck,
  CheckCheck,
  ArrowLeft,
  Check,
  UserPlus,
  Mail,
  ExternalLink,
  Plus,
  X,
  PhoneCall,
  MessageSquare
} from 'lucide-react'

function ChatInner() {
  const searchParams = useSearchParams()
  const targetRoomParam = searchParams.get('room')
  const targetStateParam = searchParams.get('state')

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [activeRoomId, setActiveRoomId] = useState<string>('room-public-inquiries')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'direct'>('all')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')

  // Track message IDs sent from this browser tab for guaranteed Right-side alignment
  const [mySentIds, setMySentIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const raw = sessionStorage.getItem('sidaap_my_sent_msgs')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Typing indicator
  const [typingUsers, setTypingUsers] = useState<{ userId: string; userName: string }[]>([])
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)

  // Auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Add Person Modal State
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false)
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactRole, setContactRole] = useState('LGA Field Officer / Counselor')
  const [initialNote, setInitialNote] = useState('')
  const [chatTargetType, setChatTargetType] = useState<'direct' | 'group'>('direct')
  const [targetGroupId, setTargetGroupId] = useState('room-lagos-chapter')

  // Load user & rooms
  const reloadRooms = useCallback(async () => {
    const data = await fetchChatRooms()
    setRooms(data)
  }, [])

  useEffect(() => {
    setCurrentUser(getStoredUser())
    reloadRooms()
  }, [reloadRooms])

  // Auto-redirect to specific room or state group from URL params (?state=... or ?room=...)
  useEffect(() => {
    if (rooms.length === 0) return

    if (targetRoomParam) {
      const match = rooms.find((r) => r.id === targetRoomParam)
      if (match) {
        setActiveRoomId(match.id)
        return
      }
    }

    if (targetStateParam) {
      const cleanState = targetStateParam.trim().toLowerCase()
      const matched = rooms.find(
        (r) =>
          (r.state && r.state.toLowerCase() === cleanState) ||
          r.name.toLowerCase().includes(cleanState) ||
          r.id.toLowerCase().includes(cleanState)
      )

      if (matched) {
        setActiveRoomId(matched.id)
      } else {
        // Automatically provision a new official state channel
        const stateName = targetStateParam.trim()
        const stateSlug = stateName.toLowerCase().replace(/[^a-z0-9]/g, '-')
        const newRoomId = `room-state-${stateSlug}`

        const newRoom: ChatRoom = {
          id: newRoomId,
          name: `📍 ${stateName} State Operations & Volunteers`,
          type: 'state_group',
          state: stateName,
          description: `${stateName} State Directorate, LGA representatives, school liaison and volunteer team`,
          unreadCount: 0,
          lastMessage: `State channel created for ${stateName}`,
          lastTime: 'Just now',
          avatarText: stateName.slice(0, 3).toUpperCase(),
          avatarColor: 'bg-emerald-800'
        }

        upsertChatRoom(newRoom).then(() => {
          setRooms((prev) => [...prev, newRoom])
          setActiveRoomId(newRoomId)
        })
      }
    }
  }, [rooms.length, targetRoomParam, targetStateParam])
  // Select a room: immediately clears unread count badge
  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId)
    setMobileView('chat')
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r))
    )
  }

  // Load messages & setup live subscriptions whenever activeRoomId changes
  useEffect(() => {
    if (!activeRoomId) return

    // Immediately clear unread badge for the viewed room
    setRooms((prev) =>
      prev.map((r) => (r.id === activeRoomId ? { ...r, unreadCount: 0 } : r))
    )

    // 1. Fetch current message history & mark messages from other users as read
    fetchChatMessages(activeRoomId).then((msgs) => {
      setMessages(msgs)
      // When the opposite person views the room, mark unread messages as read (triggers two blue ticks for sender)
      msgs.forEach((m) => {
        if (m.senderId !== currentUser?.id && m.status !== 'read') {
          updateMessageDelivery(m.id, 'read')
        }
      })
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })

    // 2. Subscribe to real-time typing indicators for this room
    const currentUserId = currentUser?.id || 'viewer'
    const unsubscribeTyping = subscribeToTyping(activeRoomId, currentUserId, (typers) => {
      setTypingUsers(typers)
    })

    return () => {
      unsubscribeTyping()
    }
  }, [activeRoomId, currentUser?.id])

  // Global subscription across all rooms to update unread badge counts & delivery ticks
  useEffect(() => {
    const unsubscribeAll = subscribeToAllMessages((incomingMsg) => {
      // Auto-create sidebar entry for visitor-specific public rooms from the widget
      if (incomingMsg.roomId.startsWith('room-public-') && incomingMsg.roomId !== 'room-public-inquiries') {
        setRooms((prev) => {
          if (prev.find(r => r.id === incomingMsg.roomId)) return prev
          // senderName format: "08012345678 (Lagos)"
          const senderName = incomingMsg.senderName || ''
          const phoneMatch = senderName.match(/^([\d\s]+)/)
          const stateMatch = senderName.match(/\(([^)]+)\)/)
          const visitorPhone = phoneMatch?.[1]?.trim() || 'Visitor'
          const visitorState = stateMatch?.[1]?.trim() || 'Unknown State'
          const newRoom: ChatRoom = {
            id: incomingMsg.roomId,
            name: `📱 ${visitorPhone} — ${visitorState}`,
            type: 'direct',
            state: visitorState,
            description: `Public visitor • ${visitorPhone} • ${visitorState}`,
            unreadCount: 1,
            lastMessage: incomingMsg.text,
            lastTime: incomingMsg.timestamp,
            avatarText: visitorPhone.slice(-4),
            avatarColor: 'bg-[#c9ec63] text-[#13231f]'
          }
          upsertChatRoom(newRoom)
          return [newRoom, ...prev]
        })
      }
      if (incomingMsg.roomId === activeRoomId) {
        // Message is for currently open room
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === incomingMsg.id)
          if (idx >= 0) {
            const updated = [...prev]
            updated[idx] = incomingMsg
            return updated
          }
          return [...prev, incomingMsg]
        })

        // If message is from the other person and we are viewing it right now, mark as read immediately
        if (incomingMsg.senderId !== currentUser?.id && incomingMsg.status !== 'read') {
          updateMessageDelivery(incomingMsg.id, 'read')
        }

        // Active room unread count stays 0
        setRooms((prev) =>
          prev.map((r) =>
            r.id === incomingMsg.roomId
              ? {
                  ...r,
                  lastMessage: `${incomingMsg.senderName}: ${incomingMsg.text}`,
                  lastTime: incomingMsg.timestamp,
                  unreadCount: 0
                }
              : r
          )
        )
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      } else {
        // Message arrived in an inactive room: increment unread count so badge indicates new message arrived
        setRooms((prev) =>
          prev.map((r) =>
            r.id === incomingMsg.roomId
              ? {
                  ...r,
                  lastMessage: `${incomingMsg.senderName}: ${incomingMsg.text}`,
                  lastTime: incomingMsg.timestamp,
                  unreadCount: (r.unreadCount || 0) + 1
                }
              : r
          )
        )
      }
    })

    return () => {
      unsubscribeAll()
    }
  }, [activeRoomId, currentUser?.id])

  // Handle send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputMessage.trim()) return

    // Clear typing indicator
    if (currentUser) {
      broadcastUserTyping(activeRoomId, currentUser.id, currentUser.name || 'Someone', false)
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    isTypingRef.current = false

    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const timeString = `${hours}:${minutes}`

    const userRoleTitle =
      currentUser?.role === 'national_director'
        ? 'National Executive Director'
        : currentUser?.role === 'state_director'
        ? `${currentUser.state || 'State'} Director`
        : 'SIDAAP Field Officer'

    const senderDisplayName = currentUser?.name
      ? `${currentUser.name} (${userRoleTitle})`
      : 'SIDAAP Official Desk'

    const msgId = `msg-${Date.now()}`
    const newMsg: ChatMessage = {
      id: msgId,
      roomId: activeRoomId,
      senderId: currentUser?.id || 'current-user',
      senderName: senderDisplayName,
      senderRole: userRoleTitle,
      text: inputMessage.trim(),
      timestamp: timeString,
      isMe: true,
      status: 'sent'
    }

    // Optimistically update UI and track as my sent message
    setMySentIds((prev) => {
      const next = new Set(prev).add(msgId)
      try {
        sessionStorage.setItem('sidaap_my_sent_msgs', JSON.stringify([...next]))
      } catch {}
      return next
    })
    setMessages((prev) => [...prev, newMsg])
    setInputMessage('')
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    // Save through unified service (Supabase if online, localStorage fallback)
    await sendChatMessage(activeRoomId, newMsg)

    // Delivered to server/database -> marks two gray ticks
    setTimeout(() => {
      updateMessageDelivery(msgId, 'delivered')
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId && m.status !== 'read' ? { ...m, status: 'delivered' } : m))
      )
    }, 800)
    // NOTE: Ticks will switch to two blue checkmarks (read) ONLY when the recipient actually opens/views this channel!
  }

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
    if (!currentUser) return

    if (!isTypingRef.current) {
      isTypingRef.current = true
      broadcastUserTyping(activeRoomId, currentUser.id, currentUser.name || 'Someone', true)
    }

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      broadcastUserTyping(activeRoomId, currentUser.id, currentUser.name || 'Someone', false)
      isTypingRef.current = false
    }, 3000)
  }

  // Handle Add Person to WhatsApp/Portal
  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName.trim() && !contactEmail.trim() && !contactPhone.trim()) return

    const displayName = contactName.trim() || contactEmail.trim() || contactPhone.trim()
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const timeString = `${hours}:${minutes}`

    const initials =
      displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'DM'

    const userRoleTitle =
      currentUser?.role === 'national_director'
        ? 'National Executive Director'
        : currentUser?.role === 'state_director'
        ? `${currentUser.state || 'State'} Director`
        : 'SIDAAP Field Officer'

    if (chatTargetType === 'direct') {
      const contactInfo = [
        contactPhone.trim() ? `📱 ${contactPhone.trim()}` : '',
        contactEmail.trim() ? `✉️ ${contactEmail.trim()}` : ''
      ]
        .filter(Boolean)
        .join(' • ')

      const newRoom: ChatRoom = {
        id: `dm-${Date.now()}`,
        name: `${displayName} (${contactRole})`,
        type: 'direct',
        description: contactInfo || `${contactRole} • SIDAAP Official Contact`,
        unreadCount: 0,
        lastMessage: initialNote.trim() ? `You: ${initialNote.trim()}` : 'Chat initiated',
        lastTime: timeString,
        avatarText: initials,
        avatarColor: 'bg-[#00a884]'
      }

      await upsertChatRoom(newRoom)
      setRooms((prev) => [newRoom, ...prev])
      setActiveRoomId(newRoom.id)

      if (initialNote.trim()) {
        const initialMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          roomId: newRoom.id,
          senderId: currentUser?.id || 'current-user',
          senderName: currentUser?.name ? `${currentUser.name} (${userRoleTitle})` : 'You',
          senderRole: userRoleTitle,
          text: initialNote.trim(),
          timestamp: timeString,
          isMe: true,
          status: 'sent'
        }
        await sendChatMessage(newRoom.id, initialMsg)
      }
    } else {
      const joinMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        roomId: targetGroupId,
        senderId: 'system',
        senderName: 'SIDAAP Portal System',
        senderRole: 'System',
        text: `Added ${displayName} (${contactRole}) [${contactPhone.trim() || contactEmail.trim()}] to this channel.`,
        timestamp: timeString,
        status: 'read'
      }
      await sendChatMessage(targetGroupId, joinMsg)

      if (initialNote.trim()) {
        const followUpMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          roomId: targetGroupId,
          senderId: currentUser?.id || 'current-user',
          senderName: currentUser?.name ? `${currentUser.name} (${userRoleTitle})` : 'You',
          senderRole: userRoleTitle,
          text: initialNote.trim(),
          timestamp: timeString,
          isMe: true,
          status: 'sent'
        }
        await sendChatMessage(targetGroupId, followUpMsg)
      }
      setActiveRoomId(targetGroupId)
    }

    setContactName('')
    setContactEmail('')
    setContactPhone('')
    setInitialNote('')
    setIsAddPersonOpen(false)
  }

  // Active room
  const activeRoom =
    rooms.find((r) => r.id === activeRoomId) ||
    rooms[0] || {
      id: 'room-public-inquiries',
      name: '🌐 Live Public Crisis & Citizen Help Desk',
      type: 'broadcast' as const,
      avatarColor: 'bg-[#c9ec63] text-[#13231f]',
      avatarText: 'SOS',
      unreadCount: 0,
      lastMessage: '',
      lastTime: '',
      description: 'Public inquiry portal'
    }

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'groups' && r.type !== 'direct') ||
      (activeTab === 'direct' && r.type === 'direct')
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Typing indicator label
  const typingLabel =
    typingUsers.length === 0
      ? null
      : typingUsers.length === 1
      ? `${typingUsers[0].userName} is typing…`
      : typingUsers.length === 2
      ? `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing…`
      : `${typingUsers.length} people are typing…`

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#0c1614] text-white flex flex-col font-sans overflow-hidden">
      {/* Main Chat Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT COLUMN: CHATS LIST (WhatsApp Style) */}
        {/* ========================================================= */}
        <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} sm:flex w-full sm:w-80 md:w-96 bg-[#111e1b] border-r border-white/10 flex-col h-full shrink-0`}>
          {/* Header */}
          <div className="h-16 px-4 bg-[#162723] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-white/10 text-[#c9ec63]" title="Back to Dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">SIDAAP Channels</h2>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/70">
              <button
                onClick={() => setIsAddPersonOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#02be96] text-white text-[11px] font-bold uppercase tracking-wider transition shadow-md"
                title="Add Person to WhatsApp by Email or Phone Number"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>+ Add Person</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-[#111e1b] border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
              <input
                type="text"
                placeholder="Search or enter email / phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#182c27] text-white pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#c9ec63] placeholder:text-white/40"
              />
            </div>

            {searchQuery.trim() && (
              <button
                onClick={() => {
                  if (searchQuery.includes('@')) {
                    setContactEmail(searchQuery.trim())
                  } else {
                    setContactPhone(searchQuery.trim())
                  }
                  setIsAddPersonOpen(true)
                }}
                className="mt-2 w-full p-2 rounded-xl bg-white/5 hover:bg-[#00a884] hover:text-white border border-white/10 text-[11px] text-[#c9ec63] flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Add &ldquo;{searchQuery}&rdquo; to Chat</span>
                </div>
                <Plus className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
              </button>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-2.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'groups', label: 'Channels' },
                { id: 'direct', label: 'Direct' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition ${
                    activeTab === t.id
                      ? 'bg-[#c9ec63] text-[#13231f]'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredRooms.map((room) => {
              const isSelected = room.id === activeRoomId
              return (
                <div
                  key={room.id}
                  onClick={() => handleSelectRoom(room.id)}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#1a332d] border-l-4 border-[#c9ec63]'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div
                    className={`h-11 w-11 rounded-full ${room.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow`}
                  >
                    {room.avatarText}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate max-w-[170px]">
                        {room.name}
                      </h4>
                      <span className="text-[10px] font-mono text-white/40 shrink-0">
                        {room.lastTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 truncate mt-0.5">
                      {room.lastMessage}
                    </p>
                  </div>

                  {!isSelected && (room.unreadCount || 0) > 0 && (
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#c9ec63] text-[#13231f] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 shadow animate-pulse">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: ACTIVE CONVERSATION (WhatsApp Style) */}
        {/* ========================================================= */}
        <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} sm:flex flex-1 flex-col h-full bg-[#0d1815] relative`}>
          {/* Active Conversation Header */}
          <div className="h-16 px-3 sm:px-6 bg-[#162723] border-b border-white/10 flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileView('list')}
                className="sm:hidden p-1.5 rounded-lg hover:bg-white/10 text-[#c9ec63] shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div
                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full ${activeRoom.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow shrink-0`}
              >
                {activeRoom.avatarText}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeRoom.name}</span>
                  {activeRoom.type !== 'direct' && (
                    <span className="text-[10px] font-mono bg-white/10 text-[#c9ec63] px-2 py-0.5 rounded-full uppercase">
                      Official SIDAAP Room
                    </span>
                  )}
                </h3>
                <span className="text-[11px] text-white/50">
                  {activeRoom.description || 'SIDAAP Secure Communication Channel'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/70">
              {/* WhatsApp App Direct Link Button */}
              {activeRoom.description?.includes('📱') && (
                <a
                  href={`https://wa.me/${
                    activeRoom.description.match(/(\+?234\d{10}|0[789][01]\d{8})/)?.[0]?.replace(/\D/g, '').replace(/^0/, '234') || '2348063430562'
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#02be96] text-white text-xs font-bold transition shadow"
                  title="Open this conversation on WhatsApp app"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Open on WhatsApp</span>
                  <ExternalLink className="h-3 w-3 opacity-75" />
                </a>
              )}

              <button className="p-2 hover:bg-white/10 rounded-full text-white/80" title="Audio Call">
                <Phone className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full text-white/80" title="Video Conference">
                <Video className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full text-white/80" title="Channel Info">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0a1412] relative">
            {/* Subtle WhatsApp wallpaper doodle pattern simulation */}
            <div className="pointer-events-none absolute inset-0 opacity-5 [background-image:radial-gradient(#c9ec63_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* End-to-End Encryption Banner */}
            <div className="relative text-center my-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#142621] px-3 py-1 text-[10px] text-[#c9ec63] border border-white/5 shadow font-mono">
                <ShieldCheck className="h-3 w-3" />
                Messages are protected under SIDAAP National Governance Protocol &bull; CAC RN: 8390984
              </span>
            </div>

            {/* Empty State when zero messages */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-white/50 space-y-2 relative z-10">
                <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c9ec63] mb-1">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-white/80">No messages yet</p>
                <p className="text-[11px] max-w-xs text-white/40 leading-relaxed">
                  Send a message below to start communicating in {activeRoom.name}. All messages are stored permanently in the database.
                </p>
              </div>
            )}

            {/* Message Bubbles */}
            {messages.map((msg) => {
              const isMine = Boolean(
                msg.isMe ||
                mySentIds.has(msg.id) ||
                (currentUser?.id && msg.senderId === currentUser.id) ||
                (currentUser?.email && msg.senderId === currentUser.email)
              )
              const isPublicCitizen =
                msg.senderRole === 'Citizen Inquiry' ||
                msg.senderRole === 'Public Visitor' ||
                msg.senderRole === 'WhatsApp Lead'

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} my-1 relative z-10`}
                >
                  <div
                    className={`max-w-[78%] sm:max-w-[65%] px-4 py-2.5 shadow-md text-xs leading-relaxed break-words ${
                      isMine
                        ? 'bg-[#005c4b] text-white rounded-2xl rounded-tr-none border border-[#00a884]/20'
                        : isPublicCitizen
                        ? 'bg-[#182823] text-stone-100 rounded-2xl rounded-tl-none border border-[#c9ec63]/40'
                        : 'bg-[#202c33] text-stone-100 rounded-2xl rounded-tl-none border border-white/5'
                    }`}
                  >
                    {/* Sender label — only on received messages */}
                    {!isMine && (
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-[#c9ec63]">
                          {msg.senderName}
                        </span>
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                            isPublicCitizen
                              ? 'bg-[#c9ec63] text-[#13231f]'
                              : 'bg-black/30 text-white/60'
                          }`}
                        >
                          {isPublicCitizen ? '🌐 Public Lead' : msg.senderRole}
                        </span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Timestamp + delivery ticks — always bottom-right */}
                    <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-white/40 font-mono">
                      <span>{msg.timestamp}</span>
                      {isMine && (
                        msg.status === 'read' ? (
                          <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="h-3.5 w-3.5 text-white/50" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-white/50" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {typingLabel && (
              <div className="flex items-end gap-2 relative z-10">
                <div className="max-w-[60%] rounded-2xl rounded-tl-none px-4 py-2.5 bg-[#202c33] border border-white/5 shadow-md flex items-center gap-2">
                  <span className="flex items-center gap-0.5 h-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9ec63] animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9ec63] animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9ec63] animate-bounce [animation-delay:300ms]" />
                  </span>
                  <span className="text-[11px] text-white/60 italic">{typingLabel}</span>
                </div>
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="h-20 px-4 sm:px-6 bg-[#162723] border-t border-white/10 flex items-center gap-3 z-10"
          >
            <button
              type="button"
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10"
              title="Emoji"
            >
              <Smile className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                const sample = prompt('Attach field photo URL or notes:', 'https://sidaap.org/assets/outreach-photo.jpg')
                if (sample) {
                  setInputMessage(`[Photo Attachment Attached]: ${sample}`)
                }
              }}
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10"
              title="Attach File or Photo"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <input
              type="text"
              placeholder={`Message ${activeRoom.name}...`}
              value={inputMessage}
              onChange={handleInputChange}
              className="flex-1 bg-[#1e342f] text-white px-4 py-3 rounded-2xl text-xs outline-none focus:ring-1 focus:ring-[#c9ec63] placeholder:text-white/40"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="h-11 w-11 rounded-full bg-[#00a884] hover:bg-[#029071] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition shadow-lg shrink-0"
            >
              <Send className="h-5 w-5 -translate-x-0.5 translate-y-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADD PERSON BY EMAIL OR PHONE NUMBER MODAL */}
      {/* ========================================================= */}
      {isAddPersonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0f1d19] border border-white/15 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#142621] p-5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#00a884] text-white flex items-center justify-center font-black shadow">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Add Person to WhatsApp &amp; Portal Chat
                  </h3>
                  <p className="text-[11px] text-[#a9b9a8] font-mono">
                    Connect staff, state directors, medical partners, or citizens by Email or Phone
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddPersonOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddPerson} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Phone / WhatsApp Number */}
              <div>
                <label className="block text-[#d1d9cf] font-bold mb-1 uppercase tracking-wider text-[11px]">
                  WhatsApp / Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="tel"
                    placeholder="e.g. 0806 343 0562 or +234 802 853 1259"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#162723] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#a9b9a8]">
                  Enables instant 1-click launch to their physical WhatsApp app.
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[#d1d9cf] font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="email"
                    placeholder="e.g. doctor.amadi@sidaap.org or partner@clinic.ng"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#162723] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#a9b9a8]">
                  Identifies their statutory account in the SIDAAP portal.
                </p>
              </div>

              {/* Name & Role Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d9cf] font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Person&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ngozi Amadi"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d9cf] font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Role / Category
                  </label>
                  <select
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                  >
                    <option value="State Director">State Director</option>
                    <option value="LGA Field Officer / Counselor">LGA Field Officer / Counselor</option>
                    <option value="Hospital / Medical Detox Partner">Hospital / Medical Partner</option>
                    <option value="School Outreach Liaison">School Outreach Liaison</option>
                    <option value="Football Academy Coach / Scout">Football Coach / Scout</option>
                    <option value="Citizen / Patient Case Desk">Citizen / Patient Case</option>
                  </select>
                </div>
              </div>

              {/* Target Destination */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#c9ec63]">
                  Chat Channel Destination:
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="chatTarget"
                      checked={chatTargetType === 'direct'}
                      onChange={() => setChatTargetType('direct')}
                      className="accent-[#00a884]"
                    />
                    <span>Start Direct 1-on-1 Conversation (Private Thread)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="chatTarget"
                      checked={chatTargetType === 'group'}
                      onChange={() => setChatTargetType('group')}
                      className="accent-[#00a884]"
                    />
                    <span>Add to an existing Group Channel</span>
                  </label>
                </div>

                {chatTargetType === 'group' && (
                  <div className="pt-2">
                    <select
                      value={targetGroupId}
                      onChange={(e) => setTargetGroupId(e.target.value)}
                      className="w-full bg-[#162723] text-white px-3 py-2 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884]"
                    >
                      {rooms
                        .filter((r) => r.type !== 'direct')
                        .map((r) => (
                          <option key={r.id} value={r.id} className="bg-stone-900 text-white">
                            {r.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Initial Message */}
              <div>
                <label className="block text-[#d1d9cf] font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Initial Message / Directive (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Welcome to SIDAAP collaboration network. Please verify your weekly outreach log..."
                  value={initialNote}
                  onChange={(e) => setInitialNote(e.target.value)}
                  className="w-full bg-[#162723] text-white p-3 rounded-xl border border-white/10 text-xs outline-none focus:border-[#00a884] placeholder:text-white/30 resize-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPersonOpen(false)}
                  className="px-4 py-2.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!contactName.trim() && !contactEmail.trim() && !contactPhone.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#029071] text-white font-bold uppercase tracking-wider transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Person &amp; Start Chat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-[#0c1614] flex items-center justify-center text-white text-sm">
          Loading SIDAAP chat channels...
        </div>
      }
    >
      <ChatInner />
    </Suspense>
  )
}
