/**
 * SIDAAP Real-Time & Cloud Chat Service (Supabase + Local Fallback)
 * ─────────────────────────────────────────────────────────────────────────────
 * - When Supabase is configured in .env.local:
 *     Connects to Supabase PostgreSQL + Realtime WebSockets for multi-device sync.
 * - When Supabase is not yet configured:
 *     Seamlessly falls back to local storage and cross-tab broadcasts.
 */

import { createClient, isSupabaseConfigured } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import {
  ChatRoom,
  ChatMessage,
  getStoredChatRooms,
  saveStoredChatRooms,
  getStoredChatMessages,
  saveStoredChatMessages,
  addChatMessage,
  setTyping as setLocalTyping,
  clearTyping as clearLocalTyping,
  getTypingInRoom as getLocalTypingInRoom
} from '@/lib/data/portal-data'

export function isCloudRealtimeActive(): boolean {
  return isSupabaseConfigured()
}

// ── Rooms ─────────────────────────────────────────────────────────────────────

export async function fetchChatRooms(): Promise<ChatRoom[]> {
  const supabase = createClient()
  if (!supabase) {
    return getStoredChatRooms()
  }

  try {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('created_at', { ascending: true })

    if (error || !data || data.length === 0) {
      return getStoredChatRooms()
    }

    const rooms: ChatRoom[] = data.map((r: any) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      description: r.description ?? '',
      state: r.state ?? undefined,
      unreadCount: 0,
      lastMessage: 'Active channel',
      lastTime: 'Active',
      avatarText: r.avatar_text || r.name.slice(0, 3).toUpperCase(),
      avatarColor: r.avatar_color || 'bg-emerald-800'
    }))

    // Keep local cache synced
    saveStoredChatRooms(rooms)
    return rooms
  } catch (err) {
    console.error('[sidaap:chat] fetchChatRooms fallback to local', err)
    return getStoredChatRooms()
  }
}

export async function upsertChatRoom(room: ChatRoom): Promise<void> {
  // Always update local cache first
  const current = getStoredChatRooms()
  const exists = current.some((r) => r.id === room.id)
  const updated = exists ? current.map((r) => (r.id === room.id ? room : r)) : [room, ...current]
  saveStoredChatRooms(updated)

  const supabase = createClient()
  if (!supabase) return

  try {
    await supabase.from('chat_rooms').upsert(
      {
        id: room.id,
        name: room.name,
        type: room.type,
        description: room.description || null,
        state: room.state || null,
        avatar_text: room.avatarText,
        avatar_color: room.avatarColor
      },
      { onConflict: 'id' }
    )
  } catch (err) {
    console.error('[sidaap:chat] upsertChatRoom error', err)
  }
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function fetchChatMessages(roomId: string): Promise<ChatMessage[]> {
  const localMap = getStoredChatMessages()
  const localMsgs = localMap[roomId] || []

  const supabase = createClient()
  if (!supabase) {
    return localMsgs
  }

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(150)

    if (error || !data || data.length === 0) {
      return localMsgs
    }

    const mapped: ChatMessage[] = data.map((m: any) => {
      const timeStr = m.created_at
        ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now'

      return {
        id: m.id,
        roomId: m.room_id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        senderRole: m.sender_role,
        senderState: m.sender_state ?? undefined,
        text: m.text,
        timestamp: timeStr,
        status: m.status || 'read'
      }
    })

    // Merge with local if needed
    return mapped
  } catch (err) {
    console.error('[sidaap:chat] fetchChatMessages fallback to local', err)
    return localMsgs
  }
}

export async function sendChatMessage(roomId: string, message: ChatMessage): Promise<void> {
  // Always save locally immediately
  addChatMessage(roomId, message)

  const supabase = createClient()
  if (!supabase) return

  try {
    await supabase.from('chat_messages').insert({
      id: message.id,
      room_id: roomId,
      sender_id: message.senderId,
      sender_name: message.senderName,
      sender_role: message.senderRole,
      sender_state: message.senderState || null,
      text: message.text,
      status: message.status || 'sent'
    })
  } catch (err) {
    console.error('[sidaap:chat] sendChatMessage error', err)
  }
}

export async function updateMessageDelivery(msgId: string, status: 'delivered' | 'read'): Promise<void> {
  // Update local storage fallback
  if (typeof window !== 'undefined') {
    const all = getStoredChatMessages()
    let found = false
    for (const [roomId, msgs] of Object.entries(all)) {
      const idx = msgs.findIndex((m) => m.id === msgId)
      if (idx >= 0 && msgs[idx].status !== status) {
        msgs[idx].status = status
        found = true
        break
      }
    }
    if (found) {
      saveStoredChatMessages(all)
    }
  }

  const supabase = createClient()
  if (!supabase) return

  try {
    await supabase.from('chat_messages').update({ status }).eq('id', msgId)
  } catch (err) {
    console.error('[sidaap:chat] updateMessageDelivery error', err)
  }
}

// ── Realtime Subscriptions ────────────────────────────────────────────────────

export function subscribeToAllMessages(
  onMessage: (msg: ChatMessage) => void
): () => void {
  const supabase = createClient()

  const handleLocalUpdate = () => {
    const all = getStoredChatMessages()
    for (const msgs of Object.values(all)) {
      if (msgs.length > 0) {
        onMessage(msgs[msgs.length - 1])
      }
    }
  }
  window.addEventListener('sidaap_chat_updated', handleLocalUpdate)
  window.addEventListener('storage', handleLocalUpdate)

  let channel: RealtimeChannel | null = null

  if (supabase) {
    channel = supabase
      .channel('global_chat_messages_feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload: any) => {
          if (payload.new) {
            const m = payload.new
            const timeStr = m.created_at
              ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now'

            onMessage({
              id: m.id,
              roomId: m.room_id,
              senderId: m.sender_id,
              senderName: m.sender_name,
              senderRole: m.sender_role,
              senderState: m.sender_state ?? undefined,
              text: m.text,
              timestamp: timeStr,
              status: m.status || 'sent'
            })
          }
        }
      )
      .subscribe()
  }

  return () => {
    window.removeEventListener('sidaap_chat_updated', handleLocalUpdate)
    window.removeEventListener('storage', handleLocalUpdate)
    if (channel && supabase) {
      supabase.removeChannel(channel)
    }
  }
}

export function subscribeToMessages(
  roomId: string,
  onNewMessage: (msg: ChatMessage) => void
): () => void {
  const supabase = createClient()

  // Local storage listener fallback
  const handleLocalUpdate = () => {
    const all = getStoredChatMessages()
    const msgs = all[roomId] || []
    if (msgs.length > 0) {
      onNewMessage(msgs[msgs.length - 1])
    }
  }
  window.addEventListener('sidaap_chat_updated', handleLocalUpdate)
  window.addEventListener('storage', handleLocalUpdate)

  let channel: RealtimeChannel | null = null

  if (supabase) {
    channel = supabase
      .channel(`room_messages_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload: any) => {
          if (payload.new) {
            const m = payload.new
            const timeStr = m.created_at
              ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now'

            onNewMessage({
              id: m.id,
              roomId: m.room_id,
              senderId: m.sender_id,
              senderName: m.sender_name,
              senderRole: m.sender_role,
              senderState: m.sender_state ?? undefined,
              text: m.text,
              timestamp: timeStr,
              status: m.status || 'read'
            })
          }
        }
      )
      .subscribe()
  }

  return () => {
    window.removeEventListener('sidaap_chat_updated', handleLocalUpdate)
    window.removeEventListener('storage', handleLocalUpdate)
    if (channel && supabase) {
      supabase.removeChannel(channel)
    }
  }
}

// ── Typing Indicator ──────────────────────────────────────────────────────────

export function broadcastUserTyping(
  roomId: string,
  userId: string,
  userName: string,
  isTyping: boolean
): void {
  if (isTyping) {
    setLocalTyping(roomId, userId, userName)
  } else {
    clearLocalTyping(roomId, userId)
  }

  const supabase = createClient()
  if (!supabase) return

  try {
    const channel = supabase.channel(`typing_${roomId}`)
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, userName, isTyping }
    })
  } catch (err) {
    // Ignore error
  }
}

export function subscribeToTyping(
  roomId: string,
  myUserId: string,
  onUpdate: (typers: { userId: string; userName: string }[]) => void
): () => void {
  const syncLocal = () => {
    const list = getLocalTypingInRoom(roomId, myUserId)
    onUpdate(list.map((t) => ({ userId: t.userId, userName: t.userName })))
  }

  window.addEventListener('sidaap_typing_updated', syncLocal)
  window.addEventListener('storage', syncLocal)

  const supabase = createClient()
  let channel: RealtimeChannel | null = null

  if (supabase) {
    channel = supabase
      .channel(`typing_${roomId}`)
      .on('broadcast', { event: 'typing' }, (event: any) => {
        const { userId, userName, isTyping } = event.payload || {}
        if (userId === myUserId) return

        if (isTyping) {
          setLocalTyping(roomId, userId, userName)
        } else {
          clearLocalTyping(roomId, userId)
        }
        syncLocal()
      })
      .subscribe()
  }

  syncLocal()

  return () => {
    window.removeEventListener('sidaap_typing_updated', syncLocal)
    window.removeEventListener('storage', syncLocal)
    if (channel && supabase) {
      supabase.removeChannel(channel)
    }
  }
}
