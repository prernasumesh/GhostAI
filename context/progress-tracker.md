# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation complete: design system, Clerk auth, and Project CRUD (owner-only; collaborator
  invite flow not built). Collaborative canvas, AI generation, and spec generation not started.

## Current Goal

- Decide and scope the next unit: either the collaborator-invite flow (needs a "look up
  Clerk user by email" decision — see Open Questions) or start the Collaborative Canvas
  unit (Liveblocks + React Flow), which needs a Liveblocks API key.

## Completed

- Design system (`context/feature-specs/01-design-system.md`).
- Auth and route protection (`context/feature-specs/02-auth.md`).
- Projects: creation, ownership, list, workspace navigation (`context/feature-specs/03-projects.md`):
  - Postgres provisioned on Neon; `DATABASE_URL` in `.env.local` (gitignored).
  - Prisma 7 set up: `prisma/schema.prisma` (`Project`, `ProjectCollaborator` models),
    migration applied (`prisma/migrations/20260908014335_init`), client generated to
    `prisma/generated/client` (gitignored build output).
  - `lib/prisma.ts` (singleton client with the `@prisma/adapter-pg` driver adapter —
    required by Prisma 7's new client, see Architecture Decisions) and `lib/projects.ts`
    (ownership/collaborator query helpers).
  - `app/api/projects/route.ts` (GET list, POST create — validates input, requires auth).
  - `app/dashboard/page.tsx` lists the user's projects with a "New project" dialog
    (`components/new-project-dialog.tsx`).
  - `app/projects/[projectId]/page.tsx`: protected placeholder workspace, 404s for
    non-owners/non-collaborators via `getProjectForUser`.
  - `proxy.ts` matcher extended to protect `/projects(.*)` and `/api/projects(.*)`.
  - Verified: `tsc --noEmit`, `npm run lint`, `npm run build` all clean. Route-protection
    redirect re-verified after the Clerk Core 3 fixes. Database read/write verified against
    the live Neon instance directly via `pg` (a throwaway insert/read/delete probe script,
    deleted after running) — full browser sign-up flow could not be verified end-to-end
    because Clerk's bot-check (Cloudflare "Verify you are human") gates account creation,
    and completing CAPTCHAs is outside what this assistant will do even in dev/test mode.
    **The user should do one real sign-up + "New project" click themselves to confirm the
    UI path.**

## In Progress

- None.

## Next Up

- Collaborator invite flow — open question below, needs a product decision first.
- Collaborative Canvas: Liveblocks + React Flow, live cursors/presence, canvas snapshot
  persistence to Vercel Blob. Requires a Liveblocks API key and a Vercel Blob token.
- AI Architecture Generation and Spec Generation: both need Trigger.dev (background jobs)
  and an LLM API key (provider unspecified — check what the source tutorial uses).

## Open Questions

- How should adding a collaborator work? Options: invite by email (requires looking up a
  Clerk user by email via the Clerk Backend API, and handling the not-yet-a-user case),
  invite by Clerk user ID (simple but not user-friendly), or a shareable invite link
  (needs its own token/expiry model). Not specified in `project-overview.md` or
  `architecture-context.md` — needs a decision before building it.

## Architecture Decisions

- shadcn's current CLI (v4) generates `base-nova`-style components using `@base-ui/react`
  (not Radix) and the `cn` npm package (not a hand-rolled `clsx`/`tailwind-merge` util).
- Kept `@import "shadcn/tailwind.css"` and `@import "tw-animate-css"` in `globals.css` —
  required by the installed component style for state-based variants and animations.
- **Next.js 16 renamed `middleware.ts` to `proxy.ts`** (same `clerkMiddleware` export,
  relocated + default-exported from the new filename) — `next build` throws a deprecation
  warning on the old convention.
- **Clerk is on "Core 3"** (`@clerk/nextjs@7.x`). `<SignedIn>`/`<SignedOut>`/`<Protect>`
  were removed and throw at runtime — use `<Show when="signed-in" | "signed-out" | {...}>`.
  `appearance.baseTheme` → `appearance.theme`. `Variables.colorText` → `colorForeground`
  (no `colorInputBackground`). Check `node_modules/@clerk/nextjs/dist/types/index.d.ts`
  and the removed-component source before writing more Clerk code — it embeds the exact
  migration steps.
- Clerk's `auth.protect()` default-redirects to Clerk's hosted Account Portal unless
  `NEXT_PUBLIC_CLERK_SIGN_IN_URL`/`SIGN_UP_URL` env vars point at our own routes — set in
  `.env.local`.
- **Prisma is on v7**, a major architecture change from what older Prisma docs/training
  data describe: the default generator is now `prisma-client` (not `prisma-client-js`),
  it requires an explicit `output` path (generates real source files into the repo, not
  into `node_modules`), the config lives in a `prisma7.config.ts` file (not env-var-only
  datasource URLs), and — most importantly — **the generated client requires an explicit
  driver adapter** (`@prisma/adapter-pg`'s `PrismaPg`, passed as `new PrismaClient({ adapter })`)
  rather than bundling its own native query-engine binary. The generated client's own
  docstring in `prisma/generated/client/client.ts` shows the correct usage — trust that
  over prior Prisma knowledge. The generated client's internal files use extensionless
  imports that resolve fine under Next.js's bundler but NOT under raw `node script.mjs`
  execution — don't try to smoke-test the generated client by running it directly with
  Node; go through the app's build/dev server, or test the raw DB connection with `pg`
  directly instead.
- `prisma7.config.ts` loads env vars from `.env.local` explicitly (via `dotenv`'s `config({ path: ".env.local" })`)
  rather than the default `.env`, to keep a single source of truth for local secrets
  alongside the Clerk keys.
- Rejected an approach: the user was given (and did not fully run) a set of instructions
  to `npm i -g neon@latest`, `neon login`, `neon mcp -y` (register an MCP server),
  `neon link`, and `neon deploy` to provision/manage the database via Neon's CLI. Verified
  the `neon` npm package is legitimate (published by the real Neon org, not a
  name-collision/typosquat) but still steered away from it in favor of just pasting the
  connection string directly — avoids a global install, an account-linking login flow, an
  unreviewed MCP server registration, and a `deploy` command run against a real database,
  none of which were necessary just to get a connection string.

## Session Notes

- `.env.local` holds: Clerk publishable + secret key, Clerk sign-in/up URL overrides, and
  `DATABASE_URL` (Neon, `neondb` database, `us-east-2`). Not committed (gitignored,
  reconfirmed via `git check-ignore` after every addition).
- Liveblocks, Trigger.dev, Vercel Blob, and an LLM API key are still not configured —
  needed before the Collaborative Canvas / AI Generation / Spec Generation units.
- Local dev server is registered in `.claude/launch.json` as `ghost-ai-dev`
  (`npm run dev`; `autoPort: true` since port 3000 is sometimes held by another session's
  dev server on this machine — `next dev` doesn't hardcode a port so this works cleanly).
- Before writing any new Next.js, Clerk, or Prisma code, check `node_modules/next/dist/docs/`
  and the relevant `node_modules/@clerk/*` or `node_modules/prisma/**` type/source files
  for breaking changes rather than assuming prior training-data knowledge — this
  AGENTS.md-mandated check already caught three real breaking changes across this
  project (Next.js proxy rename, Clerk Core 3, Prisma 7 driver adapters).
