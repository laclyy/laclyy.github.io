import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { useState } from 'react'
import { publicUrl } from '../lib/content'
import type { VideoItem } from '../types'

export default function VideoCard({ video, onOpen, index = 0 }: { video: VideoItem; onOpen: (video: VideoItem) => void; index?: number }) {
  const [src, setSrc] = useState(publicUrl(video.thumbnailUrl || 'thumbnails/fallback.svg'))
  return (
    <motion.article layout initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .4, delay: Math.min(index * .045, .2) }} className="group min-w-0">
      <button onClick={() => onOpen(video)} className="block w-full text-left focus-ring" aria-label={`Play ${video.title}`}>
        <div className="relative aspect-video overflow-hidden rounded-[1.25rem] border border-white/[.08] bg-panel shadow-2xl shadow-black/20">
          <img src={src} onError={() => setSrc(publicUrl('thumbnails/fallback.svg'))} alt={`${video.title} thumbnail`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-125" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/5 opacity-80 transition-opacity group-hover:opacity-60" />
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] text-white/70 backdrop-blur-md">{video.style}</span>
          <span className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white text-ink shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-flame group-hover:text-white">
            <Play size={16} fill="currentColor" className="translate-x-px" />
          </span>
          <span className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[.16em] text-white/55">{new Date(`${video.date}T00:00:00`).getFullYear()} · {video.source}</span>
        </div>
        <div className="flex items-start justify-between gap-4 px-1 pt-5">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-flame">{video.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-white/43">{video.description}</p>
          </div>
          <ArrowUpRight size={18} className="mt-1 shrink-0 text-white/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-flame" />
        </div>
      </button>
    </motion.article>
  )
}
