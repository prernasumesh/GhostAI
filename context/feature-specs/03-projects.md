Read 'AGENTS.md' before starting.

We're adding project creation, ownership, and the project list/workspace navigation
(the remainder of "Authentication and Projects" from `project-overview.md`).

Set up Prisma + Postgres (Neon).

- `prisma/schema.prisma`: `Project` (id, name, ownerId, canvasJsonPath, timestamps) and
  `ProjectCollaborator` (join table: projectId, userId) models, per the storage model in
  `architecture-context.md`.
- `lib/prisma.ts`: shared Prisma client singleton.
- `lib/projects.ts`: `listProjectsForUser` / `getProjectForUser` — ownership OR
  collaborator-membership queries, reused by the dashboard, the workspace page, and the API route.
- `app/api/projects/route.ts`: `GET` (list current user's projects), `POST` (create a
  project owned by the current user). Validates input, enforces auth before any query.
- `app/dashboard/page.tsx`: lists the current user's projects; "New project" dialog.
- `app/projects/[projectId]/page.tsx`: protected placeholder workspace — 404s via
  `getProjectForUser` if the current user isn't the owner or a collaborator. The real
  canvas is a separate unit (needs Liveblocks + React Flow).
- `proxy.ts`: extend the protected-route matcher to cover `/projects(.*)` and `/api/projects(.*)`.

###Check when done
- `/dashboard` lists only the signed-in user's own projects; creating one persists to
  Postgres and navigates to `/projects/[id]`.
- Visiting another user's `/projects/[id]` (not owner or collaborator) 404s.
- No TypeScript or lint errors; `next build` is clean.
- Verified Postgres read/write against the real Neon database (not just type-checked).
