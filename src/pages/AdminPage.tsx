import { CheckCircle2, ExternalLink, LogOut } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import ProfileEditor from '../components/admin/ProfileEditor'
import SocialsEditor from '../components/admin/SocialsEditor'
import VideosManager from '../components/admin/VideosManager'
import { Spinner } from '../components/admin/ui'
import { publicUrl } from '../lib/content'
import { dataFiles, getStoredToken, repo, storeToken, updateJsonFile } from '../lib/github'

type DataFile = keyof typeof dataFiles
export type Publish = <T>(file: DataFile, change: (current: T) => T, message: string) => Promise<T>

type Status =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'deploying'; file: DataFile; expected: string; since: number }
  | { kind: 'live' }
  | { kind: 'slow' }

const tabs = [
  { id: 'videos', label: 'Video' },
  { id: 'profile', label: 'Profilo e testi' },
  { id: 'socials', label: 'Social' },
] as const

type TabId = (typeof tabs)[number]['id']

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(getStoredToken)
  const [tab, setTab] = useState<TabId>('videos')
  const [visited, setVisited] = useState<Set<TabId>>(() => new Set(['videos']))
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  useEffect(() => {
    document.title = 'Gestione contenuti — Lacly'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  const publish = useCallback<Publish>(async (file, change, message) => {
    if (!token) throw new Error('Sessione scaduta: effettua di nuovo l’accesso.')
    setStatus({ kind: 'saving' })
    try {
      const next = await updateJsonFile(token, dataFiles[file], change, message)
      setStatus({ kind: 'deploying', file, expected: JSON.stringify(next), since: Date.now() })
      return next
    } catch (error) {
      setStatus({ kind: 'idle' })
      throw error
    }
  }, [token])

  // Dopo il commit GitHub Actions ricostruisce il sito: si controlla il JSON online finché non combacia.
  useEffect(() => {
    if (status.kind !== 'deploying' || !import.meta.env.PROD) return
    const check = async () => {
      try {
        const response = await fetch(`${publicUrl(`data/${status.file}.json`)}?v=${Date.now()}`, { cache: 'no-store' })
        if (response.ok && JSON.stringify(await response.json()) === status.expected) return setStatus({ kind: 'live' })
      } catch {
        // Si riprova al giro successivo.
      }
      if (Date.now() - status.since > 8 * 60_000) setStatus({ kind: 'slow' })
    }
    const timer = window.setInterval(check, 15_000)
    return () => window.clearInterval(timer)
  }, [status])

  const login = (value: string, remember: boolean) => {
    storeToken(value, remember)
    setToken(value)
  }

  const logout = () => {
    storeToken(null)
    setToken(null)
    setStatus({ kind: 'idle' })
  }

  const openTab = (id: TabId) => {
    setTab(id)
    setVisited((current) => new Set(current).add(id))
  }

  if (!token) return <div className="min-h-screen bg-ink text-white"><AdminLogin onLogin={login} /></div>

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-40 border-b border-white/[.07] bg-ink/85 backdrop-blur-xl">
        <div className="shell flex h-16 items-center gap-4">
          <span className="font-display text-base font-bold tracking-[.18em]">LACLY</span>
          <span className="hidden rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.16em] text-white/45 sm:inline">Admin</span>
          <div className="ml-auto flex items-center gap-1">
            <a href="/" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs text-white/55 transition hover:text-white focus-ring">Vedi sito <ExternalLink size={13} /></a>
            <button type="button" onClick={logout} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs text-white/55 transition hover:text-white focus-ring"><LogOut size={14} /> Esci</button>
          </div>
        </div>
        <div className="shell -mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Sezioni">
          {tabs.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => openTab(item.id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm transition focus-ring ${tab === item.id ? 'border-flame text-white' : 'border-transparent text-white/45 hover:text-white'}`}>{item.label}</button>
          ))}
        </div>
      </header>

      <PublishStatus status={status} onDismiss={() => setStatus({ kind: 'idle' })} />

      <main className="shell pb-10 pt-10">
        {/* Le schede restano montate: cambiando scheda non si perdono le modifiche in corso. */}
        <div hidden={tab !== 'videos'}><VideosManager token={token} publish={publish} /></div>
        {visited.has('profile') && <div hidden={tab !== 'profile'}><ProfileEditor token={token} publish={publish} /></div>}
        {visited.has('socials') && <div hidden={tab !== 'socials'}><SocialsEditor token={token} publish={publish} /></div>}
      </main>
    </div>
  )
}

function PublishStatus({ status, onDismiss }: { status: Status; onDismiss: () => void }) {
  if (status.kind === 'idle') return null
  const actionsUrl = `https://github.com/${repo.owner}/${repo.name}/actions`
  const content = {
    saving: <><Spinner /> Salvataggio su GitHub…</>,
    deploying: import.meta.env.PROD
      ? <><Spinner /> Salvato. Il sito si sta aggiornando: di solito servono 1–2 minuti.</>
      : <><CheckCircle2 size={16} className="text-emerald-300" /> Salvato su GitHub. Il sito online si aggiornerà in 1–2 minuti.</>,
    live: <><CheckCircle2 size={16} className="text-emerald-300" /> Le modifiche sono online. Se non le vedi, ricarica la pagina del sito.</>,
    slow: <>Salvato, ma il sito non risulta ancora aggiornato. <a href={actionsUrl} target="_blank" rel="noreferrer" className="underline">Controlla lo stato della pubblicazione</a>.</>,
  }[status.kind]

  return (
    <div className="border-b border-white/[.07] bg-white/[.03]" role="status">
      <div className="shell flex min-h-11 items-center gap-3 py-2 text-xs text-white/70">
        {content}
        {status.kind !== 'saving' && <button type="button" onClick={onDismiss} className="ml-auto text-white/40 hover:text-white focus-ring">Chiudi</button>}
      </div>
    </div>
  )
}
