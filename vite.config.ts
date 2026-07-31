import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://bensb1931-hub.github.io/yan/
export default defineConfig({
  base: '/yan/',
  plugins: [react()],
})
