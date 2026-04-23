# Solar System Explorer — Claude Code Guide

## Project Overview
Interactive 3D solar system web app. Planets and moons orbit in real-time; clicking any body shows detailed info.

## Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| 3D | Three.js via `@react-three/fiber` + `@react-three/drei` |
| Animations | `@react-three/postprocessing` (bloom), `framer-motion` (UI) |
| Backend | Express + TypeScript, port 3001 |
| Data | Solar System OpenData API (no key required) |
| Workspace | npm workspaces (root `package.json`) |

## Folder Conventions
- `ui/` — all frontend code (React components, hooks, services, types)
- `backend/` — Express API (routes, services, middleware)
- `data/` — static fallback JSON and shared schemas
- `architecture/adr/` — Architecture Decision Records

## Key Commands
```bash
npm run dev                       # start both servers (frontend :5173, backend :3001)
npm run build                     # production build both packages
npm run dev --workspace=ui        # frontend only
npm run dev --workspace=backend   # backend only (compiles TS then starts node)
```

## Dev Notes
- Backend `dev` script runs `tsc && node dist/index.js` — `ts-node` has issues in this environment
- Both TypeScript checks are clean: `npx tsc --noEmit` in both `ui/` and `backend/`

## Component Architecture
```
App.tsx
└── SolarSystem/Scene.tsx   ← R3F Canvas root
    ├── Sun/Sun.tsx
    ├── Planet/Planet.tsx (×8)
    │   └── Moon/Moon.tsx (×N, visible when planet selected)
    └── OrbitRing/OrbitRing.tsx (×8)
InfoPanel/InfoPanel.tsx     ← overlaid outside Canvas
LoadingScreen/LoadingScreen.tsx
```

## Data Flow
1. `usePlanets` hook → `GET /api/planets` (backend) → Solar System OpenData API
2. Backend caches responses 1 hr in memory
3. On API failure, `usePlanets` falls back to `../../data/planets-fallback.json`
4. Click planet → `useSelection` updates state → InfoPanel fetches `GET /api/planets/:id`

## External API
`https://api.le-systeme-solaire.net/rest/`
- No auth required
- `GET /rest/bodies/?filter[]=isPlanet,eq,true` — all 8 planets
- `GET /rest/bodies/{englishName}` — single body with moons array

## Texture Assets
The app uses **procedural canvas textures** generated in `ui/src/utils/planetTextures.ts` — no texture files needed to run.

To upgrade to photorealistic textures: download JPGs from Solar System Scope (solarsystemscope.com/textures) and place them in `ui/public/textures/` as `sun.jpg`, `mercury.jpg`, etc. Then revert `Sun.tsx`, `Planet.tsx`, and `Moon.tsx` to use `useLoader(TextureLoader, '/textures/...')`.

## Live API (Optional)
The backend serves static planet data from `data/planets-fallback.json` by default.
To enable live Solar System OpenData API:
```
SOLAR_API_KEY=your_key_here npm run dev --workspace=backend
```
Get a free key at: api.le-systeme-solaire.net/generatekey.html

## Coding Conventions
- TypeScript strict mode everywhere
- No `any` types — use interfaces from `ui/src/types/solar.ts`
- R3F components use `useFrame` for animation (never `setInterval`)
- Backend route handlers are thin — all logic lives in `services/`
- Cache middleware wraps service calls; routes don't call the external API directly
