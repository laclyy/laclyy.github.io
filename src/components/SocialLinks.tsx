import { AtSign, Camera, CirclePlay, ExternalLink, Mail, MessageCircle, Music2, Send, Tv } from 'lucide-react'
import type { ComponentType } from 'react'
import type { SocialItem, Socials } from '../types'

const explicitIcons: Record<string, ComponentType<{ size?: number }>> = {
  discord: MessageCircle,
  instagram: Camera,
  tiktok: Music2,
  youtube: CirclePlay,
  x: AtSign,
  twitter: AtSign,
  twitch: Tv,
  telegram: Send,
  email: Mail,
}

function resolveSocialIcon(key: string, social: SocialItem): ComponentType<{ size?: number }> {
  const k = key.toLowerCase()
  const p = (social.platform || social.icon || '').toLowerCase()
  const u = (social.url || '').toLowerCase()

  if (explicitIcons[p]) return explicitIcons[p]
  if (explicitIcons[k]) return explicitIcons[k]

  if (k.startsWith('tiktok') || k.includes('tiktok') || u.includes('tiktok.com')) return Music2
  if (k.startsWith('instagram') || k.includes('instagram') || u.includes('instagram.com') || u.includes('instagr.am')) return Camera
  if (k.startsWith('discord') || k.includes('discord') || u.includes('discord.gg') || u.includes('discord.com')) return MessageCircle
  if (k.startsWith('youtube') || k.includes('youtube') || u.includes('youtube.com') || u.includes('youtu.be')) return CirclePlay
  if (k === 'x' || k.startsWith('twitter') || k.includes('twitter') || u.includes('x.com') || u.includes('twitter.com')) return AtSign
  if (k.startsWith('twitch') || k.includes('twitch') || u.includes('twitch.tv')) return Tv
  if (k.startsWith('telegram') || k.includes('telegram') || u.includes('t.me')) return Send
  if (k === 'email' || u.startsWith('mailto:')) return Mail

  return ExternalLink
}

export default function SocialLinks({ socials, compact = false, excludeEmail = false }: { socials: Socials; compact?: boolean; excludeEmail?: boolean }) {
  const entries = Object.entries(socials).filter(([key, social]) => social.url && (!excludeEmail || (key !== 'email' && !social.url.startsWith('mailto:'))))

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, social]) => {
          const Icon = resolveSocialIcon(key, social)
          return (
            <a
              key={key}
              href={social.url}
              target={social.url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/45 transition hover:-translate-y-0.5 hover:border-flame/40 hover:text-flame focus-ring"
              aria-label={social.label}
            >
              <Icon size={16} />
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {entries.map(([key, social]) => {
        const Icon = resolveSocialIcon(key, social)
        return (
          <a
            key={key}
            href={social.url}
            target={social.url.startsWith('mailto:') ? undefined : '_blank'}
            rel="noreferrer"
            className="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/[.08] bg-white/[.025] p-4 transition hover:-translate-y-0.5 hover:border-flame/30 hover:bg-white/[.04] focus-ring"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-black/20 text-flame">
              <Icon size={18} />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[9px] uppercase tracking-[.15em] text-white/30">{social.label}</span>
              <span className="mt-1 block truncate text-sm text-white/70">{social.username ?? social.value}</span>
            </span>
            <ExternalLink size={14} className="ml-auto shrink-0 text-white/20 transition group-hover:text-flame" />
          </a>
        )
      })}
    </div>
  )
}
