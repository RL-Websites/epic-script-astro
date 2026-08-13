# UI/UX Conventions — epic-script-astro

Documents the EXISTING visual language and styling architecture. Preserve this system unless explicitly instructed otherwise.

## Styling architecture (how it actually works)

- Styling is **entirely SCSS + Bootstrap 5**, compiled **outside** Astro/Vite by the standalone Dart `sass` CLI: `npm run watch` runs `sass --watch public/Themes/Thrivewellrx.Theme.EpiqScripts/assets/scss/styles.scss:.../css/style.css` (FACT, `package.json`). Astro's `astro build` never touches SCSS — no `.astro`/`.ts` file imports any `.scss` file, and `astro.config.mjs` has no `css` config.
- The compiled output is a single global `style.css` (~21,000 lines) linked from `Layout.astro`. **Zero components use Astro's scoped `<style>` blocks** (0 of 111 `.astro` files, FACT) — all class-based styling is global.
- **When adding new styles, add a new SCSS partial under the matching folder and `@use` it from that folder's `_index.scss`** — do not add scoped `<style>` blocks to `.astro` files, as that would be the only component doing so and breaks the established pattern. Then run `npm run watch` (or ask the user to) so `style.css` regenerates — editing `.astro` files alone will not add new styles.

### SCSS structure

```
public/Themes/Thrivewellrx.Theme.EpiqScripts/assets/scss/
  styles.scss              — entry point, @use's the 4 folders below
  base/                     — variables, typography, font-face, global resets, utility-class generators
  components/               — 34 partials: buttons, cards, forms, tables, offcanvas, toast, etc.
    intake-form/            — 13 partials for the multi-step intake form UI
    shimmerUI/               — 8 partials for loading-skeleton components
  layouts/                  — header, footer, modal (+ some orphaned partials, see below)
  pages/                    — 20 page-specific partials
```

- **6 SCSS partials exist but are never `@use`'d anywhere and are not compiled into `style.css`**: `layouts/_breadcrumb.scss`, `layouts/_coupon-modal.scss`, `layouts/_features.scss`, `layouts/_photo-grid.scss`, `layouts/_suggestions.scss`, `components/_map.scss`. Don't assume these are live just because the files exist.

## Design tokens

- Colors, spacing, and font-size scales are defined in `base/_variables.scss` and `base/_utils.scss` as SCSS variables/maps (e.g. `$primary: #00533f`, `$fs-10` through `$fs-200`, a `$spacing-list` map generating `.m-#{key}` utility classes). **Use existing tokens/utility classes before introducing new hardcoded values.**
- `_variables.scss` has accumulated ~15 "legacy"/"New Added" color aliases stacked on earlier colors (e.g. `$secondary: $black`, `$purple: $primary`) — a sign of iterative rebranding. When picking a color, check what it currently renders as, not just its name.
- **CSS custom properties (`--var`) are essentially unused** as a design-token layer (only 3 files use `var(--...)`, mostly Bootstrap overrides or a spinner animation) — the token system is SCSS-variable-based, not runtime-themeable. Do not build a dark-mode or runtime-theming feature assuming CSS variables are already wired for it.
- Typography is mostly tokenized (`h1`/`h2` use `$fs-*` variables) but `h3` is hard-coded to `38px` in `base/_typography.scss` — an existing inconsistency, not a pattern to copy.

## Responsive breakpoints

- **No shared breakpoint mixin exists** (`@mixin` appears zero times in the SCSS tree, FACT). Breakpoints are ad hoc `@media` px values repeated across partials, roughly aligned to Bootstrap 5 defaults (768/992/576/1200) but with inconsistent near-duplicates (767 vs 768, 991 vs 992, 575 vs 576, 1420 vs 1440) scattered through different files.
- When adding responsive styles, match the breakpoint value already used by the surrounding partial rather than introducing a new one-off value.

## Component library

- **Bootstrap 5.3.3** is loaded from CDN in `Layout.astro` and provides the grid/utility/component base (FACT). Bootstrap grid classes (`col-N`, `row`) and utility classes (`d-flex`, `d-none`, `d-md-*`, `justify-content-*`) are used extensively across ~35+ pages/components.
- **No Tailwind** — confirmed absent from `package.json`, `postcss.config.cjs`, and every source file. Don't introduce Tailwind classes; this is a Bootstrap-class + custom-SCSS project.
- `.btn`/`.btn-*` is redefined in 9+ files beyond the central `components/_button.scss` (page/component partials each re-tweak button styles rather than composing from the base). This is existing drift, not a pattern to extend — prefer the central `_button.scss` definitions when possible, and flag if you need a genuinely new button variant rather than silently adding another override.

## No dark/light mode

- No dark mode implementation exists anywhere (`prefers-color-scheme`, `data-theme`, `.dark` all return zero matches). Don't assume a dark variant needs to be maintained unless asked to build one.

## Fonts

- Custom self-hosted font "MADE Tommy" (weights 300–900) via `@font-face` in `base/_font-face.scss`, using `.otf` files with `font-display: swap` already set (good baseline). No `<link rel="preload">` exists for fonts in `Layout.astro`, and `.otf` (not `.woff2`) is used — a known performance gap, see `seo-performance.md`.

## Images / icons

- Plain `<img>` tags throughout — no Astro `<Image>`/`<Picture>`/`astro:assets` usage anywhere (0 matches, FACT). Images are served as-is from `public/Themes/.../assets/img/`. New image usage should follow this same plain-`<img>` pattern for consistency with the rest of the codebase, unless the user asks to introduce Astro's image optimization pipeline as a deliberate change.

## Accessibility conventions already in place

- Semantic structural tags are used reasonably (`<header>`, `<nav>`, `<main>`, presumably `<footer>`), and Bootstrap's own `aria-*` conventions (`aria-expanded`, `aria-controls`, `aria-hidden` via `data-bs-*`) appear on accordions/offcanvas/modals.
- Form labels are correctly associated via `for`/`id` pairing (e.g. `login.astro`).
- **Gaps to be aware of, not to silently "fix" as a side effect of unrelated work** (raise with the user first, per the impact-before-changing rule):
  - `ProductCard.astro`: nearly every product image uses literal `alt="Product"` instead of the real product name.
  - `common/CategoryCard.astro`: 7 category thumbnails use `alt=""` despite being content-bearing, not decorative.