# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firebase-App-Check is a full-stack TypeScript monorepo built with the Better-T-Stack template. It consists of a React 19 + React Router 7 frontend (SPA mode), a Fastify 5 backend API, and shared packages for configuration and environment validation.

## Commands

All commands run from the monorepo root unless noted.

```bash
npm install          # Install all dependencies across workspaces

npm run dev          # Start web (port 5173) and server (port 3000) concurrently
npm run dev:web      # Start only the frontend
npm run dev:server   # Start only the backend

npm run build        # Build all apps and packages via Turborepo
npm run check-types  # TypeScript type-checking across the monorepo
npm run check        # Format + lint fix with Biome across the monorepo
```

Server-specific (from `/apps/server`):
```bash
npm run compile      # Compile to standalone binary with bun
```

There is no test runner configured in this project.

## Architecture

### Monorepo Structure

```
apps/
  web/      # React Router 7 SPA (Vite, Tailwind CSS v4, shadcn/ui)
  server/   # Fastify 5 API server
packages/
  config/   # Shared tsconfig.base.json used by all TS projects
  env/      # Type-safe environment validation (T3 env-core + Zod)
```

Turborepo orchestrates builds and tasks with caching. The root `turbo.json` defines task dependencies (e.g., `build` depends on upstream `build`).

### Environment Validation (`packages/env`)

The env package exports two separate modules:
- `@Firebase-App-Check/env/server` — validates `CORS_ORIGIN`, `NODE_ENV` (Node.js env)
- `@Firebase-App-Check/env/web` — validates `VITE_SERVER_URL` (browser env via `VITE_` prefix)

Both apps import from this package rather than reading `process.env` directly.

**Development `.env` files (not committed):**
- `/apps/web/.env`: `VITE_SERVER_URL=http://localhost:3000`
- `/apps/server/.env`: `CORS_ORIGIN=http://localhost:5173`

### Web App (`apps/web`)

- React Router 7 with file-system routing (`flatRoutes`), SSR disabled
- Vite build with path alias `@/*` → `./src/*`
- Tailwind CSS v4 via Vite plugin
- shadcn/ui component library (configured in `components.json`)
- Entry: `src/root.tsx` (layout), `src/routes/_index.tsx` (home)

### Server (`apps/server`)

- Single entry point: `src/index.ts`
- Fastify v5 with CORS plugin; listens on port 3000
- Built with tsdown to ESM (`dist/index.mjs`); internal monorepo packages are bundled (not external)

### Code Style

Biome enforces: tab indentation, Tailwind class sorting, exhaustive React hook dependencies, and strict style rules. Run `npm run check` to auto-fix.

TypeScript is configured with strict settings: `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess` — all enabled in `packages/config/tsconfig.base.json`.
