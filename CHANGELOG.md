# Changelog

All notable changes to the Secure City RTCC Analytics Platform, tracked by development phase. Dates use YYYY-MM-DD.

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
