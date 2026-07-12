import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpDown, ChevronDown, RotateCcw, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
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

const styleOrder = ['sigma boy', 'tiktok edit', 'trend edit', 'vibe edit', 'flow edit', 'lacly style edit']
const label = (value: string) => value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)

const sortOptions: Array<{ value: Filters['sort']; label: string }> = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'difficulty-asc', label: 'Difficulty ↑' },
  { value: 'difficulty-desc', label: 'Difficulty ↓' },
]

export default function VideoFilters({ filters, onChange, count, videos }: { filters: Filters; onChange: (filters: Filters) => void; count: number; videos: VideoItem[] }) {
  const availableStyles = useMemo(() => {
    const scoped = videos
      .filter((video) => filters.type === 'all' || video.type === filters.type)
      .filter((video) => filters.category === 'all' || video.category === filters.category)
      .filter((video) => filters.game === 'all' || video.tags.includes(filters.game))
    const styles = new Set(scoped.map((video) => video.style).filter((style) => style !== 'altro'))
    return ['all', ...styleOrder.filter((style) => styles.has(style))]
  }, [filters.category, filters.game, filters.type, videos])

  const patch = (next: Partial<Filters>) => onChange({ ...filters, ...next })
  const reset = () => onChange({ type: 'all', category: 'all', game: 'all', style: 'all', search: '', sort: 'date-desc' })
  const setType = (type: string) => patch({ type: type as Filters['type'], style: 'all' })
  const setCategory = (category: string) => patch({ category, game: 'all', style: 'all' })
  const setGame = (game: string) => patch({ game, style: 'all' })

  return (
    <section className="rounded-[2rem] border border-white/[.08] bg-white/[.025] p-4 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-6" aria-label="Video filters">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex rounded-full border border-white/[.08] bg-black/20 p-1" aria-label="Project type">
          {projectTypes.map((item) => (
            <button key={item.value} onClick={() => setType(item.value)} className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold transition focus-ring sm:px-5 ${filters.type === item.value ? 'bg-white text-ink' : 'text-white/45 hover:text-white'}`}>{item.label}</button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block sm:w-80">
            <span className="sr-only">Search videos by title or tag</span>
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
            <input value={filters.search} onChange={(event) => patch({ search: event.target.value })} placeholder="Search title or tag..." className="h-12 w-full rounded-full border border-white/[.09] bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-flame/60 focus:ring-2 focus:ring-flame/15" />
          </label>
          <SortDropdown value={filters.sort} onChange={(sort) => patch({ sort })} />
          <button onClick={reset} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/[.08] bg-black/20 px-4 text-xs text-white/42 transition hover:border-flame/35 hover:text-flame focus-ring"><RotateCcw size={13} /> Reset</button>
        </div>
      </div>

      <div className="mt-5 space-y-5 border-t border-white/[.07] pt-5">
        <FilterStrip title="Category" values={categories} active={filters.category} onClick={setCategory} />

        {filters.category === 'videogiochi' && (
          <FilterStrip title="Game" values={games} active={filters.game} onClick={setGame} />
        )}

        <FilterStrip title="Style" values={availableStyles.map((value) => ({ value, label: label(value) }))} active={filters.style} onClick={(style) => patch({ style })} wide />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/[.07] pt-4 font-mono text-[9px] uppercase tracking-[.16em] text-white/28">
        <span>{count} {count === 1 ? 'result' : 'results'}</span>
        <span>{sortOptions.find((option) => option.value === filters.sort)?.label}</span>
      </div>
    </section>
  )
}

function SortDropdown({ value, onChange }: { value: Filters['sort']; onChange: (value: Filters['sort']) => void }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = sortOptions.find((option) => option.value === value) ?? sortOptions[0]

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative z-30 sm:w-48">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`group flex h-12 w-full items-center gap-2 rounded-full border px-4 text-left text-xs font-semibold outline-none transition duration-300 focus-ring ${open ? 'border-flame/45 bg-flame/10 text-white/70 shadow-[0_0_24px_rgba(255,45,45,.10)]' : 'border-white/[.09] bg-black/20 text-white/45 hover:border-white/18 hover:text-white/60'}`}
      >
        <ArrowUpDown size={15} className={`shrink-0 transition ${open ? 'text-flame' : 'text-white/32 group-hover:text-white/45'}`} />
        <span className="min-w-0 flex-1 truncate">{selected.label}</span>
        <ChevronDown size={14} className={`shrink-0 text-white/30 transition duration-300 ${open ? 'rotate-180 text-flame/80' : 'group-hover:text-white/45'}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full w-full overflow-hidden rounded-2xl border border-white/[.10] bg-[#080605]/95 p-1.5 shadow-[0_22px_70px_rgba(0,0,0,.55)] backdrop-blur-xl"
            role="listbox"
            aria-label="Sort videos"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,45,45,.14),transparent_48%)]" />
            <div className="relative space-y-1">
              {sortOptions.map((option) => {
                const active = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition focus-ring ${active ? 'bg-flame/12 text-flame' : 'text-white/42 hover:bg-white/[.045] hover:text-white/68'}`}
                  >
                    <span>{option.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_12px_rgba(255,45,45,.65)]" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterStrip({ title, values, active, onClick, wide = false }: { title: string; values: Array<{ value: string; label: string }>; active: string; onClick: (value: string) => void; wide?: boolean }) {
  return (
    <fieldset className={`grid gap-3 ${wide ? 'lg:grid-cols-[92px_1fr]' : 'sm:grid-cols-[92px_1fr]'} sm:items-start`}>
      <legend className="contents">
        <span className="min-w-0">
          <span className="block pt-1.5 font-mono text-[9px] uppercase tracking-[.17em] text-white/32">{title}</span>
        </span>
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {values.map((item) => (
          <button key={item.value} onClick={() => onClick(item.value)} className={`rounded-full border px-3 py-1.5 text-[11px] transition focus-ring ${active === item.value ? 'border-flame/60 bg-flame/10 text-flame' : 'border-white/[.08] text-white/42 hover:border-white/20 hover:text-white'}`}>{item.label}</button>
        ))}
      </div>
    </fieldset>
  )
}
