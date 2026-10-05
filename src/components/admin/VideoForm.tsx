import { ArrowLeft, Sparkles, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import {
  categoryOptions,
  detectAspectRatio,
  difficultyOptions,
  emptyVideo,
  finalizeVideo,
  gameOptions,
  guessFromUrl,
  imageExists,
  isImageVideo,
  isUsableUrl,
  normalizeUrl,
  ratioPresets,
  sameUrl,
  styleSuggestions,
  tagsForCategory,
  typeOptions,
} from '../../lib/adminVideo'
import { publicUrl } from '../../lib/content'
import type { VideoItem } from '../../types'
import VideoCard from '../VideoCard'
import VideoModal from '../VideoModal'
import { Choice, Field, Notice, Spinner, Toggle, useUnsavedWarning } from './ui'

type Props = {
  original: VideoItem | null
  allVideos: VideoItem[]
  onCancel: () => void
  onSave: (video: VideoItem) => Promise<boolean>
  onDelete?: () => Promise<boolean>
}

type Errors = Partial<Record<'videoUrl' | 'title' | 'date', string>>

const gameValues = gameOptions.map((option) => option.value)

export default function VideoForm({ original, allVideos, onCancel, onSave, onDelete }: Props) {
  const isNew = !original
  const [draft, setDraft] = useState<VideoItem>(() => (original ? { ...original, tags: [...(original.tags ?? [])] } : emptyVideo()))
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [autofilled, setAutofilled] = useState<string[]>([])
  const [thumbStatus, setThumbStatus] = useState<'idle' | 'checking' | 'ok' | 'missing'>('idle')
  const [ratioStatus, setRatioStatus] = useState<'idle' | 'detecting' | 'failed'>('idle')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const touched = useRef(new Set<keyof VideoItem>())
  const autofilledFor = useRef('')
  const autoTags = useRef<string[]>([])
  const latestUrl = useRef(draft.videoUrl)

  const initialSignature = useMemo(() => JSON.stringify(original ?? emptyVideo()), [original])
  const dirty = JSON.stringify(draft) !== initialSignature
  useUnsavedWarning(dirty && !saving)

  const update = <K extends keyof VideoItem>(key: K, value: VideoItem[K]) => {
    touched.current.add(key)
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const setCategory = (category: string) => {
    touched.current.add('category')
    setDraft((current) => {
      const oldTags = new Set([...tagsForCategory(current.category), ...(category === 'videogiochi' ? [] : gameValues)])
      const tags = [...current.tags.filter((tag) => !oldTags.has(tag)), ...tagsForCategory(category)]
      return { ...current, category, subcategory: '', tags: Array.from(new Set(tags)), style: category === 'gfx' ? '' : current.style }
    })
  }

  const game = draft.tags.find((tag) => gameValues.includes(tag))
  const setGame = (value: string) => setDraft((current) => ({ ...current, tags: [...current.tags.filter((tag) => !gameValues.includes(tag)), ...(value === game ? [] : [value])] }))

  const checkRatio = useCallback(async (url: string, image: boolean) => {
    setRatioStatus('detecting')
    const ratio = await detectAspectRatio(publicUrl(normalizeUrl(url)), image)
    if (latestUrl.current !== url) return
    if (ratio) setDraft((current) => ({ ...current, aspectRatio: ratio }))
    setRatioStatus(ratio ? 'idle' : 'failed')
  }, [])

  // Per un nuovo video: appena si incolla il link, compila tutto quello che si può dedurre.
  useEffect(() => {
    latestUrl.current = draft.videoUrl
    const url = draft.videoUrl.trim()
    if (!isNew || !isUsableUrl(url) || url === autofilledFor.current) return
    const timer = window.setTimeout(async () => {
      autofilledFor.current = url
      const { tags: guessedTags, ...guess } = guessFromUrl(normalizeUrl(url))
      const patch = Object.fromEntries(Object.entries(guess).filter(([key]) => !touched.current.has(key as keyof VideoItem))) as Partial<VideoItem>
      // I tag dedotti da un link incollato prima vengono sostituiti, quelli scritti a mano restano.
      const previousAutoTags = autoTags.current
      autoTags.current = guessedTags ?? []
      setDraft((current) => ({
        ...current,
        ...patch,
        tags: Array.from(new Set([...current.tags.filter((tag) => !previousAutoTags.includes(tag) && !(guessedTags && tagsForCategory(current.category).includes(tag))), ...(guessedTags ?? [])])),
      }))
      setAutofilled(Object.keys(patch).filter((key) => ['title', 'category', 'style', 'type', 'difficulty', 'thumbnailUrl'].includes(key)))

      const image = isImageVideo({ category: guess.category ?? '', videoUrl: url })
      if (!touched.current.has('aspectRatio')) void checkRatio(draft.videoUrl, image)
      if (guess.thumbnailUrl && !touched.current.has('thumbnailUrl')) {
        setThumbStatus('checking')
        const ok = await imageExists(publicUrl(guess.thumbnailUrl))
        if (latestUrl.current !== draft.videoUrl) return
        setThumbStatus(ok ? 'ok' : 'missing')
        if (!ok) setDraft((current) => (current.thumbnailUrl === guess.thumbnailUrl ? { ...current, thumbnailUrl: '' } : current))
      }
    }, 450)
    return () => window.clearTimeout(timer)
  }, [draft.videoUrl, isNew, checkRatio])

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/^#/, '')
    if (tag && !draft.tags.includes(tag)) update('tags', [...draft.tags, tag])
    setTagInput('')
  }
  const onTagKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(tagInput)
    } else if (event.key === 'Backspace' && !tagInput && draft.tags.length) {
      update('tags', draft.tags.slice(0, -1))
    }
  }

  const suggestedTags = useMemo(() => {
    const counts = new Map<string, number>()
    allVideos.forEach((video) => video.tags?.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)))
    return Array.from(counts).sort((a, b) => b[1] - a[1]).map(([tag]) => tag).filter((tag) => !draft.tags.includes(tag)).slice(0, 10)
  }, [allVideos, draft.tags])

  const styles = useMemo(() => {
    const used = allVideos.map((video) => video.style).filter(Boolean)
    return Array.from(new Set([...styleSuggestions, ...used]))
  }, [allVideos])

  const subcategories = useMemo(() => Array.from(new Set(allVideos
    .filter((video) => video.category === draft.category)
    .map((video) => video.subcategory?.trim()).filter((value): value is string => Boolean(value))))
    .sort((a, b) => a.localeCompare(b)), [allVideos, draft.category])

  const duplicate = isNew && draft.videoUrl.trim() ? allVideos.find((video) => sameUrl(video.videoUrl, draft.videoUrl)) : undefined
  const preview = useMemo(() => finalizeVideo({ ...draft, title: draft.title.trim() || 'Titolo del video' }), [draft])
  const closePreview = useCallback(() => setPreviewOpen(false), [])
  const image = isImageVideo(draft)

  const save = async () => {
    const nextErrors: Errors = {}
    if (!isUsableUrl(draft.videoUrl)) nextErrors.videoUrl = 'Inserisci un percorso completo di estensione (.mp4, .png…) oppure un link https:// valido.'
    if (!draft.title.trim()) nextErrors.title = 'Scrivi un titolo.'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) nextErrors.date = 'Scegli una data.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return window.scrollTo({ top: 0, behavior: 'smooth' })
    setSaving(true)
    const ok = await onSave(finalizeVideo(draft))
    setSaving(false)
    if (!ok) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async () => {
    if (!onDelete) return
    setSaving(true)
    await onDelete()
    setSaving(false)
  }

  return (
    <div>
      <button type="button" onClick={onCancel} className="link-arrow"><ArrowLeft size={15} /> Torna alla lista</button>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-.03em] sm:text-4xl">{isNew ? 'Aggiungi un video' : 'Modifica video'}</h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-7">
          {Object.keys(errors).length > 0 && <Notice tone="error">Controlla i campi evidenziati qui sotto.</Notice>}

          <Field label="Percorso o link del video / immagine" htmlFor="video-url" error={errors.videoUrl} hint="Basta il percorso: il sito aggiunge https://vanzakart.net:8443 e codifica spazi e simboli. Puoi anche incollare un link completo, YouTube o Vimeo.">
            <input id="video-url" className="form-input" type="text" value={draft.videoUrl} onChange={(event) => update('videoUrl', event.target.value)} placeholder="video-lacly/video/anime edits/sigma boys/nagi sigma boy(easy).mp4" />
          </Field>
          {isUsableUrl(draft.videoUrl) && <p className="-mt-4 break-all text-xs leading-5 text-white/40"><span className="font-semibold text-white/60">Link automatico: </span>{normalizeUrl(draft.videoUrl)}</p>}
          {duplicate && <Notice tone="warning">Questo link è già sul sito, nel video «{duplicate.title}».</Notice>}
          {autofilled.length > 0 && (
            <Notice tone="success" action={<button type="button" onClick={() => setAutofilled([])} aria-label="Chiudi" className="text-white/50 hover:text-white"><X size={16} /></button>}>
              <span className="inline-flex items-center gap-1.5 font-semibold"><Sparkles size={14} /> Compilato in automatico dal link.</span> Controlla titolo, categoria, stile e difficoltà prima di salvare.
            </Notice>
          )}

          <Field label="Copertina (thumbnail)" htmlFor="video-thumb" hint={thumbStatus === 'missing' ? 'Non ho trovato la copertina sul cloud: inserisci il percorso o il link dell’immagine, oppure lascia vuoto per usare un’immagine generica.' : image ? 'Per le immagini GFX puoi lasciarlo vuoto: verrà usata l’immagine stessa.' : 'Percorso o link della copertina: server e codifica vengono aggiunti automaticamente. Se lo lasci vuoto verrà usata un’immagine generica.'}>
            <div className="flex items-center gap-3">
              <input id="video-thumb" className="form-input" type="text" value={draft.thumbnailUrl} onChange={(event) => { setThumbStatus('idle'); update('thumbnailUrl', event.target.value) }} placeholder="video-lacly/thumbnails/anime edits/…png" />
              {thumbStatus === 'checking' && <Spinner />}
            </div>
          </Field>

          <div className="grid gap-7 sm:grid-cols-2">
            <Field label="Titolo" htmlFor="video-title" error={errors.title}>
              <input id="video-title" className="form-input" value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="es. Kurumi Vibe Edit" />
            </Field>
            <Field label="Data" htmlFor="video-date" error={errors.date} hint="I video più recenti appaiono per primi.">
              <input id="video-date" className="form-input [color-scheme:dark]" type="date" value={draft.date} onChange={(event) => update('date', event.target.value)} />
            </Field>
          </div>

          <Field label="Descrizione (facoltativa)" htmlFor="video-description" hint={`Se la lasci vuota verrà scritto: «${draft.title.trim() || 'titolo'} by Lacly.»`}>
            <textarea id="video-description" className="form-input min-h-24 resize-y" value={draft.description} onChange={(event) => update('description', event.target.value)} />
          </Field>

          <Field label="Tipo di lavoro">
            <Choice label="Tipo di lavoro" value={draft.type} options={typeOptions} onChange={(value) => update('type', value)} />
          </Field>

          <Field label="Categoria">
            <Choice label="Categoria" value={draft.category} options={categoryOptions} onChange={setCategory} />
          </Field>

          <Field label="Sottocategoria (facoltativa)" htmlFor="video-subcategory" hint="Scegli una sottocategoria oppure scrivine una nuova. Dopo il salvataggio sarà selezionabile per gli altri video di questa categoria e nei filtri del sito.">
            <select aria-label="Sottocategorie esistenti" className="form-input mb-3 [color-scheme:dark]" value={subcategories.includes(draft.subcategory ?? '') ? draft.subcategory : ''} onChange={(event) => update('subcategory', event.target.value)}>
              <option value="">Nessuna / nuova sottocategoria</option>
              {subcategories.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <input id="video-subcategory" className="form-input" value={draft.subcategory ?? ''} onChange={(event) => update('subcategory', event.target.value)} placeholder="es. Blue Lock" />
          </Field>

          {draft.category === 'videogiochi' && (
            <Field label="Gioco" hint="Serve per il filtro “Game” nella pagina Video.">
              <Choice label="Gioco" value={game} options={gameOptions} onChange={setGame} />
            </Field>
          )}

          {draft.category !== 'gfx' && (
            <Field label="Stile" htmlFor="video-style" hint="Appare come etichetta sulla card. Scegline uno o scrivine uno nuovo.">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {styles.map((style) => (
                  <button key={style} type="button" aria-pressed={draft.style === style} onClick={() => update('style', draft.style === style ? '' : style)} className={`rounded-full border px-3 py-1.5 text-xs transition focus-ring ${draft.style === style ? 'border-flame/60 bg-flame/10 text-flame' : 'border-white/[.08] text-white/45 hover:border-white/20 hover:text-white'}`}>{style}</button>
                ))}
              </div>
              <input id="video-style" className="form-input" value={draft.style} onChange={(event) => update('style', event.target.value)} placeholder="es. vibe edit" />
            </Field>
          )}

          <Field label="Difficoltà" hint="Colora il bordo della card.">
            <Choice label="Difficoltà" value={draft.difficulty} options={difficultyOptions} onChange={(value) => update('difficulty', value)} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle checked={Boolean(draft.featured)} onChange={(value) => update('featured', value)} label="In evidenza nella Home" hint="La Home mostra i 3 featured più recenti; senza featured, i 3 ultimi lavori." />
            <Toggle checked={Boolean(draft.masterpiece)} onChange={(value) => update('masterpiece', value)} label="Masterpiece" hint="Bordo arcobaleno: per i tuoi preferiti." />
          </div>

          <Field label="Formato" hint={ratioStatus === 'failed' ? 'Non sono riuscito a leggere il formato dal file: sceglilo tu.' : 'Viene letto in automatico dal file. Cambialo solo se la card appare deformata.'}>
            <div className="flex flex-wrap items-center gap-2">
              {ratioPresets.map((preset) => (
                <button key={preset.value} type="button" aria-pressed={draft.aspectRatio === preset.value} onClick={() => update('aspectRatio', preset.value)} className={`rounded-full border px-3 py-1.5 text-xs transition focus-ring ${draft.aspectRatio === preset.value ? 'border-flame/60 bg-flame/10 text-flame' : 'border-white/[.08] text-white/45 hover:border-white/20 hover:text-white'}`}>{preset.label}</button>
              ))}
              <input aria-label="Formato personalizzato" className="form-input w-32 py-2" value={draft.aspectRatio ?? ''} onChange={(event) => update('aspectRatio', event.target.value)} placeholder="1080/1920" />
              <button type="button" disabled={!isUsableUrl(draft.videoUrl) || ratioStatus === 'detecting'} onClick={() => checkRatio(draft.videoUrl, image)} className="inline-flex items-center gap-2 rounded-full border border-white/[.08] px-3 py-1.5 text-xs text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-40 focus-ring">
                {ratioStatus === 'detecting' ? <Spinner size={13} /> : <Sparkles size={13} />} Rileva dal file
              </button>
            </div>
          </Field>

          <Field label="Tag (per la ricerca)" htmlFor="video-tags" hint="Scrivi una parola e premi Invio. Clicca su un suggerimento per aggiungerlo.">
            <div className="form-input flex flex-wrap items-center gap-2 py-2.5">
              {draft.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/10 py-1 pl-3 pr-1.5 text-xs text-white/80">
                  {tag}
                  <button type="button" onClick={() => update('tags', draft.tags.filter((item) => item !== tag))} aria-label={`Rimuovi ${tag}`} className="grid h-5 w-5 place-items-center rounded-full text-white/50 hover:bg-white/15 hover:text-white"><X size={12} /></button>
                </span>
              ))}
              <input id="video-tags" value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={onTagKey} onBlur={() => tagInput && addTag(tagInput)} className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-white/20" placeholder="aggiungi tag…" />
            </div>
            {suggestedTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {suggestedTags.map((tag) => <button key={tag} type="button" onClick={() => addTag(tag)} className="rounded-full border border-dashed border-white/15 px-2.5 py-1 text-[11px] text-white/40 transition hover:border-white/30 hover:text-white focus-ring">+ {tag}</button>)}
              </div>
            )}
          </Field>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="form-label">Anteprima sul sito</p>
          <div className="max-w-sm">
            <VideoCard key={`${preview.thumbnailUrl}|${preview.videoUrl}`} video={preview} onOpen={() => isUsableUrl(draft.videoUrl) && setPreviewOpen(true)} />
          </div>
          <p className="mt-3 text-xs leading-5 text-white/35">{isUsableUrl(draft.videoUrl) ? 'Clicca la card per provare il video come lo vedranno i visitatori.' : 'Incolla il link per vedere l’anteprima.'}</p>
        </aside>
      </div>

      <div className="sticky bottom-0 z-30 -mx-5 mt-10 border-t border-white/[.08] bg-ink/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={save} disabled={saving} className="button-primary disabled:opacity-60">
            {saving ? <><Spinner /> Salvataggio…</> : isNew ? 'Aggiungi al sito' : 'Salva modifiche'}
          </button>
          <button type="button" onClick={onCancel} disabled={saving} className="button-secondary">Annulla</button>
          {onDelete && (
            <div className="ml-auto flex items-center gap-2">
              {confirmDelete ? (
                <>
                  <span className="text-xs text-white/50">Eliminare davvero?</span>
                  <button type="button" onClick={remove} disabled={saving} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-red-600 px-4 text-xs font-bold text-white transition hover:bg-red-500 focus-ring">Sì, elimina</button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="min-h-10 rounded-full px-3 text-xs text-white/50 hover:text-white focus-ring">No</button>
                </>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} disabled={saving} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-red-400/25 px-4 text-xs text-red-200/80 transition hover:border-red-400/50 hover:text-red-100 focus-ring"><Trash2 size={14} /> Elimina video</button>
              )}
            </div>
          )}
        </div>
      </div>

      <VideoModal video={previewOpen ? preview : null} onClose={closePreview} />
    </div>
  )
}
