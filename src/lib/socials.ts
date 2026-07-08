import { useEffect, useState } from 'react'
import type { Socials } from '../types'
import { loadJson } from './content'

export function useSocials() {
  const [socials, setSocials] = useState<Socials>({})

  useEffect(() => {
    loadJson<Record<string, unknown>>('data/socials.json')
      .then((data) => {
        const clean = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => !key.startsWith('_') && typeof value === 'object' && value !== null),
        ) as Socials
        setSocials(clean)
      })
      .catch(console.error)
  }, [])

  return socials
}
