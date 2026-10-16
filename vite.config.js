import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/cv',
    // three.js is its own lazily loaded chunk (see App.tsx), so its size does not block first paint
    chunkSizeWarningLimit: 600,
  },
})
