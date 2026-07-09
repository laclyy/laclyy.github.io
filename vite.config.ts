import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // User site GitHub Pages + custom domain: serve asset da root.
  base: '/',
})
