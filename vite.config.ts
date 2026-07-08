import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Il path relativo funziona sia su dominio personalizzato sia in /nome-repository/.
  base: './',
})
