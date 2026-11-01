'use client'

import { useState, useRef, useEffect } from 'react'
import {
  X,
  Camera,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  Phone,
  Building,
  User,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react'
import { AuthUser, updateUserProfile } from '@/lib/auth/session'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: AuthUser | null
}

const AVATAR_PRESETS = [
  { label: 'Dr. Friday Chalele (Executive)', url: '/hero-portrait.jpg' },
  { label: 'Director (Corporate)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Director (Formal)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Director (Female Formal)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Counselor / Staff', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Sports / Youth Director', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80' }
]

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
      setCity(user.city || '')
      setAvatarUrl(user.avatarUrl || '')
      setPassword(user.password || '')
    }
    setSuccessMsg('')
  }, [user, isOpen])

  if (!isOpen || !user) return null

  // Handle local image file upload and convert to base64 DataURL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 4MB
    if (file.size > 4 * 1024 * 1024) {
      alert('Image file too large. Please select an image under 4MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        setAvatarUrl(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMsg('')

    setTimeout(() => {
      const updated = updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        avatarUrl: avatarUrl.trim(),
        ...(password.trim() ? { password: password.trim() } : {})
      })

      setIsSaving(false)
      if (updated) {
        setSuccessMsg('Profile and photo updated successfully! Changes are live across the portal.')
        setTimeout(() => {
          onClose()
        }, 1200)
      }
    }, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f1d19] border border-white/15 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#142621] p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-black shadow">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Edit Profile &amp; Officer Photo
              </h3>
              <p className="text-[11px] text-[#a9b9a8] font-mono">
                {user.role === 'national_director'
                  ? 'National Executive Directorate'
                  : user.role === 'state_director'
                  ? `${user.state} State Directorate`
                  : `${user.lga || 'LGA'} Field Officer`} &bull; Official Account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. PHOTO MANAGEMENT */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#c9ec63] mb-3">
              1. Officer Profile Photo / Avatar
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Preview Bubble */}
              <div className="relative group shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#c9ec63]/60 shadow-xl"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#c9ec63] to-[#8c9d39] text-[#13231f] flex items-center justify-center font-black text-2xl shadow-xl">
                    {user.avatarInitials || 'DIR'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] shadow-lg transition"
                  title="Upload image"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2.5 text-center sm:text-left w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] text-xs font-bold transition shadow"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Image from Device</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#a9b9a8]">
                  Or paste an image URL directly:
                </div>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                  <input
                    type="url"
                    placeholder="https://.../my-photo.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[#162723] text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63] placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono text-stone-400 block mb-2 uppercase">
                Or select an official photo preset:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setAvatarUrl(p.url)}
                    className={`shrink-0 flex items-center gap-1.5 p-1 pr-2.5 rounded-xl border transition text-[11px] ${
                      avatarUrl === p.url
                        ? 'bg-[#c9ec63] text-[#13231f] border-[#c9ec63] font-bold'
                        : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="h-6 w-6 rounded-lg object-cover" />
                    <span className="truncate max-w-[90px]">{p.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. OFFICER DETAILS */}
          <div className="space-y-3.5 text-xs">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#c9ec63]">
              2. Personal &amp; Statutory Information
            </span>

            <div>
              <label className="block text-[#d1d9cf] font-bold mb-1 uppercase tracking-wider text-[11px]">
                Full Official Name
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Friday Chalele"
                className="w-full bg-[#162723] text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#d1d9cf] font-bold uppercase tracking-wider text-[11px]">
                  Official Email Address
                </label>
                <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                  <Lock className="h-3 w-3 text-stone-400" />
                  Statutory CAC Identity
                </span>
              </div>
              <input
                disabled
                type="email"
                value={user.email}
                className="w-full bg-white/5 text-stone-400 px-3.5 py-2.5 rounded-xl border border-white/10 text-xs cursor-not-allowed font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#d1d9cf] font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Contact Phone / Hotline
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                  <input
                    type="tel"
                    placeholder="e.g. 0806 343 0562"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#162723] text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#d1d9cf] font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Command Post / City Office
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="e.g. Wuse II, Abuja or Ikeja"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#162723] text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63]"
                  />
                </div>
              </div>
            </div>

            {/* Jurisdiction Badge */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-stone-400">Jurisdiction: </span>
                <strong className="text-white">{user.state} State</strong>
                {user.lga && <span className="text-stone-300"> ({user.lga})</span>}
              </div>
              <span className="font-mono text-[10px] text-[#c9ec63] uppercase">
                {user.title}
              </span>
            </div>
          </div>

          {/* 3. SECURITY / PASSWORD */}
          <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#c9ec63]">
              3. Portal Password &amp; Passcode
            </span>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#d1d9cf] font-bold uppercase tracking-wider text-[11px]">
                  Change Portal Password
                </label>
                <span className="text-[10px] text-[#a9b9a8] font-mono">
                  Default: sidaap2026
                </span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Set custom password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#162723] text-white pl-9 pr-10 py-2.5 rounded-xl border border-white/10 text-xs outline-none focus:border-[#c9ec63] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl hover:bg-white/10 text-xs text-white/70 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] text-xs font-bold uppercase tracking-wider transition shadow-lg font-mono disabled:opacity-50"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
