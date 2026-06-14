/**
 * Vitest configuration — kept separate from vite.config.js on purpose:
 * tests don't need the Tailwind plugin or the GitHub Pages base path, and
 * Vitest prefers this file automatically when it exists.
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',      // simulated DOM so components can render in Node
    globals: true,             // describe/it/expect available without imports
    setupFiles: './src/test/setup.js',
    css: false,                // styles are irrelevant to behavior tests — skip for speed
  },
})
