import { RotateCcw, Search } from 'lucide-react'
import { useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Filters, VideoItem } from '../types'

const projectTypes = [
  { value: 'all', label: 'All' },
  { value: 'my-edit', label: 'My edits' },
  { value: 'commissioned', label: 'Commissioned' },
]

const categories = [
  { value: 'all', label: 'All' },
  { value: 'anime', label: 'Anime' },
  { value: 'videogiochi', label: 'Games' },
]

const games = [
  { value: 'all', label: 'All games' },
  { value: 'rocket league', label: 'Rocket League' },
  { value: 'other games', label: 'Other games' },
]

const styleOrder = [
  'promo edit',
  'sigma boy',
  'tiktok edit',
  'trend edit',
  'vibe edit',
  'rocket league edit',
  'lacly style edit',
  'game edit',
]

const labels: Record<string, string> = { all: 'All' }
const label = (value: string) => labels[value] ?? value.charAt(0).toUpperCase() + value.slice(1)

export default function VideoFilters({ filters, onChange, count, videos }: { filters: Filters; onChange: (filters: Filters) => void; count: number; videos: VideoItem[] }) {
  const availableStyles = useMemo(() => {
    const scoped = videos
      .filter((video) => filters.type === 'all' || video.type === filters.type)
      .filter((video) => filters.category === 'all' || video.category === filters.category)
      .filter((video) => filters.game === 'all' || video.tags.includes(filters.game))
    const styles = new Set(scoped.map((video) => video.style))
    return ['all', ...styleOrder.filter((style) => styles.has(style))]
  }, [filters.category, filters.game, filters.type, videos])

  const patch = (next: Partial<Filters>) => onChange({ ...filters, ...next })
  const setType = (type: string) => patch({ type: type as Filters['type'], style: 'all' })
  const setCategory = (category: string) => patch({ category, game: 'all', style: 'all' })
  const setGame = (game: string) => patch({ game, style: 'all' })
  const reset = () => onChange({ type: 'all', category: 'all', game: 'all', style: 'all', search: '' })
  const hasGameFilter = filters.category === 'videogiochi'

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[.08] bg-white/[.025] shadow-2xl shadow-black/10 backdrop-blur-sm" aria-label="Video filters">
      <div className="flex flex-col gap-4 border-b border-white/[.07] p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="eyebrow"><span className="h-px w-7 bg-flame" />Filter archive</div>
          <p className="mt-2 text-xs leading-5 text-white/38">Choose type, category, game and edit style without duplicate filters.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block sm:w-80">
            <span className="sr-only">Search videos by title or tag</span>
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
            <input value={filters.search} onChange={(event) => patch({ search: event.target.value })} placeholder="Search title or tag..." className="h-11 w-full rounded-full border border-white/[.09] bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-flame/60 focus:ring-2 focus:ring-flame/15" />
          </label>
          <button onClick={reset} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/[.08] bg-black/20 px-4 text-xs text-white/45 transition hover:border-flame/30 hover:text-flame focus-ring"><RotateCcw size={13} /> Reset</button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-4">
        <FilterBlock title="Type" helper="Portfolio ownership" className="lg:border-r lg:border-white/[.07]">
          <Segmented values={projectTypes} active={filters.type} onClick={setType} />
        </FilterBlock>

        <FilterBlock title="Category" helper="Anime or games" className="lg:border-r lg:border-white/[.07]">
          <Pills values={categories} active={filters.category} onClick={setCategory} />
        </FilterBlock>

        <FilterBlock title="Game" helper={hasGameFilter ? 'Only for game edits' : 'Select Games first'} className="lg:border-r lg:border-white/[.07]" muted={!hasGameFilter}>
          {hasGameFilter ? <Pills values={games} active={filters.game} onClick={setGame} /> : <p className="rounded-2xl border border-white/[.06] bg-black/15 px-3 py-2 text-xs leading-5 text-white/28">Game filters appear when the category is set to Games.</p>}
        </FilterBlock>

        <FilterBlock title="Style" helper="Available for current selection">
          <Pills values={availableStyles.map((value) => ({ value, label: label(value) }))} active={filters.style} onClick={(style) => patch({ style })} />
        </FilterBlock>
      </div>

      <div className="flex items-center justify-between border-t border-white/[.07] px-4 py-4 font-mono text-[9px] uppercase tracking-[.16em] text-white/28 md:px-5">
        <span>{count} {count === 1 ? 'result' : 'results'}</span>
        <span>Newest first</span>
      </div>
    </section>
  )
}

function FilterBlock({ title, helper, children, className = '', muted = false }: { title: string; helper: string; children: ReactNode; className?: string; muted?: boolean }) {
  return (
    <fieldset className={`min-w-0 border-b border-white/[.07] p-4 md:p-5 lg:border-b-0 ${className} ${muted ? 'opacity-70' : ''}`}>
      <legend className="mb-3">
        <span className="block font-mono text-[9px] uppercase tracking-[.17em] text-white/32">{title}</span>
        <span className="mt-1 block text-xs text-white/28">{helper}</span>
      </legend>
      {children}
    </fieldset>
  )
}

function Segmented({ values, active, onClick }: { values: Array<{ value: string; label: string }>; active: string; onClick: (value: string) => void }) {
  return (
    <div className="grid rounded-full border border-white/[.08] bg-black/20 p-1" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
      {values.map((item) => (
        <button key={item.value} onClick={() => onClick(item.value)} className={`min-h-9 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition focus-ring ${active === item.value ? 'bg-white text-ink' : 'text-white/45 hover:text-white'}`}>{item.label}</button>
      ))}
    </div>
  )
}

function Pills({ values, active, onClick }: { values: Array<{ value: string; label: string }>; active: string; onClick: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((item) => (
        <button key={item.value} onClick={() => onClick(item.value)} className={`rounded-full border px-3 py-1.5 text-[11px] transition focus-ring ${active === item.value ? 'border-flame/60 bg-flame/10 text-flame' : 'border-white/[.08] text-white/42 hover:border-white/20 hover:text-white'}`}>{item.label}</button>
      ))}
    </div>
  )
}
