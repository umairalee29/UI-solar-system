# ADR 001 — Technology Stack

**Status:** Accepted  
**Date:** 2026-04-23

## Decision
- **Frontend:** React 18 + Vite + TypeScript
- **3D rendering:** `@react-three/fiber` (R3F) + `@react-three/drei`
- **Backend:** Express + TypeScript (Node.js)
- **Monorepo:** npm workspaces

## Rationale
R3F gives idiomatic React integration with Three.js — components, hooks, and Suspense work naturally. Vite provides fast HMR. Express is lightweight and sufficient for a proxy/cache layer. npm workspaces avoids the overhead of Turborepo/Nx for a two-package monorepo.

## Alternatives Considered
- **Next.js** — rejected (SSR unnecessary for a client-side 3D app)
- **Vanilla JS + Canvas** — rejected (R3F removes significant boilerplate for 3D scenes)
- **Standalone frontend** — rejected (API key/rate-limit concerns require a backend proxy)
