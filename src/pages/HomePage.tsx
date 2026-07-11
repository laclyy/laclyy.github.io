import type { Profile, Socials } from '../types'
import ContactSection from '../components/ContactSection'
import Hero from '../components/Hero'
import ProfileAvatar from '../components/ProfileAvatar'
import SocialLinks from '../components/SocialLinks'

export default function HomePage({ profile, socials }: { profile: Profile; socials: Socials }) {
  return <>
    <Hero profile={profile} />
    <section className="section-space border-y border-white/[.06] bg-white/[.012]"><div className="shell"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20"><div><div className="flex items-center gap-4"><ProfileAvatar profile={profile} size="lg" /><div><div className="eyebrow"><span className="h-px w-7 bg-flame" />{profile.role}</div>{profile.location && <p className="mt-3 font-mono text-[10px] uppercase tracking-[.15em] text-white/28">Based in {profile.location}</p>}</div></div><p className="mt-7 font-display text-2xl font-medium leading-tight tracking-tight text-white/88 md:text-3xl">{profile.shortDescription}</p></div><div className="grid gap-6 text-base leading-7 text-white/50 sm:grid-cols-2"><p>{profile.longDescription}</p><p>{profile.styleDescription}</p></div></div><div className="mt-14 rounded-[1.75rem] border border-white/[.08] bg-black/20 p-5 shadow-2xl shadow-black/15 md:p-7"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="eyebrow"><span className="h-px w-7 bg-solar" />Follow Lacly</div><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.04em] md:text-4xl">Socials first. Edits everywhere.</h2></div><p className="max-w-sm text-sm leading-6 text-white/42">Catch new drops, previews, commissions info, and updates directly from Lacly’s channels.</p></div><SocialLinks socials={socials} excludeEmail /></div></div></section>
    <ContactSection profile={profile} />
  </>
}
