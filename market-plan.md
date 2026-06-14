# Secure City RTCC Analytics Platform — Market Plan

**Version:** 1.0 — June 2026  
**Author:** Armando Gomez  
**Status:** Pre-launch — internal planning document

---

## Executive Summary

Law enforcement Real Time Crime Centers (RTCCs) have an accountability problem. Analysts process hundreds of LPR hits, agency-assist requests, and lookouts every month — but commanders have no real-time view of who is doing what, how the center is performing, or how to justify the RTCC's budget to city leadership.

Secure City RTCC Analytics Platform solves this by replacing manual Excel reporting with a role-based web dashboard that gives command staff center-wide KPIs, gives analysts visibility into their own performance, and gives administrators a searchable, exportable record of analyst activity — all through a browser, with no additional infrastructure.

---

## The Problem We Solve

### What agencies are doing today

- Analysts submit monthly reports via email or shared drives
- Supervisors compile those into Excel spreadsheets manually
- Command staff receive a summary PDF once a month — data is already 30 days old
- There is no way to view individual analyst performance mid-month
- There is no audit trail for who submitted what and when
- Justifying RTCC headcount and budget requires hours of manual data aggregation

### Why this hurts agencies

- Analyst underperformance goes undetected for an entire reporting cycle
- High performers have no visibility into how they rank against peers
- Commanders cannot answer "what did the RTCC do this week?" without digging through inboxes
- Budget requests are backed by anecdotal evidence, not clean data

---

## Target Market

### Primary: RTCCs in mid-size police departments (50,000–500,000 population)

These centers typically employ 4–12 analysts, operate 24/7 or extended hours, and have direct ties to patrol operations, investigations, and neighboring agencies. They have the volume to make dashboard data meaningful but lack the IT resources of large metro departments who build their own tools.

**Estimated universe:** 400–600 RTCC-equipped agencies in the United States (IACP / PERF estimate)

### Secondary: County sheriff RTCCs and regional intelligence centers

Multi-agency fusion centers often coordinate across multiple departments. A dashboard that tracks agency-assist metrics directly maps to their core mission.

### Tertiary: State-level intelligence centers (SAR/fusion centers)

Larger footprint, longer sales cycle, higher contract value.

---

## Customer Profiles

### The Decision Maker — RTCC Director / Records & Intelligence Commander

- Owns the RTCC budget and personnel
- Reports to a Deputy Chief or Sheriff
- Pain: can't show city council or the Chief a clean monthly ROI number
- Wants: a one-page weekly summary delivered to their inbox automatically
- Speaks: outcomes, clearance rates, cost-per-assist, analyst utilization

### The Champion — Senior RTCC Analyst / Shift Supervisor

- Uses the dashboard daily
- Pain: has to self-report monthly stats and knows the process is unreliable
- Wants: a live view of their own numbers and team ranking
- This person will sell it internally if it makes their job easier

### The Gatekeeper — City IT / Records Management

- Will ask about CJIS compliance, data storage, and access control
- Pain: not their budget, not their priority
- Wants: proof it won't create a security liability
- Needs: a one-pager on role-based access, no external data transmission, and audit logging

---

## Competitive Analysis

| Competitor | What it does | Price | Our advantage |
|---|---|---|---|
| **Esri ArcGIS** (Daily Activity Dashboard) | GIS-based crime mapping and hotspot visualization | $5k–$50k/yr license + GIS staff | No GIS license needed; focused on analyst performance, not geography |
| **Axon Records / Evidence.com** | Evidence management, body cam, RMS integration | Per-user SaaS, enterprise contracts | We're analyst-accountability focused, not evidence-chain focused |
| **PowerBI + manual feeds** | Generic BI tool cobbled onto SharePoint exports | IT hours + $10/user/mo | We're purpose-built for RTCC workflows; zero BI expertise needed |
| **Excel + email** | Current state for most agencies | Free but slow and error-prone | We replace the manual process entirely; same data, instant visibility |

### Our differentiator in one sentence

ArcGIS tells commanders *where* crime is happening. We tell commanders *how their team is performing* — which is the question that determines headcount, budget, and accountability.

---

## Go-To-Market Strategy

### Phase 1 — Local anchor (months 1–3)

**Target:** One RTCC in Laredo, TX or Webb County area.

- Leverage existing knowledge of local RTCC operations
- Offer a **free 90-day pilot** — no commitment, their data stays local
- Goal: get a letter of support and one real dataset to prove the product works on live data
- Deliverable: a case study with real before/after numbers (time to compile monthly report, analyst visibility score)

### Phase 2 — Regional expansion via referrals (months 4–9)

- Border Patrol / CBP-adjacent RTCCs in South Texas
- Texas DPS fusion centers
- Target conferences: **IACP Annual Conference**, **NATIA (National Technical Investigators Association)**, **HIDTA Program conferences**
- Lead with the case study — agencies trust peer agencies more than vendors

### Phase 3 — Grant-backed national rollout (months 10–18)

- Apply as a COPS-funded approved vendor / align with SEARCH Group recommendations
- Position the platform as the implementation layer for the COPS *Designing an Effective LE Data Dashboard* framework
- Target agencies that have COPS Office grants in the current funding cycle

---

## Pricing Model

### Option A — SaaS Subscription (recommended)

| Tier | Price | What's included |
|---|---|---|
| **Starter** | $500/month | 1 agency, up to 10 analysts, standard dashboard |
| **Command** | $1,200/month | 1 agency, unlimited analysts, scheduled PDF exports, alert thresholds |
| **Multi-Agency** | $2,500/month | Up to 5 agencies on one instance, comparative reporting, dedicated support |

Annual commitment: 10% discount. COPS grant-compatible invoicing available.

### Option B — On-Premises License

- $25,000 one-time setup + $5,000/year maintenance
- Agency hosts on their own server or city cloud instance
- Source code delivery option available for larger contracts ($50k)
- Preferred by agencies with strict CJIS air-gap requirements

### Option C — Pilot → Convert

- 90 days free
- Convert to Starter or Command at pilot end
- No data lost — subscription activates on the same instance

---

## Sales Playbook

### The pitch (30 seconds)

> "We replace your monthly Excel reporting process with a live dashboard. Your analysts submit their stats in under 2 minutes. Your commanders see real-time KPIs without waiting for end-of-month reports. No GIS license, no IT project — it runs in a browser."

### Discovery questions

1. How does your center currently track analyst activity each month?
2. How long does it take a supervisor to compile the monthly report?
3. Can you tell me right now which analyst ran the most LPR hits this week?
4. When the Chief asks for an RTCC ROI report, what does that process look like?
5. Have you looked at COPS grant funding for technology improvements this cycle?

### Objections and responses

| Objection | Response |
|---|---|
| "We already have a system" | "What does it take to pull last month's analyst performance breakdown?" |
| "IT won't approve it" | "All data stays on your network. The only thing external is the browser that loads it. We have a one-page CJIS compliance summary." |
| "We don't have budget" | "A 90-day pilot costs nothing. We find the budget conversation is easier after you have real numbers in front of leadership." |
| "We're not ready" | "The pilot doesn't require any integration. Analysts enter their own stats — same as they do today, just into a form instead of an email." |

---

## Pilot Program Design

### What the agency gets

- Full platform access for 90 days
- Onboarding call (1 hour) — we set up accounts and walk the supervisor through the admin view
- 2 check-in calls at day 30 and day 60
- Export of all data at pilot end regardless of conversion

### What we need from the agency

- 1 supervisor to be the internal champion
- Analysts to submit monthly stats through the platform instead of email (10 minutes/month per analyst)
- Feedback at day 30 on what's missing

### Success criteria

- Supervisor uses the admin view at least once a week
- At least 80% of analysts submit at least one report during the pilot
- Supervisor can answer "who was the top LPR analyst this month" without opening Excel

---

## Funding Angles

### COPS Office Technology Grants

The Bureau of Justice Assistance (BJA) and COPS Office fund law enforcement technology annually. The COPS Office published a framework in 2023 specifically for law enforcement data dashboards (SEARCH Group / PERF). Positioning Secure City as the implementation tool for that framework makes grant applications straightforward.

**Action:** Register on SAM.gov as a vendor; monitor grants.gov for COPS / BJA technology solicitations.

### HIDTA Program

High Intensity Drug Trafficking Areas programs fund multi-agency coordination tools. Our agency-assist tracking view maps directly to HIDTA reporting requirements.

### State-Level Criminal Justice Grants

Most states have a criminal justice planning office that passes through federal funds. Texas has the Governor's Office of Criminal Justice Policy (CJD). These often have smaller, faster application cycles than federal direct awards.

---

## Success Metrics

| Metric | Target (12 months) |
|---|---|
| Signed pilots | 5 |
| Conversions from pilot | 3 |
| Monthly recurring revenue | $4,500 |
| Net Promoter Score (supervisor) | 8+ |
| Avg time to compile monthly report (before vs. after) | Reduce by 80% |

---

## Immediate Next Steps

1. **Add CSV/Excel import** so the platform can ingest existing analyst data without manual re-entry
2. **Add automated PDF export** so command staff receive a weekly summary by email
3. **Write a 1-page CJIS summary** covering role-based access, no external data transmission, and audit logging
4. **Write a ConOps template** agencies can fill out to spec their own implementation (COPS framework requirement)
5. **Identify 1 local agency contact** for the first pilot conversation
6. **Register on SAM.gov** to be eligible for federal grant-funded procurement
