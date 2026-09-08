Read 'AGENTS.md' before starting.

We're adding authentication and route protection.

Install and configure Clerk (`@clerk/nextjs`).

- Wrap the app in `ClerkProvider`, themed dark to match `ui-context.md` (`@clerk/themes` dark base theme + brand accent variables).
- Add `/sign-in` and `/sign-up` catch-all routes using Clerk's `<SignIn />` / `<SignUp />` components.
- Protect `/dashboard(.*)` via `proxy.ts` (Next.js 16 renamed `middleware.ts` — see deprecation notice) using `clerkMiddleware` + `auth.protect()`.
- Add a `Navbar` component (`components/navbar.tsx`) with sign-in/sign-up/UserButton, matching the dark navbar spec.
- Point Clerk's own sign-in/up/redirect env vars at our own routes instead of the hosted Account Portal.

Project creation and ownership (the rest of "Authentication and Projects" in `project-overview.md`) is a separate unit — it needs Prisma + Postgres, not yet configured.

###Check when done
- Visiting `/dashboard` while signed out redirects to our own `/sign-in` page (not Clerk's hosted Account Portal).
- Sign-up/sign-in modals and pages render themed dark, matching the app.
- No TypeScript or lint errors.
- `next build` has no deprecation warnings.
