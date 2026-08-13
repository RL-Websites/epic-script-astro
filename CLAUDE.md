## Project overview

epic-script-astro is a static (SSG) Astro site for a telehealth/pharmacy intake and e-commerce funnel ("EpiqScripts" theme), currently in a UI-shell/prototype stage: no backend, no API, no env config, no tests, no lint tooling. Styling is SCSS + Bootstrap 5, compiled outside Astro by a standalone `sass` CLI. See `.claude/project-architecture.md` for the full picture.

## Working in this project

1. **Read this file and the relevant `.claude/*.md` docs before working**: `.claude/project-architecture.md` (structure, routing, data layer), `.claude/coding-conventions.md` (TS/Astro/naming/reuse patterns), `.claude/ui-ux-conventions.md` (styling system, design tokens), `.claude/seo-performance.md` (known SEO/perf/a11y gaps), `.claude/project-decisions.md` (open questions requiring a human call, e.g. duplicate pages, orphaned components, dual lockfiles).
2. **Inspect existing implementations before creating new ones.** This codebase has a strong history of duplicating markup into new files instead of parameterizing existing components (see `coding-conventions.md`'s "Component reuse" section) — don't repeat that pattern.
3. **Reuse existing components whenever appropriate** — check `coding-conventions.md` for which components are the reusable/canonical ones (`ProductSingle.astro`, `Offcanvas.astro`, etc.) vs. one-off duplicates.
4. **Follow the existing Astro architecture**: static output, no client directives, no scoped `<style>` blocks, no framework islands. Don't introduce SSR, a UI framework, or content collections without discussing it first — none exist today.
5. **Follow existing styling conventions**: SCSS partials under `public/Themes/Thrivewellrx.Theme.EpiqScripts/assets/scss/`, Bootstrap 5 classes, no Tailwind, no scoped Astro styles, no CSS-variable-based theming. See `ui-ux-conventions.md`.
6. **Follow existing TypeScript conventions**: `astro/tsconfigs/strict` preset; add a typed `interface Props` when a component needs configurability, matching the pattern in `ProductSingle.astro`.
7. **Preserve the existing SEO architecture** — it currently has real gaps (shared `<title>Astro Basics</title>` on every page, no sitemap, no meta descriptions). Don't silently "fix" these as a side effect of unrelated work; if asked to improve SEO, see `seo-performance.md` for the deliberate first step.
8. **Preserve accessibility standards already in place** (semantic tags, label associations) and flag but don't silently patch known gaps (generic/empty `alt` text) unless asked.
9. **Do not introduce new dependencies without justification** — there are already two coexisting lockfiles (npm + pnpm) and at least one unused devDependency (`postcss-purgecss`); don't add to that drift.
10. **Do not refactor unrelated code.** Several components/pages look like legacy duplicates (see `project-decisions.md`) but must not be touched without confirming intent with the user first.
11. **Do not replace existing architecture merely because another approach is preferred** — e.g. don't migrate to Tailwind, scoped styles, or a UI framework unless explicitly asked.
12. **Analyze impact before making changes** — `Layout.astro` is imported by ~64 of 65 pages and all styling is global (no scoped CSS), so small changes can have a large blast radius. Check what else depends on a file before editing shared code.
13. **Run appropriate validation after implementation** — there is no test suite or linter in this project, so validation means running `npm run dev`/`astro build` and visually checking the affected page(s); say so explicitly if you can't verify visually.
14. **Update project documentation when architectural decisions change** — record confirmed decisions in `.claude/project-decisions.md` with date and reasoning.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
