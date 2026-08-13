# Project Architecture — epic-script-astro

Describes the EXISTING project as verified by code inspection. FACT = directly verified in code. INFERENCE = reasonable conclusion not directly confirmed. UNKNOWN = cannot be determined from this repo.

## What this project is

A telehealth/pharmacy intake and e-commerce marketing site ("EpiqScripts" / Thrivewellrx theme) built with Astro, currently in **static prototype/UI-shell stage** — INFERENCE. Page names (`cart`, `login`, `registration`, `my-order`, `payment-method`, `assessment-*`, `qa-*`) describe a full intake → assessment → checkout → order-tracking funnel, but no backend, API, or data layer exists in this repo (FACT).

## Repository layout

| Path | Purpose |
|---|---|
| `src/pages/` | 65 Astro routes, flat structure, no dynamic `[slug]` routes (FACT) |
| `src/components/` | 26 root components + `common/`, `homePage/`, `shimmerUI/` subfolders |
| `src/layouts/Layout.astro` | Single shared layout used by all but one page |
| `public/Themes/Thrivewellrx.Theme.EpiqScripts/` | Purchased/legacy theme assets: SCSS source, compiled CSS, fonts, icons, images, vendor JS (jQuery, Bootstrap, Swiper, AOS, Moment, bootstrap-datetimepicker) |
| `EmailTemplates/` | ~27 standalone HTML email templates, not wired into the Astro app — not imported anywhere from `src/` |
| `pdf/lab-requisition.html` | Standalone HTML, likely a PDF-generation source for a separate system |
| `UI/` | Design reference screenshots (mockups, not code) |
| `.claude/` | Claude Code config + this documentation set |
| `graphify-out/` | Generated knowledge-graph artifacts (build output, not source) |

## Rendering model

- **Output mode: `static`** (`astro.config.mjs:7`) — pure SSG, FACT.
- No adapter configured — no deploy target wired in (FACT).
- No integrations array at all — zero framework/UI integrations (FACT).
- No `src/pages/api/`, no server endpoints, no middleware (FACT).
- No content collections (`src/content/` does not exist) (FACT).
- No dynamic routes anywhere (FACT).
- `build.format: "file"` → routes emit as `route.html`, not `route/index.html` (FACT).
- `compressHTML: false` → HTML output is not minified (FACT).

## Astro usage pattern

- Every page (except one outlier) imports `src/layouts/Layout.astro` and passes only an optional `bodyClass` prop — the layout has no `title`/`description`/head-injection mechanism (FACT). Every page therefore renders the identical `<title>Astro Basics</title>` (FACT — see `seo-performance.md`).
- `src/pages/assessment-blood.astro` does **not** use `Layout.astro` — it hand-rolls its own `<html>/<head>` and duplicates the vendor CSS/JS stack inline, plus contains 11 inline `<script>` blocks. Likely an unmigrated prototype page (INFERENCE).
- Zero Astro client directives (`client:load`, `client:visible`, etc.) exist anywhere (FACT) — consistent with zero UI-framework components (no React/Vue/Svelte/Solid files exist in `src/`, FACT). All interactivity is plain jQuery via inline `<script>` blocks or the global vendor bundle loaded in `Layout.astro`.
- No component uses Astro's scoped `<style>` blocks (0 of 111 files) — all styling comes from the single global compiled `style.css` (FACT; see `ui-ux-conventions.md`).

## Data / API architecture

- **No HTTP client usage anywhere** in `src/` — no `fetch`, `axios`, `import.meta.env`, `process.env` (FACT).
- **No environment variables, `.env` files, or API base URL configuration exist** (FACT).
- All page/component content (products, orders, testimonials, FAQ) is hardcoded static markup (FACT).
- The only client-side "logic" found is cosmetic: a jQuery click handler in `payment-method.astro` that does `window.location.href = '/thank-you'` (no real submission), and dead Knockout-style `data-bind="click:..."` attributes on `login.astro` buttons with no Knockout runtime loaded (FACT: attributes exist; INFERENCE: they are non-functional leftovers).
- **UNKNOWN**: a real backend for cart/login/orders/payment almost certainly exists for the live product, but it lives outside this repository — do not assume any API shape when building against this codebase; ask before wiring up real data fetching.

## Routing map (representative — see full audit for all 65 routes)

| Route file | Layout | Notes |
|---|---|---|
| `index.astro` | Layout | Homepage: hero, category grid, digital pharmacy section, testimonials, rapid contact |
| `assessment-*.astro` (14 files) | Layout | First-generation intake quiz flow |
| `qa-*.astro` (7 files) | Layout | Second, structurally parallel intake quiz flow — likely supersedes or duplicates `assessment-*` (INFERENCE, confirm with team before removing either) |
| `category-*.astro` (8 files) | Layout | Product category listings, all use `ProductSingle` in a loop |
| `cart.astro`, `payment-method.astro`, `payment-method2.astro`, `shipping-state-selection.astro` | Layout | Checkout flow |
| `my-order.astro`, `my-order-pharm.astro`, `my-profile.astro`, `my-table.astro`, `order-details.astro`, `order-confirmation.astro` | Layout | Post-purchase account/order views |
| `login.astro`, `registration.astro`, `forgot-password.astro`, `reset-password.astro` | Layout | Auth pages (no backend wired) |
| `upload-drivers-licence.astro`, `document-upload.astro` | Layout | Identity/document intake |
| `about.astro` / `about-us.astro`, `thank-you.astro` / `thank-you-2.astro`, `payment-method.astro` / `payment-method2.astro`, `upload-drivers-licence.astro` / `upload-drivers-licence-backup.astro` | Layout | **Duplicate page pairs** — see Known Duplicates below |
| `shimmerUI.astro` | Layout | Internal loading-skeleton style-guide/demo page, not a real user route (INFERENCE) |
| `404.astro` | Layout | Error page |

## Known duplicate / legacy pages (do not treat as inconsequential — confirm intent before deleting)

- `upload-drivers-licence-backup.astro` vs `upload-drivers-licence.astro` — filename says "backup"; backup lacks the `FileUpload` import the live page has.
- `thank-you-2.astro` vs `thank-you.astro` — `payment-method.astro` redirects to `/thank-you`, not `/thank-you-2`, suggesting `thank-you.astro` is live.
- `payment-method2.astro` vs `payment-method.astro` — the submit-handler script in `payment-method2.astro` is commented out (dead), while the identical script in `payment-method.astro` is live.
- `about.astro` vs `about-us.astro` — same import set, likely duplicate content (not body-diffed).
- `assessment-*` vs `qa-*` — two parallel quiz flows with overlapping purpose and shared component set (`AssesmentHeader`/`AssesmentFooter`/`CommonAction`).

See `project-decisions.md` for how to handle these.

## Dependency map (high level)

```
Pages (src/pages/*.astro)
  → Layout.astro (shared, all but 1 page)
    → global vendor CSS/JS (jQuery, Bootstrap 5.3.3, Swiper, AOS, Moment, cropperjs, vanillajs-datepicker)
    → global compiled style.css (from public/Themes/.../scss/, compiled by standalone `sass` CLI, NOT via Astro/Vite)
  → Components (src/components/**, no props/data flow beyond hardcoded content)
  → (no Utilities layer, no Data/API layer, no External services — none exist in this repo)
```

- **No circular dependencies found** (INFERENCE — no import cycles surfaced by any research pass; codebase is largely one-way page→component with almost no cross-component imports).
- **Tightly coupled area**: styling is 100% global (no scoped styles), so any SCSS partial change can affect unrelated pages — see `ui-ux-conventions.md`.
- **Reusable modules**: `Header.astro`, `Footer.astro`, `CommonAction.astro`, `AssesmentHeader.astro`/`AssesmentFooter.astro`, `ProductSingle.astro` are the only components used across many pages. Nearly everything else is page-specific, hardcoded, or orphaned (see `coding-conventions.md`).

## Tooling maturity (FACT)

- No tests, no lint config (ESLint/Prettier/Biome), no `.env` handling, no CI config found anywhere in the repo.
- Two lockfiles coexist (`package-lock.json` and `pnpm-lock.yaml`) with no `packageManager` field to disambiguate — pick one and remove the other before adding new dependencies (see `project-decisions.md`).
- `postcss-purgecss` is a devDependency but is not wired into `postcss.config.cjs` — appears unused.

## Unknowns

- Real backend/API shape, authentication mechanism, and payment processor — not present in this repo.
- Whether `assessment-*` or `qa-*` is the intended live quiz flow.
- Whether `about.astro` or `about-us.astro` is canonical.
- Node/Astro version pin — no `engines` field in `package.json`.