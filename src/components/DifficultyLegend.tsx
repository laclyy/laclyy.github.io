import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { getDifficultyMeta } from '../lib/videoMeta'
import type { VideoDifficulty } from '../types'

const levels: Array<{ value: VideoDifficulty; short: string }> = [
  { value: 'easy', short: 'clean/simple execution' },
  { value: 'medium', short: 'more layers and polish' },
  { value: 'hard', short: 'advanced timing and motion' },
  { value: 'very hard', short: 'dense, complex sequencing' },
  { value: 'masterpiece', short: 'signature-level execution' },
]

export default function DifficultyLegend() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-white/[.08] bg-white/[.022] p-4 shadow-2xl shadow-black/10 backdrop-blur-sm"
      aria-label="Difficulty color legend"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        <div className="flex flex-wrap gap-2">
          {levels.map((level) => {
            const meta = getDifficultyMeta(level.value)
            return (
              <span
                key={level.value}
                title={`${meta.label}: ${level.short}`}
                className={`group inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[9px] uppercase tracking-[.14em] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 ${meta.pillClass}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                <span>{meta.label}</span>
                <span className="hidden normal-case tracking-normal text-white/34 xl:inline">· {level.short}</span>
              </span>
            )
          })}
        </div>
      </div>
    </motion.aside>
  )
}
