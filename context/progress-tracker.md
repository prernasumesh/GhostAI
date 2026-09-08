# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation complete: design system, Clerk auth, Project CRUD, and the real-time
  collaborative canvas (Liveblocks + React Flow) are built. Canvas snapshot persistence,
  starter templates, AI generation, and spec generation not started.

## Current Goal

- Get the canvas verified live by the user (see Session Notes — the assistant could not
  complete this itself), then decide the next unit: canvas snapshot persistence to Vercel
  Blob, starter system design templates, or AI architecture generation.

## Recent Fixes (found while generating a demo screenshot)

Building a throwaway static demo page (populated with sample data, no auth/Liveblocks) to
produce a portfolio screenshot surfaced and fixed three real bugs in the shipped canvas —
worth calling out since they'd have hit real users on `/projects/[id]`, not just the demo:

1. `app/layout.tsx`: `body` used `min-h-full` instead of `h-full`. `min-height` doesn't
   establish a definite height for percentage/flex-based descendant sizing, so React Flow's
   container could fail to size itself ("parent container needs a width and a height").
2. `components/canvas/shape-node.tsx` + `liveblocks.config.ts` + `components/canvas/canvas.tsx`:
   every node only exposed `type="source"` handles, so edges had no valid `target`-type
   handle to bind to — new connections would fail to render correctly once reloaded from
   storage. Fixed by giving each of the 4 sides both a source and target handle
   (`${side}-source` / `${side}-target`) and persisting `sourceHandle`/`targetHandle` on
   the edge itself instead of leaving them implicit.
3. `components/canvas/shape-node.tsx`: the handle list's `.map()` returned a shorthand `<>`
   fragment per item — shorthand fragments can't take a `key` prop, so React warned on
   every render. Fixed with an explicit `<Fragment key={side}>`.

The demo page itself (`app/demo-screenshot/page.tsx`) was deleted after use — it was never
meant to ship, just a static sandbox to render the same components with fixed sample data
so a screenshot didn't require a live signed-in session.

## Completed

- Design system (`context/feature-specs/01-design-system.md`).
- Auth and route protection (`context/feature-specs/02-auth.md`).
- Projects: creation, ownership, list, workspace navigation (`context/feature-specs/03-projects.md`).
- Collaborative Canvas (`context/feature-specs/04-canvas.md`):
  - Liveblocks (`@liveblocks/client`/`react`/`node`) + `@xyflow/react` (React Flow) installed.
  - `types/canvas.ts`: the 8 `NODE_COLORS` pairs, 6 `NODE_SHAPES`, `CanvasNodeData` — from `ui-context.md`.
  - `liveblocks.config.ts`: global `Storage`/`Presence`/`UserMeta` augmentation. Nodes and
    edges are each a `LiveMap` keyed by id (not one big array) for per-item concurrent-edit safety.
  - `app/api/liveblocks-auth/route.ts`: verifies project membership (`getProjectForUser`)
    before issuing a room token; room ID = project ID.
  - `components/canvas/`: `canvas-room.tsx` (provider wrapper), `canvas.tsx` (the
    ReactFlow canvas — storage-backed nodes/edges, drag/connect/delete synced via
    `useMutation`, live cursors via `useOthers`), `shape-node.tsx` (all 6 shapes, hover-reveal
    handles on all sides), `canvas-toolbar.tsx` (floating shape/color picker + add-node button).
  - `app/projects/[projectId]/page.tsx` now renders the real canvas (still behind the same
    ownership check as before).
  - Verified: `tsc --noEmit`, `npm run lint`, `npm run build` all clean; route protection
    re-confirmed for `/projects/[id]` after the change. **Not verified live in-browser** —
    see Session Notes.

## In Progress

- None.

## Next Up

- Canvas snapshot persistence to Vercel Blob (`canvas/{projectId}.json`, per the storage
  model) — deliberately deferred as its own unit, not bundled with the real-time canvas
  work. Needs a Vercel Blob token.
- Starter System Designs: template library + import into an active room.
- Collaborator invite flow — still blocked on the open question below.
- AI Architecture Generation / Spec Generation — need Trigger.dev + an LLM API key.

## Open Questions

- How should adding a collaborator work? (email lookup vs. Clerk user ID vs. invite link —
  not specified anywhere in the context files.) Still unresolved from the previous unit.

## Architecture Decisions

- shadcn's CLI (v4) generates `base-nova`-style components on `@base-ui/react` + the `cn`
  package, not Radix/clsx/tailwind-merge.
- **Next.js 16 renamed `middleware.ts` to `proxy.ts`.**
- **Clerk is on "Core 3"** (`@clerk/nextjs@7.x`) — `<Show when="signed-in"|"signed-out">`
  replaces `<SignedIn>`/`<SignedOut>`/`<Protect>`; `appearance.theme` not `.baseTheme`;
  `colorForeground` not `colorText`.
- **Prisma is on v7** — `prisma-client` generator with an explicit `output` path, driver
  adapters required (`@prisma/adapter-pg`), config in `prisma7.config.ts`.
- **Liveblocks is on v3** (`@liveblocks/*@3.24.1`) and **React Flow ships as `@xyflow/react`
  v12** (the `reactflow` package is the old pre-rename name — don't install that). Verified
  the hook/API surface (`LiveblocksProvider`, `RoomProvider`, `useStorage`, `useMutation`,
  `useOthers`, the global `Liveblocks` interface augmentation, `Handle`/`Position`/
  `MarkerType`) against the installed type declarations rather than assuming — it matches
  prior Liveblocks v2 knowledge closely, with one real gotcha (next bullet).
- **`useStorage`'s selector receives a read-only `ToJson<Storage>` snapshot, not the live
  CRDT objects** — a `LiveMap` shows up as a plain object in that snapshot, so iterate it
  with `Object.entries(root.nodes)`, not `root.nodes.entries()`. The live `LiveMap`/
  `LiveObject` instances (with real `.get()`/`.set()`/`.delete()`/`.entries()`) are only
  available inside `useMutation`'s `storage` argument. Also: because our `CanvasNodeStorage`/
  `CanvasEdgeData` types carry an index signature (required to satisfy Liveblocks' `Json`
  constraint), TypeScript widens every field to the index signature type when it runs them
  through `ToJson<T>` — cast with `as unknown as CanvasNodeStorage` (etc.) at the point
  nodes/edges are read out of `useStorage`, rather than fighting the inference.
- Rejected an approach: was given (and did not fully run) `npm i -g neon@latest` / `neon
  login` / `neon mcp -y` / `neon link` / `neon deploy` to provision the database via
  Neon's CLI+MCP. Verified the package is legitimately Neon's (not a typosquat) but used a
  pasted connection string instead — no global install, account-linking login, unreviewed
  MCP registration, or `deploy` command needed just to get a connection string.

## Session Notes

- `.env.local` now also holds `LIVEBLOCKS_SECRET_KEY` (dev key, `sk_dev_...`). Still not
  committed (gitignored, reconfirmed).
- **The assistant cannot complete the browser sign-up flow itself** — Clerk's bot-check
  (Cloudflare "Verify you are human") gates it, and completing CAPTCHAs is out of bounds
  even for dev/test verification. This means the canvas (and the project dashboard's
  create flow before it) is verified by build/typecheck/lint plus route-protection checks,
  but the actual interactive behavior — dragging nodes, multi-user cursors, the create-
  project dialog — needs the user to click through it once. Flagged both times so far;
  worth remembering as a standing limitation for any future UI unit, not re-discovering it
  each time.
- Vercel Blob, Trigger.dev, and an LLM API key are still not configured.
- Local dev server runs on `npm run dev`, port 3000 (falls back to another port if taken).
- Keep checking `node_modules/**` type declarations / doc folders directly before writing
  code against Next.js, Clerk, Prisma, Liveblocks, or React Flow — this project has hit a
  real breaking change in every major dependency so far (Next.js proxy rename, Clerk Core
  3, Prisma 7 driver adapters, and the `useStorage` ToJson snapshot behavior above), so
  prior training-data knowledge alone has been wrong at least once per dependency.
