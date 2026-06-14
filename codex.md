# Secure City RTCC Analytics Platform — Product Codex

**Version:** 1.8.0 — June 2026  
**Author:** Armando Gomez  
**Purpose:** Master reference document — what this product is, what every piece does, and where everything lives

---

## What This Product Is

A role-based analytics dashboard for Real Time Crime Centers (RTCCs). It gives command staff a live view of center-wide KPIs, gives analysts visibility into their own performance, and replaces manual Excel-based monthly reporting with a 2-minute web form submission.

**What it is not:** a crime mapping tool, an evidence management system, a CAD/RMS replacement, or a real-time dispatch system.

---

## The Three Roles

| Role | Username | What they see | First view |
|---|---|---|---|
| **Admin** | `admin` | Center-wide KPIs, all analyst stats, bar/pie/line charts, searchable analyst table, CSV export | Command Overview |
| **Analyst** | `Maria Santos`, `James Rivera`, etc. | Their own KPIs only, personal LPR trend, team ranking (anonymized), monthly submission form | My Performance |
| **Architect** | `demo` | Interactive 5-section technical tour of how the app is built | Auth Flow |

Role is assigned at login by the API and never changes during a session. An analyst cannot navigate to admin views — the sidebar does not render those items, and the view router ignores unauthorized view IDs.

---

## Core Features

### Admin — Command Overview

- 4 KPI stat cards: Total LPR Hits, Agencies Assisted, Active Analysts, Alerts Generated
- Grouped bar chart: Monthly LPR hits per analyst (last 6 months)
- Pie chart: Agency breakdown by assist percentage
- Line chart: Daily alert trend for current month
- All charts have `aria-hidden` wrappers with `sr-only` data tables for accessibility

### Admin — Analyst Activity

- Sortable table with all analysts: name, submissions, LPR hits, lookouts, agencies helped, status
- Live search filter (name or status)
- CSV export of current filtered view with datestamped filename
- Active/inactive status badges

### Analyst — My Performance

- 4 personal KPI cards: My LPR Hits, My Submissions, Top Agency Assisted, My Lookouts
- Rank badge showing their position vs. the team (e.g., "#2 of 5")
- Personal LPR trend line chart (last 6 months)
- Team ranking bar chart (anonymized except self)
- Submit Monthly Stats form

### Analyst — Submit Stats

- Form fields: month selector, LPR hits, LPR lookouts, agency assists, notes
- Controlled inputs with validation
- Confirmation state on submit

### Architect — 5-section technical tour

1. **Auth Flow** — 4 annotated steps with real code snippets showing the full login pipeline
2. **Component Tree** — visual hierarchy of every component with render notes
3. **Data Flow** — 4-layer pipeline diagram (UI → hooks → API → mock data) + API surface table
4. **CI/CD Pipeline** — 4-stage GitHub Actions visual + full workflow YAML
5. **Tech Stack** — 8 technology cards with "why chosen" and "how it's used here"

---

## Navigation System

### Back / Forward buttons (TopNav)

Each role has a defined view sequence:

```
admin:    overview → analysts
analyst:  mystats  → submit
architect: authflow → components → dataflow → cicd → techstack
```

The `‹` and `›` buttons in TopNav step through this sequence. At the first or last view, the respective button is disabled (opacity 25%, cursor not-allowed).

### Sidebar navigation

Nav items are role-specific — admin sees overview/analysts, analyst sees mystats/submit, architect sees the 5 tour sections. Active item gets a neon-blue left border and subtle glow. The logo is a clickable button that returns to the role's home view.

---

## File Structure

```
src/
├── main.tsx                   Entry point — renders <App />
├── App.tsx                    Root state: user, activeView, navigation logic
├── types.ts                   Shared types: User, Role, ViewId, all data types
├── index.css                  Global CSS + Tailwind v4 @theme tokens + neon keyframes
│
├── api/
│   └── mockApi.ts             All async API functions — replace this file to connect a real backend
│
├── data/
│   └── mockData.ts            Seed data: users, credentials, chart data, CHART_COLORS
│
└── components/
    ├── ShieldLogo.tsx          Inline SVG shield badge with optional neon-pulse glow
    ├── StatCard.tsx            KPI card with label, value, icon, neon hover glow
    ├── SkeletonCard.tsx        Loading placeholder matching StatCard dimensions
    ├── Login.tsx               Login form + demo account panel + system flow diagram
    ├── Sidebar.tsx             Role-specific nav + logo home button
    ├── TopNav.tsx              Header with back/forward buttons, title, user badge
    ├── AdminDashboard.tsx      Overview + Analysts views for admin role
    ├── AnalystDashboard.tsx    My Performance + Submit views for analyst role
    └── ArchitectView.tsx       5-section technical tour for architect role
```

---

## API Surface

All functions in `src/api/mockApi.ts`. Return a `Promise<T>` with simulated 400–900ms latency. Swapping in real endpoints requires only editing this file.

| Function | Returns | Used by |
|---|---|---|
| `api.login(username, password)` | `User` (no password field) | Login.tsx |
| `api.getOverviewStats()` | `OverviewStats` | AdminDashboard.tsx |
| `api.getAnalystStats()` | `AnalystStat[]` | AdminDashboard.tsx |
| `api.getMonthlyLprByAnalyst()` | `MonthlyLprEntry[]` | AdminDashboard.tsx, AnalystDashboard.tsx |
| `api.getAgencyBreakdown()` | `AgencyEntry[]` | AdminDashboard.tsx |
| `api.getDailyAlerts()` | `DailyAlertEntry[]` | AdminDashboard.tsx |
| `api.getAnalystById(id)` | `AnalystStat` | AnalystDashboard.tsx |
| `api.getAnalystRanking()` | `TeamRankEntry[]` | AnalystDashboard.tsx |

---

## Data Types

Defined in `src/types.ts`:

```typescript
type Role = 'admin' | 'analyst' | 'architect'

interface User {
  id: number
  username: string
  name: string
  role: Role
  // password intentionally excluded — API strips it before returning
}

interface OverviewStats {
  totalLprHits: number
  agenciesAssisted: number
  activeAnalysts: number
  alertsGenerated: number
}

interface AnalystStat {
  id: number
  name: string
  submissions: number
  lprHits: number
  lookouts: number
  agencies: number
  status: 'Active' | 'Inactive'
}

interface MonthlyLprEntry { month: string; [analystName: string]: number | string }
interface AgencyEntry     { name: string; value: number }
interface DailyAlertEntry { day: number; alerts: number }
interface TeamRankEntry   { name: string; hits: number }
```

---

## Design System

### Color palette

| Token | Hex | Used for |
|---|---|---|
| `navy` | `#0a1628` | Page background |
| `navy-light` | `#112240` | Cards, sidebar, top nav |
| `navy-lighter` | `#1a2f52` | Borders, gridlines, hover states |
| `accent` | `#00d4ff` | Electric blue — logo, KPIs, buttons, active nav |

Defined in `src/index.css` under `@theme {}`. Tailwind v4 auto-generates all utility classes from these variables.

### Neon effects

- `.neon-logo` — `neon-pulse` keyframe (drop-shadow oscillation, 3s, infinite) — applied to ShieldLogo when `glow` prop is true
- `.neon-border` — `border-glow` keyframe (box-shadow oscillation, 4s, infinite) — applied to the login card
- Inline Tailwind arbitrary values for one-off glows: `shadow-[0_0_20px_rgba(0,212,255,0.25)]`

### Role color coding

| Role | Color | Used in |
|---|---|---|
| Admin | Amber (`amber-400`) | Badge, demo account border, sidebar |
| Analyst | Accent/cyan (`accent`) | Badge, demo account border, sidebar |
| Architect | Purple (`purple-400`) | Badge, demo account border, sidebar |

---

## Security Design

### Password handling

Credentials live in `src/data/mockData.ts` — a separate `credentials` map keyed by username. The `User` interface has no password field. `api.login()` validates the credential map and returns a `User` object with the password structurally excluded before it is ever stored in React state.

### Role enforcement

- The `user.role` value set at login never changes during the session
- The Sidebar renders only the nav items for that role
- `App.tsx` ignores any `setActiveView` call for a `ViewId` that doesn't belong to the current role's sequence

### No external transmission

All data is generated in `mockData.ts` and served from `mockApi.ts`. Nothing leaves the browser. There are no fetch calls to external endpoints in the current version.

### Audit-ready design

The mock API is structured so that adding a real backend with audit logging (who accessed what and when) is a one-file change (`mockApi.ts`). Every data access goes through the API layer — there are no direct data reads in components.

---

## Testing

19 tests across 3 files — run with `npm test`.

| File | What it covers |
|---|---|
| `src/App.test.tsx` | Login → dashboard routing for all 3 roles; logout; role isolation |
| `src/components/Login.test.tsx` | Credential rejection; auto-fill; loading state; error display |
| `src/components/AnalystDashboard.test.tsx` | Data scoping (analyst sees only own data); stat cards; recharts render |

Test setup: Vitest + React Testing Library + jsdom. Recharts is mocked to avoid ResizeObserver errors in jsdom.

---

## CI/CD Pipeline

4 stages in `.github/workflows/deploy.yml`:

1. **Lint** — `npm run lint` (ESLint flat config)
2. **Type check** — `npx tsc --noEmit`
3. **Tests** — `npm test -- --run` (all 19 tests must pass)
4. **Build + Deploy** — `npm run build` → GitHub Pages

Stages 1–3 run in parallel on pull requests. Stage 4 only runs on push to `main`. No deploy happens if any quality gate fails.

---

## Deployment

### Current: GitHub Pages

Live at: `https://armandosnhu.github.io/Secure_City_PD_RTCC_Dashboard/`

Base path is scoped to production only in `vite.config.js`:
```javascript
base: process.env.NODE_ENV === 'production' ? '/Secure_City_PD_RTCC_Dashboard/' : '/'
```

### For agency deployment

The build output is a static folder (`dist/`) — a directory of HTML/CSS/JS files with no server-side runtime. It can be hosted on:

- Any web server (Apache, Nginx)
- Cloud storage with static hosting (AWS S3 + CloudFront, Azure Static Web Apps)
- An agency's existing intranet web server
- A Raspberry Pi on a private network (low-cost air-gap option)

---

## Product Roadmap

### Near-term (next milestone)

- [ ] CSV / Excel import — let admin upload real analyst data; removes dependency on manual form entry
- [ ] Alert threshold notifications — notify supervisor when an analyst drops below a set threshold
- [ ] Scheduled PDF export — weekly summary delivered by email to command staff
- [ ] Shift / daily view — not just monthly; yesterday's numbers available at shift start

### Medium-term

- [ ] Real API backend (Node.js / Supabase) — replace mockApi.ts with real endpoints
- [ ] Audit log view — every login and data change, timestamped, exportable
- [ ] Multi-agency instance — one deployment serving multiple departments with data isolation
- [ ] Goal tracking — set monthly targets per analyst; show % toward goal with status indicators

### Long-term

- [ ] CAD/RMS integration hooks — documented endpoints so agencies can push data from their records systems
- [ ] Map / hotspot view — geographic LPR hit density (differentiates from ArcGIS by combining analyst accountability with geographic context)
- [ ] CJIS-compliant cloud hosting option — SOC 2 + CJIS audit trail for agencies that require it
- [ ] Mobile responsive view — supervisor can check dashboard from a phone during shift

---

## Known Limitations (Current Version)

- All data is mock / seeded — no real backend, no real persistence
- The submit form does not actually persist data between sessions
- No authentication tokens or session management — auth state lives only in React state (page refresh = logout)
- No email notifications — PDF export and threshold alerts are roadmap items
- Not CJIS-certified in current form — pending real backend + audit log implementation
- Recharts `ResizeObserver` requires a jsdom polyfill in tests (handled in test setup via vi.mock)

---

*This document should be updated at each version release. Cross-reference CHANGELOG.md for version history.*
