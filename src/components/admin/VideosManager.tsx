import { Plus, Search, Star, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { categoryOptions, difficultyOptions, replaceVideo, type VideoFile } from '../../lib/adminVideo'
import { publicUrl } from '../../lib/content'
import { dataFiles, describeError, readJsonFile } from '../../lib/github'
import { formatMonthYear } from '../../lib/videoMeta'
import type { VideoItem } from '../../types'
import type { Publish } from '../../pages/AdminPage'
import VideoForm from './VideoForm'
import { LoadingBlock, Notice, Spinner } from './ui'

export default function VideosManager({ token, publish }: { token: string; publish: Publish }) {
  const [file, setFile] = useState<VideoFile | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [editing, setEditing] = useState<{ original: VideoItem | null } | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [flash, setFlash] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<VideoItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoadError(null)
    readJsonFile<VideoFile>(token, dataFiles.videos)
      .then(({ data }) => setFile(data))
      .catch((error) => setLoadError(describeError(error)))
  }
  useEffect(load, [token])

  const videos = file?.videos ?? []
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return videos
      .filter((video) => category === 'all' || video.category === category)
      .filter((video) => !q || `${video.title} ${video.style} ${video.tags?.join(' ')}`.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [videos, query, category])

  const commit = async (original: VideoItem | null, next: VideoItem | null, message: string, success: string) => {
    setActionError(null)
    try {
      const saved = await publish('videos', (current: VideoFile) => replaceVideo(current, original, next), message)
      setFile(saved)
      setFlash(success)
      return true
    } catch (error) {
      setActionError(describeError(error))
      return false
    }
  }

  const openEditor = (original: VideoItem | null) => {
    setFlash(null)
    setActionError(null)
    setEditing({ original })
    window.scrollTo({ top: 0 })
  }

  const closeEditor = () => {
    setEditing(null)
    window.scrollTo({ top: 0 })
  }

  if (loadError) return <Notice tone="error" action={<button onClick={load} className="text-xs font-semibold underline">Riprova</button>}>Non riesco a leggere i video: {loadError}</Notice>
  if (!file) return <LoadingBlock label="Carico i video…" />

  if (editing) {
    const { original } = editing
    return (
      <>
        {actionError && <div className="mb-6"><Notice tone="error">{actionError}</Notice></div>}
        <VideoForm
          key={original ? JSON.stringify(original) : 'new'}
          original={original}
          allVideos={videos}
          onCancel={closeEditor}
          onSave={async (video) => {
            const ok = await commit(original, video, `Admin: ${original ? 'modificato' : 'aggiunto'} video "${video.title}"`, `«${video.title}» ${original ? 'aggiornato' : 'aggiunto'}.`)
            if (ok) closeEditor()
            return ok
          }}
          onDelete={original ? async () => {
            const ok = await commit(original, null, `Admin: eliminato video "${original.title}"`, `«${original.title}» eliminato.`)
            if (ok) closeEditor()
            return ok
          } : undefined}
        />
      </>
    )
  }

  const remove = async (video: VideoItem) => {
    setDeleting(true)
    await commit(video, null, `Admin: eliminato video "${video.title}"`, `«${video.title}» eliminato.`)
    setDeleting(false)
    setConfirming(null)
  }

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-[-.03em] sm:text-4xl">Video e grafiche</h2>
          <p className="mt-2 text-sm text-white/45">{videos.length} lavori pubblicati sul sito.</p>
        </div>
        <button type="button" onClick={() => openEditor(null)} className="button-primary"><Plus size={16} /> Aggiungi video</button>
      </div>

      <div className="mt-6 space-y-3">
        {flash && <Notice tone="success" action={<button onClick={() => setFlash(null)} className="text-xs text-white/50 hover:text-white">Chiudi</button>}>{flash}</Notice>}
        {actionError && <Notice tone="error">{actionError}</Notice>}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative block md:w-80">
          <span className="sr-only">Cerca un video</span>
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca per titolo o tag…" className="form-input rounded-full pl-11" />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[{ value: 'all', label: 'Tutti' }, ...categoryOptions].map((option) => (
            <button key={option.value} type="button" aria-pressed={category === option.value} onClick={() => setCategory(option.value)} className={`rounded-full border px-3.5 py-2 text-xs transition focus-ring ${category === option.value ? 'border-flame/60 bg-flame/10 text-flame' : 'border-white/[.08] text-white/45 hover:border-white/20 hover:text-white'}`}>{option.label}</button>
          ))}
        </div>
      </div>

      <ul className="mt-6 divide-y divide-white/[.06] overflow-hidden rounded-[1.5rem] border border-white/[.08] bg-white/[.02]">
        {visible.map((video, index) => {
          const difficulty = difficultyOptions.find((option) => option.value === video.difficulty)
          const thumb = video.thumbnailUrl || (video.category === 'gfx' ? video.videoUrl : 'thumbnails/fallback.svg')
          const isConfirming = confirming === video
          return (
            <li key={`${video.videoUrl}-${index}`} className="flex items-center gap-4 p-3 sm:p-4">
              <button type="button" onClick={() => openEditor(video)} className="flex min-w-0 flex-1 items-center gap-4 text-left focus-ring rounded-xl">
                <img src={publicUrl(thumb)} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.src = publicUrl('thumbnails/fallback.svg') }} className="h-14 w-24 shrink-0 rounded-lg bg-panel object-cover sm:h-16 sm:w-28" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white/90">{video.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/40">
                    <span>{categoryOptions.find((option) => option.value === video.category)?.label ?? video.category}</span>
                    {video.style && <span>· {video.style}</span>}
                    {difficulty && <span className="inline-flex items-center gap-1.5">· <span className={`h-1.5 w-1.5 rounded-full ${difficulty.dotClass}`} />{difficulty.label}</span>}
                    <span>· {formatMonthYear(video.date)}</span>
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-1.5">
                    {video.featured && <span className="inline-flex items-center gap-1 rounded-full bg-solar/10 px-2 py-0.5 text-[10px] text-solar"><Star size={10} fill="currentColor" /> In evidenza</span>}
                    {video.masterpiece && <span className="rounded-full difficulty-pill-masterpiece px-2 py-0.5 text-[10px]">Masterpiece</span>}
                  </span>
                </span>
              </button>
              {isConfirming ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => remove(video)} disabled={deleting} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-red-600 px-3.5 text-xs font-bold text-white hover:bg-red-500 focus-ring">{deleting ? <Spinner size={13} /> : 'Elimina'}</button>
                  <button type="button" onClick={() => setConfirming(null)} disabled={deleting} className="min-h-10 px-2 text-xs text-white/50 hover:text-white focus-ring">Annulla</button>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => openEditor(video)} className="hidden min-h-10 rounded-full border border-white/10 px-4 text-xs text-white/65 transition hover:border-white/25 hover:text-white focus-ring sm:inline-flex sm:items-center">Modifica</button>
                  <button type="button" onClick={() => setConfirming(video)} aria-label={`Elimina ${video.title}`} className="grid h-10 w-10 place-items-center rounded-full text-white/35 transition hover:bg-red-500/10 hover:text-red-300 focus-ring"><Trash2 size={16} /></button>
                </div>
              )}
            </li>
          )
        })}
        {!visible.length && <li className="p-10 text-center text-sm text-white/40">Nessun video trovato.</li>}
      </ul>
    </div>
  )
}
