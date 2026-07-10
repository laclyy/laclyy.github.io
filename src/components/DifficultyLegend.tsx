import { motion } from 'framer-motion'
import { Gauge, Sparkles } from 'lucide-react'
import { getDifficultyMeta } from '../lib/videoMeta'
import type { VideoDifficulty } from '../types'

const levels: Array<{ value: VideoDifficulty; meaning: string; detail: string }> = [
  {
    value: 'easy',
    meaning: 'Clean execution',
    detail: 'Simple structure, readable sync, light effects, and fast delivery energy.',
  },
  {
    value: 'medium',
    meaning: 'More layered',
    detail: 'Stronger pacing, more transitions, better sound accents, and extra polish.',
  },
  {
    value: 'hard',
    meaning: 'Advanced edit',
    detail: 'Complex timing, heavier motion, refined composition, and tighter visual rhythm.',
  },
  {
    value: 'very hard',
    meaning: 'High complexity',
    detail: 'Dense sequences, demanding flow, advanced effects, and precise frame control.',
  },
  {
    value: 'masterpiece',
    meaning: 'Signature piece',
    detail: 'Top-tier concept, execution, atmosphere, rhythm, and replay value.',
  },
]

export default function DifficultyLegend() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55 }}
      className="relative overflow-hidden rounded-[2rem] border border-white/[.08] bg-white/[.025] p-4 shadow-2xl shadow-black/15 backdrop-blur-sm md:p-6"
      aria-labelledby="difficulty-legend-title"
    >
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,32,56,.22),rgba(255,212,59,.08)_35%,transparent_68%)] blur-2xl" />
      <div className="relative grid gap-6 xl:grid-cols-[.75fr_1.25fr] xl:items-stretch">
        <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/[.07] bg-black/20 p-5">
          <div>
            <div className="eyebrow"><span className="h-px w-7 bg-solar" />Difficulty scale</div>
            <h2 id="difficulty-legend-title" className="mt-4 font-display text-3xl font-semibold tracking-[-.04em] md:text-4xl">
              Border colors show how demanding each edit is.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/45">
              The scale is based on editing complexity: sync precision, motion density, transitions, typography, composition, and overall polish.
            </p>
          </div>
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-flame/20 bg-flame/[.06] p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ember to-flame text-white"><Gauge size={17} /></span>
            <p className="text-xs leading-5 text-white/45">
              Difficulty does not mean quality only — it mainly describes how technically demanding the edit is.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {levels.map((level, index) => {
            const meta = getDifficultyMeta(level.value)
            return (
              <motion.article
                key={level.value}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`group relative rounded-[1.35rem] p-[1px] ${meta.frameClass}`}
              >
                <div className="relative flex min-h-full flex-col overflow-hidden rounded-[1.28rem] bg-[#0b0908] p-4 transition duration-300 group-hover:bg-[#120d0c]">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] backdrop-blur-md ${meta.pillClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                      {meta.label}
                    </span>
                    {level.value === 'masterpiece' && <Sparkles size={15} className="text-solar" />}
                  </div>
                  <h3 className="mt-8 font-display text-lg font-semibold tracking-[-.02em]">{level.meaning}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/42">{level.detail}</p>
                  <span className="mt-auto pt-8 font-mono text-[9px] uppercase tracking-[.16em] text-white/20">Level 0{index + 1}</span>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
