import { motion } from 'framer-motion'
import { Clapperboard } from 'lucide-react'
import type { VideoItem } from '../types'
import VideoCard from './VideoCard'

export default function VideoGrid({ videos, loading, onOpen }: { videos: VideoItem[]; loading: boolean; onOpen: (video: VideoItem) => void }) {
  if (loading) return <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="animate-pulse"><div className="aspect-video rounded-[1.25rem] bg-white/[.05]" /><div className="mt-5 h-5 w-1/2 rounded bg-white/[.05]" /></div>)}</div>
  if (!videos.length) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-[360px] place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[.018] px-6 text-center">
      <div><span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[.03] text-flame"><Clapperboard size={22} /></span><h3 className="mt-5 font-display text-2xl">No frames here. Yet.</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">Try changing or resetting the filters. The next edit might be just around the corner.</p></div>
    </motion.div>
  )
  return <motion.div key={videos.map((video) => video.videoUrl).join('|')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }} className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{videos.map((video, index) => <VideoCard key={video.videoUrl} video={video} onOpen={onOpen} index={index} />)}</motion.div>
}
