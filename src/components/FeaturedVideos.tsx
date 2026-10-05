import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Profile, VideoItem } from '../types'
import VideoCard from './VideoCard'
import VideoGrid from './VideoGrid'

export default function FeaturedVideos({ profile, videos, loading, onOpen }: { profile: Profile; videos: VideoItem[]; loading: boolean; onOpen: (video: VideoItem) => void }) {
  const featured = videos.filter((video) => video.featured)
  const hasFeatured = featured.length > 0
  const selected = [...(hasFeatured ? featured : videos)].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  return (
    <section className="section-space relative">
      <div className="shell">
        <div className="section-heading"><div><div className="eyebrow"><span className="h-px w-7 bg-flame" />{hasFeatured ? 'Featured' : 'Latest drops'}</div><h2>{hasFeatured ? profile.featuredTitle : 'Latest edits'}</h2><p>{hasFeatured ? profile.featuredText : 'Fresh cuts, new projects, and my latest work.'}</p></div><Link to="/videos" className="link-arrow">All videos <ArrowRight size={15} /></Link></div>
        {loading ? <div className="mt-12"><VideoGrid videos={[]} loading onOpen={onOpen} /></div> : selected.length ? <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{selected.map((video, index) => <VideoCard key={video.videoUrl} video={video} onOpen={onOpen} index={index} />)}</div> : <p className="mt-12 rounded-2xl border border-white/10 p-8 text-center text-sm text-white/40">New edits coming soon.</p>}
      </div>
    </section>
  )
}
