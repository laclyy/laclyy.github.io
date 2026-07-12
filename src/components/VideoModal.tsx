import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { publicUrl } from '../lib/content'
import { embedUrl, isDirectMediaSource, isImageMediaUrl } from '../lib/videos'
import { formatMonthYear, getDifficultyMeta, normalizeAspectRatio } from '../lib/videoMeta'
import type { VideoItem } from '../types'

export default function VideoModal({ video, onClose }: { video: VideoItem | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const difficulty = getDifficultyMeta(video?.difficulty)
  const [measuredRatio, setMeasuredRatio] = useState<string>()
  const viewerStyle = getViewerStyle(measuredRatio || video?.aspectRatio)
  const hasDisplayStyle = Boolean(video?.style && video.style !== 'altro')
  useEffect(() => {
    if (!video) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    window.setTimeout(() => closeRef.current?.focus(), 50)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKey) }
  }, [video, onClose])
  useEffect(() => setMeasuredRatio(undefined), [video?.aspectRatio, video?.videoUrl])

  return (
    <AnimatePresence>
      {video && (
        <motion.div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-md sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={`Video: ${video.title}`}>
          <motion.div initial={{ opacity: 0, y: 25, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: .98 }} transition={{ type: 'spring', damping: 27, stiffness: 280 }} className="relative my-auto w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d0b0a] shadow-[0_30px_100px_rgba(0,0,0,.7)]" style={viewerStyle}>
            <button ref={closeRef} onClick={onClose} className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-white hover:text-black focus-ring" aria-label="Close video"><X size={18} /></button>
            <Player video={video} onRatioChange={setMeasuredRatio} />
            <div className="p-5 md:p-7">
              <div>
                <div className="eyebrow mb-3"><span className="h-1 w-1 rounded-full bg-flame" />{video.type === 'my-edit' ? 'Personal work' : 'Commissioned work'}{hasDisplayStyle && <> · {video.style}</>} · {formatMonthYear(video.date)}</div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold md:text-3xl">{video.title}</h2>
                  {video.masterpiece && (
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] backdrop-blur-md difficulty-pill-masterpiece">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      Masterpiece
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] backdrop-blur-md ${difficulty.pillClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${difficulty.dotClass}`} />
                    {difficulty.label}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/48">{video.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{video.tags.map((tag) => <span key={tag} className="font-mono text-[9px] uppercase tracking-[.12em] text-white/28">#{tag}</span>)}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Player({ video, onRatioChange }: { video: VideoItem; onRatioChange: (ratio: string) => void }) {
  const embed = embedUrl(video)
  if (isDirectMediaSource(video)) return <DirectMediaPlayer video={video} onRatioChange={onRatioChange} />
  if (embed) return <EmbedPlayer video={video} embed={embed} />
  return <div className="grid aspect-video place-items-center bg-[radial-gradient(circle_at_center,rgba(255,61,32,.16),transparent_55%)] p-8 text-center"><div><span className="font-mono text-[10px] uppercase tracking-[.18em] text-flame">External platform</span><h3 className="mt-3 font-display text-2xl">This video opens on its original platform.</h3><a href={publicUrl(video.videoUrl)} target="_blank" rel="noreferrer" className="button-primary mt-6">Open video <ExternalLink size={15} /></a></div></div>
}

function DirectMediaPlayer({ video, onRatioChange }: { video: VideoItem; onRatioChange: (ratio: string) => void }) {
  const initialRatio = getRatioInfo(video.aspectRatio || '16/9')
  const [ratio, setRatio] = useState(initialRatio.css)
  const [ratioNumber, setRatioNumber] = useState(initialRatio.value)
  const [failed, setFailed] = useState(false)
  const mediaUrl = publicUrl(video.videoUrl)
  const poster = publicUrl(video.thumbnailUrl || 'thumbnails/fallback.svg')

  useEffect(() => {
    const nextRatio = getRatioInfo(video.aspectRatio || '16/9')
    setRatio(nextRatio.css)
    setRatioNumber(nextRatio.value)
    setFailed(false)
  }, [video.aspectRatio, video.videoUrl])

  if (isImageMediaUrl(video.videoUrl)) {
    return (
      <div className="media-stage" style={getMediaElementStyle(ratio, ratioNumber)}>
        <img src={mediaUrl} alt={video.title} loading="lazy" decoding="async" className="media-element" onLoad={(event) => {
          const image = event.currentTarget
          if (!ratio && image.naturalWidth && image.naturalHeight) {
            const nextRatio = `${image.naturalWidth} / ${image.naturalHeight}`
            setRatio(nextRatio)
            setRatioNumber(image.naturalWidth / image.naturalHeight)
            onRatioChange(nextRatio)
          }
        }} />
      </div>
    )
  }

  return (
    <div className="media-stage" style={getMediaElementStyle(ratio, ratioNumber)}>
      {failed ? (
        <div className="max-w-md p-8 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[.18em] text-flame">Browser playback unavailable</span>
          <h3 className="mt-3 font-display text-2xl">This media format cannot be played directly here.</h3>
          <p className="mt-3 text-sm leading-6 text-white/45">The viewer supports browser-compatible cloud videos such as MP4, WebM, OGG and compatible MOV files. You can still open the original file.</p>
          <a href={mediaUrl} target="_blank" rel="noreferrer" className="button-primary mt-6">Open media <ExternalLink size={15} /></a>
        </div>
      ) : (
        <video
          controls
          playsInline
          preload="metadata"
          poster={poster}
          className="media-element"
          onLoadedMetadata={(event) => {
            const element = event.currentTarget
            if (element.videoWidth && element.videoHeight) {
              const nextRatio = `${element.videoWidth} / ${element.videoHeight}`
              setRatio(nextRatio)
              setRatioNumber(element.videoWidth / element.videoHeight)
              onRatioChange(nextRatio)
            }
          }}
          onError={() => setFailed(true)}
        >
          <source src={mediaUrl} />
          Your browser does not support HTML5 video.
        </video>
      )}
    </div>
  )
}

function EmbedPlayer({ video, embed }: { video: VideoItem; embed: string }) {
  const ratio = normalizeAspectRatio(video.aspectRatio)
  return (
    <div className="media-stage" style={getMediaElementStyle(ratio || '16 / 9', getRatioInfo(ratio || '16 / 9').value)}>
      <div className="media-element">
        <iframe src={embed} title={video.title} className="h-full w-full" allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen loading="lazy" />
      </div>
    </div>
  )
}

function getViewerStyle(aspectRatio?: string): CSSProperties | undefined {
  const ratio = getRatioInfo(aspectRatio)
  if (!ratio.value) return { width: 'min(72rem, calc(100vw - 1.5rem))' }
  return {
    width: `min(72rem, calc(100vw - 1.5rem), ${Number((ratio.value * 78).toFixed(4))}vh)`,
  }
}

function getMediaElementStyle(ratio?: string, ratioNumber?: number): CSSProperties {
  if (!ratio || !ratioNumber) return {}
  return {
    aspectRatio: ratio,
  }
}

function getRatioInfo(value?: string): { css?: string; value?: number } {
  const css = normalizeAspectRatio(value)
  if (!css) return {}
  const [width, height] = css.split('/').map((part) => Number(part.trim()))
  if (!width || !height) return { css }
  return { css, value: width / height }
}
