import { ArrowUpRight, CheckCircle2, Clock3, MessageCircle, Ticket, Users } from 'lucide-react'
import CopyDiscordButton from '../components/CopyDiscordButton'
import ProfileAvatar from '../components/ProfileAvatar'
import SocialLinks from '../components/SocialLinks'
import type { Profile, Socials } from '../types'

const ticketSteps = [
  { icon: MessageCircle, title: 'Join the Discord server', text: 'Enter Lacly’s server through the invite link and head to the commissions area.' },
  { icon: Ticket, title: 'Open a ticket', text: 'Create a private ticket with your idea, references, deadline, format, and budget range.' },
  { icon: CheckCircle2, title: 'Confirm the edit', text: 'Lacly reviews the request, confirms availability, and keeps the full commission flow in one place.' },
]

export default function ContactPage({ profile, socials }: { profile: Profile; socials: Socials }) {
  const discord = socials.discord
  const discordInvite = discord?.url && !discord.url.startsWith('mailto:') ? discord.url : ''

  return <main className="pb-28 pt-32 md:pb-36 md:pt-40">
    <section className="shell"><div className="grid gap-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
      <div>
        <div className="mb-8 flex items-center gap-4 rounded-3xl border border-white/[.08] bg-white/[.025] p-4">
          <ProfileAvatar profile={profile} size="lg" />
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/32">Commission contact</span>
            <h2 className="mt-1 font-display text-2xl font-semibold">{profile.name}</h2>
            <p className="mt-1 text-sm text-white/42">{profile.role}</p>
          </div>
        </div>
        <div className="eyebrow"><span className="h-px w-7 bg-flame" />Discord ticket system</div>
        <h1 className="mt-6 font-display text-[clamp(3.6rem,8vw,7rem)] font-semibold leading-[.88] tracking-[-.06em]">{profile.contactTitle}</h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-white/50">{profile.contactText}</p>

        {discord?.username && <div className="mt-10 rounded-2xl border border-white/[.08] bg-white/[.025] p-5">
          <div className="flex items-center gap-3">
            <MessageCircle size={18} className="text-flame" />
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[.15em] text-white/30">Discord</span>
              <span className="mt-1 block font-display text-lg">{discord.username}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyDiscordButton username={discord.username} />
            {discordInvite && <a href={discordInvite} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-flame/35 bg-flame/10 px-3 py-2 text-xs text-white/75 transition hover:bg-flame hover:text-white focus-ring">Open Discord server <ArrowUpRight size={13} /></a>}
          </div>
        </div>}

        <div className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.025] p-4">
          <div className="mb-4 flex items-center gap-3"><ProfileAvatar profile={profile} size="xs" /><span className="font-mono text-[9px] uppercase tracking-[.15em] text-white/35">Social channels</span></div>
          <SocialLinks socials={socials} compact excludeEmail />
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[.09] bg-white/[.025] p-5 shadow-2xl shadow-black/20 sm:p-8">
        <div className="contact-glow pointer-events-none absolute -right-40 -top-52 h-[430px] w-[430px] rounded-full opacity-60" />
        <div className="relative">
          <div className="flex items-center justify-between border-b border-white/[.08] pb-5">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[.16em] text-flame">Commission tickets</span>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-.035em]">Open a private ticket.</h2>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-ember to-flame text-white shadow-[0_0_26px_rgba(255,32,56,.24)]"><Ticket size={20} /></span>
          </div>

          <p className="mt-6 text-sm leading-6 text-white/48">Commissions are handled through Lacly’s Discord server so every request, reference, deadline, revision, and update stays organized in one private thread.</p>

          <div className="mt-8 grid gap-4">
            {ticketSteps.map((step, index) => (
              <article key={step.title} className="group rounded-2xl border border-white/[.08] bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-flame/30 hover:bg-white/[.035]">
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-black/25 text-flame"><step.icon size={18} /></span>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/28">Step 0{index + 1}</span>
                    <h3 className="mt-1 font-display text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-white/42">{step.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-flame/20 bg-flame/[.06] p-5">
            <div className="flex items-start gap-3">
              <Clock3 size={18} className="mt-0.5 shrink-0 text-solar" />
              <p className="text-sm leading-6 text-white/52">For the fastest reply, include duration, format, platform, deadline, references, and whether the edit is personal or commissioned.</p>
            </div>
          </div>

          {discordInvite ? (
            <a href={discordInvite} target="_blank" rel="noreferrer" className="button-primary mt-8 w-full justify-center py-4">{profile.commissionCtaText}<Users size={16} /></a>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/[.08] bg-black/25 p-5 text-center">
              <p className="text-sm leading-6 text-white/45">The Discord ticket invite is coming soon. For now, copy the Discord username and contact Lacly directly.</p>
            </div>
          )}
        </div>
      </section>
    </div></section>

    <section className="shell mt-24"><div className="border-t border-white/[.08] pt-10"><div className="eyebrow mb-5"><span className="h-px w-7 bg-flame" />Find Lacly online</div><SocialLinks socials={socials} excludeEmail /></div></section>
  </main>
}
