import { ExternalLink, KeyRound } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { describeError, repo, tokenCreationUrl, verifyToken } from '../../lib/github'
import { Notice, Spinner } from './ui'

export default function AdminLogin({ onLogin }: { onLogin: (token: string, remember: boolean) => void }) {
  const [token, setToken] = useState('')
  const [remember, setRemember] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const value = token.trim()
    if (!value) return setError('Incolla il token prima di continuare.')
    setChecking(true)
    setError(null)
    try {
      await verifyToken(value)
      onLogin(value, remember)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setChecking(false)
    }
  }

  return (
    <main className="shell grid min-h-screen place-items-center py-16">
      <div className="w-full max-w-2xl">
        <div className="eyebrow"><span className="h-px w-7 bg-flame" />Area riservata</div>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Gestione contenuti</h1>
        <p className="mt-4 text-sm leading-6 text-white/50">Da qui puoi aggiungere video, modificare i testi e i social del sito senza toccare nessun file. Per salvare serve una chiave di accesso GitHub (token): si crea una volta sola.</p>

        <ol className="mt-8 space-y-4 rounded-[1.5rem] border border-white/[.08] bg-white/[.025] p-5 text-sm leading-6 text-white/65 sm:p-7">
          <Step n={1}>
            Accedi a GitHub con l’account del sito e apri la pagina di creazione del token:
            <div className="mt-3"><a href={tokenCreationUrl} target="_blank" rel="noreferrer" className="button-secondary min-h-10">Crea il token su GitHub <ExternalLink size={14} /></a></div>
          </Step>
          <Step n={2}>Nome, scadenza e permesso <b className="text-white/85">Contents: Read and write</b> sono già compilati. Alla voce <b className="text-white/85">Repository access</b> scegli <b className="text-white/85">Only select repositories</b> e seleziona <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">{repo.name}</code>.</Step>
          <Step n={3}>Clicca <b className="text-white/85">Generate token</b>, copia il codice che inizia con <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">github_pat_</code> e incollalo qui sotto.</Step>
        </ol>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-token" className="form-label">Token GitHub</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input id="admin-token" type="password" autoComplete="off" spellCheck={false} value={token} onChange={(event) => setToken(event.target.value)} placeholder="github_pat_…" className="form-input pl-11" />
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-white/55">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="mt-1 h-4 w-4 accent-[#ff2038]" />
            <span>Ricordami su questo dispositivo. <span className="text-white/35">Non spuntarlo su computer condivisi o pubblici.</span></span>
          </label>
          {error && <Notice tone="error">{error}</Notice>}
          <button type="submit" disabled={checking} className="button-primary w-full disabled:opacity-60 sm:w-auto">
            {checking ? <><Spinner /> Verifica in corso…</> : 'Entra'}
          </button>
        </form>
        <p className="mt-6 text-xs leading-5 text-white/30">Il token resta solo in questo browser e viene inviato unicamente a GitHub. Non condividerlo con nessuno: chi lo possiede può modificare il sito. Se lo perdi, eliminalo da GitHub e creane uno nuovo.</p>
      </div>
    </main>
  )
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-flame/40 font-mono text-xs text-flame">{n}</span>
      <div className="min-w-0">{children}</div>
    </li>
  )
}
