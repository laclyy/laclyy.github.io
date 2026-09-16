// Salvataggio dei contenuti senza backend: l'area /admin legge e scrive i JSON
// direttamente nel repository tramite le API di GitHub. Ogni salvataggio è un
// commit su main, che fa ripartire il deploy su GitHub Pages.

export const repo = { owner: 'laclyy', name: 'laclyy.github.io', branch: 'main' }

export const dataFiles = {
  videos: 'public/data/videos.json',
  profile: 'public/data/profile.json',
  socials: 'public/data/socials.json',
}

const tokenKey = 'lacly-admin-token'

export const tokenCreationUrl = `https://github.com/settings/personal-access-tokens/new?${new URLSearchParams({
  name: 'Admin sito lacly.art',
  description: 'Usato dalla pagina /admin del sito per salvare video e testi.',
  target_name: repo.owner,
  expires_in: '366',
  contents: 'write',
})}`

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(tokenKey) ?? sessionStorage.getItem(tokenKey)
  } catch {
    return null
  }
}

export function storeToken(token: string | null, remember = true) {
  try {
    localStorage.removeItem(tokenKey)
    sessionStorage.removeItem(tokenKey)
    if (token) (remember ? localStorage : sessionStorage).setItem(tokenKey, token)
  } catch {
    // Storage bloccato (navigazione privata): il token resta valido solo finché la pagina è aperta.
  }
}

export class GitHubError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

async function api<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      },
    })
  } catch {
    throw new GitHubError(0, 'Connessione non riuscita. Controlla internet e riprova.')
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new GitHubError(response.status, body?.message ?? response.statusText)
  }
  return response.json() as Promise<T>
}

/** Messaggio comprensibile per chi non conosce GitHub. */
export function describeError(error: unknown): string {
  if (!(error instanceof GitHubError)) return error instanceof Error ? error.message : 'Errore sconosciuto.'
  if (error.status === 0) return error.message
  if (error.status === 401) return 'Il token non è valido o è scaduto. Creane uno nuovo ed effettua di nuovo l’accesso.'
  if (error.status === 403 && /rate limit/i.test(error.message)) return 'GitHub ha ricevuto troppe richieste. Aspetta qualche minuto e riprova.'
  if (error.status === 403) return 'Il token non ha il permesso di modificare il sito. Serve “Contents: Read and write” sul repository laclyy.github.io.'
  if (error.status === 404) return `Il token non ha accesso al repository ${repo.owner}/${repo.name}. Quando lo crei, selezionalo in “Repository access”.`
  if (error.status === 409) return 'Il file è stato modificato nello stesso momento da un’altra parte. Riprova.'
  return `GitHub ha risposto con un errore (${error.status}): ${error.message}`
}

export async function verifyToken(token: string) {
  await api(token, '')
  await api(token, `/contents/${dataFiles.videos}?ref=${repo.branch}`)
}

interface ContentFile {
  sha: string
  content: string
  encoding: 'base64' | 'none'
}

export async function readJsonFile<T>(token: string, path: string): Promise<{ data: T; sha: string }> {
  const file = await api<ContentFile>(token, `/contents/${path}?ref=${repo.branch}`)
  // Sopra 1 MB l'endpoint contents non include il contenuto: lo si legge come blob.
  const content = file.encoding === 'none' ? (await api<ContentFile>(token, `/git/blobs/${file.sha}`)).content : file.content
  return { data: JSON.parse(decodeBase64(content)) as T, sha: file.sha }
}

/**
 * Rilegge sempre la versione più recente del file, applica la modifica e fa il commit.
 * Se nel frattempo il file è cambiato (409) riprova, così non si sovrascrivono modifiche altrui.
 */
export async function updateJsonFile<T>(token: string, path: string, change: (current: T) => T, message: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const { data, sha } = await readJsonFile<T>(token, path)
    const next = change(data)
    try {
      await api(token, `/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({ message, sha, branch: repo.branch, content: encodeBase64(`${JSON.stringify(next, null, 2)}\n`) }),
      })
      return next
    } catch (error) {
      if (attempt >= 2 || !(error instanceof GitHubError) || error.status !== 409) throw error
      await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)))
    }
  }
}

function decodeBase64(value: string): string {
  const binary = atob(value.replace(/\s/g, ''))
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}
