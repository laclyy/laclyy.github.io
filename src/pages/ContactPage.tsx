import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import CopyDiscordButton from '../components/CopyDiscordButton'
import SocialLinks from '../components/SocialLinks'
import type { Profile, Socials } from '../types'

export default function ContactPage({ profile, socials }: { profile: Profile; socials: Socials }) {
  const discord = socials.discord
  const [name, setName] = useState('')
  const [project, setProject] = useState('')
  const [message, setMessage] = useState('')
  const sendEmail = (event: FormEvent) => { event.preventDefault(); const subject = encodeURIComponent(`Edit inquiry — ${project || 'New project'}`); const body = encodeURIComponent(`Hi ${profile.name},\n\nMy name is ${name}.\n\n${message}\n\nThank you!`); window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}` }
  return <main className="pb-28 pt-32 md:pb-36 md:pt-40">
    <section className="shell"><div className="grid gap-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
      <div><div className="eyebrow"><span className="h-px w-7 bg-flame" />Let’s work together</div><h1 className="mt-6 font-display text-[clamp(3.6rem,8vw,7rem)] font-semibold leading-[.88] tracking-[-.06em]">{profile.contactTitle}</h1><p className="mt-7 max-w-xl text-base leading-7 text-white/50">{profile.contactText}</p><a href={`mailto:${profile.email}`} className="group mt-9 inline-flex items-center gap-3 text-lg text-white transition hover:text-flame focus-ring"><span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-ember to-flame text-white"><Mail size={17} /></span>{profile.email}<ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
        {discord?.username && <div className="mt-10 rounded-2xl border border-white/[.08] bg-white/[.025] p-5"><div className="flex items-center gap-3"><MessageCircle size={18} className="text-flame" /><div><span className="block font-mono text-[9px] uppercase tracking-[.15em] text-white/30">Discord</span><span className="mt-1 block font-display text-lg">{discord.username}</span></div></div><div className="mt-4 flex flex-wrap gap-2"><CopyDiscordButton username={discord.username} />{discord.url && <a href={discord.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-3 py-2 text-xs text-white/55 transition hover:border-flame/35 hover:text-white focus-ring">Open / join server <ArrowUpRight size={13} /></a>}</div></div>}
        <div className="mt-8"><SocialLinks socials={socials} compact /></div>
      </div>
      <form onSubmit={sendEmail} className="rounded-[1.75rem] border border-white/[.09] bg-white/[.025] p-5 shadow-2xl shadow-black/20 sm:p-8"><div className="flex items-center justify-between border-b border-white/[.08] pb-5"><div><span className="font-mono text-[9px] uppercase tracking-[.16em] text-flame">Project brief</span><h2 className="mt-1 font-display text-2xl font-semibold">Tell me about your edit.</h2></div><span className="h-2 w-2 rounded-full bg-flame shadow-[0_0_16px_#ff2038]" /></div><div className="mt-7 grid gap-6 sm:grid-cols-2"><Field label="Your name" value={name} onChange={setName} placeholder="What should I call you?" required /><Field label="Project type" value={project} onChange={setProject} placeholder="AMV, promo, gaming..." required /></div><label className="mt-6 block"><span className="form-label">Brief and deadline</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Mood, duration, platform, deadline, and any useful references..." required rows={6} className="form-input resize-none" /></label><p className="mt-4 text-xs leading-5 text-white/28">This form does not send data to a server. It simply opens your email app with the message already filled in.</p><button type="submit" className="button-primary mt-7 w-full justify-center py-4">{profile.commissionCtaText}<ArrowUpRight size={16} /></button></form>
    </div></section>
    <section className="shell mt-24"><div className="border-t border-white/[.08] pt-10"><div className="eyebrow mb-5"><span className="h-px w-7 bg-flame" />Find me online</div><SocialLinks socials={socials} /></div></section>
  </main>
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean }) { return <label className="block"><span className="form-label">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="form-input" /></label> }
