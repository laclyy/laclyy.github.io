import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Profile, VideoItem } from '../types'
import VideoCard from './VideoCard'

export default function FeaturedVideos({ profile, videos, onOpen }: { profile: Profile; videos: VideoItem[]; onOpen: (video: VideoItem) => void }) {
  const featured = videos.filter((video) => video.featured).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
  return (
    <section className="section-space relative">
      <div className="shell">
        <div className="section-heading"><div><div className="eyebrow"><span className="h-px w-7 bg-flame" />Featured</div><h2>{profile.featuredTitle}</h2><p>{profile.featuredText}</p></div><Link to="/videos" className="link-arrow">All videos <ArrowRight size={15} /></Link></div>
        <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{featured.map((video, index) => <VideoCard key={`${video.title}-${video.date}`} video={video} onOpen={onOpen} index={index} />)}</div>
        {!featured.length && <p className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/40">Set <code>featured</code> to <code>true</code> in videos.json to show a project here.</p>}
      </div>
    </section>
  )
}
