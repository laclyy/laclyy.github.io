import { useEffect, useState } from 'react'
import type { Profile } from '../types'
import { loadJson } from './content'

const fallbackProfile: Profile = {
  name: 'LACLY', role: 'Italian video editor', shortDescription: 'Visual stories, edited with intention.',
  longDescription: 'Video editing, motion, and sound.', styleDescription: 'Sync, rhythm, and cinematic storytelling.',
  email: 'hello@example.com', heroEyebrow: 'Independent video editor', heroTitle: 'I cut frames. I build feelings.',
  heroText: 'Editing and motion for high-impact stories.', primaryCtaText: 'View my work',
  secondaryCtaText: 'Contact me', featuredTitle: 'Selected work', featuredText: 'A selection of recent projects.',
  strengthsTitle: 'More than a clean cut.', strengthsText: 'Technique, rhythm, and intention.',
  contactTitle: "Let's work together.", contactText: 'Tell me about your project.', commissionCtaText: 'Commission an edit',
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJson<Profile>('data/profile.json')
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { profile, loading }
}
