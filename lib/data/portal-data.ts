export type UserRole = 'national_director' | 'state_director' | 'state_staff' | 'member'

export interface StateDirector {
  id: string
  name: string
  email: string
  phone: string
  state: string
  lga: string
  city: string
  appointedDate: string
  status: 'active' | 'suspended' | 'vacant'
  staffCount: number
  facilitiesCount: number
  outreachCount: number
  avatarUrl?: string
}

export interface StateStaffMember {
  id: string
  name: string
  email: string
  phone: string
  state: string
  lga: string
  city: string
  roleTitle: 'Field Officer' | 'School Liaison' | 'Youth Coach' | 'Counselor' | 'Volunteer'
  joinedDate: string
  assignedDirector: string
  status: 'active' | 'pending'
  avatarUrl?: string
}

export interface NationalDirective {
  id: string
  title: string
  issuedBy: string
  date: string
  priority: 'high' | 'urgent' | 'standard'
  content: string
  targetScope: string
  upcomingEventDate?: string
}

export interface StateActivity {
  id: string
  title: string
  state: string
  lga: string
  city: string
  category: 'School Outreach' | 'Community March' | 'Football Tournament' | 'Rehab Intake'
  date: string
  reportedBy: string
  studentsReached?: number
  booksDistributed?: number
  status: 'Approved by State' | 'Verified Nationally'
  notes: string
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  senderRole: string
  senderState?: string
  text: string
  timestamp: string
  attachmentUrl?: string
  isMe?: boolean
  /** 'sent' = single gray tick, 'delivered' = double gray tick, 'read' = double blue tick */
  status?: 'sent' | 'delivered' | 'read'
}

// ── Typing Indicator helpers ──────────────────────────────────────────────────
const TYPING_KEY = 'sidaap_typing'

export interface TypingEntry {
  roomId: string
  userId: string
  userName: string
  at: number // Date.now()
}

export function setTyping(roomId: string, userId: string, userName: string): void {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(TYPING_KEY)
  const entries: TypingEntry[] = raw ? JSON.parse(raw) : []
  const filtered = entries.filter(
    (e) => !(e.roomId === roomId && e.userId === userId)
  )
  filtered.push({ roomId, userId, userName, at: Date.now() })
  localStorage.setItem(TYPING_KEY, JSON.stringify(filtered))
  window.dispatchEvent(new Event('sidaap_typing_updated'))
}

export function clearTyping(roomId: string, userId: string): void {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(TYPING_KEY)
  const entries: TypingEntry[] = raw ? JSON.parse(raw) : []
  const filtered = entries.filter(
    (e) => !(e.roomId === roomId && e.userId === userId)
  )
  localStorage.setItem(TYPING_KEY, JSON.stringify(filtered))
  window.dispatchEvent(new Event('sidaap_typing_updated'))
}

export function getTypingInRoom(roomId: string, myUserId: string): TypingEntry[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(TYPING_KEY)
  const entries: TypingEntry[] = raw ? JSON.parse(raw) : []
  const now = Date.now()
  // Only entries that are fresh (< 4 seconds old) and not mine
  return entries.filter(
    (e) => e.roomId === roomId && e.userId !== myUserId && now - e.at < 4000
  )
}

export interface ChatRoom {
  id: string
  name: string
  type: 'broadcast' | 'state_group' | 'direct'
  description?: string
  state?: string
  unreadCount: number
  lastMessage: string
  lastTime: string
  avatarText: string
  avatarColor: string
}

export const INITIAL_NATIONAL_DIRECTIVES: NationalDirective[] = [
  {
    id: 'dir-nat-01',
    title: 'Nationwide Q4 Secondary School Exercise Books Dispatch',
    issuedBy: 'Dr. Friday Chalele (National Trustee / Executive Directorate)',
    date: 'October 28, 2026',
    priority: 'high',
    content: 'All 36 State Directors and LGA School Liaisons are instructed to complete distribution of the new SIDAAP branded anti-drug exercise books to public secondary schools. Ensure photo reports are submitted via the portal before the 15th of next month.',
    targetScope: 'All 36 States + Abuja FCT',
    upcomingEventDate: 'November 15, 2026'
  },
  {
    id: 'dir-nat-02',
    title: 'Joint NDLEA Sensitization Marches Against Synthetic Opioids & Meth',
    issuedBy: 'National Secretariat (Abuja Headquarters)',
    date: 'October 20, 2026',
    priority: 'urgent',
    content: 'Each State Director must coordinate directly with the NDLEA State Command (Drug Demand Reduction Unit) to conduct localized community rallies in high-risk motor parks and markets against Colorado (Colo) and Mkpuru Mmiri.',
    targetScope: 'All State Chapters',
    upcomingEventDate: 'November 22, 2026'
  },
  {
    id: 'dir-nat-03',
    title: 'SIDAAP Football Academy U-17 State Scouting Showcase',
    issuedBy: 'Prosper Ohwojero (Trustee & Sports Director)',
    date: 'October 15, 2026',
    priority: 'standard',
    content: 'Following CAC registration (RC: 9864105), youth coaches across Lagos, Delta, Rivers, and Abuja chapters are to host free trials for talented vulnerable youth. Kits will be delivered from the national warehouse.',
    targetScope: 'Sports Academy Coordinators',
    upcomingEventDate: 'December 02, 2026'
  }
]

export const INITIAL_STATE_ACTIVITIES: StateActivity[] = [
  {
    id: 'act-1',
    title: 'Secondary School Drug Awareness Workshop & Exercise Books Giveaway',
    state: 'Lagos',
    lga: 'Ikeja',
    city: 'Ikeja Central',
    category: 'School Outreach',
    date: 'Yesterday, 11:30 AM',
    reportedBy: 'Blessing Okon (Counselor & School Liaison)',
    studentsReached: 620,
    booksDistributed: 450,
    status: 'Verified Nationally',
    notes: 'Engaged SS1 to SS3 students on dangers of synthetic weed (Colorado) and codeine syrup. Distributed 450 free branded exercise books.'
  },
  {
    id: 'act-2',
    title: 'Bwari Secondary Schools Anti-Drug Rally & Parent Counseling Session',
    state: 'Abuja (FCT)',
    lga: 'Bwari',
    city: 'Kubwa',
    category: 'School Outreach',
    date: '2 days ago',
    reportedBy: 'Praise Ohwojero Efe (Trustee & School Outreach)',
    studentsReached: 480,
    booksDistributed: 300,
    status: 'Verified Nationally',
    notes: 'Outreach held at Kubwa Town Hall with secondary students, principals, and parent association executives.'
  },
  {
    id: 'act-3',
    title: 'U-17 Football Academy Scouting Match & Anti-Substance Screening',
    state: 'Delta',
    lga: 'Warri South',
    city: 'Warri Urban',
    category: 'Football Tournament',
    date: '3 days ago',
    reportedBy: 'Coach Emeka Uba (Youth Coach)',
    studentsReached: 120,
    booksDistributed: 100,
    status: 'Approved by State',
    notes: 'Youth football showcase held at Effurun township stadium. 120 youths tested, 14 scouted for academy trial roster.'
  },
  {
    id: 'act-4',
    title: 'Motor Park Grassroots Drug Sensitization Walk with NDLEA Kano Command',
    state: 'Kano',
    lga: 'Kano Municipal',
    city: 'Kano City',
    category: 'Community March',
    date: '4 days ago',
    reportedBy: 'Abubakar Lawal (Field Officer)',
    studentsReached: 350,
    booksDistributed: 150,
    status: 'Verified Nationally',
    notes: 'Hausa-language street march addressing tramadol and cough syrup abuse among inter-state drivers and young artisans.'
  }
]

export const INITIAL_STATE_DIRECTORS: StateDirector[] = [
  {
    id: 'dir-fct',
    name: 'Dr. Friday Chalele',
    email: 'chalele@sidaap.org',
    phone: '0806 343 0562',
    state: 'Abuja (FCT)',
    lga: 'Municipal Area Council (AMAC)',
    city: 'Wuse II, Abuja',
    appointedDate: 'April 2025',
    status: 'active',
    staffCount: 38,
    facilitiesCount: 12,
    outreachCount: 45,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'dir-lagos',
    name: 'Engr. Babatunde Sanusi',
    email: 'lagos.dir@sidaap.org',
    phone: '0802 853 1259',
    state: 'Lagos',
    lga: 'Ikeja',
    city: 'Ikeja',
    appointedDate: 'May 2025',
    status: 'active',
    staffCount: 64,
    facilitiesCount: 22,
    outreachCount: 82,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'dir-delta',
    name: 'Prosper Ohwojero',
    email: 'prosper@sidaap.org',
    phone: '0703 092 4398',
    state: 'Delta',
    lga: 'Warri South',
    city: 'Warri',
    appointedDate: 'June 2025',
    status: 'active',
    staffCount: 42,
    facilitiesCount: 9,
    outreachCount: 54,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'dir-kano',
    name: 'Mallam Ibrahim Danbatta',
    email: 'kano.dir@sidaap.org',
    phone: '0803 111 2233',
    state: 'Kano',
    lga: 'Kano Municipal',
    city: 'Kano Central',
    appointedDate: 'July 2025',
    status: 'active',
    staffCount: 31,
    facilitiesCount: 8,
    outreachCount: 39,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'dir-rivers',
    name: 'Dr. (Mrs) Ngozi Amadi',
    email: 'rivers.dir@sidaap.org',
    phone: '0804 555 7788',
    state: 'Rivers',
    lga: 'Port Harcourt',
    city: 'Port Harcourt',
    appointedDate: 'August 2025',
    status: 'active',
    staffCount: 29,
    facilitiesCount: 7,
    outreachCount: 33,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'dir-oyo',
    name: 'Chief Oladimeji Adeleke',
    email: 'oyo.dir@sidaap.org',
    phone: '0805 444 3322',
    state: 'Oyo',
    lga: 'Ibadan North',
    city: 'Ibadan',
    appointedDate: 'September 2025',
    status: 'active',
    staffCount: 27,
    facilitiesCount: 6,
    outreachCount: 28,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80'
  }
]

export const INITIAL_STAFF_MEMBERS: StateStaffMember[] = [
  {
    id: 'staff-1',
    name: 'Praise Ohwojero Efe',
    email: 'praise.efe@sidaap.org',
    phone: '0806 111 0001',
    state: 'Abuja (FCT)',
    lga: 'Municipal Area Council (AMAC)',
    city: 'Wuse & Garki',
    roleTitle: 'School Liaison',
    joinedDate: 'April 2025',
    assignedDirector: 'Dr. Friday Chalele',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'staff-2',
    name: 'Blessing Okon',
    email: 'blessing.lagos@sidaap.org',
    phone: '0802 222 0002',
    state: 'Lagos',
    lga: 'Ikeja',
    city: 'Ikeja & Maryland',
    roleTitle: 'Counselor',
    joinedDate: 'May 2025',
    assignedDirector: 'Engr. Babatunde Sanusi',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'staff-3',
    name: 'Ayomide Balogun',
    email: 'ayomide.alimosho@sidaap.org',
    phone: '0802 333 4444',
    state: 'Lagos',
    lga: 'Alimosho',
    city: 'Egbeda / Igando',
    roleTitle: 'Field Officer',
    joinedDate: 'June 2025',
    assignedDirector: 'Engr. Babatunde Sanusi',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'staff-4',
    name: 'Coach Emeka Uba',
    email: 'emeka.sports@sidaap.org',
    phone: '0803 333 0003',
    state: 'Delta',
    lga: 'Warri South',
    city: 'Warri Urban',
    roleTitle: 'Youth Coach',
    joinedDate: 'June 2025',
    assignedDirector: 'Prosper Ohwojero',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'staff-5',
    name: 'Abubakar Lawal',
    email: 'lawal.kano@sidaap.org',
    phone: '0807 444 0004',
    state: 'Kano',
    lga: 'Kano Municipal',
    city: 'Kano Sabon Gari',
    roleTitle: 'Field Officer',
    joinedDate: 'July 2025',
    assignedDirector: 'Mallam Ibrahim Danbatta',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'staff-6',
    name: 'Chioma Nwosu',
    email: 'chioma.rivers@sidaap.org',
    phone: '0808 555 1234',
    state: 'Rivers',
    lga: 'Port Harcourt',
    city: 'D/Line, Port Harcourt',
    roleTitle: 'Counselor',
    joinedDate: 'August 2025',
    assignedDirector: 'Dr. (Mrs) Ngozi Amadi',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
  }
]

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-public-inquiries',
    name: '🌐 Live Public Crisis & Citizen Help Desk',
    type: 'broadcast',
    description: 'Incoming live messages & WhatsApp inquiries from citizens, parents, and youth on the public website',
    unreadCount: 0,
    lastMessage: 'Channel active',
    lastTime: '',
    avatarText: 'SOS',
    avatarColor: 'bg-[#c9ec63] text-[#13231f]'
  },
  {
    id: 'room-national-broadcast',
    name: '📢 National Directives & Announcements',
    type: 'broadcast',
    description: 'Official directives sent by the National Secretariat to all State Directors & staff',
    unreadCount: 0,
    lastMessage: 'Channel active',
    lastTime: '',
    avatarText: 'HQ',
    avatarColor: 'bg-emerald-800'
  },
  {
    id: 'room-directors-executive',
    name: '🏛️ National Directors Executive Forum',
    type: 'broadcast',
    description: 'Private coordination group for all 36 State Directors + National Trustees',
    unreadCount: 0,
    lastMessage: 'Channel active',
    lastTime: '',
    avatarText: 'DIR',
    avatarColor: 'bg-blue-900'
  },
  {
    id: 'room-lagos-chapter',
    name: '📍 Lagos State Operations & Volunteers',
    type: 'state_group',
    state: 'Lagos',
    description: 'Lagos State Director, LGA representatives, school liaison and volunteer team',
    unreadCount: 0,
    lastMessage: 'Channel active',
    lastTime: '',
    avatarText: 'LAG',
    avatarColor: 'bg-amber-800'
  },
  {
    id: 'room-fct-chapter',
    name: '📍 Abuja FCT Field Command',
    type: 'state_group',
    state: 'Abuja (FCT)',
    description: 'Bwari, AMAC, Gwagwalada, and Kubwa field outreach team',
    unreadCount: 0,
    lastMessage: 'Channel active',
    lastTime: '',
    avatarText: 'FCT',
    avatarColor: 'bg-purple-900'
  },
  {
    id: 'room-football-academy',
    name: '⚽ SIDAAP Football Academy Technical Staff',
    type: 'state_group',
    description: 'Coaches, trainers, kit coordinators, and talent scouts (CAC RC: 9864105)',
    unreadCount: 0,
    lastMessage: 'Channel active',
    lastTime: '',
    avatarText: 'SFA',
    avatarColor: 'bg-[#13231f]'
  },

]

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {}

// -------------------------------------------------------------
// PERSISTENT DATA LAYER (Sync across National, State, & Members)
// -------------------------------------------------------------

const DIRECTORS_KEY = 'sidaap_state_directors'
const STAFF_KEY = 'sidaap_state_staff'
const ACTIVITIES_KEY = 'sidaap_state_activities'

export function getStoredDirectors(): StateDirector[] {
  if (typeof window === 'undefined') return INITIAL_STATE_DIRECTORS
  try {
    const raw = localStorage.getItem(DIRECTORS_KEY)
    if (raw) {
      const parsed: StateDirector[] = JSON.parse(raw)
      const existingIds = new Set(parsed.map(d => d.id))
      const missing = INITIAL_STATE_DIRECTORS.filter(d => !existingIds.has(d.id))
      if (missing.length > 0) {
        const merged = [...parsed, ...missing]
        localStorage.setItem(DIRECTORS_KEY, JSON.stringify(merged))
        return merged
      }
      return parsed
    } else {
      localStorage.setItem(DIRECTORS_KEY, JSON.stringify(INITIAL_STATE_DIRECTORS))
    }
  } catch (err) {
    console.error('Failed to get stored directors', err)
  }
  return INITIAL_STATE_DIRECTORS
}

export function saveStoredDirectors(directors: StateDirector[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DIRECTORS_KEY, JSON.stringify(directors))
  } catch (err) {
    console.error('Failed to save stored directors', err)
  }
}

export function getStoredStaff(): StateStaffMember[] {
  if (typeof window === 'undefined') return INITIAL_STAFF_MEMBERS
  try {
    const raw = localStorage.getItem(STAFF_KEY)
    if (raw) {
      const parsed: StateStaffMember[] = JSON.parse(raw)
      const existingIds = new Set(parsed.map(s => s.id))
      const missing = INITIAL_STAFF_MEMBERS.filter(s => !existingIds.has(s.id))
      if (missing.length > 0) {
        const merged = [...parsed, ...missing]
        localStorage.setItem(STAFF_KEY, JSON.stringify(merged))
        return merged
      }
      return parsed
    } else {
      localStorage.setItem(STAFF_KEY, JSON.stringify(INITIAL_STAFF_MEMBERS))
    }
  } catch (err) {
    console.error('Failed to get stored staff', err)
  }
  return INITIAL_STAFF_MEMBERS
}

export function saveStoredStaff(staff: StateStaffMember[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff))
  } catch (err) {
    console.error('Failed to save stored staff', err)
  }
}

export function getStoredActivities(): StateActivity[] {
  if (typeof window === 'undefined') return INITIAL_STATE_ACTIVITIES
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY)
    if (raw) {
      const parsed: StateActivity[] = JSON.parse(raw)
      const existingIds = new Set(parsed.map(a => a.id))
      const missing = INITIAL_STATE_ACTIVITIES.filter(a => !existingIds.has(a.id))
      if (missing.length > 0) {
        const merged = [...parsed, ...missing]
        localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(merged))
        return merged
      }
      return parsed
    } else {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_STATE_ACTIVITIES))
    }
  } catch (err) {
    console.error('Failed to get stored activities', err)
  }
  return INITIAL_STATE_ACTIVITIES
}

export function saveStoredActivities(activities: StateActivity[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities))
  } catch (err) {
    console.error('Failed to save stored activities', err)
  }
}

// -------------------------------------------------------------
// CHAT & INQUIRIES PERSISTENCE (Sync between Website & Dashboard)
// -------------------------------------------------------------

const CHAT_ROOMS_KEY = 'sidaap_chat_rooms'
const CHAT_MESSAGES_KEY = 'sidaap_chat_messages'

export function getStoredChatRooms(): ChatRoom[] {
  if (typeof window === 'undefined') return INITIAL_CHAT_ROOMS
  try {
    const raw = localStorage.getItem(CHAT_ROOMS_KEY)
    if (raw) {
      let parsed: ChatRoom[] = JSON.parse(raw)
      // Filter out legacy demo personal DMs
      parsed = parsed.filter(r => r.id !== 'dm-friday-chalele')
      const existingIds = new Set(parsed.map(r => r.id))
      const missing = INITIAL_CHAT_ROOMS.filter(r => !existingIds.has(r.id))
      if (missing.length > 0) {
        const merged = [...missing, ...parsed]
        localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(merged))
        return merged
      }
      return parsed
    } else {
      localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(INITIAL_CHAT_ROOMS))
    }
  } catch (err) {
    console.error('Failed to get stored chat rooms', err)
  }
  return INITIAL_CHAT_ROOMS
}

export function saveStoredChatRooms(rooms: ChatRoom[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms))
  } catch (err) {
    console.error('Failed to save stored chat rooms', err)
  }
}

export function getStoredChatMessages(): Record<string, ChatMessage[]> {
  if (typeof window === 'undefined') return INITIAL_MESSAGES
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_KEY)
    if (raw) {
      const parsed: Record<string, ChatMessage[]> = JSON.parse(raw)
      // Purge any legacy dummy/demo messages from browser storage
      const legacyDummyIds = new Set([
        'pub-1', 'pub-2', 'pub-3',
        'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11',
        'seed-msg-001', 'seed-msg-002', 'seed-msg-003'
      ])
      let hasLegacy = false
      const cleaned: Record<string, ChatMessage[]> = {}
      for (const [roomId, msgs] of Object.entries(parsed)) {
        const filtered = msgs.filter(m => !legacyDummyIds.has(m.id) && !m.id.startsWith('seed-'))
        if (filtered.length !== msgs.length) {
          hasLegacy = true
        }
        cleaned[roomId] = filtered
      }
      if (hasLegacy) {
        localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(cleaned))
      }
      return cleaned
    } else {
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify({}))
    }
  } catch (err) {
    console.error('Failed to get stored chat messages', err)
  }
  return INITIAL_MESSAGES
}

export function saveStoredChatMessages(messagesMap: Record<string, ChatMessage[]>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messagesMap))
    window.dispatchEvent(new Event('sidaap_chat_updated'))
  } catch (err) {
    console.error('Failed to save stored chat messages', err)
  }
}

export function addChatMessage(roomId: string, message: ChatMessage): void {
  const current = getStoredChatMessages()
  const roomMessages = current[roomId] || []
  current[roomId] = [...roomMessages, message]
  saveStoredChatMessages(current)

  // Update snippet in room list
  const rooms = getStoredChatRooms()
  const updatedRooms = rooms.map(r => {
    if (r.id === roomId) {
      return {
        ...r,
        lastMessage: `${message.senderName}: ${message.text}`,
        lastTime: message.timestamp,
        unreadCount: r.unreadCount + 1
      }
    }
    return r
  })
  saveStoredChatRooms(updatedRooms)
}
