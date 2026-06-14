import type React from 'react'

interface Props {
  activeView: string
}

// ── Shared primitives ──────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-slate-400 mt-1">{subtitle}</p>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-navy-light border border-navy-lighter rounded-xl p-5 ${className}`}>
      {children}
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-navy rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto border border-navy-lighter leading-relaxed whitespace-pre">
      {code}
    </pre>
  )
}

function Badge({ label, color }: { label: string; color: 'accent' | 'amber' | 'purple' | 'green' | 'red' }) {
  const colors = {
    accent: 'bg-accent/10 text-accent border-accent/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
  }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${colors[color]}`}>
      {label}
    </span>
  )
}

function Arrow({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <div className="flex justify-center my-1">
        <div className="flex flex-col items-center gap-0">
          <div className="w-px h-4 bg-navy-lighter" />
          <div className="text-navy-lighter text-xs leading-none">▼</div>
        </div>
      </div>
    )
  }
  return <span className="text-slate-600 text-lg font-light shrink-0">→</span>
}

// ── Section 1: Auth Flow ───────────────────────────────────────────────────────

const authSteps = [
  {
    num: '01',
    color: 'amber' as const,
    fn: 'handleSubmit()',
    file: 'Login.tsx',
    label: 'Form submission',
    desc: 'Prevents default, sets loading state, delegates to the API layer. Any thrown Error is caught and shown as an inline error message.',
    code: `const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    const user = await api.login(username, password)
    onLogin(user)          // hand off to App
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed.')
  } finally {
    setLoading(false)
  }
}`,
  },
  {
    num: '02',
    color: 'accent' as const,
    fn: 'api.login()',
    file: 'mockApi.ts',
    label: 'Credential validation',
    desc: 'Normalises the username to lowercase for case-insensitive matching. Looks up credentials from a separate map so the User type never carries a password field.',
    code: `async login(username: string, password: string): Promise<User> {
  await delay()           // simulates 300 ms network latency
  const normalised = username.trim().toLowerCase()
  const user = users.find((u) => u.username.toLowerCase() === normalised)
  const expectedPassword = user ? credentials[user.username] : undefined
  if (!user || expectedPassword !== password) {
    throw new Error('Invalid credentials. Access denied.')
  }
  return user             // safe — no password field on User type
}`,
  },
  {
    num: '03',
    color: 'purple' as const,
    fn: 'App.handleLogin()',
    file: 'App.tsx',
    label: 'Role-based routing',
    desc: 'Stores the safe user object in React state. Branches on role to set the correct initial view — ensuring each role lands on the right screen.',
    code: `const handleLogin = (loggedInUser: User) => {
  setUser(loggedInUser)
  if (loggedInUser.role === 'admin')     setActiveView('overview')
  else if (loggedInUser.role === 'architect') setActiveView('authflow')
  else                                   setActiveView('mystats')
}`,
  },
  {
    num: '04',
    color: 'green' as const,
    fn: 'useEffect fetch',
    file: 'AdminDashboard.tsx / AnalystDashboard.tsx',
    label: 'Parallel data loading',
    desc: 'On mount the dashboard fires all API calls in parallel with Promise.all. Each resolves into its own state slice so partial data can render incrementally.',
    code: `useEffect(() => {
  Promise.all([
    api.getOverviewStats(),
    api.getAnalystStats(),
    api.getMonthlyLprByAnalyst(),
    api.getAgencyBreakdown(),
    api.getDailyAlerts(),
  ]).then(([stats, analysts, monthly, agencies, alerts]) => {
    setStats(stats)
    setAnalysts(analysts)
    setMonthlyData(monthly)
    setAgencyData(agencies)
    setAlertData(alerts)
  })
}, [])`,
  },
]

function AuthFlowSection() {
  return (
    <div>
      <SectionHeader
        title="Authentication Flow"
        subtitle="Step-by-step walkthrough of what happens when a user clicks Secure Login"
      />

      <div className="space-y-0 max-w-3xl">
        {authSteps.map((step, i) => (
          <div key={step.num}>
            <Card>
              <div className="flex gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    step.color === 'amber'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : step.color === 'accent'
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : step.color === 'purple'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <code className="text-accent text-sm font-mono font-semibold">{step.fn}</code>
                    <span className="text-slate-600 text-xs font-mono">{step.file}</span>
                    <Badge label={step.label} color={step.color} />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">{step.desc}</p>
                  <CodeBlock code={step.code} />
                </div>
              </div>
            </Card>
            {i < authSteps.length - 1 && <Arrow vertical />}
          </div>
        ))}
      </div>

      <div className="mt-8 max-w-3xl">
        <Card>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Security design decisions</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Type-safe separation', body: 'passwords live in credentials: Record<string,string> — the User interface has no password field, making it structurally impossible to leak one.' },
              { title: 'Case-insensitive login', body: 'username.trim().toLowerCase() so "Maria Santos", "maria santos", and "MARIA SANTOS" all resolve to the same account.' },
              { title: 'Single error message', body: 'Invalid credentials for both wrong username and wrong password — deliberately avoids confirming whether a username exists.' },
            ].map((item) => (
              <div key={item.title} className="bg-navy rounded-lg p-3 border border-navy-lighter">
                <p className="text-xs font-semibold text-accent mb-1">{item.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── Section 2: Component Tree ──────────────────────────────────────────────────

interface TreeNode {
  name: string
  file?: string
  desc: string
  badge?: { label: string; color: 'accent' | 'amber' | 'purple' | 'green' | 'red' }
  children?: TreeNode[]
}

const componentTree: TreeNode[] = [
  {
    name: 'App',
    file: 'App.tsx',
    desc: 'Root — owns user state, activeView state, and role-based routing',
    children: [
      {
        name: 'Login',
        file: 'Login.tsx',
        desc: 'Shown when user is null — split-panel demo screen',
        badge: { label: 'unauthenticated', color: 'red' },
      },
      {
        name: 'Sidebar',
        file: 'Sidebar.tsx',
        desc: 'Left nav — role-aware item list, logout button',
      },
      {
        name: 'TopNav',
        file: 'TopNav.tsx',
        desc: 'Header bar — current view title, user badge',
      },
      {
        name: 'AdminDashboard',
        file: 'AdminDashboard.tsx',
        desc: 'role: admin — KPI cards, 3 charts, analyst table',
        badge: { label: 'admin only', color: 'amber' },
        children: [
          { name: 'SkeletonCard ×4', file: 'SkeletonCard.tsx', desc: 'Animated pulse placeholders shown while stats === null' },
          { name: 'StatCard ×4', file: 'StatCard.tsx', desc: 'KPI tile with icon, value, label' },
          { name: 'BarChart', file: 'recharts', desc: 'Monthly LPR hits per analyst — 6 months of data' },
          { name: 'PieChart', file: 'recharts', desc: 'Agency breakdown — 6 agencies' },
          { name: 'LineChart', file: 'recharts', desc: 'Daily alerts trend — 30 days' },
        ],
      },
      {
        name: 'AnalystDashboard',
        file: 'AnalystDashboard.tsx',
        desc: 'role: analyst — personal KPI cards, monthly submission form',
        badge: { label: 'analyst only', color: 'accent' },
        children: [
          { name: 'SkeletonCard ×4', file: 'SkeletonCard.tsx', desc: 'Loading placeholders for personal KPIs' },
          { name: 'StatCard ×4', file: 'StatCard.tsx', desc: 'Own LPR hits, agencies, lookouts, submissions' },
          { name: 'ReportForm', file: 'inline', desc: 'noValidate form — 5 fields with custom JS validation and per-field max' },
        ],
      },
      {
        name: 'ArchitectView',
        file: 'ArchitectView.tsx',
        desc: 'role: architect — this interactive tour (you are here)',
        badge: { label: 'architect only', color: 'purple' },
      },
    ],
  },
]

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const indent = depth * 24
  return (
    <>
      <div className="flex items-start gap-3 py-2.5 border-b border-navy-lighter/40 last:border-0"
        style={{ paddingLeft: `${indent}px` }}>
        <div className="w-5 h-5 rounded bg-navy-lighter/60 flex items-center justify-center shrink-0 mt-0.5 text-xs">
          {depth === 0 ? '⚛' : node.children ? '📁' : '◻'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{node.name}</span>
            {node.file && (
              <code className="text-xs text-slate-500 font-mono">{node.file}</code>
            )}
            {node.badge && <Badge label={node.badge.label} color={node.badge.color} />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{node.desc}</p>
        </div>
      </div>
      {node.children?.map((child) => (
        <TreeRow key={child.name} node={child} depth={depth + 1} />
      ))}
    </>
  )
}

function ComponentTreeSection() {
  return (
    <div>
      <SectionHeader
        title="Component Tree"
        subtitle="Every component in the app — what it renders, which role can see it, and why it exists"
      />

      <div className="max-w-3xl">
        <Card>
          {componentTree.map((node) => (
            <TreeRow key={node.name} node={node} depth={0} />
          ))}
        </Card>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Components', value: '10', sub: 'React files' },
            { label: 'Role gates', value: '3', sub: 'admin · analyst · architect' },
            { label: 'Shared', value: '2', sub: 'StatCard · SkeletonCard' },
            { label: 'Views', value: '9', sub: 'total navigable screens' },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <p className="text-2xl font-bold text-accent">{s.value}</p>
              <p className="text-xs font-semibold text-white mt-1">{s.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section 3: Data Flow ───────────────────────────────────────────────────────

const dataLayers = [
  {
    label: 'mockData.ts',
    sublabel: 'Source of truth',
    color: 'amber' as const,
    items: ['users[]', 'credentials{}', 'analystStats[]', 'overviewStats', 'monthlyLprByAnalyst[]', 'agencyBreakdown[]', 'dailyAlerts[]'],
  },
  {
    label: 'mockApi.ts',
    sublabel: 'Async layer (300 ms delay)',
    color: 'accent' as const,
    items: ['api.login()', 'getOverviewStats()', 'getAnalystStats()', 'getAnalystById()', 'getMonthlyLprByAnalyst()', 'getAgencyBreakdown()', 'getDailyAlerts()', 'submitMonthlyReport()'],
  },
  {
    label: 'Components',
    sublabel: 'useEffect on mount',
    color: 'purple' as const,
    items: ['AdminDashboard → Promise.all', 'AnalystDashboard → parallel calls', 'Each call → own useState slice', 'null state → SkeletonCard shown'],
  },
  {
    label: 'JSX / DOM',
    sublabel: 'Re-render on state update',
    color: 'green' as const,
    items: ['StatCard receives typed props', 'Recharts receives typed data[]', 'Table rows from filteredAnalysts', 'Skeleton unmounts when loaded'],
  },
]

function DataFlowSection() {
  return (
    <div>
      <SectionHeader
        title="Data Flow"
        subtitle="How raw data travels from static exports through the async API layer into React state and finally the DOM"
      />

      <div className="flex flex-col xl:flex-row items-start gap-3 mb-8">
        {dataLayers.map((layer, i) => (
          <div key={layer.label} className="flex xl:flex-row flex-col items-center gap-3 flex-1 w-full">
            <div className="flex-1 w-full">
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Badge label={layer.label} color={layer.color} />
                </div>
                <p className="text-xs text-slate-500 mb-3">{layer.sublabel}</p>
                <ul className="space-y-1">
                  {layer.items.map((item) => (
                    <li key={item} className="text-xs font-mono text-slate-400 flex items-start gap-1.5">
                      <span className="text-navy-lighter mt-0.5 shrink-0">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            {i < dataLayers.length - 1 && (
              <div className="shrink-0 xl:rotate-0 rotate-90 text-slate-600 text-2xl font-light">→</div>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-3xl">
        <Card>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            API surface — function → consumer → what it returns
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-lighter">
                  <th className="text-left text-slate-500 pb-2 font-semibold">Function</th>
                  <th className="text-left text-slate-500 pb-2 font-semibold">Returns</th>
                  <th className="text-left text-slate-500 pb-2 font-semibold">Consumer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-lighter/50">
                {[
                  { fn: 'api.login()', ret: 'Promise<User>', consumer: 'Login.tsx → App.tsx' },
                  { fn: 'getOverviewStats()', ret: 'Promise<OverviewStats>', consumer: 'AdminDashboard' },
                  { fn: 'getAnalystStats()', ret: 'Promise<AnalystStat[]>', consumer: 'AdminDashboard' },
                  { fn: 'getAnalystById(id)', ret: 'Promise<AnalystStat | undefined>', consumer: 'AnalystDashboard' },
                  { fn: 'getMonthlyLprByAnalyst()', ret: 'Promise<MonthlyLprEntry[]>', consumer: 'AdminDashboard BarChart' },
                  { fn: 'getAgencyBreakdown()', ret: 'Promise<AgencyEntry[]>', consumer: 'AdminDashboard PieChart' },
                  { fn: 'getDailyAlerts()', ret: 'Promise<DailyAlertEntry[]>', consumer: 'AdminDashboard LineChart' },
                  { fn: 'submitMonthlyReport()', ret: 'Promise<SubmissionResult>', consumer: 'AnalystDashboard form' },
                ].map((row) => (
                  <tr key={row.fn}>
                    <td className="py-2 font-mono text-accent">{row.fn}</td>
                    <td className="py-2 font-mono text-emerald-400">{row.ret}</td>
                    <td className="py-2 text-slate-400">{row.consumer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── Section 4: CI/CD ───────────────────────────────────────────────────────────

const pipelineStages = [
  {
    num: '1',
    label: 'Trigger',
    color: 'amber' as const,
    icon: '⚡',
    title: 'git push → main',
    file: '.github/workflows/deploy.yml',
    steps: [
      'Any push to main branch triggers the workflow',
      'Pull requests targeting main also run the quality gate',
      'Uses ubuntu-latest runner on GitHub-hosted infra',
    ],
  },
  {
    num: '2',
    label: 'Quality Gate',
    color: 'red' as const,
    icon: '🔍',
    title: 'Lint · TypeCheck · Test',
    file: 'quality-gate job',
    steps: [
      'npm run lint — ESLint flat config + @typescript-eslint/parser',
      'npx tsc --noEmit — strict TypeScript, no implicit any',
      'npm run test — Vitest, 19 tests across 4 suites',
      'Build job is blocked until all three pass',
    ],
  },
  {
    num: '3',
    label: 'Build',
    color: 'purple' as const,
    icon: '🔨',
    title: 'Vite production build',
    file: 'build job',
    steps: [
      'npm run build — Vite 5 bundles and tree-shakes',
      'Outputs optimised assets to /dist',
      'Sets base: "/Secure_City_PD_RTCC_Dashboard/" for GitHub Pages',
      'Uploads /dist as a GitHub Actions artifact',
    ],
  },
  {
    num: '4',
    label: 'Deploy',
    color: 'green' as const,
    icon: '🚀',
    title: 'GitHub Pages',
    file: 'deploy job',
    steps: [
      'peaceiris/actions-gh-pages publishes /dist',
      'Pushes to gh-pages branch automatically',
      'Live at github.io/Secure_City_PD_RTCC_Dashboard/',
      'Zero-downtime — old version serves until new one is ready',
    ],
  },
]

function CiCdSection() {
  return (
    <div>
      <SectionHeader
        title="CI/CD Pipeline"
        subtitle="Every push to main automatically lints, type-checks, tests, builds, and deploys — no manual steps"
      />

      <div className="flex flex-col items-center gap-0 max-w-2xl mb-8">
        {pipelineStages.map((stage, i) => (
          <div key={stage.num} className="w-full">
            <Card>
              <div className="flex gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${
                    stage.color === 'amber'
                      ? 'bg-amber-500/15 border border-amber-500/30'
                      : stage.color === 'red'
                        ? 'bg-red-500/15 border border-red-500/30'
                        : stage.color === 'purple'
                          ? 'bg-purple-500/15 border border-purple-500/30'
                          : 'bg-emerald-500/15 border border-emerald-500/30'
                  }`}
                >
                  {stage.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-white">{stage.title}</span>
                    <Badge label={stage.label} color={stage.color} />
                    <code className="text-xs text-slate-600 font-mono">{stage.file}</code>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {stage.steps.map((s) => (
                      <li key={s} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-navy-lighter mt-0.5 shrink-0">▸</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
            {i < pipelineStages.length - 1 && <Arrow vertical />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        <Card>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Workflow YAML structure</p>
          <CodeBlock code={`name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run test

  build:
    needs: quality-gate        # blocked until gate passes
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3

  deploy:
    needs: build
    environment: github-pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4`} />
        </Card>
      </div>
    </div>
  )
}

// ── Section 5: Tech Stack ──────────────────────────────────────────────────────

const technologies = [
  {
    name: 'React 18',
    version: 'v18.3',
    category: 'UI',
    color: 'accent' as const,
    why: 'Hooks-based functional components throughout — useState, useEffect, no class components.',
    how: 'Renders the entire app. Role-based conditional rendering gates which dashboard mounts.',
  },
  {
    name: 'TypeScript',
    version: 'v5.x',
    category: 'Language',
    color: 'accent' as const,
    why: 'strict mode + noUnusedLocals + noUnusedParameters eliminates whole classes of runtime bugs at compile time.',
    how: 'Shared types in types.ts flow through every file. Passwords are structurally excluded from the User interface.',
  },
  {
    name: 'Vite 5',
    version: 'v5.x',
    category: 'Build',
    color: 'amber' as const,
    why: 'Sub-second HMR during development. Production build tree-shakes and code-splits for fast page loads.',
    how: 'base path configured for GitHub Pages sub-directory. Outputs ESM bundles with content hashes.',
  },
  {
    name: 'Tailwind CSS 4',
    version: 'v4.x',
    category: 'Styling',
    color: 'accent' as const,
    why: 'Utility-first means zero dead CSS in the bundle. Custom @theme tokens (navy, accent) create consistent design language.',
    how: '@theme block in index.css defines navy, navy-light, navy-lighter, and accent as CSS custom properties used everywhere.',
  },
  {
    name: 'Recharts',
    version: 'v2.x',
    category: 'Charts',
    color: 'purple' as const,
    why: 'Composable, declarative API that works naturally with React state. WCAG accessible via sr-only data tables.',
    how: 'BarChart (monthly LPR), PieChart (agency breakdown), LineChart (daily alerts). Each chart has an aria-hidden wrapper and a screen-reader data table.',
  },
  {
    name: 'Vitest + RTL',
    version: 'v2.x / v16.x',
    category: 'Testing',
    color: 'green' as const,
    why: 'Vitest runs in the same Vite pipeline so imports and path aliases just work. RTL tests behaviour, not implementation.',
    how: '19 tests across 4 suites. Tests cover login validation, role routing, form errors, table filtering, and CSV export.',
  },
  {
    name: 'ESLint (flat config)',
    version: 'v9.x',
    category: 'Quality',
    color: 'amber' as const,
    why: 'New flat config format (eslint.config.js) is simpler than legacy .eslintrc and supports per-file overrides natively.',
    how: 'Separate config blocks for JS/JSX, TS/TSX, and test files. @typescript-eslint/parser handles generics in TSX.',
  },
  {
    name: 'GitHub Actions',
    version: 'v4 actions',
    category: 'CI/CD',
    color: 'purple' as const,
    why: 'Zero-cost for public repos. Native GitHub Pages deployment with artifact-based pipeline.',
    how: '3-stage workflow: quality-gate → build → deploy. Build only runs when lint + tsc + test all pass.',
  },
]

function TechStackSection() {
  return (
    <div>
      <SectionHeader
        title="Tech Stack"
        subtitle="Every technology in the project — the version, why it was chosen, and exactly how it's used"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {technologies.map((tech) => (
          <Card key={tech.name}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">{tech.name}</h3>
                  <code className="text-xs text-slate-600 font-mono">{tech.version}</code>
                </div>
                <Badge label={tech.category} color={tech.color} />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Why chosen</p>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.why}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">How it's used here</p>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.how}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Tests passing', value: '19 / 19', color: 'text-emerald-400' },
          { label: 'TypeScript errors', value: '0', color: 'text-emerald-400' },
          { label: 'ESLint warnings', value: '0', color: 'text-emerald-400' },
          { label: 'Bundle target', value: 'ESM / GitHub Pages', color: 'text-accent' },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function ArchitectView({ activeView }: Props) {
  return (
    <main className="p-6 overflow-auto">
      {activeView === 'authflow' && <AuthFlowSection />}
      {activeView === 'components' && <ComponentTreeSection />}
      {activeView === 'dataflow' && <DataFlowSection />}
      {activeView === 'cicd' && <CiCdSection />}
      {activeView === 'techstack' && <TechStackSection />}
    </main>
  )
}
