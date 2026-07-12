export type VideoType = 'my-edit' | 'commissioned'
export type VideoSource = 'local' | 'direct' | 'cloud' | 'youtube' | 'vimeo' | 'dailymotion' | 'external'
export type VideoDifficulty = 'easy' | 'medium' | 'hard' | 'very hard'
export type VideoSort = 'date-desc' | 'date-asc' | 'difficulty-asc' | 'difficulty-desc'

export interface VideoItem {
  title: string
  description: string
  type: VideoType
  category: string
  style: string
  thumbnailUrl: string
  videoUrl: string
  source: VideoSource
  aspectRatio?: string
  difficulty?: VideoDifficulty
  masterpiece?: boolean
  tags: string[]
  featured: boolean
  date: string
}

export interface Profile {
  name: string
  role: string
  avatarUrl?: string
  shortDescription: string
  longDescription: string
  styleDescription: string
  email: string
  location?: string
  heroEyebrow: string
  heroTitle: string
  heroText: string
  primaryCtaText: string
  secondaryCtaText: string
  featuredTitle: string
  featuredText: string
  strengthsTitle: string
  strengthsText: string
  contactTitle: string
  contactText: string
  commissionCtaText: string
}

export interface SocialItem {
  label: string
  username?: string
  value?: string
  url: string
}

export type Socials = Record<string, SocialItem>

export interface Filters {
  type: 'all' | VideoType
  category: string
  game: string
  style: string
  search: string
  sort: VideoSort
}
