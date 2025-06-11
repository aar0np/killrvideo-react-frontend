# KillrVideo – Responsive Baseline Audit

**Date:** <!-- TODO: update -->

This document captures the current state of the KillrVideo-React frontend with respect to responsive design.  It is meant to be a living checklist that we will update as the migration progresses.

---
## 1. Viewport meta-tag

| File | Line | Status |
|------|------|--------|
| `index.html` | 6 | ✅  Already contains `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` |

No change required.

---
## 2. Pages / Components that need attention

Below is a first pass created by grepping the codebase for fixed pixel widths (`w-[NNpx]`, `max-w-*`, etc.) and hard-coded absolute positioning.  Each item links to the relevant source file so it is easy to open in an editor.

| Area | Potential Issue | File(s) |
|------|-----------------|---------|
| **Global root** | *Legacy Vite template* applies `#root { max-width: 1280px; padding: 2rem; }` which can introduce horizontal scroll on ≤ 320 px screens.  Likely unused but should be deleted. | `src/App.css` |
| **Sidebar** | Uses CSS variables `--sidebar-width(=16rem)` / `--sidebar-width-mobile(=18rem)` which translate to 256 / 288 px.  Behaviour is adaptive but still worth QA on < 360 px mobile. | `src/components/ui/sidebar.tsx` |
| **Select / Popover / Menu components** | Tailwind classes like `min-w-[8rem]`, `md:max-w-[420px]` could overflow very narrow viewports if placed inside constrained parents. | `src/components/ui/{select,context-menu,dropdown-menu,menubar,toast}.tsx` |
| **Trending page** | Hard-coded `w-48` (192 px) select dropdown plus absolute badge container; needs testing at 320 px. | `src/pages/Trending.tsx` |
| **Flag/Moderation/UserManagement pages** | Containers use `max-w-4xl/6xl` (64–72 rem).  Fine for desktop but should fallback gracefully. | `src/pages/{FlagDetail,Moderation,UserManagement}.tsx` |
| **Hero / NotFound decorative triangles** | Several absolutely-positioned triangles may spill outside the viewport and trigger side-scroll on small screens. | `src/components/home/HeroSection.tsx`, `src/pages/NotFound.tsx` |
| **Toast container** | `w-full` on mobile, but `md:max-w-[420px]` at larger breakpoints—OK but verify no global overflow. | `src/components/ui/toast.tsx` |
| **StarRating / misc. icons** | Uses inline `w-[${size}px]` sizing – generally safe. | various |

> **Next action:** Mark any items that *actually* cause overflow in your manual QA sessions and move them to the "Must-fix" list below.

---
## 3. Manual QA matrix

| Breakpoint | Home | Watch | Creator | Trending | Moderation | Notes |
|------------|------|-------|---------|----------|-----------|-------|
| 320 × 568 (iPhone SE) | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 390 × 844 (iPhone 14) | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 412 × 915  (Pixel 7)  | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 820 × 1180 (iPad)     | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 1024×768              | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 1440×900              | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 1920×1080             | ☐ | ☐ | ☐ | ☐ | ☐ | |

Use Chrome DevTools → "Responsive mode" or the Lighthouse CLI to fill this grid.  Any page that shows a horizontal scrollbar (**Indicators:** `document.documentElement.scrollWidth > window.innerWidth`, or visible bar) should be filed as a bug and linked here.

---
## 4. Must-fix list (to be filled after manual run)

- [ ] …

---
## 5. Nice-to-have / follow-ups

- Add a `npm run audit:responsive` script that runs `lighthouse` in mobile emulation and exports a JSON/HTML report.
- Introduce Stylelint rule to flag `px` widths outside media queries.
- Replace legacy `src/App.css` with Tailwind utilities or delete if unused.

---

_This file should evolve as we proceed through the roadmap.  Once all items in **Section 4** are checked off we can close Stage 1._ 