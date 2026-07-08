import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Profile, Socials } from '../types'

export default function Footer({ profile, socials }: { profile: Profile; socials: Socials }) {
  const visible = Object.entries(socials).filter(([, social]) => social.url && !social.url.startsWith('mailto:')).slice(0, 5)
  return (
    <footer className="border-t border-white/[.07] bg-black/20">
      <div className="shell py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Link to="/" className="font-display text-2xl font-bold tracking-[.15em] focus-ring">{profile.name}</Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">{profile.shortDescription}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {visible.map(([key, social]) => (
              <a key={key} href={social.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white focus-ring">
                {social.label}<ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/[.07] pt-6 font-mono text-[10px] uppercase tracking-[.16em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}. All cuts reserved.</span>
          <span>Designed for motion · Built for speed</span>
        </div>
      </div>
    </footer>
  )
}
