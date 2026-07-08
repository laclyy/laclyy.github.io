import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Profile } from '../types'

export default function ContactSection({ profile }: { profile: Profile }) {
  return <section className="section-space"><div className="shell"><div className="relative overflow-hidden rounded-[2rem] border border-white/[.09] bg-[#110d0a] px-6 py-16 shadow-ember md:px-14 md:py-24"><div className="contact-glow pointer-events-none absolute -right-32 -top-44 h-[500px] w-[500px] rounded-full" /><div className="relative max-w-4xl"><div className="eyebrow"><span className="h-px w-7 bg-solar" />Available for selected projects</div><h2 className="mt-6 font-display text-[clamp(2.7rem,7vw,6.5rem)] font-semibold leading-[.92] tracking-[-.055em]">{profile.contactTitle}</h2><p className="mt-6 max-w-xl text-base leading-7 text-white/52">{profile.contactText}</p><Link to="/contact" className="button-primary mt-8">{profile.commissionCtaText}<ArrowUpRight size={16} /></Link></div></div></div></section>
}
