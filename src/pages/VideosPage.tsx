import { useState } from 'react'
import VideoFilters from '../components/VideoFilters'
import VideoGrid from '../components/VideoGrid'
import { useFilteredVideos } from '../lib/videos'
import type { Filters, VideoItem } from '../types'

const initialFilters: Filters = { type: 'all', category: 'all', style: 'all', search: '' }

export default function VideosPage({ videos, loading, onOpen }: { videos: VideoItem[]; loading: boolean; onOpen: (video: VideoItem) => void }) {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const filtered = useFilteredVideos(videos, filters)
  return <main className="pb-28 pt-32 md:pb-36 md:pt-40">
    <section className="shell"><div className="max-w-4xl"><div className="eyebrow"><span className="h-px w-7 bg-flame" />Work archive · {videos.length.toString().padStart(2, '0')}</div><h1 className="mt-6 font-display text-[clamp(3.7rem,10vw,8rem)] font-semibold leading-[.87] tracking-[-.06em]">Every cut<br /><span className="text-gradient">has a pulse.</span></h1><p className="mt-7 max-w-xl text-base leading-7 text-white/50">Personal edits, commissions, and motion studies. Filter the archive to find exactly the mood you're looking for.</p></div></section>
    <section className="shell mt-14 md:mt-20"><VideoFilters filters={filters} onChange={setFilters} count={filtered.length} /><div className="mt-12"><VideoGrid videos={filtered} loading={loading} onOpen={onOpen} /></div></section>
  </main>
}
