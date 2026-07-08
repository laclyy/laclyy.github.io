const cache = new Map<string, Promise<unknown>>()

export function publicUrl(path: string): string {
  if (!path) return ''
  if (/^(https?:|mailto:|data:|blob:)/i.test(path)) return path
  const cleanPath = path.replace(/^\.?\//, '')
  return `${import.meta.env.BASE_URL}${cleanPath}`
}

export async function loadJson<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(publicUrl(path)).then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${path}`)
        return response.json()
      }),
    )
  }
  return cache.get(path) as Promise<T>
}
