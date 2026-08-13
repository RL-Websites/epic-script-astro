# Coding Conventions — epic-script-astro

Documents the conventions actually present in this codebase (not aspirational ones). Follow these when adding or touching code so new work matches the existing style.

## TypeScript

- `tsconfig.json` extends `astro/tsconfigs/strict` (FACT) — stricter than the "base" preset. No custom `compilerOptions`, no path aliases.
- TypeScript usage inside `.astro` files is inconsistent: some components define `interface Props { ... }` (e.g. `ProductSingle.astro`, `Loader.astro`, `Offcanvas.astro`, `OffCanvas2.astro`, `OffCanvas3.astro`, `StateAutocomplete.astro`, `TimelineStep.astro`, `MobileTimelineStep.astro`), but the majority of components take no props at all and hardcode their content directly (FACT).
- **Convention to follow**: if a component needs configurable content, add a typed `interface Props` (matching the pattern in `ProductSingle.astro`) rather than hardcoding another one-off variant.

## Astro component conventions

- Components are `.astro` only — no `.jsx/.tsx/.vue/.svelte` files exist anywhere (FACT). Do not introduce a UI framework without discussing it first (see `project-decisions.md`).
- No component uses Astro scoped `<style>` — all styling comes from the global SCSS/CSS pipeline (see `ui-ux-conventions.md`). New components should follow this and add classes to the existing SCSS structure rather than introducing scoped `<style>` blocks, to stay consistent (this is a convention to preserve, not necessarily an ideal to copy blindly for genuinely new work — flag the tension if it matters).
- Only one component (`StateAutocomplete.astro`) has an inline `<script>` block. Client-side behavior otherwise lives in the global vendor JS files under `public/Themes/.../assets/js/` or inline `<script>` blocks directly inside pages (e.g. `payment-method.astro`, `cart.astro`, `index.astro`).

## File/folder naming

- Root-level components and `common/`/`homePage/` are PascalCase; `shimmerUI/` mixes PascalCase and camelCase inconsistently (`CategoryCardShimmer.astro` vs `cartShimmer.astro`, `myOrderShimmer.astro`, etc.) — FACT. Match whichever casing the sibling files in the folder you're editing use; don't introduce a third style.
- **Known typos to be aware of** (do not "fix" without confirming — the typo may be referenced elsewhere, e.g. imports):
  - `CustoemrInfo.astro` (should be "CustomerInfo") — imported with the typo preserved in `order-confirmation.astro`.
  - `homePage/DigitalPhamacy.astro` (should be "Pharmacy").
- Casing inconsistency: `Offcanvas.astro` (lowercase "canvas") vs `OffCanvas2.astro`/`OffCanvas3.astro` (capital "Canvas") for the same UI concept.

## Component reuse — check before creating

This codebase has a strong pattern of **duplicating markup into a new file instead of parameterizing an existing component**. Before creating a new component, check whether one of these already covers the need:

- **Product cards**: `ProductSingle.astro` is the correct, prop-driven, reusable pattern (used via `.map()` on all 8 category pages). `ProductCard.astro` (1000 lines, hardcoded) and `PackageProductCard.astro` (408 lines, hardcoded, currently unused) duplicate the same visual pattern without props — prefer extending `ProductSingle.astro`'s prop shape over adding another hardcoded card component.
- **Offcanvas panels**: `Offcanvas.astro` is a generic slotted shell; `OffCanvas2.astro`/`OffCanvas3.astro` hardcode entirely different content inside a copy-pasted header/close-button shell. If adding a new offcanvas panel, consider composing with `Offcanvas.astro`'s slot rather than copying the OffCanvas2/3 pattern again.
- **Dose/modal selection**: `SelectDosageModal.astro` and `UnableToProceed.astro` are ~90% identical and both currently unused — do not create a third variant; reconcile these two first if this UI is needed (see `project-decisions.md`).

## Orphaned / dead components (verified unused — not imported by any page)

`PackageProductCard.astro`, `SelectDosageModal.astro`, `UnableToProceed.astro`, `ClientCard.astro`, `ClientFeedback.astro`, `homePage/HowWorks_backupold.astro`. Do not build on top of these without first confirming with the team whether they're intended for future use or should be removed — see `project-decisions.md`.

## Data patterns

- No components fetch data — all content is hardcoded arrays/objects directly in `.astro` frontmatter (e.g. `Footer.astro`'s link columns, `Faq.astro`'s Q&A list, `CustoemrInfo.astro`'s customer object). New pages/components should follow this hardcoded-data pattern **unless** you are explicitly asked to wire up real data — this repo has no API layer, no env config, and no fetch usage anywhere (see `project-architecture.md`). Do not invent an API client or env var scheme on your own initiative.

## Tooling gaps to be aware of

- No ESLint/Prettier/Biome config exists — there is no automated formatter to defer to; match surrounding file style by eye.
- No test suite exists — do not assume `npm test` works or add tests without being asked to set up a framework first.
- Two lockfiles (`package-lock.json`, `pnpm-lock.yaml`) coexist with no `packageManager` field — confirm with the user which package manager is canonical before installing anything, to avoid making the drift worse.