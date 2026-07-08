import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { publicUrl } from '../lib/content'
import { detectSource, embedUrl } from '../lib/videos'
import type { VideoItem } from '../types'

export default function VideoModal({ video, onClose }: { video: VideoItem | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!video) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    window.setTimeout(() => closeRef.current?.focus(), 50)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKey) }
  }, [video, onClose])

  return (
    <AnimatePresence>
      {video && (
        <motion.div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-md sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={`Video: ${video.title}`}>
          <motion.div initial={{ opacity: 0, y: 25, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: .98 }} transition={{ type: 'spring', damping: 27, stiffness: 280 }} className="relative my-auto w-full max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d0b0a] shadow-[0_30px_100px_rgba(0,0,0,.7)]">
            <button ref={closeRef} onClick={onClose} className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-white hover:text-black focus-ring" aria-label="Close video"><X size={18} /></button>
            <Player video={video} />
            <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-7">
              <div><div className="eyebrow mb-3"><span className="h-1 w-1 rounded-full bg-flame" />{video.type === 'my-edit' ? 'Personal work' : 'Commissioned work'} · {video.style}</div><h2 className="font-display text-2xl font-semibold md:text-3xl">{video.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/48">{video.description}</p><div className="mt-4 flex flex-wrap gap-2">{video.tags.map((tag) => <span key={tag} className="font-mono text-[9px] uppercase tracking-[.12em] text-white/28">#{tag}</span>)}</div></div>
              <a href={publicUrl(video.videoUrl)} target="_blank" rel="noreferrer" className="button-secondary whitespace-nowrap">Open source <ExternalLink size={15} /></a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Player({ video }: { video: VideoItem }) {
  const source = detectSource(video.videoUrl, video.source)
  const embed = embedUrl(video)
  if (source === 'local') return <div className="aspect-video bg-black"><video controls preload="none" poster={publicUrl(video.thumbnailUrl || 'thumbnails/fallback.svg')} className="h-full w-full" playsInline><source src={publicUrl(video.videoUrl)} />Your browser does not support HTML5 video.</video></div>
  if (embed) return <div className="aspect-video bg-black"><iframe src={embed} title={video.title} className="h-full w-full" allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen loading="lazy" /></div>
  return <div className="grid aspect-video place-items-center bg-[radial-gradient(circle_at_center,rgba(255,61,32,.16),transparent_55%)] p-8 text-center"><div><span className="font-mono text-[10px] uppercase tracking-[.18em] text-flame">External platform</span><h3 className="mt-3 font-display text-2xl">This video opens on its original platform.</h3><a href={publicUrl(video.videoUrl)} target="_blank" rel="noreferrer" className="button-primary mt-6">Open video <ExternalLink size={15} /></a></div></div>
}
