import { useEffect, useMemo, useState } from 'react'
import type { Filters, VideoItem, VideoSource } from '../types'
import { loadJson } from './content'

interface VideoFile { videos: VideoItem[] }

export function useVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJson<VideoFile | VideoItem[]>('data/videos.json')
      .then((data) => setVideos(Array.isArray(data) ? data : data.videos ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { videos, loading }
}

export function useFilteredVideos(videos: VideoItem[], filters: Filters) {
  return useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase('en')
    return videos
      .filter((video) => filters.type === 'all' || video.type === filters.type)
      .filter((video) => filters.category === 'all' || video.category === filters.category)
      .filter((video) => filters.style === 'all' || video.style === filters.style)
      .filter((video) => !query || `${video.title} ${video.description} ${video.tags.join(' ')}`.toLocaleLowerCase('en').includes(query))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [filters, videos])
}

export function detectSource(url: string, declared?: VideoSource): VideoSource {
  if (declared && declared !== 'external') return declared
  if (/youtu\.be|youtube\.com/i.test(url)) return 'youtube'
  if (/vimeo\.com/i.test(url)) return 'vimeo'
  if (/dailymotion\.com|dai\.ly/i.test(url)) return 'dailymotion'
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url) && !/^https?:/i.test(url)) return 'local'
  return 'external'
}

export function embedUrl(video: VideoItem): string | null {
  const source = detectSource(video.videoUrl, video.source)
  if (source === 'youtube') {
    const id = video.videoUrl.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,})/)?.[1]
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null
  }
  if (source === 'vimeo') {
    const id = video.videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  if (source === 'dailymotion') {
    const id = video.videoUrl.match(/(?:video\/|dai\.ly\/)([\w]+)/)?.[1]
    return id ? `https://www.dailymotion.com/embed/video/${id}` : null
  }
  return null
}
