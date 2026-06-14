/**
 * ESLint flat config (ESLint 9+/10 format).
 *
 * Layers:
 *  1. eslint's recommended JS rules
 *  2. react-hooks rules (catches missing deps / conditional hooks)
 *  3. react-refresh rule (keeps components hot-reload safe)
 *  4. eslint-config-prettier LAST — disables any stylistic rule that would
 *     fight Prettier, so formatting is Prettier's job and ESLint only
 *     enforces correctness.
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default [
  // Never lint build output or dependencies
  { ignores: ['dist', 'node_modules', 'coverage'] },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error', // hooks only at top level / in components
      'react-hooks/exhaustive-deps': 'warn', // flag missing useEffect dependencies
      'react-refresh/only-export-components': 'warn',
      // Allow intentionally-unused vars when prefixed with _ (e.g. the
      // password stripped via destructuring in mockApi.js)
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },

  // Test files run in the Vitest environment — register its globals so
  // `describe`, `it`, `expect`, `vi` etc. don't trip no-undef.
  {
    files: ['**/*.test.{js,jsx}', 'src/test/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },

  // Must be last: turn off rules that conflict with Prettier formatting
  prettier,
]
