Read 'AGENTS.md' before starting.

We're adding the real-time Collaborative Canvas (`project-overview.md`'s "Collaborative
Canvas" feature): shared React Flow canvas over Liveblocks, live cursors/presence, and
node/edge editing. Canvas snapshot persistence to Vercel Blob is a separate unit (per
`ai-workflow-rules.md`: don't combine real-time canvas state with database/blob
persistence in one step) — not built yet.

- `types/canvas.ts`: `NODE_COLORS` (8 pairs), `NODE_SHAPES` (6 shapes), `CanvasNodeData`,
  per the canvas spec in `ui-context.md`.
- `liveblocks.config.ts`: global `Liveblocks` interface augmentation — `Storage` is
  `LiveMap<string, CanvasNodeStorage>` for nodes and `LiveMap<string, CanvasEdgeData>` for
  edges (one entry per node/edge, not a single monolithic array/object — needed so
  concurrent edits from different collaborators don't clobber each other).
- `app/api/liveblocks-auth/route.ts`: issues a room token only after verifying the
  requesting user is the project's owner or a collaborator (`getProjectForUser`), per the
  "Liveblocks room tokens are issued only after verifying project membership" invariant in
  `architecture-context.md`. Room ID = project ID.
- `components/canvas/canvas-room.tsx`: `LiveblocksProvider` + `RoomProvider` wrapper.
- `components/canvas/canvas.tsx`: the actual `<ReactFlow>` canvas — reads nodes/edges from
  Liveblocks storage, syncs drags/deletes/connections back via `useMutation`, renders other
  users' live cursors from `useOthers()`.
- `components/canvas/shape-node.tsx`: custom node renderer for all 6 shapes (diamond/
  hexagon/cylinder as inline SVG per the UI spec), connection handles on all 4 sides,
  hidden until hover.
- `components/canvas/canvas-toolbar.tsx`: floating left toolbar (shape picker, color
  swatches, "Add node") per the editor layout pattern in `ui-context.md`.
- `app/projects/[projectId]/page.tsx`: now renders the real canvas instead of the
  placeholder card, still behind the same ownership check.

###Check when done
- `tsc --noEmit`, `npm run lint`, `next build` all clean.
- Route protection still redirects a signed-out visit to `/projects/[id]` to `/sign-in`
  (re-verified after adding the route).
- **Not yet verified live in-browser**: the assistant hit a Cloudflare bot-check on
  Clerk's sign-up form and won't complete CAPTCHAs, so the actual canvas — dragging nodes,
  live cursors between two tabs, persistence across reload — needs a human pass. The user
  should sign in, create/open a project, and confirm: adding nodes of each shape/color,
  dragging them, connecting two nodes with an edge, and (ideally) opening the same project
  in a second browser/incognito tab signed in as a collaborator to see live cursors.
