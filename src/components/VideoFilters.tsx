import { RotateCcw, Search } from 'lucide-react'
import type { Filters } from '../types'

const categories = ['all', 'anime', 'videogiochi', 'altro']
const styles = ['all', 'simple edit', 'vibe edit', 'typography', 'promo edit', 'flow edit', 'cinematic edit', 'amv', 'gmv', 'altro']

const labels: Record<string, string> = { all: 'All', videogiochi: 'Gaming', altro: 'Other' }
const label = (value: string) => labels[value] ?? value.charAt(0).toUpperCase() + value.slice(1)

export default function VideoFilters({ filters, onChange, count }: { filters: Filters; onChange: (filters: Filters) => void; count: number }) {
  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value })
  const reset = () => onChange({ type: 'all', category: 'all', style: 'all', search: '' })
  return (
    <div className="rounded-3xl border border-white/[.08] bg-white/[.025] p-4 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex rounded-full border border-white/[.08] bg-black/20 p-1" aria-label="Project type">
          {[{ value: 'all', text: 'All' }, { value: 'my-edit', text: 'My Edits' }, { value: 'commissioned', text: 'Commissioned' }].map((item) => <button key={item.value} onClick={() => set('type', item.value)} className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold transition focus-ring sm:px-5 ${filters.type === item.value ? 'bg-white text-ink' : 'text-white/45 hover:text-white'}`}>{item.text}</button>)}
        </div>
        <label className="relative block lg:w-80"><span className="sr-only">Search videos by title or tag</span><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" /><input value={filters.search} onChange={(event) => set('search', event.target.value)} placeholder="Search title or tag..." className="h-12 w-full rounded-full border border-white/[.09] bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-flame/60 focus:ring-2 focus:ring-flame/15" /></label>
      </div>
      <div className="mt-5 grid gap-5 border-t border-white/[.07] pt-5 lg:grid-cols-[1fr_2fr_auto] lg:items-end">
        <FilterRow title="Category" values={categories} active={filters.category} onClick={(value) => set('category', value)} />
        <FilterRow title="Style" values={styles} active={filters.style} onClick={(value) => set('style', value)} />
        <button onClick={reset} className="inline-flex h-9 items-center gap-2 self-end whitespace-nowrap text-xs text-white/38 transition hover:text-flame focus-ring"><RotateCcw size={13} /> Reset filters</button>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/[.07] pt-4 font-mono text-[9px] uppercase tracking-[.16em] text-white/28"><span>{count} {count === 1 ? 'result' : 'results'}</span><span>Newest first</span></div>
    </div>
  )
}

function FilterRow({ title, values, active, onClick }: { title: string; values: string[]; active: string; onClick: (value: string) => void }) {
  return <fieldset><legend className="mb-2.5 font-mono text-[9px] uppercase tracking-[.17em] text-white/32">{title}</legend><div className="flex flex-wrap gap-1.5">{values.map((value) => <button key={value} onClick={() => onClick(value)} className={`rounded-full border px-3 py-1.5 text-[11px] transition focus-ring ${active === value ? 'border-flame/60 bg-flame/10 text-flame' : 'border-white/[.08] text-white/42 hover:border-white/20 hover:text-white'}`}>{label(value)}</button>)}</div></fieldset>
}
