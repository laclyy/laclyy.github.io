import type { VideoDifficulty } from '../types'

type DifficultyMeta = {
  label: string
  frameClass: string
  pillClass: string
  dotClass: string
}

const difficultyMeta: Record<VideoDifficulty, DifficultyMeta> = {
  easy: {
    label: 'Easy',
    frameClass: 'difficulty-frame-easy',
    pillClass: 'difficulty-pill-easy',
    dotClass: 'bg-emerald-300',
  },
  medium: {
    label: 'Medium',
    frameClass: 'difficulty-frame-medium',
    pillClass: 'difficulty-pill-medium',
    dotClass: 'bg-orange-300',
  },
  hard: {
    label: 'Hard',
    frameClass: 'difficulty-frame-hard',
    pillClass: 'difficulty-pill-hard',
    dotClass: 'bg-red-400',
  },
  'very hard': {
    label: 'Very hard',
    frameClass: 'difficulty-frame-very-hard',
    pillClass: 'difficulty-pill-very-hard',
    dotClass: 'bg-purple-300',
  },
  masterpiece: {
    label: 'Masterpiece',
    frameClass: 'difficulty-frame-masterpiece',
    pillClass: 'difficulty-pill-masterpiece',
    dotClass: 'bg-white',
  },
}

export function getDifficultyMeta(difficulty?: string): DifficultyMeta {
  const normalized = normalizeDifficulty(difficulty)
  return normalized
    ? difficultyMeta[normalized]
    : {
        label: 'Unrated',
        frameClass: 'difficulty-frame-default',
        pillClass: 'difficulty-pill-default',
        dotClass: 'bg-white/40',
      }
}

export function normalizeDifficulty(difficulty?: string): VideoDifficulty | null {
  const normalized = difficulty?.trim().toLowerCase().replace(/[-_]+/g, ' ')
  if (!normalized) return null
  if (normalized in difficultyMeta) return normalized as VideoDifficulty
  return null
}

export function formatMonthYear(date: string): string {
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en', { month: 'long', year: 'numeric' })
}

export function normalizeAspectRatio(value?: string): string | undefined {
  if (!value) return undefined
  const normalized = value.trim().replace(':', ' / ')
  return /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(normalized) ? normalized : undefined
}
