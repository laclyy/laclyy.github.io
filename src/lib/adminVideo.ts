import type { VideoDifficulty, VideoItem, VideoType } from '../types'
import { detectSource, extractTitleFromUrl, isImageMediaUrl } from './videos'

export interface VideoFile {
  videos: VideoItem[]
  [key: string]: unknown
}

export const typeOptions: Array<{ value: VideoType; label: string }> = [
  { value: 'my-edit', label: 'Mio edit' },
  { value: 'commissioned', label: 'Commissione' },
]

export const categoryOptions = [
  { value: 'anime', label: 'Anime', tags: ['anime'] },
  { value: 'videogiochi', label: 'Videogiochi', tags: ['gaming'] },
  { value: 'gfx', label: 'GFX / immagine', tags: ['gfx'] },
]

export const gameOptions = [
  { value: 'rocket league', label: 'Rocket League' },
  { value: 'other games', label: 'Altri giochi' },
]

export const difficultyOptions: Array<{ value: VideoDifficulty; label: string; dotClass: string }> = [
  { value: 'easy', label: 'Facile', dotClass: 'bg-emerald-300' },
  { value: 'medium', label: 'Media', dotClass: 'bg-orange-300' },
  { value: 'hard', label: 'Difficile', dotClass: 'bg-red-400' },
  { value: 'very hard', label: 'Molto difficile', dotClass: 'bg-purple-300' },
]

export const styleSuggestions = ['tiktok edit', 'vibe edit', 'trend edit', 'sigma boy', 'jugg edit', 'flow edit', 'lacly style edit', 'promo edit', 'commission edit']

export const ratioPresets = [
  { value: '16/9', label: 'Orizzontale 16:9' },
  { value: '9/16', label: 'Verticale 9:16' },
  { value: '1/1', label: 'Quadrato 1:1' },
  { value: '4/5', label: 'Post 4:5' },
]

// Le cartelle del cloud seguono una struttura fissa (es. "anime edits/vibe edits/"):
// dal link si ricavano categoria, stile, tipo e tag.
const folderRules: Array<{ match: RegExp; apply: Partial<Pick<VideoItem, 'type' | 'category' | 'style'>>; tags?: string[] }> = [
  { match: /anime edits/, apply: { category: 'anime' } },
  { match: /game edits/, apply: { category: 'videogiochi' } },
  { match: /(^|\/)gfx(\/|$)/, apply: { category: 'gfx', style: '' } },
  { match: /rocket league/, apply: {}, tags: ['rocket league'] },
  { match: /other games/, apply: {}, tags: ['other games'] },
  { match: /promotion and commission edits/, apply: { type: 'commissioned', style: 'promo edit' }, tags: ['promo', 'commission'] },
  { match: /(^|\/)commission edits/, apply: { type: 'commissioned', style: 'commission edit' }, tags: ['commission'] },
  { match: /tiktok edits/, apply: { style: 'tiktok edit' }, tags: ['tiktok'] },
  { match: /vibe edits/, apply: { style: 'vibe edit' }, tags: ['vibe'] },
  { match: /trend edits/, apply: { style: 'trend edit' }, tags: ['trend'] },
  { match: /sigma boys/, apply: { style: 'sigma boy' }, tags: ['sigma boys'] },
  { match: /jugg edits/, apply: { style: 'jugg edit' }, tags: ['jugg edit'] },
  { match: /flow edits/, apply: { style: 'flow edit' }, tags: ['flow'] },
  { match: /lacly'?s style edits/, apply: { style: 'lacly style edit' }, tags: ['lacly style'] },
]

const difficultyInName = /\s*\((easy|medium|hard|very hard)\)\s*/i

export function today(): string {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export function emptyVideo(): VideoItem {
  return {
    title: '',
    description: '',
    type: 'my-edit',
    category: 'anime',
    style: '',
    thumbnailUrl: '',
    videoUrl: '',
    source: 'cloud',
    aspectRatio: '',
    masterpiece: false,
    tags: ['anime'],
    featured: false,
    date: today(),
  }
}

export function isUsableUrl(url: string): boolean {
  const value = url.trim()
  if (!value || (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^https?:\/\//i.test(value))) return false
  if (/^https?:\/\//i.test(value)) {
    try {
      return Boolean(new URL(value).hostname)
    } catch {
      return false
    }
  }
  return /\.[a-z0-9]{2,5}$/i.test(value) && !/[\r\n]/.test(value)
}

export const cloudOrigin = 'https://vanzakart.net:8443'

/** Codifica ogni segmento senza ricodificare i caratteri già percent-encoded. */
function encodePath(path: string): string {
  return path.split('/').map((segment) =>
    segment.split(/(%[a-f0-9]{2})/ig).map((part) =>
      /^%[a-f0-9]{2}$/i.test(part) ? part.toUpperCase() : encodeURIComponent(part).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`),
    ).join(''),
  ).join('/')
}

/** Accetta percorsi del cloud e URL completi, mantenendo query e fragment dei link. */
export function normalizeUrl(url: string): string {
  const value = url.trim()
  if (!value) return ''
  if (!/^https?:\/\//i.test(value)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value
    // Conserva i percorsi degli asset locali già supportati dal portfolio.
    if (/^\/?(?:videos|thumbnails)\//i.test(value)) return encodePath(value)
    return `${cloudOrigin}/${encodePath(value.replace(/\\/g, '/').replace(/^\/?\.\//, '').replace(/^\/+/, ''))}`
  }
  try {
    const parsed = new URL(value)
    parsed.pathname = encodePath(parsed.pathname)
    return parsed.href
  } catch {
    return value
  }
}

/** Confronta due link ignorando le differenze di codifica (spazi, parentesi…). */
export function sameUrl(a: string, b: string): boolean {
  return safeDecode(normalizeUrl(a)) === safeDecode(normalizeUrl(b))
}

export function isImageVideo(video: Pick<VideoItem, 'category' | 'videoUrl'>): boolean {
  return video.category === 'gfx' || isImageMediaUrl(video.videoUrl)
}

export function tagsForCategory(category: string): string[] {
  return categoryOptions.find((option) => option.value === category)?.tags ?? []
}

/** Deduce il più possibile dal link del file: titolo, difficoltà, categoria, stile, tag e copertina. */
export function guessFromUrl(url: string): Partial<VideoItem> {
  const clean = url.split(/[?#]/)[0]
  const decoded = safeDecode(clean).toLowerCase()
  const folder = decoded.replace(/^.*?\/video\//, '').split('/').slice(0, -1).join('/')
  const guess: Partial<VideoItem> = { type: 'my-edit', source: sourceFor(url) }
  const tags = new Set<string>()

  const fileTitle = extractTitleFromUrl(clean)
  const difficulty = fileTitle.match(difficultyInName)?.[1]?.toLowerCase()
  const title = fileTitle.replace(difficultyInName, ' ').replace(/\s+\d{3,}$/, '').replace(/\s+/g, ' ').trim()
  if (title) guess.title = title
  if (difficulty) guess.difficulty = difficulty as VideoDifficulty

  for (const rule of folderRules) {
    if (!rule.match.test(folder)) continue
    Object.assign(guess, rule.apply)
    rule.tags?.forEach((tag) => tags.add(tag))
  }
  if (guess.category) tagsForCategory(guess.category).forEach((tag) => tags.add(tag))
  if (tags.size) guess.tags = Array.from(tags)

  if (isImageMediaUrl(clean)) {
    guess.thumbnailUrl = url
    guess.category ??= 'gfx'
  } else if (/\/video\//.test(url) && /\.[a-z0-9]{2,4}$/i.test(clean)) {
    guess.thumbnailUrl = clean.replace(/\/video\//, '/thumbnails/').replace(/\.[a-z0-9]{2,4}$/i, '.png')
  }
  return guess
}

export function sourceFor(url: string): VideoItem['source'] {
  const source = detectSource(url)
  return source === 'direct' ? 'cloud' : source
}

/** Scrive il video con lo stesso ordine di campi usato nel JSON, eliminando valori vuoti opzionali. */
export function finalizeVideo(draft: VideoItem): VideoItem {
  const title = draft.title.trim()
  const { title: _t, description: _d, type, category, subcategory, style, thumbnailUrl, videoUrl, source: _s, aspectRatio, difficulty, masterpiece, tags, featured, date, ...extra } = draft
  const url = normalizeUrl(videoUrl)
  return {
    title,
    description: draft.description.trim() || `${title} by Lacly.`,
    type,
    category,
    ...(subcategory?.trim() ? { subcategory: subcategory.trim() } : {}),
    style: style.trim(),
    thumbnailUrl: normalizeUrl(thumbnailUrl),
    videoUrl: url,
    source: sourceFor(url),
    ...(aspectRatio?.trim() ? { aspectRatio: aspectRatio.trim().replace(/\s+/g, '') } : {}),
    ...(difficulty ? { difficulty } : {}),
    masterpiece: Boolean(masterpiece),
    tags: Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))),
    featured: Boolean(featured),
    date,
    ...extra,
  }
}

/** Sostituisce, aggiunge (original = null) o elimina (next = null) un video nella versione più recente del file. */
export function replaceVideo(file: VideoFile, original: VideoItem | null, next: VideoItem | null): VideoFile {
  const videos = Array.isArray(file.videos) ? [...file.videos] : []
  if (!original) {
    if (next) videos.push(next)
    return { ...file, videos }
  }
  const signature = JSON.stringify(original)
  const index = videos.findIndex((video) => JSON.stringify(video) === signature)
  if (index === -1) throw new Error('Questo video è stato modificato o eliminato da un’altra parte nel frattempo. Ricarica la pagina e riprova.')
  if (next) videos.splice(index, 1, next)
  else videos.splice(index, 1)
  return { ...file, videos }
}

export function imageExists(url: string, timeout = 12_000): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image()
    const timer = window.setTimeout(() => finish(false), timeout)
    function finish(result: boolean) {
      window.clearTimeout(timer)
      image.onload = image.onerror = null
      resolve(result)
    }
    image.onload = () => finish(image.naturalWidth > 0)
    image.onerror = () => finish(false)
    image.src = url
  })
}

/** Legge larghezza e altezza reali del file (video o immagine) per impostare il formato. */
export function detectAspectRatio(url: string, image: boolean, timeout = 20_000): Promise<string | null> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => finish(null), timeout)
    const element = image ? new Image() : document.createElement('video')
    function finish(result: string | null) {
      window.clearTimeout(timer)
      element.onload = element.onerror = null
      if (element instanceof HTMLVideoElement) {
        element.onloadedmetadata = null
        element.removeAttribute('src')
        element.load()
      }
      resolve(result)
    }
    element.onerror = () => finish(null)
    if (element instanceof HTMLVideoElement) {
      element.muted = true
      element.preload = 'metadata'
      element.onloadedmetadata = () => finish(element.videoWidth && element.videoHeight ? `${element.videoWidth}/${element.videoHeight}` : null)
    } else {
      element.onload = () => finish(element.naturalWidth && element.naturalHeight ? `${element.naturalWidth}/${element.naturalHeight}` : null)
    }
    element.src = url
  })
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
