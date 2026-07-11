import { motion } from 'framer-motion'
import { Info, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { getDifficultyMeta } from '../lib/videoMeta'
import type { VideoDifficulty } from '../types'

const levels: Array<{ value: VideoDifficulty; short: string; description: string }> = [
  { value: 'easy', short: 'clean/simple execution', description: 'Simple structure, clean pacing, light effects, and a focused idea executed without unnecessary density.' },
  { value: 'medium', short: 'more layers and polish', description: 'More layered syncing, stronger transitions, extra polish, and a more deliberate edit rhythm.' },
  { value: 'hard', short: 'advanced timing and motion', description: 'Complex timing, tighter motion work, heavier sound accents, and transitions that require more precision.' },
  { value: 'very hard', short: 'dense, complex sequencing', description: 'Dense sequencing with multiple effects, fast changes, detailed sync, and a high level of control.' },
  { value: 'masterpiece', short: 'signature-level execution', description: 'A showcase-level edit: standout concept, premium polish, high complexity, strong identity, and final-result impact.' },
]

export default function DifficultyLegend() {
  const [active, setActive] = useState<VideoDifficulty>('easy')
  const activeLevel = levels.find((level) => level.value === active) ?? levels[0]
  const activeMeta = getDifficultyMeta(activeLevel.value)

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-3xl border border-white/[.08] bg-white/[.022] p-4 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-5"
      aria-label="Difficulty color legend"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-flame/25 bg-flame/[.08] text-flame">
            <Info size={15} />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold tracking-[-.025em]">Difficulty colors</h2>
            <p className="mt-1 max-w-xl text-xs leading-5 text-white/42">
              Borders show technical complexity: sync, effects, motion density, transitions, typography, and overall polish.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          {levels.map((level) => {
            const meta = getDifficultyMeta(level.value)
            const isActive = active === level.value
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => setActive(level.value)}
                onMouseEnter={() => setActive(level.value)}
                onFocus={() => setActive(level.value)}
                aria-pressed={isActive}
                className={`group inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[9px] uppercase tracking-[.14em] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 focus-ring ${meta.pillClass} ${isActive ? 'scale-[1.02] ring-1 ring-white/18' : 'opacity-[.72] hover:opacity-100'}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                <span>{meta.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <motion.div
        key={activeLevel.value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-5 overflow-hidden rounded-2xl border border-white/[.075] bg-black/20 p-4 md:p-5"
      >
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-1 ${activeLevel.value === 'masterpiece' ? 'difficulty-frame-masterpiece' : activeMeta.frameClass}`} />
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-flame/10 blur-3xl" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] ${activeMeta.pillClass}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${activeMeta.dotClass}`} />
                {activeMeta.label}
              </span>
              {activeLevel.value === 'masterpiece' && <Sparkles size={15} className="text-solar" />}
            </div>
            <p className="mt-3 font-display text-xl font-semibold tracking-[-.03em] text-white/88">{activeLevel.short}</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/48">{activeLevel.description}</p>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/25">Tap or hover</span>
        </div>
      </motion.div>
    </motion.aside>
  )
}
