import { motion } from 'framer-motion'
import { Gamepad2, Gauge, Layers3, MessageSquareText, Sparkles, Type, Wand2 } from 'lucide-react'
import type { Profile, Socials, VideoItem } from '../types'
import ContactSection from '../components/ContactSection'
import FeaturedVideos from '../components/FeaturedVideos'
import Hero from '../components/Hero'
import ProfileAvatar from '../components/ProfileAvatar'
import SocialLinks from '../components/SocialLinks'

const strengths = [
  { icon: Gauge, title: 'Sync & rhythm', text: 'Cuts and micro-accents shaped around sound without sacrificing clarity.' },
  { icon: MessageSquareText, title: 'Storytelling', text: 'Every sequence has direction: tension, breathing room, and payoff.' },
  { icon: Type, title: 'Typography', text: 'Type that becomes rhythm, hierarchy, and a living part of the frame.' },
  { icon: Sparkles, title: 'Anime edits', text: 'Atmosphere, character focus, and transitions that respect the scene.' },
  { icon: Gamepad2, title: 'Gaming edits', text: 'High-energy montages, GMVs, and highlights with precise sound design.' },
  { icon: Wand2, title: 'Promo edits', text: 'Short, memorable content built for launches and social platforms.' },
  { icon: Layers3, title: 'Flow & cinematic', text: 'Visual continuity, color mood, and pacing that create presence.' },
]

export default function HomePage({ profile, socials, videos, onOpen }: { profile: Profile; socials: Socials; videos: VideoItem[]; onOpen: (video: VideoItem) => void }) {
  return <>
    <Hero profile={profile} />
    <section className="section-space border-y border-white/[.06] bg-white/[.012]"><div className="shell"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20"><div><div className="flex items-center gap-4"><ProfileAvatar profile={profile} size="lg" /><div><div className="eyebrow"><span className="h-px w-7 bg-flame" />{profile.role}</div>{profile.location && <p className="mt-3 font-mono text-[10px] uppercase tracking-[.15em] text-white/28">Based in {profile.location}</p>}</div></div><p className="mt-7 font-display text-2xl font-medium leading-tight tracking-tight text-white/88 md:text-3xl">{profile.shortDescription}</p></div><div className="grid gap-6 text-base leading-7 text-white/50 sm:grid-cols-2"><p>{profile.longDescription}</p><p>{profile.styleDescription}</p></div></div><div className="mt-14 rounded-[1.75rem] border border-white/[.08] bg-black/20 p-5 shadow-2xl shadow-black/15 md:p-7"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="eyebrow"><span className="h-px w-7 bg-solar" />Follow Lacly</div><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.04em] md:text-4xl">Socials first. Edits everywhere.</h2></div><p className="max-w-sm text-sm leading-6 text-white/42">Catch new drops, previews, commissions info, and updates directly from Lacly’s channels.</p></div><SocialLinks socials={socials} excludeEmail /></div></div></section>
    <FeaturedVideos profile={profile} videos={videos} onOpen={onOpen} />
    <section className="section-space overflow-hidden border-y border-white/[.06] bg-white/[.012]"><div className="shell"><div className="section-heading"><div><div className="eyebrow"><span className="h-px w-7 bg-flame" />Capabilities</div><h2>{profile.strengthsTitle}</h2><p>{profile.strengthsText}</p></div><span className="hidden font-display text-8xl font-semibold text-white/[.025] lg:block">07</span></div><div className="mt-14 grid border-l border-t border-white/[.075] sm:grid-cols-2 lg:grid-cols-4">{strengths.map((item, index) => <motion.article key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .05 }} className="group min-h-56 border-b border-r border-white/[.075] p-6 transition-colors hover:bg-white/[.025] md:p-7"><item.icon size={20} className="text-flame transition-transform duration-300 group-hover:scale-110" /><span className="mt-12 block font-mono text-[9px] tracking-[.14em] text-white/20">0{index + 1}</span><h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/40">{item.text}</p></motion.article>)}</div></div></section>
    <ContactSection profile={profile} />
  </>
}
