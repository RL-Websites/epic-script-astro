# SEO & Performance — epic-script-astro

Documents the EXISTING SEO and performance posture. All items below are gaps in the current codebase, not recommendations to fix immediately — surface them to the user before acting, per the impact-before-changing rule in the root `CLAUDE.md`.

## SEO — current state (FACT)

- **`Layout.astro` has no SEO mechanism at all**: no `title`/`description` prop, `<title>` is hardcoded to the literal `"Astro Basics"` (the unedited Astro template default), no `<meta name="description">`, no canonical link, no `<meta name="robots">`, no Open Graph tags, no Twitter card tags, no JSON-LD structured data.
- **Every one of the ~65 pages renders the identical `<title>Astro Basics</title>`** — none pass a title prop because the Layout doesn't accept one. This is the single biggest SEO gap in the project.
- **No sitemap and no robots.txt** — no `@astrojs/sitemap` integration, no static `sitemap.xml`/`robots.txt` in `public/`.
- `<html lang="en">` is present (good). Viewport is set via two separate `<meta name="viewport">` tags instead of one combined tag — functional but unusual.
- Heading hierarchy is inconsistent: `about.astro` has no `<h1>` at all (starts at `<h2>`); `index.astro` has two `<h1>` tags in its hero section.
- Image alt text quality is poor in places (see `ui-ux-conventions.md` — `ProductCard.astro`'s generic `alt="Product"`, `CategoryCard.astro`'s empty `alt=""` on content images) — this also hurts image-search SEO.

**If asked to improve SEO**: the correct first step is adding `title`/`description` props to `Layout.astro`'s `Props` interface and threading them from each page — do this deliberately and confirm scope with the user first, since it touches every page file.

## Performance — current state (FACT)

- **No Astro image optimization anywhere** — 116 plain `<img>` tags across 29 files, zero `astro:assets`/`<Image>`/`<Picture>` usage. No automatic responsive `srcset` or lazy-loading from the framework.
- **Full vendor JS/CSS stack loads globally on every page** via `Layout.astro`, regardless of whether that page needs it: jQuery 3.3.1, Bootstrap 5.3.3 bundle, Moment.js, Swiper bundle, cropperjs (CDN), vanillajs-datepicker (CDN), plus local `aos.js`/`slider.js`/`datepicker.js`/`main.js` — all `defer`, but all shipped unconditionally. A privacy-policy or FAQ page loads the same JS payload as a page that actually uses a datepicker or image cropper.
- `src/pages/assessment-blood.astro` duplicates the entire vendor `<head>`/`<script>` stack inline instead of using `Layout.astro` — a maintenance/perf outlier and drift risk.
- Fonts (`MADE Tommy`) are self-hosted `.otf` (not `.woff2`) with `font-display: swap` set but no `<link rel="preload">` in `Layout.astro`.
- No analytics/tracking/chat-widget scripts were found anywhere — the third-party footprint is limited to cropperjs and the datepicker CDN links.
- Zero Astro client directives exist — there's no hydration cost, but also no componentized interactivity; everything is imperative jQuery DOM scripting.

**If asked to improve performance**: the highest-leverage, lowest-risk changes (in rough priority order) would be: (1) per-page/conditional loading of the heavier vendor scripts (cropperjs, datepicker, Swiper) instead of global inclusion, (2) migrating `assessment-blood.astro` onto the shared `Layout.astro`, (3) preloading the font files, (4) adopting `astro:assets` for new images going forward. Do not undertake any of these without confirming scope — they touch shared, high-traffic files (`Layout.astro`) or every page.

## Accessibility — current state (FACT)

- Reasonable baseline: semantic tags (`<header>`, `<nav>`, `<main>`) are used, form labels are correctly associated via `for`/`id` (e.g. `login.astro`), and Bootstrap's ARIA conventions appear on interactive components (accordions, offcanvas, modals, toasts).
- Known gaps: generic (`alt="Product"`) or empty (`alt=""`) alt text on content-bearing images in `ProductCard.astro` and `common/CategoryCard.astro`. Would likely fail a WCAG 1.1.1 (non-text content) audit as-is.
- The primary login CTA buttons use correct `<button>` semantics but carry dead Knockout-style `data-bind="click:..."` attributes with no Knockout runtime loaded — accessible markup, but the click handlers themselves are inert (see `project-architecture.md`).

## Data-layer implications for SEO/performance work

There is no backend/API in this repo (see `project-architecture.md`). Any SEO or performance work that would normally depend on dynamic data (e.g. per-product structured data, dynamic sitemaps from a product catalog) cannot be implemented against real data today — flag this as an `UNKNOWN`/blocked dependency rather than fabricating placeholder data-driven SEO.
