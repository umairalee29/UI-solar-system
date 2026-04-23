# ADR 003 — 3D Rendering Approach

**Status:** Accepted  
**Date:** 2026-04-23

## Decision
Use **@react-three/fiber** with **@react-three/drei** helpers and **@react-three/postprocessing** for bloom effects. Planets animate via `useFrame` with a scaled orbit speed derived from each planet's real sidereal orbital period. Camera interaction uses drei's `CameraControls` for smooth programmatic tweening on planet click.

## Rationale
- `useFrame` is the idiomatic R3F animation loop — avoids `requestAnimationFrame` boilerplate
- `drei` provides `<Stars>`, `<CameraControls>`, `<Line>`, `<Html>` — all needed here without custom code
- Bloom post-processing via `@react-three/postprocessing` gives a realistic sun glow and planet highlight on selection

## Orbit Scaling
Real orbital periods span 88 days (Mercury) to 165 years (Neptune). We normalize to a visual speed range of `0.5×` to `3.5×` using a log scale so all planets are visually interesting without Neptune appearing stationary.

## Texture Strategy
NASA-licensed JPG texture maps loaded via Three.js `TextureLoader` through R3F's `useLoader`. Textures are placed in `ui/public/textures/` and served as static assets by Vite dev server and production build.
