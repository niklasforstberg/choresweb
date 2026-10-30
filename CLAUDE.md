# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this

The React SPA for Chores (household chores — who did what, when). The API lives in `../choresapi`; see its CLAUDE.md for the backend and deployment as a whole. Structure follows Mynt's `clientapp/` (`../Mynt/clientapp`).

**The two repos are one project.** A change in `src/api/` usually needs the matching endpoint or DTO change in `../choresapi` (and the reverse), so read and edit both without being asked.

## Commands

```bash
npm install
npm run dev      # Vite dev server at http://localhost:5177, proxies /api to the API on :5072
npm run build    # TypeScript compile + Vite build
npm run lint     # ESLint
```

## Architecture

React 19 + Vite + TypeScript. Styling: **custom CSS** with design tokens as CSS custom properties in `src/styles/global.css` — no component framework. Data fetching: **TanStack Query v5**. Routing: **React Router v7** (config in `main.tsx`). Icons: **lucide-react**. i18n: **react-i18next** (`src/locales/sv.json`, `en.json`). HTTP via `fetch` (no axios).

- `src/api/` — one file per domain, sharing `client.ts` (`apiFetch`). The JWT is kept in `localStorage` (`chores_token`); a 401 clears it and returns to `/`.
- `src/pages/` — `Login`, `Register`, `Week` (the grid, `/?week=YYYY-MM-DD` for other weeks), `Household` (members, invite code, chore list), `NoHousehold` (create or join; `Layout` shows it instead of the routes until the user has a household)
- `src/components/` — `Layout`, `AuthGuard` (shows `Login` when there is no token)
- `src/lib/week.ts` — ISO weeks, Monday first. Dates are local `YYYY-MM-DD` strings; never use `toISOString()`, which shifts them to UTC.
- `src/lib/members.ts` — each member's initial (first two letters when initials collide) and colour in the grid.

In the grid an entry is outlined while planned and filled once done. Only your own entries are buttons.

Requests always go to the same origin (`/api/...`): Vite proxies them in development, Caddy in production.

## Deployment

Deployed to antec by GitHub Actions on a self-hosted runner (`deploy.sh` → Docker Compose). The image builds the SPA and serves it with nginx (`nginx.conf`, SPA fallback to `index.html`). Container `choresweb` on `127.0.0.1:5105`. No env file — the build has no secrets. Caddy sends `chores.forstberg.net` here, except `/api/*` and `/health`, which go to choresapi.
