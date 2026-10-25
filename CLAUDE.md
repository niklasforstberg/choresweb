# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this

The React SPA for Chores (household chores — who did what, when). The API lives in `../choresapi`; see its CLAUDE.md for the backend and deployment as a whole. Structure follows Mynt's `clientapp/` (`../Mynt/clientapp`).

## Commands

```bash
npm install
npm run dev      # Vite dev server at http://localhost:5174, proxies /api to the API on :5070
npm run build    # TypeScript compile + Vite build
npm run lint     # ESLint
```

## Architecture

React 19 + Vite + TypeScript. Styling: **custom CSS** with design tokens as CSS custom properties in `src/styles/global.css` — no component framework. Data fetching: **TanStack Query v5**. Routing: **React Router v7** (config in `main.tsx`). Icons: **lucide-react**. i18n: **react-i18next** (`src/locales/sv.json`, `en.json`). HTTP via `fetch` (no axios).

- `src/api/` — one file per domain, sharing `client.ts` (`apiFetch`). The JWT is kept in `localStorage` (`chores_token`); a 401 clears it and returns to `/`.
- `src/pages/` — `Login`, `Register`, `Home`
- `src/components/` — `Layout`, `AuthGuard` (shows `Login` when there is no token)

Requests always go to the same origin (`/api/...`): Vite proxies them in development, Caddy in production.

## Deployment

Deployed to antec by GitHub Actions on a self-hosted runner (`deploy.sh` → Docker Compose). The image builds the SPA and serves it with nginx (`nginx.conf`, SPA fallback to `index.html`). Container `choresweb` on `127.0.0.1:5105`. No env file — the build has no secrets. Caddy sends `chores.forstberg.net` here, except `/api/*` and `/health`, which go to choresapi.
