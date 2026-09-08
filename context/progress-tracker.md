# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation: design system and Clerk auth complete. Project CRUD, canvas, AI generation, and spec generation not started.

## Current Goal

- Set up Postgres + Prisma, then build Project creation/ownership/collaborator access (the rest of the Authentication and Projects unit).

## Completed

- Design system (`context/feature-specs/01-design-system.md`) — see prior entry below.
- Auth and route protection (`context/feature-specs/02-auth.md`):
  - `@clerk/nextjs` + `@clerk/themes` installed and configured. `ClerkProvider` wraps the app in `app/layout.tsx`, themed dark (`theme: dark` + brand color variables) to match `ui-context.md`.
  - `/sign-in` and `/sign-up` catch-all routes added using Clerk's `<SignIn />` / `<SignUp />`.
  - `proxy.ts` (not `middleware.ts` — see Architecture Decisions) protects `/dashboard(.*)` via `clerkMiddleware` + `auth.protect()`.
  - `components/navbar.tsx` added: brand link, sign-in button (signed out), dashboard link + `UserButton` (signed in) — uses Clerk's `<Show when="signed-in"|"signed-out">` (see Architecture Decisions on Core 3).
  - `.env.local` created (gitignored, confirmed via `git check-ignore`) with Clerk keys plus `NEXT_PUBLIC_CLERK_SIGN_IN_URL`/`SIGN_UP_URL`/fallback-redirect vars so Clerk redirects to our own pages instead of its hosted Account Portal.
  - `app/dashboard/page.tsx` added as a protected placeholder (reads `currentUser()`); real project list is blocked on Prisma/Postgres.
  - Verified in-browser: signed-out visit to `/dashboard` redirects to our themed `/sign-in` (not the Clerk hosted portal); sign-up modal renders dark-themed on the home page; `tsc --noEmit`, `npm run lint`, and `npm run build` all clean with zero deprecation warnings.
  - Design system unit verified same way (`tsc`, `lint`, dev-server screenshot, dark theme, no light-mode flash).

## In Progress

- None.

## Next Up

- Postgres + Prisma: schema for projects, collaborators, specs, task runs (per `architecture-context.md`'s storage model).
- Project creation, ownership, collaborator access, project list/workspace navigation (needs the above).
- Requires from the user: a Postgres connection string (Neon/Supabase/Vercel Postgres/local).

## Open Questions

- None yet — no requirement ambiguity hit so far.

## Architecture Decisions

- shadcn's current CLI (v4) generates `base-nova`-style components using `@base-ui/react` (not Radix) and the `cn` npm package (not a hand-rolled `clsx`/`tailwind-merge` util). Kept as-is since it satisfies the spec's requirements without deviating from generated-file conventions.
- Kept `@import "shadcn/tailwind.css"` and `@import "tw-animate-css"` in `globals.css` — required by the installed component style for state-based variants (`data-state`, etc.) and animations (e.g. Dialog).
- **Next.js 16 renamed `middleware.ts` to `proxy.ts`** (same `clerkMiddleware` export, just relocated + default-exported from the new filename) — `next build` throws a deprecation warning on the old convention. Use `proxy.ts` for all future request-interception logic, not `middleware.ts`.
- **Clerk is on "Core 3"** (`@clerk/nextjs@7.x`), released after this session's training data. Breaking changes hit so far: `<SignedIn>`/`<SignedOut>`/`<Protect>` were removed and throw at runtime — use `<Show when="signed-in" | "signed-out" | {...}>` instead. `appearance.baseTheme` was renamed to `appearance.theme`. `Variables.colorText` was renamed to `colorForeground` (and there's no `colorInputBackground`). Before touching any more Clerk code, check `node_modules/@clerk/nextjs/dist/types/index.d.ts` and the removed-component source (it embeds the exact migration steps) rather than relying on prior Clerk knowledge.
- Clerk's `auth.protect()` default-redirects unauthenticated users to Clerk's hosted Account Portal unless `NEXT_PUBLIC_CLERK_SIGN_IN_URL`/`SIGN_UP_URL` env vars point at our own routes — set in `.env.local`.

## Session Notes

- `.env.local` holds Clerk's publishable + secret key plus the sign-in/up URL overrides. Not committed (gitignored). Postgres/Liveblocks/Trigger.dev/Vercel Blob/LLM keys still not configured — needed before the next units.
- Local dev server is registered in `.claude/launch.json` as `ghost-ai-dev` (`npm run dev`, port 3000).
- Before writing any new Next.js or Clerk code, check `node_modules/next/dist/docs/` and the relevant `node_modules/@clerk/*` type/source files for breaking changes rather than assuming prior training-data knowledge — this AGENTS.md-mandated check already caught two real breaking changes in this session (see Architecture Decisions).
