# Changelog

All notable changes to the Secure City RTCC Analytics Platform, tracked by development phase. Dates use YYYY-MM-DD.

## [1.8.0] — 2026-06-14 — Back / Forward Navigation

### Added
- **Back / Forward buttons** in `TopNav` — `‹` and `›` sit left of the page title and step through each role's ordered view sequence: admin (overview → analysts), analyst (mystats → submit), architect (authflow → components → dataflow → cicd → techstack). Buttons disable automatically at sequence boundaries.
- Purple role badge for the `architect` role in `TopNav`

### Changed
- `TopNav` now receives four new props: `canGoBack`, `canGoForward`, `onBack`, `onForward`
- `App.tsx` computes the view sequence per role and derives back/forward state from `currentIndex`

---

## [1.7.0] — 2026-06-14 — Analyst Personal Charts

### Added
- **Monthly LPR trend line chart** on the analyst My Performance view — 6-month personal trend extracted from the shared `monthlyLprByAnalyst` dataset
- **Team ranking bar chart** — shows all 5 analysts ranked by LPR hits so the analyst can see where they stand
- **Rank badge** — displays the analyst's position (#1–#5) alongside their status
- Parallel data fetch in `AnalystDashboard` using `Promise.all` to load personal stats, monthly trend, and team ranking in one go
- Recharts mock added to `AnalystDashboard.test.tsx` to prevent `ResizeObserver` errors in jsdom

### Fixed
- `index.html` entry point updated from `main.jsx` → `main.tsx`
- `vite.config.js` base path scoped to `NODE_ENV === 'production'` so local dev serves from `/` instead of the Pages subpath (fixes white-page on local dev)

---

## [1.6.0] — 2026-06-14 — System Architect Demo Account

### Added
- **`architect` role** added to the `Role` union type in `types.ts`
- **`demo` / `Demo2026` account** (`role: architect`, `name: 'System Architect'`) in `mockData.ts` and `credentials` map
- **`ArchitectView.tsx`** — new component with 5 interactive sections navigable via the sidebar:
  - **Auth Flow** — 4 annotated code snippets (handleSubmit → api.login → App.handleLogin → useEffect fetch) with step badges and security design decisions
  - **Component Tree** — visual hierarchy of every component with role gates and one-line responsibilities
  - **Data Flow** — 4-column pipeline diagram (mockData → mockApi → useEffect → DOM) plus full API surface table (8 functions, return types, consumers)
  - **CI/CD Pipeline** — 4-stage visual with actual workflow YAML excerpt
  - **Tech Stack** — 8 technology cards each with "why chosen" and "how it's used here"
- **Login demo panel** updated: architect account card with purple role badge; selected-state uses `border-purple-500/60`
- **`Sidebar.tsx`** updated: `architectItems` array with 5 nav entries (Auth Flow, Component Tree, Data Flow, CI/CD Pipeline, Tech Stack)
- **`App.tsx`** updated: 5 new `ViewId` values, 5 new `viewTitles` entries, architect branch in `handleLogin` routing

---

## [1.5.0] — 2026-06-13 — TypeScript Migration & Login Redesign

### Added
- **Full TypeScript migration**: all `.jsx` / `.js` source files renamed to `.tsx` / `.ts`
- **`src/types.ts`** — shared interfaces (`User`, `AnalystStat`, `OverviewStats`, `MonthlyLprEntry`, `AgencyEntry`, `DailyAlertEntry`, `ReportForm`, `SubmissionResult`) and the `Role` / `AnalystStatus` union types used by every component and test
- **`src/vite-env.d.ts`** — `/// <reference types="vite/client" />` so CSS imports are typed
- **`tsconfig.json`** — strict TypeScript config: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noEmit`, `moduleResolution: "bundler"`, `"types": ["vitest/globals"]` (avoids importing `vi`/`describe` separately in every test)
- **`src/components/SkeletonCard.tsx`** — animated pulse placeholder card matching `StatCard` layout; shown while API data is in flight
- **Login redesign** (`Login.tsx`) — split-panel layout:
  - Left: existing login form (functionally unchanged)
  - Right: demo panel with 3 clickable account cards that auto-fill credentials, a 4-step system flow diagram (fn name · file · one-sentence description), a role-routing visual, and a tech stack badge row
- **Passwords separated from `User` type**: moved from inline on user objects into a separate `credentials: Record<string, string>` export — TypeScript's type system now makes it structurally impossible to surface a password on a returned `User` object

### Changed
- `mockApi.ts` `login()` now looks up credentials via the separate map; `ESLint` config updated to add a TypeScript-specific block (`@typescript-eslint/parser`, `no-unused-vars: 'off'`, `no-undef: 'off'`)
- All tests updated to `.tsx` with proper TypeScript types on fixtures, helpers, and mock stubs
- Login test: "My Performance" text in the role-routing visual renamed to "Personal Stats" to avoid false-positive match in the logout test

---

## [1.4.0] — 2026-06-13 — UX Polish & Coverage

### Added
- **Skeleton loaders**: animated pulse placeholder cards replace plain "Loading…" text in both AdminDashboard and AnalystDashboard while API data is in flight
- **Analyst table search**: live text filter on the Admin → Analyst Activity view — filters by analyst name or status; shows an empty-state message when no rows match
- **Form validation**: `AnalystDashboard` submission form now validates on submit (required, non-negative integer, per-field maximum); inline red error messages appear under failing fields; border turns red on error; error clears as the user corrects the field; `noValidate` on the form so the browser doesn't fight the custom messages
- **AdminDashboard test suite** (`src/components/AdminDashboard.test.jsx`): 5 tests covering KPI cards, chart headings, full analyst table render, name filter, and filter-clear
- **AnalystDashboard validation tests**: 2 additional tests — empty-form required errors (×5) and max-exceeded error

### Changed
- `formFields` array extended with `max` per field (LPR Hits: 9,999; all others: 999)
- Total test count: **12 → 19** across **3 → 4** test files

## [1.3.0] — 2026-06-11 — Quality Engineering

### Added
- **Test suite**: 12 tests across 3 suites with Vitest + React Testing Library
  - Login: credential rejection, password stripping, case-insensitive usernames
  - App: role-based routing, analyst data scoping, logout flow (Recharts mocked for jsdom)
  - AnalystDashboard: form rendering, submission confirmation, post-submit reset
- **ESLint** flat config (`eslint.config.js`): recommended rules + react-hooks + react-refresh, with `eslint-config-prettier` layered last
- **Prettier** config (`.prettierrc.json`) and `format`/`format:check` scripts
- **CI quality gate**: lint + tests now run as a `quality` job that must pass before `build` and `deploy`; pipeline also runs on pull requests (without deploying)
- **README**: CI/live-demo/tech badges, screenshots section, Testing & Code Quality and CI/CD Pipeline documentation, Development Progress table
- **CHANGELOG.md** (this file) to track progress by phase
- `vitest.config.js` kept separate from `vite.config.js` (tests don't need the Tailwind plugin or the Pages base path)

### Changed
- Form labels now use `htmlFor`/`id` pairing in Login and the analyst submission form — accessible to screen readers and queryable in tests via `getByLabelText`

## [1.2.0] — 2026-06-11 — GitHub Pages Deployment

### Added
- GitHub Actions workflow (`.github/workflows/deploy.yml`) building and publishing `dist/` to GitHub Pages on every push to `main`
- Live site: https://armandosnhu.github.io/Secure_City_PD_RTCC_Dashboard/

### Changed
- Vite `base` set to `/Secure_City_PD_RTCC_Dashboard/` so built asset URLs resolve under the Pages project subpath

### Fixed
- Initial Pages setup served raw source (branch-deploy mode); switched the Pages source to GitHub Actions so the built bundle is served instead

## [1.1.0] — 2026-06-11 — Documentation

### Added
- Comprehensive README: tech-stack rationale, file-by-file breakdown, auth/data-flow diagrams, design system, backend migration path
- Header docblocks and inline comments across every source file explaining design decisions (password stripping, role-derived routing, Recharts data shapes, controlled forms, parallel fetching)

## [1.0.0] — 2026-06-11 — Initial Release

### Added
- React 18 + Vite + Tailwind CSS 4 + Recharts dashboard
- Role-based authentication (1 admin, 5 analysts) through a mock REST API with simulated latency and password stripping
- Admin dashboard: 4 KPI cards, 6-month grouped bar chart (LPR hits per analyst), agency-breakdown pie chart (Sheriff/DPS/Constable/FBI/DEA/CBP), daily-alerts line chart, analyst activity table with status pills
- Analyst dashboard: personal KPI cards and a monthly submission form (LPR Hits, LPR Lookouts, Federal/Local/Intel requests) with confirmation banner
- Dark command-center theme (navy `#0a1628` + electric blue `#00d4ff`), shield logo SVG, responsive layout
