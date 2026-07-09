import { useEffect, useState } from 'react'
import { publicUrl } from '../lib/content'
import type { Profile } from '../types'

type ProfileAvatarProps = {
  profile: Profile
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  priority?: boolean
}

const sizes = {
  xs: 'h-8 w-8',
  sm: 'h-11 w-11',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-36 w-36 md:h-44 md:w-44',
}

export default function ProfileAvatar({ profile, size = 'md', className = '', priority = false }: ProfileAvatarProps) {
  const fallback = publicUrl('brand/lacly-pfp.svg')
  const [src, setSrc] = useState(publicUrl(profile.avatarUrl || 'brand/lacly-pfp.svg'))

  useEffect(() => {
    setSrc(publicUrl(profile.avatarUrl || 'brand/lacly-pfp.svg'))
  }, [profile.avatarUrl])

  return (
    <span className={`profile-avatar relative inline-grid shrink-0 place-items-center rounded-full p-[1px] ${sizes[size]} ${className}`}>
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-ember via-flame to-solar opacity-90 blur-[1px]" />
      <span className="relative h-full w-full overflow-hidden rounded-full border border-white/15 bg-black">
        <img
          src={src}
          alt={`${profile.name} profile picture`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setSrc(fallback)}
          className="h-full w-full object-cover"
        />
      </span>
    </span>
  )
}
