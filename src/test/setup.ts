/**
 * Test environment setup — runs once before every test file.
 * Registers jest-dom's extra matchers (toBeInTheDocument, toBeDisabled,
 * toHaveTextContent, ...) on Vitest's expect.
 */
import '@testing-library/jest-dom/vitest'
