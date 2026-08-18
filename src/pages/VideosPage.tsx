import { useState } from 'react'
import DifficultyLegend from '../components/DifficultyLegend'
import VideoFilters from '../components/VideoFilters'
import VideoGrid from '../components/VideoGrid'
import { useFilteredVideos } from '../lib/videos'
import type { Filters, VideoItem } from '../types'

const initialFilters: Filters = { type: 'all', category: 'all', game: 'all', style: 'all', search: '', sort: 'date-desc' }

export default function VideosPage({ videos, loading, onOpen }: { videos: VideoItem[]; loading: boolean; onOpen: (video: VideoItem) => void }) {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const filtered = useFilteredVideos(videos, filters)

  return (
    <main className="pb-28 pt-32 md:pb-36 md:pt-40">
      <section className="shell">
        <div className="max-w-4xl">
          <div className="eyebrow">
            <span className="h-px w-7 bg-flame" />
            Archive · {videos.length.toString().padStart(2, '0')} works
          </div>
          <h1 className="mt-6 font-display text-[clamp(3.5rem,9.5vw,7.8rem)] font-semibold leading-[.88] tracking-[-.06em]">
            My Edit<br />
            <span className="text-gradient">Examples</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/50">
            Anime edits, gaming clips, commissions, and GFX. Filter through the archive to find what you're looking for.
          </p>
        </div>
      </section>

      <section className="shell mt-14 md:mt-20">
        <DifficultyLegend />
        <div className="mt-8 md:mt-10">
          <VideoFilters filters={filters} onChange={setFilters} count={filtered.length} videos={videos} />
        </div>
        <div className="mt-12">
          <VideoGrid videos={filtered} loading={loading} onOpen={onOpen} />
        </div>
      </section>
    </main>
  )
}
