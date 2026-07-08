import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import VideoModal from './components/VideoModal'
import { useProfile } from './lib/profile'
import { useSocials } from './lib/socials'
import { useVideos } from './lib/videos'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import VideosPage from './pages/VideosPage'
import type { VideoItem } from './types'

export default function App() {
  const { profile } = useProfile()
  const socials = useSocials()
  const { videos, loading } = useVideos()
  const [selected, setSelected] = useState<VideoItem | null>(null)
  const location = useLocation()
  const closeModal = useCallback(() => setSelected(null), [])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); setSelected(null) }, [location.pathname])
  useEffect(() => {
    document.title = `${profile.name} — ${profile.role}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', profile.shortDescription)
  }, [profile])

  return <div className="min-h-screen overflow-clip bg-ink text-white"><div className="noise pointer-events-none fixed inset-0 z-[100] opacity-[.035]" /><Navbar profile={profile} /><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}><Routes location={location}><Route path="/" element={<HomePage profile={profile} videos={videos} onOpen={setSelected} />} /><Route path="/videos" element={<VideosPage videos={videos} loading={loading} onOpen={setSelected} />} /><Route path="/contact" element={<ContactPage profile={profile} socials={socials} />} /><Route path="*" element={<HomePage profile={profile} videos={videos} onOpen={setSelected} />} /></Routes></motion.div></AnimatePresence><Footer profile={profile} socials={socials} /><VideoModal video={selected} onClose={closeModal} /></div>
}
