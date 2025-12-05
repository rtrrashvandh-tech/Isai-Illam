import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"
import { copyFileSync } from 'fs'

// Copy _redirects to dist during build
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: 'copy-redirects',
      closeBundle: () => {
        try {
          copyFileSync('public/_redirects', 'dist/_redirects')
          console.log('Copied _redirects to dist/')
        } catch (e) {
          console.warn('Could not copy _redirects file:', e)
        }
      }
    }
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
}))
