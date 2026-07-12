import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { publicUrl } from '../lib/content'
import { formatMonthYear, getDifficultyMeta, normalizeAspectRatio } from '../lib/videoMeta'
import type { VideoItem } from '../types'

export default function VideoCard({ video, onOpen }: { video: VideoItem; onOpen: (video: VideoItem) => void; index?: number }) {
  const [src, setSrc] = useState(publicUrl(video.thumbnailUrl || 'thumbnails/fallback.svg'))
  const difficulty = getDifficultyMeta(video.difficulty)
  const aspectRatio = normalizeAspectRatio(video.aspectRatio)
  const hasDisplayStyle = video.style && video.style !== 'altro'
  const frameClass = video.masterpiece ? 'difficulty-frame-masterpiece' : difficulty.frameClass
  return (
    <motion.article initial={false} className="group min-w-0">
      <button onClick={() => onOpen(video)} className="block w-full text-left focus-ring" aria-label={`Play ${video.title}`}>
        <div className={`relative rounded-[1.45rem] p-[2px] ${frameClass}`}>
          <div className="relative aspect-video overflow-hidden rounded-[1.32rem] bg-panel shadow-2xl shadow-black/25" style={aspectRatio ? { aspectRatio } : undefined}>
            <img src={src} onError={() => setSrc(publicUrl('thumbnails/fallback.svg'))} alt={`${video.title} thumbnail`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045] group-hover:saturate-125" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/35 opacity-90 transition-opacity group-hover:opacity-70" />
            <div className="absolute inset-x-0 top-0 flex items-start gap-3 p-4">
              {hasDisplayStyle && <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] text-white/70 backdrop-blur-md">{video.style}</span>}
              <div className="ml-auto flex flex-col items-end gap-1.5">
                {video.masterpiece && (
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] backdrop-blur-md difficulty-pill-masterpiece">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Masterpiece
                  </span>
                )}
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] backdrop-blur-md ${difficulty.pillClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${difficulty.dotClass}`} />
                  {difficulty.label}
                </span>
              </div>
            </div>
            <span className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[.16em] text-white/60">{formatMonthYear(video.date)}</span>
            <span className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white text-ink shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-flame group-hover:text-white">
              <Play size={16} fill="currentColor" className="translate-x-px" />
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  )
}
