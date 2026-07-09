import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProfileAvatar from './ProfileAvatar'
import type { Profile } from '../types'

export default function Hero({ profile }: { profile: Profile }) {
  const { scrollY } = useScroll()
  const glowY = useTransform(scrollY, [0, 700], [0, 180])
  const titleParts = profile.heroTitle.split(/(?<=\.)\s+/, 2)
  return (
    <section className="relative flex min-h-[760px] items-center overflow-hidden pb-20 pt-32 md:min-h-screen md:pb-28 md:pt-40">
      <motion.div style={{ y: glowY }} className="hero-orb pointer-events-none absolute -right-40 top-20 h-[600px] w-[600px] rounded-full md:right-[-8%] md:h-[760px] md:w-[760px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="shell relative z-10 w-full">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="eyebrow">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flame shadow-[0_0_16px_#ff2038]" />{profile.heroEyebrow}
        </motion.div>
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1fr_300px]">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .08 }} className="max-w-5xl font-display text-[clamp(3.4rem,9vw,8.7rem)] font-semibold leading-[.86] tracking-[-.065em]">
            {titleParts[0]}{titleParts[1] && <><br /><span className="text-gradient">{titleParts[1]}</span></>}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .22 }} className="lg:pb-3">
            <div className="mb-7 flex items-center gap-4 rounded-3xl border border-white/[.08] bg-white/[.035] p-3 pr-5 backdrop-blur-md">
              <ProfileAvatar profile={profile} size="md" priority />
              <div className="min-w-0">
                <span className="block font-mono text-[9px] uppercase tracking-[.16em] text-white/35">Editor identity</span>
                <span className="mt-1 block truncate font-display text-lg font-semibold">{profile.name}</span>
              </div>
            </div>
            <p className="text-base leading-7 text-white/58">{profile.heroText}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/videos" className="button-primary"><Play size={15} fill="currentColor" />{profile.primaryCtaText}</Link>
              <Link to="/contact" className="button-secondary">{profile.secondaryCtaText}<ArrowRight size={16} /></Link>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }} className="mt-20 flex items-end justify-between border-t border-white/10 pt-5 md:mt-28">
          <span className="font-mono text-[10px] uppercase tracking-[.18em] text-white/35">Scroll to explore</span>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-flame"><ArrowDownRight size={17} /></span>
        </motion.div>
      </div>
    </section>
  )
}
