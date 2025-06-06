# KillrVideo – Go-Live Plan

**Document Version:** 0.1  **Date:** <!-- will be filled automatically by Git commit timestamp -->

---

## 1. Purpose

This document captures the **baseline assessment** of the existing React codebase (`killrvideo-react-loveable`) and defines the **work plan** required to bring the application to production, fully backed by the APIs exposed in `docs/openapi.json` and the business capabilities enumerated in *KillrVideo 2025 Functional Specification*.

It is intended for engineers, designers, QA, DevOps and project stakeholders who will break the plan into executable work items (stories / tickets).

---

## 2. Current Front-End Architecture Snapshot

| Layer | Technology / Library | Notes |
|-------|----------------------|-------|
| Build tool | **Vite** (TypeScript) | Fast local HMR; config in `vite.config.ts` |
| UI Layer | **React 18** + **TypeScript** | Function components, hooks |
| Routing  | **react-router-dom v6** | Declared in `src/App.tsx` |
| State / Server cache | **@tanstack/react-query** | Data-fetching hooks in `src/hooks/useApi.ts` |
| Styling  | **Tailwind CSS v3** + **Shadcn/Radix** component wrappers | Centralised config in `tailwind.config.ts` |
| Icons | **lucide-react** |
| Testing (present) | _None_ | Needs unit & E2E coverage |

### 2.1 Directory Overview (abridged)

```
src/
 ├─ components/
 │   ├─ layout/           ← global `Header`, `Layout`
 │   ├─ home/             ← landing page sections
 │   ├─ video/            ← `VideoCard` thumbnail component
 │   └─ ui/               ← generated Shadcn UI primitives
 ├─ hooks/                ← `useApi`, `useAuth`, helpers
 ├─ lib/                  ← `api.ts` (custom REST client), `utils.ts`
 ├─ pages/                ← route-level components (`Home`, `Watch`, ...)
 ├─ types/                ← domain & API typings
 ├─ index.html / main.tsx / App.tsx
```

### 2.2 Implemented Routes & Screens

| Path | Screen | Status | Data source |
|------|--------|--------|-------------|
| `/` | Home (Hero, Featured, Stats) | UI mock only | Hard-coded sample arrays |
| `/watch/:id` | Video watch page | UI mock only | Hard-coded `videoData`, `relatedVideos` |
| `/creator` | Creator dashboard (upload & analytics) | Partially wired – *assumes* working `/videos` API | Relies on `useApi.*` (stub) |
| `/auth` | Sign-in / Sign-up | Mutation hooks exist, targets `/users/*` endpoints | Stub |
| `*` | 404 | Complete | – |

> **Observation:** The front-end client (`src/lib/api.ts`) references endpoints that are **all defined** in `docs/killrvideo_openapi.yaml`. Integration work is therefore wiring the UI to these endpoints, adding auth token handling and robust error paths—no contract gaps.

---

## 3. Backend API (OpenAPI 3.0.3) Quick Inventory

The authoritative contract is stored in `docs/killrvideo_openapi.yaml` and already conforms to the KillrVideo domain.  Key resource groups:

* **Users** – `POST /users/register`, `POST /users/login`, `GET/PUT /users/me`
* **Videos** – `POST /videos`, `GET /videos/{id}`, `PUT /videos/{id}`, `GET /videos/latest`, `GET /videos/by-tag/{tag}`, `GET /users/{userId}/videos`, `POST /videos/{id}/view`, `GET /videos/{id}/status`
* **Comments** – `POST /videos/{id}/comments`, `GET /videos/{id}/comments`, `GET /users/{userId}/comments`
* **Ratings** – `POST /videos/{id}/ratings`, `GET /videos/{id}/ratings`
* **Search** – `GET /search/videos`, `GET /tags/suggest`
* **Recommendations** – `GET /videos/{id}/related`, `GET /recommendations/foryou`, `POST /reco/ingest`
* **Moderation** – Flagging endpoints (`/videos/{id}/flags`, `/moderation/*`) and moderator role assignment

Security scheme: **bearerAuth** (HTTP Bearer JWT).

> The endpoints above are mirrored in `src/lib/api.ts`; therefore, no structural mismatch exists. Work focuses on type-safe SDK generation and hooking up UI interactions.

---

## 4. Functional Requirement Coverage Matrix

| FR-ID | Feature | Front-end status | Back-end status (per OpenAPI) |
|-------|---------|-----------------|------------------------------|
| **FR-AM-001/002/003** | Register / Login / Profile Edit | Screens exist; wiring required | Defined in OpenAPI – needs backend integration |
| **FR-VC-001/002** | Submit YouTube URL, auto-thumbnail | Creator upload form present; needs mutation hook | Defined in OpenAPI – needs backend integration |
| **FR-VC-003/004/005** | Latest list, tag browse, user videos | Catalogue pages missing; implement list grids | Defined in OpenAPI – needs backend integration |
| **FR-SE-001/002** | Keyword search & tag autocomplete | Search bars exist; result page missing | Defined in OpenAPI – needs backend integration |
| **FR-CM-001..004** | Comments w/ sentiment badges | UI scaffolding; hooks missing | Defined in OpenAPI – needs backend integration |
| **FR-RA-001..003** | Rating system | Star UI; mutation and queries missing | Defined in OpenAPI – needs backend integration |
| **FR-RC-001/002** | Recommendations (related & personalised) | Stubs; carousel wiring needed | Defined in OpenAPI – needs backend integration |
| **FR-PS-001** | View counter | Mutation stubbed | Defined in OpenAPI – needs backend integration |
| **FR-MO-001..005** | Flagging & moderation console | Flag button; moderation UI not built | Defined in OpenAPI – needs backend integration |
| **NFR-PE/SE/US** | Performance, Security, Docs | No CI/CD, env validation, docs stubs | N/A |

---

## 5. Go-Live Work Plan

The project will proceed in **four parallel work-streams**.  Each work-stream can be decomposed into GitHub epics & issues.

### 5.1 API Contract & SDK Generation (Backend ←→ Frontend)

1. **Confirm domain model** with backend team.
   *If* the backend is replacing `inventory` with `video` endpoints, deliver updated `openapi.json`.
2. **Generate typed SDK** from OpenAPI using `openapi-typescript-codegen` (or `openapi-generator-cli`).
   - Output to `src/api/generated`.
   - Configure \/auth token injection via custom `HttpClient` wrapper.
3. **Deprecate `src/lib/api.ts`** in favour of generated client.
4. **Refactor React Query hooks** (`src/hooks/useApi.ts`) to consume generated methods – one hook per endpoint.
5. Implement **error boundary** & global toast handler for API errors (`HTTPValidationError`, 401, 500).
6. **Validate** that `docs/killrvideo_openapi.yaml` matches the running backend implementation; update if necessary.

### 5.2 Feature Completion – UI & State

| Sprint | Deliverable | Key Tasks |
|--------|-------------|-----------|
| S-1 | **Authentication flows** | Build `/auth` pages w/ SDK calls, persist JWT, implement `PrivateRoute` wrapper, refresh-token logic. |
| S-2 | **Creator flow** | Wire `POST /videos` mutation, poll processing job status, show video list with filters; start drag-drop reorder, edit metadata modal. |
| S-3 | **Viewer catalogue** | Build `/videos/latest`, `/videos/:tag`, `/user/:id/videos` list pages using `VideoCard` grid component; infinite scroll with React Query. |
| S-4 | **Watch page integrations** | Fetch video detail, comments, ratings; implement optimistic comment posting, star rating; call `POST /view` on mount. |
| S-5 | **Search & Autocomplete** | Create `/search` result page; integrate Algolia-like suggestions; connect to `/search/videos` endpoint. |
| S-6 | **Recommendations** | Consume `/videos/{id}/related` and `/recommendations/foryou`; show carousels. |
| S-7 | **Moderation console** | New route `/moderation`; list flags, masked reasons; RBAC guard – only roles `moderator` & `admin`; action dialogs (unmask, dismiss, remove). |
| S-8 | **Accessibility & i18n** | Audit Tailwind colour contrast, add `@react-aria/focus`, extract strings to JSON for future locales. |

### 5.3 Quality Engineering

* **Unit tests:** Jest + React Testing Library for components & hooks; enforce ≥80% coverage gate.
* **E2E tests:** Cypress covering critical journeys (watch video, rate, comment, upload video, moderator flag flow).
* **Performance:** Lighthouse CI action; target TTI < 2.5 s on median desktop.
* **Security:** ESLint security plugin, dependency audit (Snyk / npm audit), helmet headers via reverse proxy.

### 5.4 DevOps / Infrastructure

1. **Environment parity:** `.env.example` for VITE_ variables (API base URL, Auth audience, etc.).
2. **CI/CD:** GitHub Actions
   - Lint → Test → Build → Preview deploy (Vercel / Netlify) on PRs.
3. **Static asset optimisation:** Use `vite-plugin-imagemin`, `react-18` streaming SSR for future.
4. **Monitoring:** Add Sentry browser SDK, Google Analytics events (views, sign-ups).*Optional in v1.*
5. **Release versioning:** Semantic Release generating changelog & Git tags.

---

## 6. Known Defects & Technical Debt

* **Mock data throughout:** Replace with live queries.
* **Route leak:** No 401 guard – unauthenticated users can open Creator screen.
* **Global style colocation:** `index.css` mixes utility tweaks with component styles; extract to component scopes where possible.
* **Large Shadcn bundle:** Tree-shake unused primitives; enable `vite-plugin-inspect` to verify.

---

## 7. Milestone Timeline (Proposed)

| Week | Focus | Exit Criteria |
|------|-------|---------------|
| 1 | API contract finalised & SDK scaffold | Type-safe client generated, basic health check call works in dev env |
| 2 | Auth + profile | Users can register, login, logout; JWT stored; protected route scheme validated |
| 3 | Creator upload MVP | Upload form hits backend, job status polling, creator list refresh |
| 4 | Watch page wired | Real data renders, views increment, comments CRUD functional |
| 5 | Search & catalogue pages | Keyword search returns results, tag browse lists videos |
| 6 | Recommendations + Rating | Personalised lists & star rating saved |
| 7 | Moderation console | Moderator can view & action flags, RBAC enforced |
| 8 | QA hardening & launch readiness | >90% pass rate on E2E suite; Lighthouse >90 perf; zero high-sev issues |

*(Exact dates subject to resource allocation.)*

---

## 8. Open Questions / Decisions Needed

1. Will the existing Inventory endpoints coexist with new Video endpoints, or will they be repurposed?
2. Who owns JWT issuance – the backend service itself or external IdP (OIDC)?
3. Target hosting platform for front-end (Vercel, Cloudflare Pages, S3 + CloudFront, …)?
4. Analytics & consent requirements? (GDPR compliance)

---

## 9. Appendix – Suggested Ticket Breakdown

> To be imported into Jira / GitHub Projects after stakeholder review.

1. **FE-SDK-GEN** Generate SDK from OpenAPI, wire auth header
2. **FE-AUTH-PAGES** Implement Auth flows & route guards
3. **FE-UPLOAD-FLOW** Creator upload + status poll
4. **FE-WATCH-DATA** Integrate Watch page endpoints
5. **FE-SEARCH-PAGE** Search results grid & API integration
6. **FE-RECO-CAROUSEL** Related & personalised carousels
7. **FE-MOD-DASH** Moderation dashboard & RBAC guard
8. **FE-TEST-UNIT** Add Jest + RTL baseline tests
9. **FE-TEST-E2E** Add Cypress suite for key flows
10. **FE-CI-PIPELINE** Set up GitHub Actions build/test/deploy
11. **FE-A11Y-PASS** Accessibility audit & fixes

---

*End of document* 