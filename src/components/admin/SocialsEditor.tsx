import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { dataFiles, describeError, readJsonFile } from '../../lib/github'
import type { Publish } from '../../pages/AdminPage'
import type { SocialItem } from '../../types'
import { resolveSocialIcon } from '../SocialLinks'
import { Field, LoadingBlock, Notice, Spinner, useUnsavedWarning } from './ui'

type SocialsFile = Record<string, unknown>
type Entry = { key: string; social: SocialItem }

const platforms = [
  { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/…' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@…' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@…' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/…' },
  { key: 'x', label: 'X / Twitter', placeholder: 'https://x.com/…' },
  { key: 'twitch', label: 'Twitch', placeholder: 'https://twitch.tv/…' },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/…' },
  { key: 'link', label: 'Altro link', placeholder: 'https://…' },
]

function toEntries(file: SocialsFile): Entry[] {
  return Object.entries(file)
    .filter(([key, value]) => !key.startsWith('_') && typeof value === 'object' && value !== null)
    .map(([key, value]) => ({ key, social: value as SocialItem }))
}

function fromEntries(current: SocialsFile, entries: Entry[]): SocialsFile {
  const meta = Object.fromEntries(Object.entries(current).filter(([key]) => key.startsWith('_')))
  return { ...meta, ...Object.fromEntries(entries.map(({ key, social }) => [key, social])) }
}

function isValidLink(url: string) {
  return !url.trim() || /^(https?:\/\/[^\s]+|mailto:[^\s]+)$/i.test(url.trim())
}

export default function SocialsEditor({ token, publish }: { token: string; publish: Publish }) {
  const [saved, setSaved] = useState<Entry[] | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  const load = () => {
    setLoadError(null)
    readJsonFile<SocialsFile>(token, dataFiles.socials)
      .then(({ data }) => {
        setSaved(toEntries(data))
        setEntries(toEntries(data))
      })
      .catch((error) => setLoadError(describeError(error)))
  }
  useEffect(load, [token])

  const dirty = saved !== null && JSON.stringify(entries) !== JSON.stringify(saved)
  useUnsavedWarning(dirty && !saving)

  if (loadError) return <Notice tone="error" action={<button onClick={load} className="text-xs font-semibold underline">Riprova</button>}>Non riesco a leggere i social: {loadError}</Notice>
  if (!saved) return <LoadingBlock label="Carico i social…" />

  const invalid = entries.filter(({ social }) => !isValidLink(social.url))

  const patch = (index: number, change: Partial<SocialItem>) => setEntries(entries.map((entry, i) => (i === index ? { ...entry, social: { ...entry.social, ...change } } : entry)))
  const move = (index: number, direction: -1 | 1) => {
    const next = [...entries]
    const [item] = next.splice(index, 1)
    next.splice(index + direction, 0, item)
    setEntries(next)
  }
  const add = (platform: (typeof platforms)[number]) => {
    const taken = new Set(entries.map((entry) => entry.key))
    let key = platform.key
    for (let n = 2; taken.has(key); n++) key = `${platform.key}_${n}`
    setEntries([...entries, { key, social: { label: platform.key === 'link' ? '' : platform.label, username: '', url: '' } }])
  }

  const save = async () => {
    setSaving(true)
    setResult(null)
    try {
      const next = await publish('socials', (current: SocialsFile) => fromEntries(current, entries), 'Admin: aggiornati i social')
      setSaved(toEntries(next))
      setEntries(toEntries(next))
      setResult({ tone: 'success', text: 'Social salvati.' })
    } catch (error) {
      setResult({ tone: 'error', text: describeError(error) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold tracking-[-.03em] sm:text-4xl">Social e Discord</h2>
      <p className="mt-2 text-sm text-white/45">L’ordine qui è lo stesso in cui appaiono sul sito. Lascia il link vuoto per nascondere un social senza eliminarlo.</p>

      <div className="mt-8 space-y-4">
        {entries.map((entry, index) => {
          const Icon = resolveSocialIcon(entry.key, entry.social)
          const platform = platforms.find((item) => entry.key.startsWith(item.key))
          return (
            <section key={entry.key} className="rounded-[1.5rem] border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-flame"><Icon size={17} /></span>
                <span className="min-w-0 flex-1 truncate font-display text-lg font-semibold">{entry.social.label || platform?.label || 'Nuovo link'}</span>
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Sposta su" className="grid h-9 w-9 place-items-center rounded-full text-white/45 hover:bg-white/5 hover:text-white disabled:opacity-25 focus-ring"><ArrowUp size={16} /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === entries.length - 1} aria-label="Sposta giù" className="grid h-9 w-9 place-items-center rounded-full text-white/45 hover:bg-white/5 hover:text-white disabled:opacity-25 focus-ring"><ArrowDown size={16} /></button>
                <button type="button" onClick={() => setEntries(entries.filter((_, i) => i !== index))} aria-label={`Rimuovi ${entry.social.label}`} className="grid h-9 w-9 place-items-center rounded-full text-white/35 hover:bg-red-500/10 hover:text-red-300 focus-ring"><Trash2 size={16} /></button>
              </div>
              {entry.key === 'discord' && <p className="mt-3 text-xs text-white/40">Questo link è usato anche per il bottone delle commissioni nella pagina Contact.</p>}
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <Field label="Nome mostrato" htmlFor={`social-label-${entry.key}`}>
                  <input id={`social-label-${entry.key}`} className="form-input" value={entry.social.label} onChange={(event) => patch(index, { label: event.target.value })} placeholder={platform?.label} />
                </Field>
                <Field label="Username" htmlFor={`social-user-${entry.key}`}>
                  <input id={`social-user-${entry.key}`} className="form-input" value={entry.social.username ?? ''} onChange={(event) => patch(index, { username: event.target.value })} placeholder="@nome" />
                </Field>
                <Field label="Link" htmlFor={`social-url-${entry.key}`} error={isValidLink(entry.social.url) ? undefined : 'Il link deve iniziare con https://'}>
                  <input id={`social-url-${entry.key}`} className="form-input" type="url" inputMode="url" value={entry.social.url} onChange={(event) => patch(index, { url: event.target.value })} placeholder={platform?.placeholder ?? 'https://…'} />
                </Field>
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-6">
        <p className="form-label">Aggiungi un social</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button key={platform.key} type="button" onClick={() => add(platform)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/[.09] px-4 text-xs text-white/60 transition hover:border-white/25 hover:text-white focus-ring"><Plus size={13} /> {platform.label}</button>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 z-30 -mx-5 mt-8 border-t border-white/[.08] bg-ink/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16">
        {result && <div className="mb-3"><Notice tone={result.tone}>{result.text}</Notice></div>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={save} disabled={!dirty || saving || invalid.length > 0} className="button-primary disabled:pointer-events-none disabled:opacity-40">
            {saving ? <><Spinner /> Salvataggio…</> : 'Salva e pubblica'}
          </button>
          <button type="button" onClick={() => setEntries(saved)} disabled={!dirty || saving} className="button-secondary disabled:pointer-events-none disabled:opacity-40">Annulla modifiche</button>
          <span className="text-xs text-white/40">{invalid.length ? 'Correggi i link segnati in rosso.' : dirty ? 'Modifiche non ancora pubblicate' : 'Nessuna modifica'}</span>
        </div>
      </div>
    </div>
  )
}
