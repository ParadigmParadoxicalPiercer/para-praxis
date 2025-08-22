# Para-Praxis Frontend

This document explains the frontend structure so another developer can jump in quickly.

## Project layout

- `src/main.jsx` – App entry; mounts Router inside AuthProvider
- `src/routes/routes.jsx` – Central route table with guards
- `src/auth/` – AuthProvider and token helpers
- `src/configs/axios.js` – Axios instance with auth interceptors
- `src/layouts/AppLayout.jsx` – Shared header/footer + outlet
- `src/components/` – Reusable UI (Header, Hero, etc.)
- `src/pages/` – Top-level pages (Login, Register, Tasks, Journal, User)
- `src/features/` – Domain modules (focus-timer, journal)
	- `journal/` – templates, hook, components (Sidebar, Header, Preview, Toolbar)
- `src/stores/` – Zustand stores

## Conventions

- Tailwind only; no external CSS.
- Keep pages thin; move logic to hooks and feature components.
- Add small, human-readable comments at the top of each file describing purpose.

## Auth lifecycle (high level)

- On load, AuthProvider tries to refresh from an httpOnly cookie.
- On auth screens (login/register) or immediately after logout, hydration is skipped.
- Axios retries 401s once by refreshing (except for refresh/logout endpoints).

## Adding a new feature

1. Create `src/features/<name>/` with components/hooks.
2. Wire a page under `src/pages` (if top-level), or route directly if nested).
3. Add entries to `routes.jsx`.
