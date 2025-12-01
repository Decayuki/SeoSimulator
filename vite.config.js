import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Use root base path for Vercel; override with VITE_BASE_PATH for static hosting
  base: process.env.VITE_BASE_PATH || '/',
})
