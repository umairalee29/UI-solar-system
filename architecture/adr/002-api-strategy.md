# ADR 002 — API Data Strategy

**Status:** Accepted  
**Date:** 2026-04-23

## Decision
Use the **Solar System OpenData API** (`api.le-systeme-solaire.net/rest/`) as the live data source, proxied through the Express backend with a 1-hour in-memory TTL cache. A static `planets-fallback.json` in `data/` is used when the API is unreachable.

## Rationale
- No API key required — zero friction for development and deployment
- Comprehensive: covers all 8 planets, dwarf planets, and hundreds of moons with orbital/physical data
- Backend proxy avoids CORS issues and rate-limit exposure in the browser
- In-memory cache (not Redis) is sufficient — data changes on geological timescales

## Alternatives Considered
- **NASA api.nasa.gov** — requires registration and API key management
- **Static JSON only** — simpler but data would require manual updates
- **Direct browser fetch** — CORS headers on the API allow it, but proxy is cleaner and hides the upstream URL
