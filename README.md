# Solar System Explorer

An interactive 3D solar system web app. Click any planet or moon to explore its orbital and physical data, rendered in real-time WebGL.

![Solar System Explorer](https://img.shields.io/badge/Three.js-3D-black) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![Express](https://img.shields.io/badge/Express-backend-green)

## Features

- **Animated 3D scene** — all 8 planets orbit the sun with scaled relative speeds; Saturn has rings; axial tilts applied
- **Procedural textures** — each planet rendered with distinct canvas-generated surface maps (craters, bands, polar caps)
- **Click to explore** — select any planet or moon to see orbital period, mass, gravity, temperature, distance, and more
- **Moon system** — expand a planet's moon list and click individual moons for their details
- **Bloom post-processing** — sun glow and emissive highlight on selected bodies
- **Offline-first** — works without any network connection using bundled planet data
- **Responsive** — InfoPanel adapts to mobile as a bottom sheet

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| 3D rendering | Three.js via `@react-three/fiber` + `@react-three/drei` |
| Post-processing | `@react-three/postprocessing` (bloom) |
| UI animation | Framer Motion |
| Backend | Express + TypeScript |
| Data | Static JSON + Solar System OpenData API (optional) |
| Monorepo | npm workspaces |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
git clone <repo-url>
cd solsys
npm install
npm run dev
```

Opens at **http://localhost:5173** — backend API on **http://localhost:3001**.

### Other Commands

```bash
npm run build          # production build (both packages)
npm run dev --workspace=ui        # frontend only
npm run dev --workspace=backend   # backend only
```

## Project Structure

```
solsys/
├── .claude/               # Claude Code project config + guidance
├── architecture/
│   └── adr/               # Architecture Decision Records
├── ui/                    # React + Vite frontend
│   └── src/
│       ├── components/    # SolarSystem, Planet, Moon, Sun, InfoPanel, ...
│       ├── hooks/         # usePlanets, useSelection
│       ├── services/      # API client
│       ├── types/         # TypeScript interfaces
│       └── utils/         # Procedural texture generator
├── backend/               # Express API
│   └── src/
│       ├── routes/        # GET /api/planets, GET /api/planets/:id
│       ├── services/      # Data fetching + fallback logic
│       └── middleware/    # In-memory TTL cache
└── data/
    └── planets-fallback.json   # Offline planet + moon data
```

## Planet Textures

The app ships with procedural textures. To use photorealistic NASA textures:

1. Download JPG maps from [Solar System Scope](https://www.solarsystemscope.com/textures/) (free for personal use)
2. Place them in `ui/public/textures/` named: `sun.jpg`, `mercury.jpg`, `venus.jpg`, `earth.jpg`, `mars.jpg`, `jupiter.jpg`, `saturn.jpg`, `uranus.jpg`, `neptune.jpg`, `moon.jpg`
3. Update `Planet.tsx`, `Sun.tsx`, and `Moon.tsx` to use `useLoader(TextureLoader, '/textures/<name>.jpg')` instead of the canvas generator

## Live Data API (Optional)

Planet data is served from `data/planets-fallback.json` by default. To enable the live [Solar System OpenData API](https://api.le-systeme-solaire.net):

1. Get a free key at [api.le-systeme-solaire.net/generatekey.html](https://api.le-systeme-solaire.net/generatekey.html)
2. Set the environment variable before starting the backend:

```bash
SOLAR_API_KEY=your-key-here npm run dev --workspace=backend
```

## Controls

| Action | Result |
|--------|--------|
| Scroll | Zoom in / out |
| Click + drag | Rotate camera |
| Click planet | Open info panel |
| Click moon in panel | Show moon details |
| Escape | Close info panel |
