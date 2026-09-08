# Ghost AI

A real-time collaborative system design workspace. Describe a system in plain English, generate an initial architecture, refine it live on a shared canvas with your team, and export the result as a technical spec.

## Features

**Built**

- Authentication and protected routes (Clerk)
- Project creation, ownership, and a per-user dashboard (Postgres + Prisma)
- Real-time collaborative canvas per project — shared nodes, edges, and live cursors (Liveblocks + React Flow)
- Six node shapes and an 8-color palette for modeling system components (services, databases, gateways, event boundaries, etc.)

**Planned**

- Starter system design templates (monolith, microservices, event-driven, serverless)
- AI-generated architecture from a natural-language prompt
- Canvas snapshot persistence and Markdown spec generation, exportable per project

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Auth | Clerk |
| Database | PostgreSQL + Prisma |
| Real-time canvas | Liveblocks + React Flow (`@xyflow/react`) |
| Background jobs *(planned)* | Trigger.dev |
| Artifact storage *(planned)* | Vercel Blob |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Clerk](https://clerk.com) application (publishable + secret key)
- A PostgreSQL database (e.g. [Neon](https://neon.com))
- A [Liveblocks](https://liveblocks.io) project (secret key)

### Setup

```bash
npm install
```

Create a `.env.local` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

DATABASE_URL=

LIVEBLOCKS_SECRET_KEY=
```

Apply the database schema:

```bash
npx prisma migrate deploy
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                  Routes: marketing page, auth, dashboard, per-project workspace, API routes
components/           UI composition — shadcn/ui primitives, navbar, canvas
lib/                  Shared infrastructure — Prisma client, ownership/access helpers
prisma/               Database schema and migrations
types/                Shared type definitions (canvas node/edge model)
liveblocks.config.ts  Real-time storage and presence schema
```
