import { AlertTriangle, CheckCircle2, Info, LoaderCircle, XCircle } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Field({ label, hint, htmlFor, error, children }: { label: string; hint?: ReactNode; htmlFor?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="form-label">{label}</label>
      {children}
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : hint && <p className="mt-2 text-xs leading-5 text-white/38">{hint}</p>}
    </div>
  )
}

export function Choice<T extends string>({ value, options, onChange, label }: { value: T | undefined; options: Array<{ value: T; label: string; dotClass?: string }>; onChange: (value: T) => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition focus-ring ${active ? 'border-flame/60 bg-flame/10 text-white' : 'border-white/[.09] bg-black/20 text-white/50 hover:border-white/20 hover:text-white'}`}
          >
            {option.dotClass && <span className={`h-2 w-2 rounded-full ${option.dotClass}`} />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (checked: boolean) => void; label: string; hint?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition focus-ring ${checked ? 'border-flame/45 bg-flame/[.07]' : 'border-white/[.08] bg-black/20 hover:border-white/15'}`}>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-flame' : 'bg-white/15'}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-white/85">{label}</span>
        {hint && <span className="mt-0.5 block text-xs leading-5 text-white/40">{hint}</span>}
      </span>
    </button>
  )
}

const noticeStyles = {
  info: { icon: Info, className: 'border-white/10 bg-white/[.03] text-white/65' },
  success: { icon: CheckCircle2, className: 'border-emerald-300/25 bg-emerald-950/40 text-emerald-100' },
  warning: { icon: AlertTriangle, className: 'border-orange-300/25 bg-orange-950/40 text-orange-100' },
  error: { icon: XCircle, className: 'border-red-300/30 bg-red-950/45 text-red-100' },
}

export function Notice({ tone = 'info', children, action }: { tone?: keyof typeof noticeStyles; children: ReactNode; action?: ReactNode }) {
  const { icon: Icon, className } = noticeStyles[tone]
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-6 ${className}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>
  )
}

export function Spinner({ size = 16 }: { size?: number }) {
  return <LoaderCircle size={size} className="shrink-0 animate-spin" aria-hidden="true" />
}

export function LoadingBlock({ label }: { label: string }) {
  return <div className="flex min-h-[240px] items-center justify-center gap-3 text-sm text-white/45"><Spinner size={18} />{label}</div>
}

/** Chiede conferma prima di chiudere la scheda se ci sono modifiche non salvate. */
export function useUnsavedWarning(active: boolean) {
  useEffect(() => {
    if (!active) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [active])
}
