import { RotateCcw, Search } from 'lucide-react'
import { useMemo } from 'react'
import type { Filters, VideoItem } from '../types'

const projectTypes = [
  { value: 'all', label: 'All' },
  { value: 'my-edit', label: 'My edits' },
  { value: 'commissioned', label: 'Commissioned' },
]

const worlds = [
  { value: 'all', label: 'All' },
  { value: 'anime', label: 'Anime' },
  { value: 'videogiochi', label: 'Games' },
]

const gameBranches = [
  { value: 'all', label: 'All games' },
  { value: 'rocket league', label: 'Rocket League' },
  { value: 'other games', label: 'Other games' },
]

const styleOrder = [
  'promo edit',
  'commission edit',
  'sigma boy',
  'tiktok edit',
  'trend edit',
  'vibe edit',
  'other games edit',
  'lacly style edit',
]

const labels: Record<string, string> = {
  all: 'All',
  videogiochi: 'Games',
}

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
  const setStyle = (style: string) => patch({ style })
  const reset = () => onChange({ type: 'all', category: 'all', game: 'all', style: 'all', search: '' })

  return (
    <div className="rounded-3xl border border-white/[.08] bg-white/[.025] p-4 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-6">
      <div className="grid gap-4 xl:grid-cols-[auto_1fr_auto] xl:items-start">
        <FilterGroup title="Project type" values={projectTypes} active={filters.type} onClick={setType} variant="tabs" />
        <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
          <FilterGroup title="World" values={worlds} active={filters.category} onClick={setCategory} />
          {filters.category === 'videogiochi' ? (
            <FilterGroup title="Game branch" values={gameBranches} active={filters.game} onClick={setGame} />
          ) : (
            <div className="hidden lg:block" aria-hidden="true" />
          )}
        </div>
        <label className="relative block xl:w-80">
          <span className="sr-only">Search videos by title or tag</span>
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
          <input value={filters.search} onChange={(event) => patch({ search: event.target.value })} placeholder="Search title or tag..." className="h-12 w-full rounded-full border border-white/[.09] bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-flame/60 focus:ring-2 focus:ring-flame/15" />
        </label>
      </div>

      <div className="mt-5 border-t border-white/[.07] pt-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <FilterRow title="Edit style" values={availableStyles} active={filters.style} onClick={setStyle} />
          <button onClick={reset} className="inline-flex h-9 items-center gap-2 self-start whitespace-nowrap text-xs text-white/38 transition hover:text-flame focus-ring lg:self-end"><RotateCcw size={13} /> Reset filters</button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/[.07] pt-4 font-mono text-[9px] uppercase tracking-[.16em] text-white/28">
        <span>{count} {count === 1 ? 'result' : 'results'}</span>
        <span>Newest first</span>
      </div>
    </div>
  )
}

function FilterGroup({ title, values, active, onClick, variant = 'buttons' }: { title: string; values: Array<{ value: string; label: string }>; active: string; onClick: (value: string) => void; variant?: 'buttons' | 'tabs' }) {
  if (variant === 'tabs') {
    return (
      <fieldset>
        <legend className="sr-only">{title}</legend>
        <div className="flex rounded-full border border-white/[.08] bg-black/20 p-1" aria-label={title}>
          {values.map((item) => (
            <button key={item.value} onClick={() => onClick(item.value)} className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold transition focus-ring sm:px-5 ${active === item.value ? 'bg-white text-ink' : 'text-white/45 hover:text-white'}`}>{item.label}</button>
          ))}
        </div>
      </fieldset>
    )
  }

  return (
    <fieldset>
      <legend className="mb-2.5 font-mono text-[9px] uppercase tracking-[.17em] text-white/32">{title}</legend>
      <div className="flex flex-wrap gap-1.5">
        {values.map((item) => (
          <button key={item.value} onClick={() => onClick(item.value)} className={`rounded-full border px-3 py-1.5 text-[11px] transition focus-ring ${active === item.value ? 'border-flame/60 bg-flame/10 text-flame' : 'border-white/[.08] text-white/42 hover:border-white/20 hover:text-white'}`}>{item.label}</button>
        ))}
      </div>
    </fieldset>
  )
}

function FilterRow({ title, values, active, onClick }: { title: string; values: string[]; active: string; onClick: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2.5 font-mono text-[9px] uppercase tracking-[.17em] text-white/32">{title}</legend>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <button key={value} onClick={() => onClick(value)} className={`rounded-full border px-3 py-1.5 text-[11px] transition focus-ring ${active === value ? 'border-flame/60 bg-flame/10 text-flame' : 'border-white/[.08] text-white/42 hover:border-white/20 hover:text-white'}`}>{label(value)}</button>
        ))}
      </div>
    </fieldset>
  )
}
