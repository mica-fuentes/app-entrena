import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' para que funcione publicada en GitHub Pages (en cualquier subcarpeta)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { chunkSizeWarningLimit: 800 },
})
