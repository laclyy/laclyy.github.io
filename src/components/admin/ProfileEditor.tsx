import { useEffect, useState } from 'react'
import { publicUrl } from '../../lib/content'
import { dataFiles, describeError, readJsonFile } from '../../lib/github'
import type { Publish } from '../../pages/AdminPage'
import { Field, LoadingBlock, Notice, Spinner, useUnsavedWarning } from './ui'

type ProfileFile = Record<string, unknown>

type FieldDef = { key: string; label: string; hint?: string; multiline?: boolean }

const groups: Array<{ title: string; description: string; fields: FieldDef[] }> = [
  {
    title: 'Identità',
    description: 'Nome e immagine usati in navbar, Home, contatti e footer.',
    fields: [
      { key: 'name', label: 'Nome' },
      { key: 'role', label: 'Ruolo', hint: 'es. Video Editor & GFX' },
      { key: 'location', label: 'Città / Paese', hint: 'Appare come “Based in …”. Lascia vuoto per nasconderlo.' },
      { key: 'avatarUrl', label: 'Immagine profilo', hint: 'Link all’immagine (quadrata) oppure percorso nel sito, es. brand/lacly.png' },
    ],
  },
  {
    title: 'Home — parte alta',
    description: 'La prima cosa che si vede aprendo il sito.',
    fields: [
      { key: 'heroEyebrow', label: 'Testo piccolo sopra il titolo' },
      { key: 'heroTitle', label: 'Titolo grande', hint: 'Vai a capo con Invio: la seconda riga diventa colorata.', multiline: true },
      { key: 'heroText', label: 'Testo sotto il titolo', multiline: true },
      { key: 'primaryCtaText', label: 'Bottone principale (porta ai video)' },
      { key: 'secondaryCtaText', label: 'Bottone secondario (porta ai contatti)' },
    ],
  },
  {
    title: 'Home — presentazione',
    description: 'La sezione con la foto profilo sotto la parte alta.',
    fields: [
      { key: 'shortDescription', label: 'Frase principale', multiline: true },
      { key: 'longDescription', label: 'Paragrafo 1', multiline: true },
      { key: 'styleDescription', label: 'Paragrafo 2', multiline: true },
    ],
  },
  {
    title: 'Home — lavori in evidenza',
    description: 'Titolo e testo sopra i video segnati “In evidenza”.',
    fields: [
      { key: 'featuredTitle', label: 'Titolo' },
      { key: 'featuredText', label: 'Testo', multiline: true },
    ],
  },
  {
    title: 'Commissioni e contatti',
    description: 'Testi della sezione commissioni e della pagina Contact.',
    fields: [
      { key: 'contactTitle', label: 'Titolo' },
      { key: 'contactText', label: 'Testo', multiline: true },
      { key: 'commissionCtaText', label: 'Testo del bottone Discord' },
    ],
  },
]

const allKeys = groups.flatMap((group) => group.fields.map((field) => field.key))

function pickValues(file: ProfileFile): Record<string, string> {
  return Object.fromEntries(allKeys.map((key) => [key, typeof file[key] === 'string' ? (file[key] as string) : '']))
}

export default function ProfileEditor({ token, publish }: { token: string; publish: Publish }) {
  const [saved, setSaved] = useState<Record<string, string> | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  const load = () => {
    setLoadError(null)
    readJsonFile<ProfileFile>(token, dataFiles.profile)
      .then(({ data }) => {
        const picked = pickValues(data)
        setSaved(picked)
        setValues(picked)
      })
      .catch((error) => setLoadError(describeError(error)))
  }
  useEffect(load, [token])

  const changed = saved ? allKeys.filter((key) => values[key] !== saved[key]) : []
  useUnsavedWarning(changed.length > 0 && !saving)

  if (loadError) return <Notice tone="error" action={<button onClick={load} className="text-xs font-semibold underline">Riprova</button>}>Non riesco a leggere il profilo: {loadError}</Notice>
  if (!saved) return <LoadingBlock label="Carico i testi…" />

  const save = async () => {
    setSaving(true)
    setResult(null)
    // Si inviano solo i campi modificati, così eventuali altre modifiche al file non vengono perse.
    const patch = Object.fromEntries(changed.map((key) => [key, values[key]]))
    try {
      const next = await publish('profile', (current: ProfileFile) => ({ ...current, ...patch }), 'Admin: aggiornati i testi del profilo')
      setSaved(pickValues(next))
      setValues(pickValues(next))
      setResult({ tone: 'success', text: 'Testi salvati.' })
    } catch (error) {
      setResult({ tone: 'error', text: describeError(error) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold tracking-[-.03em] sm:text-4xl">Profilo e testi</h2>
      <p className="mt-2 text-sm text-white/45">I testi del sito sono in inglese: scrivili nella lingua in cui vuoi che li leggano i visitatori.</p>

      <div className="mt-8 space-y-6">
        {groups.map((group) => (
          <section key={group.title} className="rounded-[1.5rem] border border-white/[.08] bg-white/[.02] p-5 sm:p-7">
            <h3 className="font-display text-xl font-semibold">{group.title}</h3>
            <p className="mt-1 text-xs text-white/40">{group.description}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {group.fields.map((field) => (
                <div key={field.key} className={field.multiline ? 'md:col-span-2' : undefined}>
                  <Field label={field.label} htmlFor={`profile-${field.key}`} hint={field.hint}>
                    {field.multiline ? (
                      <textarea id={`profile-${field.key}`} className="form-input min-h-24 resize-y" value={values[field.key]} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
                    ) : (
                      <input id={`profile-${field.key}`} className="form-input" value={values[field.key]} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
                    )}
                  </Field>
                  {field.key === 'avatarUrl' && values.avatarUrl && <img src={publicUrl(values.avatarUrl)} alt="Anteprima immagine profilo" className="mt-3 h-16 w-16 rounded-full border border-white/10 object-cover" />}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-0 z-30 -mx-5 mt-8 border-t border-white/[.08] bg-ink/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16">
        {result && <div className="mb-3"><Notice tone={result.tone}>{result.text}</Notice></div>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={save} disabled={!changed.length || saving} className="button-primary disabled:pointer-events-none disabled:opacity-40">
            {saving ? <><Spinner /> Salvataggio…</> : 'Salva e pubblica'}
          </button>
          <button type="button" onClick={() => setValues(saved)} disabled={!changed.length || saving} className="button-secondary disabled:pointer-events-none disabled:opacity-40">Annulla modifiche</button>
          <span className="text-xs text-white/40">{changed.length ? `${changed.length} ${changed.length === 1 ? 'campo modificato' : 'campi modificati'}` : 'Nessuna modifica'}</span>
        </div>
      </div>
    </div>
  )
}
