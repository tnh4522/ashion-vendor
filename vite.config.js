import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'static/dist/',
    manifest: "manifest.json",
    rollupOptions: {
      input: [
        'src/App.jsx',
      ]
    }
  }
})
