# Project Decisions & Open Questions — epic-script-astro

Tracks decisions that need a human call before Claude acts on them, and any decisions already made. Update this file when an architectural decision is confirmed, so future sessions don't re-litigate it.

## Open questions (ask the user before acting on any of these)

1. **`assessment-*` vs `qa-*` quiz flows** — two structurally parallel intake-quiz page sets exist (`assessment-checkbox.astro`/`assessment-height.astro`/etc. vs `qa-checkbox.astro`/`qa-height.astro`/etc.), sharing the same component set (`AssesmentHeader`, `AssesmentFooter`, `CommonAction`). Unknown which is the live/intended flow. **Do not delete or consolidate either without asking.**
2. **`about.astro` vs `about-us.astro`** — same imports, likely duplicate content, not diffed line-by-line. Confirm which is canonical before editing either.
3. **`payment-method.astro` vs `payment-method2.astro`** — `payment-method.astro`'s submit handler is live; the identical handler in `payment-method2.astro` is commented out. Likely `payment-method.astro` is current and `payment-method2.astro` is legacy, but confirm before removing.
4. **`thank-you.astro` vs `thank-you-2.astro`** — `payment-method.astro` redirects to `/thank-you`, suggesting `thank-you.astro` is live and `thank-you-2.astro` is orphaned. Confirm before removing.
5. **`upload-drivers-licence.astro` vs `upload-drivers-licence-backup.astro`** — filename says backup; the backup lacks the `FileUpload` component the live page has. Confirm before removing.
6. **Orphaned components** (`PackageProductCard.astro`, `SelectDosageModal.astro`, `UnableToProceed.astro`, `ClientCard.astro`, `ClientFeedback.astro`, `homePage/HowWorks_backupold.astro`) — not imported anywhere. Unknown whether they're planned for future use or dead weight. Do not delete without confirming; do not build new features on top of them without confirming they're the intended base.
7. **Dual lockfiles** (`package-lock.json` + `pnpm-lock.yaml`) — no `packageManager` field disambiguates which package manager is canonical for this project. Ask which one to keep before running any install command or adding a dependency.
8. **`postcss-purgecss`** — present in `package.json` but not wired into `postcss.config.cjs`. Unknown if intentionally unused (kept for a future pass) or dead weight.
9. **Backend/API/data layer** — entirely absent from this repo (see `project-architecture.md`). If a task requires real data (products, orders, auth), ask where that lives / what shape it takes rather than inventing an API contract.
10. **6 orphaned SCSS partials** never `@use`'d anywhere (`layouts/_breadcrumb.scss`, `_coupon-modal.scss`, `_features.scss`, `_photo-grid.scss`, `_suggestions.scss`, `components/_map.scss`) — confirm before deleting; they may be staged for a feature not yet wired up.

## Decisions already made (none yet)

No architectural decisions have been confirmed with the user as of this discovery pass (2026-08-13). This section should be updated as decisions are made — record the decision, the date, and the reasoning, e.g.:

```
### 2026-XX-XX — <decision title>
Decision: <what was decided>
Why: <reasoning / who decided>
Affects: <files/areas impacted>
```

## Ground rules for future changes (see root CLAUDE.md for the full list)

- This project has no test suite and no lint/format tooling — there is no automated safety net. Be extra deliberate about manual verification (visually check the affected page(s) after any change) since nothing else will catch a regression.
- Styling is 100% global (no scoped Astro styles) — any SCSS change can have wider blast radius than the file you're editing. Check what else imports/is affected by a shared partial before changing it.
- `Layout.astro` is imported by ~64 of 65 pages — treat any change to it as a global change, not a per-page one.
