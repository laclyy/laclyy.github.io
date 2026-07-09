import { AtSign, Camera, CirclePlay, ExternalLink, Mail, MessageCircle, Music2 } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Socials } from '../types'

const icons: Record<string, ComponentType<{ size?: number }>> = { discord: MessageCircle, instagram: Camera, tiktok: Music2, youtube: CirclePlay, x: AtSign, email: Mail }

export default function SocialLinks({ socials, compact = false, excludeEmail = false }: { socials: Socials; compact?: boolean; excludeEmail?: boolean }) {
  const entries = Object.entries(socials).filter(([key, social]) => social.url && (!excludeEmail || (key !== 'email' && !social.url.startsWith('mailto:'))))
  if (compact) return <div className="flex flex-wrap gap-2">{entries.map(([key, social]) => { const Icon = icons[key] ?? ExternalLink; return <a key={key} href={social.url} target={social.url.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/45 transition hover:-translate-y-0.5 hover:border-flame/40 hover:text-flame focus-ring" aria-label={social.label}><Icon size={16} /></a> })}</div>
  return <div className="grid gap-3 sm:grid-cols-2">{entries.map(([key, social]) => { const Icon = icons[key] ?? ExternalLink; return <a key={key} href={social.url} target={social.url.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/[.08] bg-white/[.025] p-4 transition hover:-translate-y-0.5 hover:border-flame/30 hover:bg-white/[.04] focus-ring"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-black/20 text-flame"><Icon size={18} /></span><span className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-[.15em] text-white/30">{social.label}</span><span className="mt-1 block truncate text-sm text-white/70">{social.username ?? social.value}</span></span><ExternalLink size={14} className="ml-auto shrink-0 text-white/20 transition group-hover:text-flame" /></a> })}</div>
}
