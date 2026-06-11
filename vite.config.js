/**
 * Vite configuration.
 *
 * Vite was chosen over Create React App (deprecated) and Webpack because it
 * gives near-instant dev server startup and hot module replacement with
 * almost zero configuration.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),       // JSX transform + React Fast Refresh (hot reload that preserves state)
    tailwindcss(), // Tailwind CSS v4 first-party plugin (replaces the old PostCSS setup)
  ],
})
