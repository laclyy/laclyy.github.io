import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CopyDiscordButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => { if (!copied) return; const timer = window.setTimeout(() => setCopied(false), 1800); return () => window.clearTimeout(timer) }, [copied])
  const copy = async () => { try { await navigator.clipboard.writeText(username); setCopied(true) } catch { /* Clipboard access may be blocked over HTTP. */ } }
  return <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-3 py-2 text-xs text-white/55 transition hover:border-flame/35 hover:text-white focus-ring" aria-label={`Copy Discord username ${username}`}>{copied ? <Check size={13} className="text-flame" /> : <Copy size={13} />}{copied ? 'Copied' : 'Copy username'}</button>
}
