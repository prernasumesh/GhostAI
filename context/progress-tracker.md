# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation: design system complete. Feature phases (auth, database, canvas, AI generation, spec generation) not started.

## Current Goal

- Decide and scope the next feature unit — likely Authentication and Projects (Clerk + Prisma) per `project-overview.md`.

## Completed

- Design system (`context/feature-specs/01-design-system.md`):
  - `shadcn/ui` initialized (`components.json`, `base-nova` style, Tailwind v4).
  - Theme tokens from `ui-context.md` wired into `app/globals.css` (`:root` custom properties + `@theme inline` mapping), replacing shadcn's default light/dark oklch palette. Dark-only, `dark` class applied on `<html>` in `app/layout.tsx`.
  - Added shadcn components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea (`components/ui/*`).
  - `lucide-react` installed.
  - `lib/utils.ts` created, re-exporting `cn()` from the `cn` package (shadcn's current codegen; drop-in clsx + tailwind-merge replacement).
  - Verified: `tsc --noEmit` clean, `npm run lint` clean, dev server renders dark theme correctly with no light-mode flash (checked in browser).

## In Progress

- None.

## Next Up

- Authentication and Projects: Clerk integration, route protection, Prisma schema for projects/collaborators, project list/workspace navigation.
- Requires from the user: a Clerk application (publishable + secret key) and a Postgres connection string (e.g. via Vercel Postgres, Neon, Supabase, or local).

## Open Questions

- None yet — no requirement ambiguity hit during the design-system unit.

## Architecture Decisions

- shadcn's current CLI (v4) generates `base-nova`-style components using `@base-ui/react` (not Radix) and the `cn` npm package (not a hand-rolled `clsx`/`tailwind-merge` util). Kept as-is since it satisfies the spec's requirements (`cn()` helper, dark-theme-matched components) without deviating from generated-file conventions.
- Kept `@import "shadcn/tailwind.css"` and `@import "tw-animate-css"` in `globals.css` — required by the installed component style for state-based variants (`data-state`, etc.) and animations (e.g. Dialog).

## Session Notes

- No `.env` / external service credentials configured yet in this project (no Clerk, database URL, Liveblocks, Trigger.dev, or Vercel Blob keys). All of those are required before starting the Authentication/Projects unit or later units.
- Local dev server is registered in `.claude/launch.json` as `ghost-ai-dev` (`npm run dev`, port 3000).
