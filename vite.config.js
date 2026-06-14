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
  // GitHub Pages serves project sites from a subpath
  // (https://armandosnhu.github.io/Secure_City_PD_RTCC_Dashboard/), so all
  // built asset URLs must be prefixed with the repo name. Local dev is
  // unaffected — Vite still serves at http://localhost:5173/.
  base: process.env.NODE_ENV === 'production' ? '/Secure_City_PD_RTCC_Dashboard/' : '/',
  server: {
    port: 5174,
  },
  plugins: [
    react(),       // JSX transform + React Fast Refresh (hot reload that preserves state)
    tailwindcss(), // Tailwind CSS v4 first-party plugin (replaces the old PostCSS setup)
  ],
})
