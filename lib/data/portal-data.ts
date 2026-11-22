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
  position?: string
  positionNumber?: number
}

export interface StateStaffMember {
  id: string
  name: string
  email: string
  phone: string
  state: string
  lga: string
  city: string
  memberType: 'Member' | 'Staff'
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

export const INITIAL_NATIONAL_DIRECTIVES: NationalDirective[] = []

export const INITIAL_STATE_ACTIVITIES: StateActivity[] = []

export const INITIAL_STATE_DIRECTORS: StateDirector[] = []

export const INITIAL_STAFF_MEMBERS: StateStaffMember[] = []

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-public-inquiries',
    name: '🌐 Live Public Crisis & Citizen Help Desk',
    type: 'broadcast',
    description: 'Incoming live messages from citizens, parents, and youth on the public website',
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
export const LEGACY_SAMPLE_STAFF_IDS = new Set([
  'staff-1',
  'staff-2',
  'staff-3',
  'staff-4',
  'staff-5',
  'staff-6',
])
export const LEGACY_SAMPLE_ACTIVITY_IDS = new Set(['act-1', 'act-2', 'act-3', 'act-4'])
export const LEGACY_SAMPLE_DIRECTIVE_IDS = new Set(['dir-nat-01', 'dir-nat-02', 'dir-nat-03'])
const LEGACY_SAMPLE_DIRECTOR_IDS = new Set([
  'dir-fct',
  'dir-lagos',
  'dir-delta',
  'dir-kano',
  'dir-rivers',
  'dir-oyo',
])

export function getStoredDirectors(): StateDirector[] {
  if (typeof window === 'undefined') return INITIAL_STATE_DIRECTORS
  try {
    const raw = localStorage.getItem(DIRECTORS_KEY)
    if (raw) {
      const parsed: StateDirector[] = JSON.parse(raw)
      const current = parsed.filter(director => !LEGACY_SAMPLE_DIRECTOR_IDS.has(director.id))
      if (current.length !== parsed.length) {
        localStorage.setItem(DIRECTORS_KEY, JSON.stringify(current))
      }
      return current
    }
    localStorage.setItem(DIRECTORS_KEY, JSON.stringify(INITIAL_STATE_DIRECTORS))
  } catch (err) {
    console.error('Failed to get stored directors', err)
  }
  return INITIAL_STATE_DIRECTORS
}

export function saveStoredDirectors(directors: StateDirector[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DIRECTORS_KEY, JSON.stringify(directors))
    window.dispatchEvent(new Event('sidaap_directors_updated'))
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
      const current = parsed.filter((member) => !LEGACY_SAMPLE_STAFF_IDS.has(member.id))
      if (current.length !== parsed.length) {
        localStorage.setItem(STAFF_KEY, JSON.stringify(current))
      }
      return current
    }
    localStorage.setItem(STAFF_KEY, JSON.stringify(INITIAL_STAFF_MEMBERS))
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
      const current = parsed.filter((activity) => !LEGACY_SAMPLE_ACTIVITY_IDS.has(activity.id))
      if (current.length !== parsed.length) {
        localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(current))
      }
      return current
    }
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_STATE_ACTIVITIES))
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
