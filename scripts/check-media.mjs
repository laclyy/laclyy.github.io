import { rolldown } from 'rolldown'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const temp = await mkdtemp(join(tmpdir(), 'lacly-media-check-'))
try {
  const bundle = await rolldown({
    input: fileURLToPath(new URL('./media-checks.tsx', import.meta.url)),
    platform: 'node',
    external: (id) => id.startsWith('node:'),
    transform: { jsx: { runtime: 'automatic' }, define: { 'import.meta.env.BASE_URL': JSON.stringify('/') } },
  })
  const output = join(temp, 'checks.mjs')
  await bundle.write({ file: output, format: 'esm' })
  await bundle.close()
  await import(pathToFileURL(output).href)
} finally {
  if (resolve(dirname(temp)) !== resolve(tmpdir())) throw new Error('Unexpected temporary check directory')
  await rm(temp, { recursive: true, force: true })
}
