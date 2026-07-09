import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ProfileAvatar from './ProfileAvatar'
import type { Profile } from '../types'

const links = [
  { to: '/', label: 'Home' },
  { to: '/videos', label: 'Video' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/[.07] bg-ink/80 backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="shell flex h-20 items-center justify-between" aria-label="Navigazione principale">
        <Link to="/" className="group flex items-center gap-3 rounded-sm focus-ring" aria-label={`${profile.name}, home`}>
          <ProfileAvatar profile={profile} size="xs" priority className="transition-transform duration-300 group-hover:scale-105" />
          <span className="font-display text-lg font-bold tracking-[.18em]">{profile.name}</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/[.07] bg-white/[.025] p-1 md:flex">
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link key={link.to} to={link.to} className={`relative rounded-full px-5 py-2 text-sm transition-colors focus-ring ${active ? 'text-white' : 'text-white/55 hover:text-white'}`}>
                {active && <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full bg-white/[.08]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                {link.label}
              </Link>
            )
          })}
        </div>

        <Link to="/contact" className="button-secondary hidden md:inline-flex">Start a project <span aria-hidden="true">↗</span></Link>
        <button className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.04] focus-ring md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="border-b border-white/10 bg-ink/95 px-5 pb-6 pt-2 backdrop-blur-xl md:hidden">
            <div className="flex flex-col">
              {links.map((link, index) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .04 }}>
                  <Link to={link.to} className={`flex items-center justify-between border-b border-white/[.07] py-4 font-display text-xl focus-ring ${location.pathname === link.to ? 'text-flame' : 'text-white/80'}`}>
                    {link.label}<span className="font-mono text-xs text-white/25">0{index + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
